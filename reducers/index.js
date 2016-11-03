import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import Room from './Room';
import Facts from './Facts';
const rootReducer = combineReducers({
    Room,
    Facts,
    routing: routerReducer
});

export default rootReducer
