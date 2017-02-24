import init from './core/init/index';
import prototype from './core/prototype';
import {
    // parseTextExpression,
} from './core/compiler/utils';

export default function Me(options = {}) {
    if (!(this instanceof Me)) return new Me(options);

    init(this, options);
}

Object.assign(Me.prototype, prototype);

Me.prototype.constructor = Me;
