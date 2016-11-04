/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import moment from 'moment';
import _ from 'lodash';
import React, {Component, PropTypes} from 'react'

import {connect} from 'react-redux'

import {Table, TableBody, TableHeader, TableRow, TableRowColumn, TableHeaderColumn} from 'material-ui/Table';
import TagFace from 'material-ui/svg-icons/image/tag-faces';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import Loader from '../components/Loader';

class CurrentEventContainer extends Component {
    render() {
        const {
            Room:{data, hasReceivedData},
            roomId
        } = this.props;
        let currentEvent;
        let nextEventStartTime;
        let roomData = _.find(data, {id: roomId}) || {};
        if (roomData.currentEventId) {
            currentEvent = _.find(roomData.schedule, {id: roomData.currentEventId});
        }
        if (!currentEvent) {
            nextEventStartTime = _.get(_.first(roomData.schedule), 'start');
        }
        return (

            <Card style={{maxHeight: '45vh', height: '45vh', overflowY: 'hidden'}}>
                {
                    !hasReceivedData ?
                        <Loader active={true}/>
                        :
                        (_.isEmpty(roomData) || !currentEvent) ?
                            (<ListItem disabled={true} style={{textAlign: 'center'}}>
                                <h3 style={{marginBottom: 0}}>
                                    Available until {
                                        !!nextEventStartTime ?
                                            moment(nextEventStartTime).format('HH:mm')
                                            : 'further notice'
                                    }!
                                </h3>
                                <TagFace style={{height: 'auto', width: '150px', color: '#4CAF50'}}/>
                            </ListItem>)
                            :
                            <div>
                                <Subheader>Happening now</Subheader>
                                <CardHeader
                                    title={`${_.capitalize(currentEvent.name)}, ending at ${moment(currentEvent.finish).format('HH:mm')}`}
                                    subtitle={`by ${_.get(currentEvent, 'creator.displayName')}`}
                                    avatar={_.get(currentEvent, 'creator.image')}
                                />
                                <CardText>
                                    <Subheader>{currentEvent.guests.length} Guests</Subheader>
                                    <List style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-around',
                                        overflowY: 'scroll',
                                        maxHeight: '16vh'
                                    }}>
                                        {
                                            _.map(currentEvent.guests, (guest)=>(
                                                    <ListItem disabled={true}
                                                              primaryText={guest.displayName}
                                                              leftAvatar={<Avatar src={_.get(guest, 'image')}/>}
                                                              secondaryText={guest.responseStatus}/>
                                                )
                                            )
                                        }
                                    </List>
                                </CardText>
                                {/*<CardText>*/}
                                {/*{JSON.stringify(data)}*/}
                                {/*</CardText>*/}
                            </div>
                }
            </Card>
        );
    }
}
CurrentEventContainer.contextTypes = {
    muiTheme: PropTypes.object
};


function mapStateToProps(state) {
    const {Room} = state;
    return {Room}
}
export default connect(mapStateToProps)(CurrentEventContainer);