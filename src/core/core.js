import observeData from '../observer/observeData';
import { observe } from '../observer/index';

function Me(options = {}) {

    return new Me.fn.init(options);
}

Me.fn = Me.prototype = {
    constructor: Me,
    init(options) {
        observeData(options.data);
        return {
            data: options.data,
            observe,
        };
    },
};

export default Me;
