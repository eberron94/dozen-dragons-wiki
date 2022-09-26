exports.filterUnique = (v, i, a) => a.indexOf(v) === i;

exports.filterUniqueByObjectKey =
    (key = 'id') =>
    (curr, i, array) =>
        array.findIndex((e) => e[key] === curr[key]) === i;

exports.arrayToObject = (array, key = 'id') =>
    array.reduce((obj, item) => {
        if (key in item) obj[item[key]] = item;
        return obj;
    }, {});

exports.bucketArray = (array, byKey = 'id', defaultKey = 'item') =>
    array.reduce((obj, item) => {
        try {
            const key = item[byKey] || defaultKey || 'ukn';
            if (key in obj) obj[key].push(item);
            else obj[key] = [item];
            return obj;
        } catch (e) {
            console.error(e, array);
        }
    }, {});
