import React, {PropTypes} from 'react'
import Snackbar from 'material-ui/Snackbar';

const Message = ({message}) =>(
    <Snackbar
        open={true}
        message={message}
        action="refresh"
        autoHideDuration={5500}
    />
);

Message.propTypes = {
    error: PropTypes.string
};
export default Message;