/**
 * Created by idoschachter on 03/11/2016.
 */
import React, {Component, PropTypes} from 'react'
import Subheader from 'material-ui/Subheader';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';

const Fact = ({title, subtitle, image, icon}) =>(
    <Card>
        <Subheader style={{marginBottom: '-20px'}}>Did you know?</Subheader>
        <div style={{display: 'flex'}}>
            <CardHeader title={title} subtitle={subtitle} avatar={icon}/>
            {
                image ?
                    <CardMedia >
                        <img style={{height: '250px', width: 'auto', maxWidth: 'auto'}} src={image}/></CardMedia> :
                    <div/>
            }
        </div>
    </Card>
);

Fact.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
};
export default Fact;