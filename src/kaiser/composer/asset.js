const { filterUniqueByObjectKey } = require('../../util/arrays');

exports.composeAsset = (original) => {
    const list = original.filter(filterUniqueByObjectKey());

    return {
        list,
        find: (id) => list.find((item) => item.id === id),
    };
};
