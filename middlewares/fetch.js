/**
 * Created by idoschachter on 15/08/2016.
 */
'use strict';
import request from 'request';

const fetchMiddleware = store => next => action => {
    if (action.type !== 'API_REQUEST') {
        return next(action);
    }
    request.get(action.url, {
        time: true,
        json: true,
        withCredentials: false
    }, (err, res, body) => {
        if (res) {
            switch (res.statusCode) {
                case 0:
                    err = {
                        status: 0,
                        message: body || 'General Error'
                    };
                    break;
                case 400:
                    err = {
                        status: 400,
                        message: body || 'Bad Request'
                    };
                    break;
                case 401:
                    err = {
                        status: 401,
                        message: body || 'Bad Token'
                    };
                    break;
                case 404:
                    err = {
                        status: 404,
                        message: body || 'Feed not found'
                    };
                    break;
                case 500:
                    err = {
                        status: 500,
                        message: body || 'Server Error'
                    };
                    break;

            }
        }
        if (err) {
            return action.error(err);
        }
        return action.then(res, body);
    });
};

export default fetchMiddleware;