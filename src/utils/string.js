export function isReserved(string) {
    // 0x24: $, 0x5F: _.
    const char = `${string}`.charCodeAt(0);
    return char === 0x24 || char === 0x5F;
}
