// observer

let callbacks = {};

export function observe(key, callback) {
    if (!callbacks[key]) {
        callbacks[key] = [];
    }

    callbacks[key].push(callback);
}

export function dispatch(key) {
    if (callbacks && callbacks[key]) {
        callbacks[key].map(callback => callback());
    }
}
