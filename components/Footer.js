/**
 * Created by idoschachter on 11/08/2016.
 */
'use strict';
import React, {PropTypes} from 'react';

const Footer = (props, {muiTheme})=> (
    <span
        style={{
            color: muiTheme.palette.disabledColor,
            position: 'absolute',
            bottom: 0,
            right: 0,
            paddingRight: '2.5vw'
        }}>
                {`v.${process.env.VERSION}`}
    </span>);

Footer.contextTypes = {
    muiTheme: PropTypes.object
};

export default Footer;