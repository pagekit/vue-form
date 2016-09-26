/**
 * Utility functions.
 */

var debug = false, util = {};

export const isArray = Array.isArray;

export default function (Vue) {
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
