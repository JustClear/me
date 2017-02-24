export default function proxy(sourceKey, key) {
    let self = this;

    Object.defineProperty(self, key, {
        configurable: true,
        enumerable: true,
        get() {
            return self[sourceKey][key];
        },
        set(newVal) {
            return self[sourceKey][key] = newVal;
        },
    });
}
