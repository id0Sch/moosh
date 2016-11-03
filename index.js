import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import {listenToRooms} from './actions/Room';
import {listenToFacts} from './actions/Facts';

import App from './containers/App'

import configureStore from './store/configureStore'
import 'material-design-lite'
import 'material-design-lite/material.css'
import './css/style.scss'

injectTapEventPlugin();
const store = configureStore(window.devToolsExtension && window.devToolsExtension());
const history = syncHistoryWithStore(browserHistory, store);

const muiTheme = getMuiTheme({
    appBar: {
        height: 45,
    }
});
render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={App}>
                </Route>
            </Router>
        </Provider>
    </MuiThemeProvider>
    ,
    document.getElementById('root')
);
// setup Firebase listeners
setTimeout(function () {
    store.dispatch(listenToRooms());
    store.dispatch(listenToFacts());
});