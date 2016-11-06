/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import React, {Component, PropTypes} from 'react'

import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router'

import {AppBar} from 'material-ui';


const Menu = ({rooms,currentTime})=>(
    <IconMenu
        iconButtonElement={
            <FlatButton style={{color: 'white', verticalAlign: '-webkit-baseline-middle'}}
                        label={currentTime}/>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
        {
            _.map(rooms, (room)=> (
                <Link key={room.id} to={{pathname: "/", query: {room: room.id}}}>
                    <MenuItem key={room.id} primaryText={room.name}/>
                </Link>))
        }
    </IconMenu>
);

const HeaderContainer = ({currentRoom, allRooms, currentTime})=> (
    <AppBar title={_.get(currentRoom, 'name')}
            style={{backgroundColor: '#607D8B'}}
            iconElementRight={<Menu currentTime={currentTime} rooms={allRooms}/>}
            showMenuIconButton={false}
    />
);

HeaderContainer.contextTypes = {
    muiTheme: PropTypes.object
};

export default HeaderContainer;