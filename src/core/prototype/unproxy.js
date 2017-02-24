export default function unproxy(sourceKey, key) {
    delete this[sourceKey][key];
}
