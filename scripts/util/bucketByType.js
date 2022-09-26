exports.bucketByType = array => {
    return array.reduce((obj, item) => {
        if (item.type in obj) obj[item.type].push(item);
        else obj[item.type] = [item];
        return obj;
    }, {});
};
