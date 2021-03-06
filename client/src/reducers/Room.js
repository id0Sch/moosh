/**
 * Created by idoschachter on 23/08/2016.
 */
const _ = require('lodash');
const Events = require('../Events');

const INITIAL_STATE = {
    hasReceivedData: false,
    submittingNew: false,
    errorMessage: '',
    data: [],
    roomId: null,
    currentRoom: {},
    currentImageIndex: 0
};
export default function Room(state = INITIAL_STATE, action) {
    switch (action.type) {
        case Events.ROOMS_RECEIVE_DATA:
            let obj = {
                hasReceivedData: true,
                data: action.data,
                errorMessage: ''
            };
            if (state.roomId) {
                obj.currentRoom = _.find(obj.data, {id: state.roomId});
            }
            return Object.assign({}, state, obj);
        case Events.ROOMS_RECEIVE_DATA_ERROR:
            return Object.assign({}, state, {
                data: {},
                errorMessage: action.message
            });
        case Events.ROOMS_SELECT_CURRENT_ROOM:
            return Object.assign({}, state, {
                currentRoom: _.find(state.data, {id: action.roomId}),
                roomId: action.roomId
            });
        case Events.ROOMS_SET_ROOM_IMAGE:
            return Object.assign({}, state, {
                currentImageIndex: _.random(0, _.get(state, 'currentRoom.images.length', 1) - 1)
            });
        default:
            return state;
    }
};