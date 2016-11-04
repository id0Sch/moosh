import classNames from 'classnames/bind'
import React, {PropTypes} from 'react'
import CircularProgress from 'material-ui/CircularProgress';

const Loader = ({active}) =>(
    <div className={classNames("loading", {hidden: !active})}>
        <CircularProgress/>
    </div>
);

Loader.propTypes = {
    active: PropTypes.bool.isRequired
};
export default Loader;