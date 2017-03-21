export function domify(DOMString) {
    let htmlDoc = document.implementation.createHTMLDocument();
    htmlDoc.body.innerHTML = DOMString;
    return htmlDoc.body.children;
}

export function toDOM(el, template) {
    return template ? domify(template) : el;
}

export function isTextNode(node) {
    return node.nodeType === 3;
}

export function isElementNode(node) {
    return node.nodeType === 1;
}

export default {
    toDOM,
    isTextNode,
    isElementNode,
};
