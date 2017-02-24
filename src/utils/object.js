export function isObject(object) {
    return object !== null && typeof object === 'object';
}

export default function extend() {
    let options, name, clone, copy, source, copyIsArray,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }

    if (typeof target !== 'object') {
        target = {};
    }

    for (; i < length; i++) {
        //
        if ((options = arguments[i]) !== null) {
            // for in source object
            for (name in options) {

                source = target[name];
                copy = options[name];

                if (target == copy) {
                    continue;
                }

                // deep clone
                if (deep && copy && (typeof copy == 'object' || (copyIsArray = Array.isArray(copy)))) {
                    // if copy is array
                    if (copyIsArray) {
                        copyIsArray = false;
                        // if is not array, set it to array
                        clone = source && Array.isArray(source) ? source : [];
                    } else {
                        // if copy is not a object, set it to object
                        clone = source && typeof copy == 'object' ? source : {};
                    }

                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
}

export function isPlainObject(object) {
    let proto,
        ctor,
        class2type = {},
        toString = class2type.toString, // Object.prototype.toString
        hasOwn = class2type.hasOwnProperty,
        fnToString = hasOwn.toString, // Object.toString/Function.toString
        ObjectFunctionString = fnToString.call(Object); // 'function Object() { [native code] }'

    if (!object || toString.call(object) !== '[object Object]') {
        return false;
    }

    // According to the object created by `Object.create(null)` is no `prototype`
    proto = Object.getPrototypeOf(object);
    if (!proto) {
        return true;
    }

    ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
    return typeof ctor === 'function' && fnToString.call(ctor) === ObjectFunctionString;
}
