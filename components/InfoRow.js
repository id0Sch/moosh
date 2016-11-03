/**
 * Created by idoschachter on 01/08/2016.
 */
import React, {PropTypes, Component} from 'react'
import {TableRow, TableRowColumn} from 'material-ui/Table';

const InfoRow = ({title, value, btn})=>(
    <TableRow>
        <TableRowColumn style={{width: '25%'}}>{title}</TableRowColumn>
        <TableRowColumn style={{paddingLeft: 'auto'}}> {value}</TableRowColumn>
        {
            btn && <TableRowColumn style={{width: '15%'}}>{btn}</TableRowColumn>
        }

    </TableRow>
);

InfoRow.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired
};

export default InfoRow