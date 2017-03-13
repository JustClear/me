import Watcher from './watcher/index';
import directives from './directives/index';

export default class Directive {
    constructor(name, el, scope, expression) {
        this.name = name;
        this.el = el;
        this.me = scope;
        this.expression = expression;
        Object.assign(this, directives);
        this.bindWatcher();
    }

    bindWatcher() {
        if (!this.expression) return;
        this.bind && this.bind();
        this.watcher = new Watcher(this.me, this.expression, this.update);
        this.update(this.watcher.value);
    }
}
