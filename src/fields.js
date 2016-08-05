import Field from './field';
import Template from './templates/default.html';
import { each, warn, isArray, isObject, isString } from './util';

export default function Fields(options) {

    return {

        name: 'fields',

        props: {

            config: {
                default: ''
            },

            model: {
                default: ''
            },

            template: {
                type: String,
                default: 'default'
            }

        },

        created() {

            if (!this.fields || !this.values) {
                warn('Invalid config or model provided');
                this.$options.template = '';
                return;
            }

            if (!this.$options.template) {
                this.$options.template = Fields.templates[this.template];
            }

        },

        computed: {

            fields() {

                var vm = this;

                if (isObject(this.config)) {
                    return this.filterFields(this.config);
                }

                do {

                    if (isObject(vm.$options[this.config])) {
                        return this.filterFields(vm.$options[this.config]);
                    }

                    vm = vm.$parent;

                } while (vm);

            },

            values() {

                var vm = this;

                if (isObject(this.model)) {
                    return this.model;
                }

                do {

                    if (isObject(vm.$get(this.model))) {
                        return vm.$get(this.model);
                    }

                    vm = vm.$parent;

                } while (vm);

            }

        },

        methods: {

            filterFields(fields) {

                var arr = isArray(fields), flds = [];

                each(fields, (field, name) => {

                    if (!isString(field.name) && !arr) {
                        field.name = name;
                    }

                    if (isString(field.name)) {
                        if (!field.show || (new Vue({data: this.values})).$eval(field.show)) {
                            flds.push(field);
                        }
                    } else {
                        warn(`Field name missing ${JSON.stringify(field)}`);
                    }

                });

                return flds;
            }

        },

        components: {
            field: Field(Object.assign(options.fields || {}, Fields.types))
        }

    };

}

Fields.types = {
    text:       '<input type="text" v-bind="attrs" v-model="value">',
    textarea:   '<textarea v-bind="attrs" v-model="value"></textarea>',
    radio:      `<template v-for="option in options | options">
                    <input type="radio" v-bind="attrs" :name="name" :value="option.value" v-model="value"> <label>{{ option.text }}</label>
                 </template>`,
    checkbox:   '<input type="checkbox" v-bind="attrs" v-model="value">',
    select:     `<select v-bind="attrs" v-model="value">
                     <template v-for="option in options | options">
                         <optgroup :label="option.label" v-if="option.label">
                             <option v-for="opt in option.options" :value="opt.value">{{ opt.text }}</option>
                         </optgroup>
                         <option :value="option.value" v-else>{{ option.text }}</option>
                     </template>
                 </select>`
};

Fields.templates = {
    default: Template
};

export const Mixin = {

    created() {
        this.$options.components.fields = Vue.extend(Fields(this.$options));
    }

};
