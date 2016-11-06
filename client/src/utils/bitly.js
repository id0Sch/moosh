/**
 * Created by idoschachter on 06/11/2016.
 */
'use strict';
import _ from 'lodash';
import Promise from 'bluebird';
import fetch from 'isomorphic-fetch'
import co from 'co';

class bitly {
    constructor() {

    }

    shorten(url) {
        return fetch(`https://api-ssl.bitly.com/v3/shorten?access_token=${process.env.BITLY_CRED}&shortUrl=${url}`)
        // .then(response=>console.log(response))
            .then((response)=>response.json())
            .then(response=>_.get(response, 'data.url'))
    }
}