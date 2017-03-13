export default {
    bind() {},
    update(value) {
        this.el.setAttribute(this.attrName, value);
    },
};
