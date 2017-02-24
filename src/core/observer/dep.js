let uid = 0;

export default class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    addSub(sub) {
        // avoid repeated additions
        if (!this.subs[sub.uid]) this.subs[sub.uid] = sub;
    }

    depend() {
        Dep.target.addDep(this);
    }

    removeSub(sub) {
        let index = this.subs.indexOf(sub);
        if (index != -1) this.subs.splice(index, 1);
    }

    notify() {
        this.subs.map((sub) => {
            sub.update();
        });
    }
}

Dep.target = null;
