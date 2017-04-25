import Field from './field';
import template from './templates/default.html';
import { get, each, warn, assign, isArray, isObject, isString } from './util';

export default function (Vue) {

    return {

        name: 'fields',

        props: {

            config: {
                type: [Array, Object],
                default() {
                    return [];
                }
            },

            values: {
                type: Object
            }

        },

        created() {

            var {fields, components} = this.$options;

            if (!this.fields || !this.values) {
                warn('Invalid config or model provided');
                return;
            }

            each(assign({}, Vue.fields, fields), (type, name) => {

                if (isString(type)) {
                    type = {template: type};
                }

                if (isObject(type)) {
                    type.name = type.name || `field-${name}`;
                    type = Vue.extend(Field).extend(type);
                }

                components[name] = type;
            });

        },

        computed: {

            fields() {
                return this.filterFields(this.config);
            }

        },

        methods: {

            getField(field) {

                if (this.values instanceof Vue && 'getField' in this.values) {
                    return this.values.getField(field);
                }

                return get(this.values, field.name);
            },

            setField(field, value, prev) {

                if (this.values instanceof Vue && 'setField' in this.values) {
                    this.values.setField(field, value, prev);
                } else {
                    Vue.set(this.values, field.name, value);
                }

            },

            filterFields(config) {

                var arr = isArray(config), fields = [];

                each(config, (field, name) => {

                    if (!isString(field.name) && !arr) {
                        field.name = name;
                    }

                    if (!isString(field.type)) {
                        field.type = 'text';
                    }

                    if (isString(field.name)) {
                        if (!field.show || evalShow(field.show, this.values)) {
                            fields.push(field);
                        }
                    } else {
                        warn(`Field name missing ${JSON.stringify(field)}`);
                    }

                });

                return fields;
            }

        },

        fields: {},

        components: {},

        template

    };

    function evalShow(show, data) {

        var comp = new Vue({data});
        var result = comp.$eval(show);

        comp.$destroy();

        return result;
    }

};

export var fields = {
    text: '<input type="text" v-bind="attrs" v-model="value">',
    textarea: '<textarea v-bind="attrs" v-model="value"></textarea>',
    radio: `<template v-for="option in options | options">
                    <input type="radio" v-bind="attrs" :name="name" :value="option.value" v-model="value"> <label>{{ option.text }}</label>
                 </template>`,
    checkbox: '<input type="checkbox" v-bind="attrs" v-model="value">',
    select: `<select v-bind="attrs" v-model="value">
                     <template v-for="option in options | options">
                         <optgroup :label="option.label" v-if="option.label">
                             <option v-for="opt in option.options" :value="opt.value">{{ opt.text }}</option>
                         </optgroup>
                         <option :value="option.value" v-else>{{ option.text }}</option>
                     </template>
                 </select>`,
    range: '<input type="range" v-bind="attrs" v-model="value">',
    number: '<input type="number" v-bind="attrs" v-model="value">'
};
