import defineReactive from './define-reactive';
import {
    type,
} from './../../utils/index';

export function observe(data) {
    if (type(data) != 'object') return;

    for (let key in data) {
        defineReactive(data, key);
    }
}
