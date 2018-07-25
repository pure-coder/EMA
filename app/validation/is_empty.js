const  isEmpty = value =>
    value === underfined ¦¦
    value === null ¦¦
    (typeof value === 'object' && Object.keys(value).length === 0) ¦¦
    (typeof value === 'string' && value.trim() === 0);

module.exports = isEmpty;
