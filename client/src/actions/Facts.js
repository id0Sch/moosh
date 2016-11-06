'use strict';

import {database} from '../Firebase';
import Events from '../Events'

const InventoryRef = database.ref('facts');

export const listenToFacts = () => (dispatch) => {
    InventoryRef.off();
    InventoryRef.on('value', (snapshot) => {
        dispatch({
            type: Events.FACTS_RECEIVE_DATA,
            data: snapshot.val() || []
        });
    }, (error) => {
        dispatch({
            type: Events.FACTS_RECEIVE_DATA_ERROR,
            message: error.message
        });
    });
};


export const refreshFact = () => ({
    type: Events.FACTS_SET_FACT_INDEX
});