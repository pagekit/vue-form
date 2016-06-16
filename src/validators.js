/**
 * Validator functions.
 */

export function required(value, arg) {

    if (!(typeof arg == 'boolean')) {
        arg = true;
    }

    if (typeof value == 'boolean') {
        return !arg || value;
    }

    return !arg || !((value === null) || (value.length === 0));
}

export function numeric(value) {
    return /^[-+]?[0-9]+$/.test(value);
}

export function integer(value) {
    return /^(?:[-+]?(?:0|[1-9][0-9]*))$/.test(value);
}

export function float(value) {
    return /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/.test(value);
}

export function alpha(value) {
    return /^([A-Z]+)?$/i.test(value);
}

export function alphanum(value) {
    return /^([0-9A-Z]+)?$/i.test(value);
}

export function email(value) {
    return /^([a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*)?$/i.test(value || 'a@a.aa');
}

export function url(value) {
    return /^((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)?$/.test(value);
}

export function minlength(value, arg) {
    return value && value.length && value.length >= +arg;
}

export function maxlength(value, arg) {
    return value && value.length && value.length <= +arg;
}

export function length(value) {
    return value && value.length == +arg;
}

export function min(value, arg) {
    return value >= +arg;
}

export function max(value, arg) {
    return value <= +arg;
}

export function pattern(value, arg) {
    var match = arg.match(new RegExp('^/(.*?)/([gimy]*)$'));
    var regex = new RegExp(match[1], match[2]);
    return regex.test(value);
}
