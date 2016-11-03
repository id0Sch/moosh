'use strict';
import {save,load} from '../utils/localStorage';

const KEY = 'state';

export const loadState = (key = KEY)=> {
    return load(key)
};
export const saveState = (key = KEY, state)=> {
    return save(key, state);
};