/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import moment from 'moment';
import _ from 'lodash';
import React, {Component, PropTypes} from 'react'

import {connect} from 'react-redux'

import {Table, TableBody, TableHeader, TableRow, TableRowColumn, TableHeaderColumn} from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

import * as colors from 'material-ui/styles/colors';

import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Paper from 'material-ui/Paper';

import Loader from '../components/Loader';

class CurrentEventContainer extends Component {
    render() {
        const {
            Room:{data, hasReceivedData},
            roomId
        } = this.props;
        let roomData = _.find(data, {id: roomId});
        return (
            <Paper>
                {
                    !hasReceivedData ?
                        <Loader active={true}/>
                        :
                        (!_.isEmpty(roomData)) ?
                            <div>
                                <Subheader>Upcoming</Subheader>
                                <List style={{height: '70vh',marginBottom:'80px', overflowY: 'scroll'}}>
                                    {
                                        _.map(roomData.schedule, (event)=>(
                                            <ListItem disabled={true}
                                                      style={Object.assign({
                                                          margin: '9px',
                                                          borderRadius: '10px',
                                                      }, event.freeTime ? {
                                                          color: colors.white,
                                                          backgroundColor: colors.green500
                                                      } : {
                                                          //border: colors.blue300,
                                                          //borderStyle:  'solid',
                                                          borderWidth: '1.5px'
                                                      })}
                                                      primaryText={`${moment(event.start).format('HH:mm')} - ${moment(event.finish).format('HH:mm')}: ${event.freeTime ? 'Free time' : _.capitalize(event.name)}`}
                                                      leftAvatar={event.freeTime ? <div/> :
                                                          <Avatar src={_.get(event, 'creator.image')}/>}
                                                      secondaryText={event.freeTime ? "" : `${_.capitalize(_.get(event, 'creator.displayName', _.get(event,'creator.email').replace('@ironsrc.com','').replace(/\./g,' ')))} and ${_.size(event.guests) - 1/*-1 for the organizer*/} guests`}/>
                                        ))
                                    }
                                </List></div> : <div/>
                }
            </Paper>
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