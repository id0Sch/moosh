/**
 * Created by idoschachter on 06/11/2016.
 */
'use strict';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';

class Bitly {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    shorten(longUrl) {
        return fetch(`https://api-ssl.bitly.com/v3/shorten?access_token=${this.accessToken}&longUrl=${encodeURIComponent(longUrl)}`)
        // .then(response=>console.log(response))
            .then((response)=>response.json())
            .then(response=>_.get(response, 'data.url'))
    }
}
export default Bitly;