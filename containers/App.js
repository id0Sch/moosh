/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux'
import {List, ListItem} from 'material-ui/List';

import HeaderContainer from './HeaderContainer';
import CurrentEventContainer from './CurrentEventContainer';
import UpcomingEventsContainer from './UpcomingEventsContainer';
import FactsContainer from './FactsContainer';
import Footer from '../components/Footer';

const Application = ({location:{query}, children, Room:{data}}, {muiTheme})=> {
    let style = {
        marginTop: '10vh',
        display: '-moz-box',
        MozBoxOrient: 'vertical'
    };
    let roomImages;
    if (query.room) {
        roomImages = _.get(_.find(data, {id: query.room}), 'images', []);
    }
    return (
        <div className="appContainer" style={{backgroundImage: `url(${roomImages[_.random(0, roomImages.length-1)]})`}}>
            <HeaderContainer roomId={query.room}/>
            {
                query.room ?
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        <div style={Object.assign({maxWidth: '40vw'}, style)}>
                            <CurrentEventContainer roomId={query.room}/>
                            <FactsContainer roomId={query.room}/>
                        </div>
                        <div style={style}>
                            <UpcomingEventsContainer style={{height: '45vh', marginBottom: '10vh', overflowY: 'scroll'}}
                                                     roomId={query.room}/>
                        </div>
                    </div>
                    : <div/>
            }

            <Footer/>
        </div>
    )
};

Application.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state) {
    const {Room} = state;
    return {Room}
}
export default connect(mapStateToProps)(Application);