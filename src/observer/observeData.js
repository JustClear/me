// observe data

import reactive from '../reactive/index';
import { parseDirective } from '../dom/index';

export default function observeData(object) {
    let key;

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            reactive(object, key);
        }
    }

    parseDirective(object);
}
