/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import moment from 'moment';
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router'

import {AppBar} from 'material-ui';


const Menu = ({rooms})=>(
    <IconMenu
        iconButtonElement={
            <FlatButton style={{color: 'white', verticalAlign: '-webkit-baseline-middle'}}
                        label={moment().format('MMM DD, HH:mm')}/>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
        {
            _.map(rooms, (room)=> {
                return <Link to={{pathname: "/", query: {room: room.id}}}><MenuItem key={room.id}
                                                                                    primaryText={room.name}/></Link>;
            })
        }
    </IconMenu>
);
class HeaderContainer extends Component {
    render() {
        const {
            Room :{data},
            roomId
        } = this.props;
        return (
            <AppBar title={_.get(_.find(data, {id: roomId}), 'name')}
                    style={{backgroundColor: '#607D8B'}}
                    iconElementRight={<Menu rooms={data}/>}
                    showMenuIconButton={false}
            />
        )
    }
}
HeaderContainer.contextTypes = {
    muiTheme: PropTypes.object
};


function mapStateToProps(state) {
    const {Room} = state;
    return {Room}
}
export default connect(mapStateToProps)(HeaderContainer);