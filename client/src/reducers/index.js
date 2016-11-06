import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import Room from './Room';
import Facts from './Facts';
import Time from './Time';

const rootReducer = combineReducers({
    Time,
    Room,
    Facts,
    routing: routerReducer
});

export default rootReducer
