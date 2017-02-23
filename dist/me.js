(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Me', factory) :
    (global.Me = factory());
}(this, function () { 'use strict';

    function Me(options) {
        if (!(this instanceof Me)) return new Me(options);
    }

    return Me;

}));
//# sourceMappingURL=me.js.map
