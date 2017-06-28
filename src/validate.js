/**
 * Validate directive.
 */

import { Validator } from './validator';
import { attr, camelize, on, off } from './util';

export var Validate = {

    priority: 500,

    bind() {

        var name = attr(this.el, 'name');

        if (!name) {
            return;
        }

        this.name = camelize(name);
        this.type = this.arg;
        this.value = this.el.value;

        this.el._dirty = false;
        this.el._touched = false;

        on(this.el, 'blur', this.listener.bind(this));
        on(this.el, 'input', this.listener.bind(this));

        Validator.add(this);
    },

    unbind() {

        off(this.el, 'blur', this.listener);
        off(this.el, 'input', this.listener);

        Validator.remove(this);
    },

    update(value) {
        this.args = value;
    },

    listener(e) {

        if (related.target && (related.target.tagName === 'A' || related.target.tagName === 'BUTTON')) {
            return;
        }

        if (e.type == 'blur') {
            this.el._touched = true;
        }

        if (this.el.value != this.value) {
            this.el._dirty = true;
        }

        Validator.validate(this.el);
    },

    validate() {

        var validator = this.validator();

        if (validator) {
            return validator.call(this.vm, this.el.value, this.args);
        }
    },

    validator() {

        var vm = this.vm, validators;

        do {

            validators = vm.$options.validators || {};

            if (validators[this.type]) {
                return validators[this.type];
            }

            vm = vm.$parent;

        } while (vm);

        return Validator.types[this.type];
    }

};

//  RelatedTarget property dose not work in Safari, IE & Firefox
const related = {
    target: null,
    handler ({target}) {
        related.target = target;
        setTimeout(() => related.target = null, 0);
    }
};

on(document, 'mousedown', related.handler);
on(document, 'pointerdown', related.handler);
on(document, 'touchstart', related.handler);
