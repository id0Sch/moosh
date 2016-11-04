/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import _ from 'lodash';
import React, {Component, PropTypes} from 'react'
import QRCode from 'qrcode.react';
import {connect} from 'react-redux'

import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import {white, green500, green300,green900} from 'material-ui/styles/colors';

import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Paper from 'material-ui/Paper';

import Loader from '../components/Loader';

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

        let numberOfGuests = _.size(event.guests) - 1;//-1 for the organizer
        if (numberOfGuests > 0) {
            secondaryText += ` and ${numberOfGuests} ${numberOfGuests == 1 ? 'more guest' : 'guests'}`;
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

class UpcomingEventsContainer extends Component {
    render() {
        const {
            style,
            Room:{data, hasReceivedData},
            roomId
        } = this.props;
        let element;

        let roomData = _.find(data, {id: roomId});
        if (!hasReceivedData) {
            element = <Loader active={true}/>;
        } else if (!_.isEmpty(roomData.schedule)) {
            element = <div>
                <Subheader>Upcoming</Subheader>
                <List style={style}>
                    {
                        _.map(roomData.schedule, (event)=>
                            <UpcomingEvent currentEventsId={roomData.currentEventId} event={event}/>
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
    }
}

UpcomingEventsContainer.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state) {
    const {Room} = state;
    return {Room}
}
export default connect(mapStateToProps)(UpcomingEventsContainer);