// reactive

import { dispatch } from '../observer/index';

export default function reactive(object, key) {
    let value = object[key];

    Object.defineProperty(object, key, {
        get() {
            return value;
        },
        set(newValue) {
            value = newValue;
            dispatch(key);
        },
    });
}
