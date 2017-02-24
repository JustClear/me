let uid = 0;

export default class Dep {
    constructor() {
        this.id = uid++;
        this.subs = {};
    }

    addSub(sub) {
        // avoid repeated additions
        if (!this.subs[sub.uid]) this.subs[sub.uid] = sub;
    }

    notify() {
        for (let uid in this.subs) {
            this.subs[uid].update();
        }
    }
}

Dep.target = null;
