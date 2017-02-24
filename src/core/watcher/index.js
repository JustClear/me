import Dep from '../observer/dep';

export default class Watcher {
    constructor(me, expression, callback) {
        this.me = me;
        this.expression = expression;
        this.callback = callback;
        this.depIds = {};
        this.value = this.getValue();
    }

    update() {
        let value = this.getValue(),
            oldValue = this.value;

        if (value != oldValue) {
            this.value = value;
            this.callback.call(this.me, value, oldValue);
        }
    }

    getValue() {
        Dep.target = this;
        let value = this.getData();
        Dep.target = null;
        return value;
    }

    getData() {
        let expressions = this.expression.split('.'),
            data = this.me.$data;

        expressions.map(expression => {
            data = data[expression];
        });

        return data;
    }

    addDep(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    }
}