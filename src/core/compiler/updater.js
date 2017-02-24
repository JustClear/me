// updaters: text, html, model.

export default {
    text(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    html(node, value) {
        node.innerHtml = typeof value == 'undefined' ? '' : value;
    },
    model(node, value) {
        node.value = typeof value == 'undefined' ? '' : value;
    },
};
