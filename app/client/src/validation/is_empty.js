const  isEmpty = value =>
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim().length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0);

// Using same function as API but change exports.module = isEmpty to export default isEmpty
export default isEmpty;
