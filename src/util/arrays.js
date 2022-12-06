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

exports.isSubset = (primeArray, subArray) => {
    if (!Array.isArray(primeArray) || !Array.isArray(subArray)) return false;
    // console.log(`Looking for ${subArray} in ${primeArray}`);
    for (const sub of subArray) {
        if (!primeArray.includes(sub)) return false;
    }
    return true;
};

exports.notSubset = (primeArray, subArray) => {
    if (!Array.isArray(primeArray) || !Array.isArray(subArray)) return false;
    for (const sub of subArray) {
        if (primeArray.includes(sub)) return false;
    }
    return true;
};
