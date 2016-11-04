var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var _ = require('lodash');
var firebase = require("firebase");
var async = require('async');
var request = require('request');

// Picasa thumbnail template
var picasaURL = "http://picasaweb.google.com/data/entry/api/user/%email%?alt=json";

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/moosh.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'moosh.json';

// Load client secrets from a local file.
var config;
var localConfig = JSON.parse(fs.readFileSync('config.json'));
var configURL = localConfig.remoteConfigURL;

console.log('Getting config');
request(configURL, function (error, response, body) {
    if (error || response.statusCode != 200) {
        console.error('Error loading config');
        process.exit(1);
    }

    config = JSON.parse(body);

    // Initialize Firebase
    var firebase = require("firebase");
    firebase.initializeApp({
        serviceAccount: "google-services.json",
        databaseURL: config.firebaseDb
    });

    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Calendar API.
        authorize(JSON.parse(content), processEvents);
    });
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

function mapEvent(origEvent, callback) {
    var res = {
        id: origEvent['id'],
        name: origEvent['summary'],
        //description: origEvent['description'],
        creator: origEvent['creator'],
        start: Date.parse(origEvent['start']['dateTime']),
        finish: Date.parse(origEvent['end']['dateTime']),
        guests: origEvent['attendees']
    };

    callback(res);
}

function getCurrentEvent(events) {
    var firstEvent = events[0];

    var firstEventStart = Date.parse(firstEvent['start']['dateTime']);
    // Check if the event is now
    var now = Date.parse((new Date()).toISOString());

    return (firstEventStart < now ? firstEvent['id'] : null);
}

function getAtendeeImage(attendee, cb) {
    var url = picasaURL.replace('%email%', attendee['email']);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var res = JSON.parse(body);
            if (res && res['entry'] && res['entry']['gphoto$thumbnail'] && res['entry']['gphoto$thumbnail']['$t']) {
                return cb(res['entry']['gphoto$thumbnail']['$t']);
            }
        }
        cb(config['defaultPhoto']);
    });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function processEvents(auth) {
    var attendees = {};
    var calendar = google.calendar('v3');
    var now = new Date();
    var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    var rooms = config["rooms"];
    async.map(rooms, function (room, cb) {
        calendar.events.list({
            auth: auth,
            calendarId: room.id,
            timeMin: startOfDay.toISOString(),
            timeMax: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            maxResults: 100,
            singleEvents: true,
            orderBy: 'startTime'
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                cb(err);
            }
            console.log('Processing room %s', response.summary);
            var events = response.items;
            if (events.length == 0) {
                console.log('No upcoming events found.');
                var resultRoom = {
                    id: room.id,
                    currentEventId: null,
                    images: room['images'],
                    name: response['summary'],
                    schedule: []
                };

                console.log('Done processing room %s', response.summary);
                cb(null, resultRoom);
            } else {
                // Iterate over all events and create a list of all unique attendees in all events
                var schedule = [];
                async.eachSeries(events,
                    function (event, cb) {
                        console.log('Processing event %s', event.summary);
                        // Enhance the attendees of the event with photos
                        async.each(event.attendees,
                            function (attendee, cb2) {
                                console.log('Processing attendee %s', attendee['email']);
                                if (attendees[attendee['email']]) {
                                    var enhanced = attendees[attendee['email']];
                                    attendee['image'] = enhanced['image'];
                                    attendee['displayName'] = enhanced['displayName'];
                                    console.log('Done processing attendee %s', attendee['email']);
                                    cb2();
                                } else {
                                    if (!attendee['displayName']) {
                                        var index = attendee['email'].indexOf('@');
                                        var displayName = attendee['email'].substr(0, index).replace('.', ' ');
                                        attendee['displayName'] = displayName.replace(/\w\S*/g, function (txt) {
                                            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                        });
                                    }

                                    getAtendeeImage(attendee, function (photo) {
                                        attendee['image'] = photo;
                                        attendees[attendee['email']] = attendee;
                                        console.log('Done processing attendee %s', attendee['email']);
                                        cb2();
                                    });
                                }
                            },
                            function () {
                                // Remove the meeting remove from the list of attendees
                                _.remove(event.attendees, function(attendee) {
                                    return attendee.email == room['id'];
                                });

                                mapEvent(event, function (res) {
                                    if(res.start > Date.parse((new Date()).toISOString())) {
                                        schedule.push(res);
                                    }

                                    console.log('Done processing event %s', event.summary);

                                    cb();
                                });
                            });
                    },
                    function () {
                        var resultRoom = {
                            id: room.id,
                            currentEventId: getCurrentEvent(events),
                            images: room['images'],
                            name: response['summary'],
                            schedule: schedule

                        };

                        console.log('Done processing room %s', response.summary);
                        cb(null, resultRoom);
                    }
                );
            }
        });
    }, function (err, res) {
        if (err) {
            console.error(err);
            return;
        }

        var db = firebase.database();
        var ref = db.ref("/rooms");
        ref.set(res).then(function() {
            console.log('Done processing');
            process.exit();
        });
    });
}

