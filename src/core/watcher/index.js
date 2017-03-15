import Dep from '../observer/dep';

let uid = 0;

export default class Watcher {
    constructor(me, expression, callback, payload) {
        this.me = me;
        this.expression = expression;
        this.callback = callback;
        this.payload = payload;
        this.uid = uid++;
        this.depIds = {};
        this.value = this.getValue();
    }

    update() {
        let value = this.getValue(),
            oldValue = this.value;

        if (value != oldValue) {
            this.value = value;
            this.callback.call(this.payload.scope, value, oldValue);
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
