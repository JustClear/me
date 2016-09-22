(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Me', factory) :
    (global.Me = factory());
}(this, function () { 'use strict';

    // observer

    var callbacks = {};

    function observe(key, callback) {
        if (!callbacks[key]) {
            callbacks[key] = [];
        }

        callbacks[key].push(callback);
    }

    function dispatch(key) {
        if (callbacks && callbacks[key]) {
            callbacks[key].map(function (callback) {
                return callback();
            });
        }
    }

    function reactive(object, key) {
        var value = object[key];

        Object.defineProperty(object, key, {
            get: function get() {
                return value;
            },
            set: function set(newValue) {
                value = newValue;
                dispatch(key);
            }
        });
    }

    function observeNode(node, observeable, property) {
        node.textContent = observeable[property];

        observe(property, function () {
            return node.textContent = observeable[property];
        });
    }

    function parseDirective(observeable) {
        var nodes = document.querySelectorAll('[v-text]');

        nodes.forEach(function (node) {
            observeNode(node, observeable, node.attributes['v-text'].value);
        });
    }

    function observeData(object) {
        var key = void 0;

        for (key in object) {
            if (object.hasOwnProperty(key)) {
                reactive(object, key);
            }
        }

        parseDirective(object);
    }

    function Me() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


        observeData(options.data);

        return {
            data: options.data,
            observe: observe
        };
    }

    return Me;

}));
//# sourceMappingURL=me.js.map
