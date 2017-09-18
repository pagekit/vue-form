/**
 * Utility functions.
 */

var debug = false, util = {}, _set;

export const isArray = Array.isArray;

export default function (Vue) {
    _set = Vue.set;
    util = Vue.util;
    debug = Vue.config.debug || !Vue.config.silent;
}

export function warn(msg) {
    if (typeof console !== 'undefined' && debug) {
        console.warn(`[VueForm warn]: ${msg}`);
    }
}

export function isString(val) {
    return typeof val === 'string';
}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

export function isUndefined(val) {
    return typeof val === 'undefined';
}

export function on(el, event, cb, useCapture) {
    el.addEventListener(event, cb, useCapture);
}

export function off(el, event, cb, useCapture) {
    el.removeEventListener(event, cb, useCapture);
}

export function attr(el, attr) {
    return el ? el.getAttribute(attr) : null;
}

export function trigger(el, event) {

    var e = document.createEvent('HTMLEvents');

    e.initEvent(event, true, false);
    el.dispatchEvent(e);
}

export function camelize(str) {
    return util.camelize(str);
}

export function pull(arr, value) {
    arr.splice(arr.indexOf(value), 1);
}

export function get(obj, key, def) {

    var parts = key.split('.'), i;

    for (i = 0; i < parts.length; i++) {
        if (!isUndefined(obj[parts[i]])) {
            obj = obj[parts[i]];
        } else {
            return def;
        }
    }

    return obj;
}

export function set(obj, key, val) {

    var parts = key.split('.'), part;

    while (parts.length > 1) {

        part = parts.shift();

        if (!isObject(obj[part]) || isArray(obj[part])) {
            _set(obj, part, {});
        }

        obj = obj[part];
    }

    _set(obj, parts.shift(), val);
}

export function evaluate(expr, context) {
    try {
        return (Function(`with(this){return ${expr}}`)).call(context);
    } catch (e) {
        return false;
    }
}

export function each(obj, iterator) {

    var i, key;

    if (typeof obj.length == 'number') {
        for (i = 0; i < obj.length; i++) {
            iterator.call(obj[i], obj[i], i);
        }
    } else if (isObject(obj)) {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                iterator.call(obj[key], obj[key], key);
            }
        }
    }

    return obj;
}

export const assign = Object.assign || function (target) {

    for (var i = 1; i < arguments.length; i++) {

        var source = arguments[i];

        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
};
