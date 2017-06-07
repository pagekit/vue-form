/**
 * Validator for input validation.
 */

import * as types from './validators';
import { assign, camelize, pull, trigger } from './util';

export const Validator = {

    dirs: [],

    types: types,

    add(dir) {
        this.dirs.push(dir);
    },

    remove(dir) {
        pull(this.dirs, dir);
    },

    instance(el) {

        do {

            if (el._validator) {
                return el._validator;
            }

            el = el.parentElement;

        } while (el);

    },

    validate(el, submit) {

        var validator = this.instance(el), results = {valid: true};

        if (!validator) {
            return;
        }

        this.dirs.forEach((dir) => {

            var valid = dir.validate(), el = dir.el, name = dir.name;

            if (this.instance(el) !== validator) {
                return;
            }

            if (!el._touched && submit) {
                el._touched = true;
            }

            if (!el._touched && !valid) {
                valid = true;
                results.valid = false;
            }

            if (!results[name]) {
                results[name] = {
                    valid: true,
                    invalid: false,
                    dirty: el._dirty,
                    touched: el._touched
                };
            }

            results[name][dir.type] = !valid;

            if (submit && results.valid && !valid) {
                el.focus();
            }

            if (results[name].valid && !valid) {
                results[name].valid = false;
                results[name].invalid = true;
                results.valid = false;
            }

        });

        results.invalid = !results.valid;

        validator.results(results);

        if (submit && results.invalid) {
            trigger(validator.el, 'invalid');
        }

        return results.valid;
    }

};

export function Filter(fn) {
    return (e) => {
        e.preventDefault();

        if (Validator.validate(e.target, true)) {
            fn(e);
        }
    };
}

export const Directive = {

    bind() {

        var self = this, name = this.arg || this.expression;

        this.name = camelize(name);
        this.el._validator = this;

        this.vm.$set(this.name);
        this.vm.$on('hook:compiled', () => {
            Validator.validate(self.el);
        });
    },

    unbind() {
        this.vm.$delete(this.name);
    },

    results(results) {
        this.vm.$set(this.name, assign({
            validate: this.validate.bind(this)
        }, results));
    },

    validate() {
        return Validator.validate(this.el, true);
    }

};
