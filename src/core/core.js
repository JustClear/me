import observeData from '../observer/observeData';
import { observe } from '../observer/index';

function Me(options = {}) {

    observeData(options.data);

    return {
        data: options.data,
        observe,
    };
}

export default Me;
