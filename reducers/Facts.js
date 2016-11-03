/**
 * Created by idoschachter on 23/08/2016.
 */
const Events = require('../Events');

const INITIAL_STATE = {
    hasReceivedData: false,
    submittingNew: false,
    errorMessage: '',
    data: []
};
export default function Facts(state = INITIAL_STATE, action) {
    switch (action.type) {
        case Events.FACTS_RECEIVE_DATA:
            return Object.assign({}, state, {
                hasReceivedData: true,
                data: action.data,
                errorMessage: ''
            });
        case Events.FACTS_RECEIVE_DATA_ERROR:
            return Object.assign({}, state, {
                data: {},
                errorMessage: action.message
            });
        default:
            return state;
    }
};