/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import HeaderContainer from './HeaderContainer';
import CurrentEventContainer from './CurrentEventContainer';
import UpcomingEventsContainer from './UpcomingEventsContainer';
import FactsContainer from './FactsContainer';
import Footer from '../components/Footer';

import * as roomActions from '../actions/Room';
import * as factsActions from '../actions/Facts';
import * as timeActions from '../actions/Time';

const SECOND = 1000;
let interval;
class Application extends Component {
    componentDidMount() {
        const {location:{query}, setCurrentRoom, refreshFact, refreshTime, refreshImage} = this.props;
        if (query.hasOwnProperty('room')) {
            setCurrentRoom(query.room);
        }
        interval = setInterval(()=> {
            refreshTime();
        }, 40 * SECOND);

        setInterval(()=> {
            refreshFact();
        }, 10 * SECOND);

        setInterval(()=> {
            refreshImage();
        }, 15 * SECOND);
    }

    componentWillReceiveProps(nextProps) {
        const {location:{query}, setCurrentRoom} = nextProps;
        const {Room} = this.props;
        if (_.get(query, 'room') !== Room.roomId) {
            setCurrentRoom(query.room);
        }
    }

    render() {
        const {Room:{data, currentRoom, currentImageIndex}, Facts, Time:{currentTime}} = this.props;
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
                 style={{transition:'background 2s', backgroundImage: `url(${roomImages[currentImageIndex]})`}}>
                <HeaderContainer currentTime={currentTime} allRooms={data} currentRoom={currentRoom}/>
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
                                    style={{height: '60vh', marginBottom: '10vh', overflowY: 'scroll'}}/>
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
        ...roomActions,
        ...factsActions,
        ...timeActions
    }, dispatch);
}

function mapStateToProps(state) {
    const {Room, Facts, Time} = state;
    return {Room, Facts, Time}
}
export default connect(mapStateToProps, mapDispatchToProps)(Application);