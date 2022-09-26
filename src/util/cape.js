exports.cape = (item) =>
    item === null || item === undefined
        ? []
        : Array.isArray(item)
        ? item
        : [item];
