import init from './core/init/index';
import prototype from './core/prototype';

export default function Me(options = {}) {
    if (!(this instanceof Me)) return new Me(options);

    init(this, options);
}

Object.assign(Me.prototype, prototype);
