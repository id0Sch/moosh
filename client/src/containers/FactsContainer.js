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

class FactsContainer extends Component {
    render() {
        const {Facts:{data, currentFactIndex}} = this.props;
        return data.length ?
            <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '80px', marginBottom: '80px'}}>
                <Card style={{width: '31vw'}}>
                    <Fact {...data[currentFactIndex]}/>
                </Card>
            </div>
            : <div/>
    }
}

FactsContainer.contextTypes = {
    muiTheme: PropTypes.object
};

export default FactsContainer;