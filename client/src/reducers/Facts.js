/**
 * Created by idoschachter on 23/08/2016.
 */
import _ from 'lodash';
import Events  from '../Events';

const INITIAL_STATE = {
    hasReceivedData: false,
    submittingNew: false,
    errorMessage: '',
    data: [],
    currentFactIndex: 0
};
export default function Facts(state = INITIAL_STATE, action) {
    switch (action.type) {
        case Events.FACTS_RECEIVE_DATA:
            return Object.assign({}, state, {
                hasReceivedData: true,
                data: action.data,
                errorMessage: '',
                currentFactIndex: _.random(0, action.data.length - 1)
            });
        case Events.FACTS_RECEIVE_DATA_ERROR:
            return Object.assign({}, state, {
                data: {},
                errorMessage: action.message
            });
        case Events.FACTS_SET_FACT_INDEX:
            return Object.assign({}, state, {
                currentFactIndex: _.random(0, state.data.length - 1)
            });
        default:
            return state;
    }
};