/**
 * Created by idoschachter on 23/08/2016.
 */
import _ from 'lodash';
import Events  from '../Events';
import moment from 'moment';

const INITIAL_STATE = {
    currentTime: moment().format('MMM DD, HH:mm')
};
export default function Time(state = INITIAL_STATE, action) {
    switch (action.type) {
        case Events.CONTROL_TIME:
            return Object.assign({}, state, {
                currentTime: moment().format('MMM DD, HH:mm')
            });
        default:
            return state;
    }
};