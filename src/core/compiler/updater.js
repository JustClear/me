// updaters: text, html, model.

export default {
    ifUpdater(node, value, placeholderNode) {
        value ? placeholderNode.parentNode.insertBefore(node, placeholderNode) : placeholderNode.parentNode.removeChild(node);
    },
    show(node, value) {
        node.style.display = value ? 'block' : 'none';
    },
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
