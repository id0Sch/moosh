/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import _ from 'lodash';
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {white, green500, green300,green900} from 'material-ui/styles/colors';

import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Paper from 'material-ui/Paper';


const UpcomingEvent = ({currentEventId, event}) => {
    let style = {margin: '9px', borderRadius: '10px'};
    let freeTimeStyle = {color: white, backgroundColor: green500};
    let busyTimeStyle = {borderWidth: '1.5px'};
    let properties = {
        disabled: true,
        style: Object.assign(event.freeTime ? freeTimeStyle : busyTimeStyle, style),
        primaryText: event.title
    };

    if (!event.freeTime) {
        let secondaryText = _.get(event.creator, 'displayName', '');

        let numberOfGuests = _.size(event.guests);
        if (numberOfGuests > 0) {
            secondaryText += ` and ${numberOfGuests == 1 ? _.first(event.guests).displayName : ` ${numberOfGuests} other guests`}`;
        }
        properties.secondaryText = secondaryText;
        properties.leftAvatar = (<Avatar src={_.get(event, 'creator.image')}/>);
    } else {
        // properties.secondaryText = <div style={{
        //     height:'100%',
        //     marginLeft: '80%',
        //     marginTop: '-4%'
        // }}><QRCode size={70} fgColor={green900} bgColor={green300} value={event.link}/></div>
    }
    return event.id !== currentEventId ? <ListItem {...properties}/> : <div/>;
};

const UpcomingEventsContainer = ({style, currentRoom})=> {
    let element;

    if (!_.isEmpty(currentRoom.schedule)) {
        element = <div>
            <Subheader>Upcoming</Subheader>
            <List style={style}>
                {
                    _.map(currentRoom.schedule, (event)=>
                        <UpcomingEvent key={event.id} currentEventsId={currentRoom.currentEventId} event={event}/>
                    )
                }
            </List>
        </div>;
    } else {
        element = <p>Free until tomorrow</p>
    }
    return (
        <Paper>
            {element}
        </Paper>
    );
};

UpcomingEventsContainer.contextTypes = {
    muiTheme: PropTypes.object
};
export default UpcomingEventsContainer;