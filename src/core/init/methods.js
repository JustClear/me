import {
    noop,
} from '../../utils/index';

export default function initMethods(me) {
    let methods = me.methods;
    if (methods) {
        for (const key in methods) {
            me[key] = methods[key] == null ? noop : (typeof methods[key] == 'function' ? methods[key].bind(me) : '');
        }
    }
}
