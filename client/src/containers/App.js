/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {List, ListItem} from 'material-ui/List';

import HeaderContainer from './HeaderContainer';
import CurrentEventContainer from './CurrentEventContainer';
import UpcomingEventsContainer from './UpcomingEventsContainer';
import FactsContainer from './FactsContainer';
import Footer from '../components/Footer';

import * as roomActions from '../actions/Room';

class Application extends Component {
    componentDidMount() {
        const {location:{query}, setCurrentRoom} = this.props;
        if (query.hasOwnProperty('room')) {
            setCurrentRoom(query.room);
        }
        // setInterval(()=> {
        //
        // }, 500)
    }

    componentWillReceiveProps(nextProps) {
        const {location:{query}, setCurrentRoom} = nextProps;
        const {Room:{roomId}} = this.props;
        if (_.get(query, 'room') !== roomId) {
            setCurrentRoom(query.room);
        }
    }

    render() {
        const {Room:{data, currentRoom}, Facts} = this.props;
        let style = {
            marginTop: '10vh',
            display: '-moz-box',
            MozBoxOrient: 'vertical'
        };
        let roomImages = [];
        if (currentRoom) {
            roomImages = _.get(currentRoom, 'images', []);
        }
        return (
            <div className="appContainer"
                 style={{backgroundImage: `url(${roomImages[_.random(0, roomImages.length - 1)]})`}}>
                <HeaderContainer allRooms={data} currentRoom={currentRoom}/>
                {
                    currentRoom ?
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                            <div style={Object.assign({maxWidth: '40vw'}, style)}>
                                <CurrentEventContainer currentRoom={currentRoom}/>
                                <FactsContainer Facts={Facts} currentRoom={currentRoom}/>
                            </div>
                            <div style={style}>
                                <UpcomingEventsContainer
                                    currentRoom={currentRoom}
                                    style={{height: '45vh', marginBottom: '10vh', overflowY: 'scroll'}}/>
                            </div>
                        </div>
                        : <div/>
                }

                <Footer/>
            </div>
        )
    }
}

Application.contextTypes = {
    muiTheme: PropTypes.object
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...roomActions
    }, dispatch);
}

function mapStateToProps(state) {
    const {Room, Facts} = state;
    return {Room, Facts}
}
export default connect(mapStateToProps, mapDispatchToProps)(Application);