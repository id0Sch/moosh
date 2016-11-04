import _ from 'lodash';
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'


import rootReducer from '../reducers'
import {loadState, saveState} from './localStorage';

let createLogger;
if (process.env.NODE_ENV !== 'production') {
    createLogger = require('redux-logger');
}
// const savedState = loadState();
export default function configureStore(preloadedState) {
    let middleware = [thunkMiddleware];
    if (createLogger) {
        middleware.push(createLogger());
    }
    const store = createStore(
        rootReducer,
        // savedState,
        preloadedState,
        applyMiddleware(...middleware)
    );

    if (process.env.SAVE_STATE) {
        store.subscribe(_.throttle(()=> {
            saveState('state', store.getState());
        }, 2500));
    }

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
}
