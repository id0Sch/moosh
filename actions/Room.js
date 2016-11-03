'use strict';
import moment from 'moment';
import {database} from '../Firebase';
import Events from '../Events'

const InventoryRef = database.ref('rooms');

export const listenToRooms = () => (dispatch) => {
    InventoryRef.off();
    InventoryRef.on('value', (snapshot) => {
        let rooms = [];
        rooms = _.map(snapshot.val(), (room)=> {
            room.schedule = _.chain(room.schedule)
                .filter((event)=>moment().isSame(event.start, 'day'))
                .reduce((events, event, index, collection)=> {
                    event.creator = _.find(event.guests, {organizer: true});
                    events.push(event);
                    if (index < collection.length - 1) {
                        if (event.finish !== collection[index + 1].start) {
                            events.push({
                                freeTime: true,
                                start: event.finish,
                                finish: collection[index + 1].start
                            })
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