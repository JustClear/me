import Watcher from './watcher/index';
import directives from './directives/index';

export default class Directive {
    constructor(name, el, scope, expression, payload) {
        this.name = name;
        this.el = el;
        this.me = scope;
        this.payload = payload;
        this.attrName = payload && payload.attrName || '';
        this.expression = expression;
        Object.assign(this, directives[this.name]);
        this.bindWatcher();
    }

    bindWatcher() {
        if (!this.expression) return;
        this.bind && this.bind();
        this.watcher = new Watcher(this.me, this.expression, this.update);
        this.update && this.update(this.watcher.value);
    }
}
