export const load = (key)=> {
    try {
        let obj = localStorage.getItem(key);
        if (!obj) {
            return undefined;
        }
        return JSON.parse(obj)
    } catch (err) {
        return undefined;
    }
};
export const save = (key, obj)=> {
    try {
        return localStorage.setItem(key, JSON.stringify(obj));
    } catch (err) {
        // lol
    }
};
export const remove = (key)=> {
    try {
        return localStorage.removeItem(key);
    } catch (err) {
        // lol
    }
};