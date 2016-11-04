'use strict';
import moment from 'moment';
import {database} from '../Firebase';
import Events from '../Events'

const InventoryRef = database.ref('rooms');

function createTitle({name, start, finish}) {
    return `${moment(start).format('HH:mm')} - ${moment(finish).format('HH:mm')}: ${_.capitalize(name)}`
}

function createLink(room, {name, start, finish}) {

}
export const listenToRooms = () => (dispatch) => {
    InventoryRef.off();
    InventoryRef.on('value', (snapshot) => {
        let rooms = _.map(snapshot.val(), (room)=> {
            room.schedule = _.chain(room.schedule)
            // .filter((event)=>moment().isSame(event.start, 'day'))
                .reduce((events, event, index, collection)=> {
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

                    if (index < collection.length - 1) {
                        if (event.finish !== collection[index + 1].start) {
                            let freeTimeEvent = {
                                id: '---',
                                name: 'Free time',
                                freeTime: true,
                                start: event.finish,
                                finish: collection[index + 1].start
                            };
                            freeTimeEvent.link = createLink(room, freeTimeEvent);
                            freeTimeEvent.title = createTitle(freeTimeEvent);
                            events.push(freeTimeEvent);
                        }
                    }
                    return events;
                }, []).value();
            return room;
        });
        dispatch({
            type: Events.ROOMS_RECEIVE_DATA,
            data: rooms || []
        });
    }, (error) => {
        dispatch({
            type: Events.ROOMS_RECEIVE_DATA_ERROR,
            message: error.message
        });
    });
};