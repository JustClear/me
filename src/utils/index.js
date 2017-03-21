export function noop() {}

export function type(object) {
    let class2type = {},
        type = class2type.toString.call(object),
        typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol';

    if (object == null) {
        return object + '';
    }

    typeString.split(' ').forEach((type) => {
        class2type[`[object ${type}]`] = type.toLowerCase();
    });

    return (
        typeof object === 'object' ||
        typeof object === 'function' ?
        class2type[type] || 'object' :
        typeof object
    );
}

export function isReserved(string) {
    // 0x24: $, 0x5F: _.
    const char = `${string}`.charCodeAt(0);
    return char === 0x24 || char === 0x5F;
}

export function isObject(object) {
    return object !== null && typeof object === 'object';
}

export function isPlainObject(object) {
    let proto,
        ctor,
        class2type = {},
        toString = class2type.toString,
        hasOwn = class2type.hasOwnProperty,
        fnToString = hasOwn.toString,
        ObjectFunctionString = fnToString.call(Object);

    if (!object || toString.call(object) !== '[object Object]') {
        return false;
    }

    proto = Object.getPrototypeOf(object);
    if (!proto) {
        return true;
    }

    ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
    return typeof ctor === 'function' && fnToString.call(ctor) === ObjectFunctionString;
}

export default {
    noop,
    type,
    isReserved,
    isObject,
    isPlainObject,
};
