'use strict';
import _ from 'lodash';
import moment from 'moment';
import {database} from '../Firebase';
import Events from '../Events'
import uuid from 'node-uuid';
import Promise from 'bluebird';
import Bitly from '../utils/bitly'

const InventoryRef = database.ref('rooms');
const CALENDAR_TEMPLATE = 'https://calendar.google.com/calendar/render?action=TEMPLATE&add=[ROOM_ID]&dates=[START]/[FINISH]';
const CALENDAR_TIMESTAMP = 'YYYYMMDDTHHmm02';

const bitly = new Bitly(process.env.BITLY_CRED);

function createTitle({name, start, finish}) {
    return `${moment(start).format('HH:mm')} - ${moment(finish).format('HH:mm')}: ${_.capitalize(name)}`
}
function createLink(roomId, {start, finish}) {
    let longUrl = CALENDAR_TEMPLATE
            .replace('[ROOM_ID]', roomId)
            .replace('[START]', moment(start).format(CALENDAR_TIMESTAMP))
            .replace('[FINISH]', moment(finish).format(CALENDAR_TIMESTAMP))
        ;
    if (process.env.NODE_ENV !== 'production') {
        return Promise.resolve(longUrl);
    } else {
        return bitly.shorten(longUrl);
    }
}
export const listenToRooms = () => (dispatch) => {
    InventoryRef.off();
    InventoryRef.on('value', function (snapshot) {
        return Promise.map(snapshot.val(), function (room) {
            room.schedule = _.filter(room.schedule, (event)=>moment().isSame(event.start, 'day'));
            return Promise.reduce(room.schedule, function processEvent(events, event, index) {
                let collection = room.schedule;
                event.creator = _.find(event.guests, {organizer: true});
                _.remove(event.guests, {organizer: true});
                if (!event.creator.displayName) {
                    event.creator.displayName = _.get(event, 'creator.email')
                        .replace('@ironsrc.com', '')
                        .replace(/\./g, ' ');
                }
                event.creator.displayName = _.startCase(event.creator.displayName);
                event.name = _.capitalize(event.name);
                event.title = createTitle(event);
                events.push(event);
                return new Promise((resolve, reject)=> {
                    if (index < collection.length - 1) {
                        if (event.finish !== collection[index + 1].start) {
                            let freeTimeEvent = {
                                id: uuid.v4(),
                                name: 'Free time',
                                freeTime: true,
                                start: event.finish,
                                finish: collection[index + 1].start
                            };
                            freeTimeEvent.title = createTitle(freeTimeEvent);
                            return createLink(room.id, freeTimeEvent)
                                .then((link)=> {
                                    freeTimeEvent.link = link;
                                    events.push(freeTimeEvent);
                                    return resolve(events);
                                }).catch(err=> {
                                    console.error(err);
                                    reject(err)
                                });
                        } else {
                            return resolve(events);
                        }
                    } else {
                        return resolve(events);
                    }
                })
            }, [])
                .then((schedule)=> {
                    room.schedule = schedule;
                    return room;
                });
        }).then((rooms)=>dispatch({type: Events.ROOMS_RECEIVE_DATA, data: rooms || []}));

    }, (error) => {
        dispatch({
            type: Events.ROOMS_RECEIVE_DATA_ERROR,
            message: error.message
        });
    });
};

export const setCurrentRoom = (roomId)=> ({
    type: Events.ROOMS_SELECT_CURRENT_ROOM,
    roomId
});
export const refreshImage = () => ({
    type: Events.ROOMS_SET_ROOM_IMAGE
});
// export const setRoomImage = (images)=> ({
//     type: Events.ROOMS_SET_ROOM_IMAGE,
//     image: images[_.random(0, images.length - 1)]
// });