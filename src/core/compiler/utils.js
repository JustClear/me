export function parseTextExpression(text) {
    const regText = /\{\{(.+?)\}\}/g;
    let pieces = text.split(regText),
        matches = text.match(regText),
        tokens = [];

    pieces.map(piece => {
        if (matches && matches.indexOf('{{' + piece + '}}') > -1) {
            tokens.push(piece);
        } else if (piece) {
            tokens.push('`' + piece + '`');
        }
    });
    return tokens.join('+');
}

export function isDirective(attr) {
    return attr.indexOf('m-') === 0;
}

export function isEventDirective(attr) {
    return attr.indexOf('on') === 0;
}

export function isTextNode(node) {
    return node.nodeType === 3;
}

export function isElementNode(node) {
    return node.nodeType === 1;
}
