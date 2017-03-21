import defineReactive from './define-reactive';
import Common from './../../utils/index';

export default function observe(data) {
    if (Common.type(data) != 'object') return;

    for (let key in data) {
        defineReactive(data, key);
    }
}
