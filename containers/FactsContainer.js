/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import _ from 'lodash';
import React, {Component, PropTypes} from 'react'

import {connect} from 'react-redux'

import {Table, TableBody, TableHeader, TableRow, TableRowColumn, TableHeaderColumn} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import Fact from '../components/Fact';

const FactsContainer = ({Facts, currentRoom})=> {
    let facts = [];
    if (currentRoom.currentEventId) {
        let guestsFacts =
            _.chain(Room.data.schedule).find({id: Room.data.currentEventId}).get('guests').map('displayName')
                .map((guest)=>_.get(Facts.data, 'people.' + guest))
                .compact()
                .value();
        facts = facts.concat(guestsFacts);
    }
    facts = facts.concat(_.flatten(_.get(Facts.data, 'rooms.' + currentRoom.id)));
    facts = _.shuffle(_.flatten(facts));
    return facts.length ?
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '80px', marginBottom: '80px'}}>
            <Card>
                <Fact {...facts[0]}/>
            </Card>
        </div>
        : <div/>

};
FactsContainer.contextTypes = {
    muiTheme: PropTypes.object
};

export default FactsContainer;