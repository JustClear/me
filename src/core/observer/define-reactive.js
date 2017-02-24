import Dep from './dep';

export default function defineReactive(object, key) {
    let value = object[key],
        dep = new Dep();

    Object.defineProperty(object, key, {
        get() {
            Dep.target && dep.addSub(Dep.target);
            return value;
        },
        set(newValue) {
            value = newValue;
            dep.notify();
        },
    });
}
