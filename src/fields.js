import Field from './field';
import Template from './templates/default.html';
import { each, warn, isArray, isObject, isString } from './util';

export default function Fields (Vue) {

    return {

        name: 'fields',

        template: Template,

        props: {

            config: {
                default: ''
            },

            values: {
                type: Object
            },

            template: {
                type: String
            }

        },

        created() {

            var {types, templates, components} = this.$options;

            if (!this.config || !this.values) {
                warn('Invalid config or model provided');
                this.$options.template = '';
                return;
            }

            if (this.template && this.template in templates) {
                this.$options.template = templates[this.template];
            }

            for (var name in types) {
                var type = types[name];
                if (isString(type)) {
                    type = Vue.extend({extends: Field, template: type});
                } else if (isObject(type)) {
                    type = Vue.extend(Field).extend(type);
                }

                components[name] = type;
            }

        },

        computed: {

            fields() {

                var arr = isArray(this.config), fields = [];

                each(this.config, (field, name) => {

                    if (!isString(field.name) && !arr) {
                        field.name = name;
                    }

                    if (!isString(field.type) || !(field.type in this.$options.types)) {
                        field.type = 'text';
                    }

                    if (isString(field.name)) {
                        if (!field.show || (new Vue({data: this.values})).$eval(field.show)) {
                            fields.push(field);
                        }
                    } else {
                        warn(`Field name missing ${JSON.stringify(field)}`);
                    }

                });

                return fields;
            }

        },

        methods: {

            get(field) {
                return this.$get(`values${field.key}`);
            },

            set(field, value) {
                this.$set(`values${field.key}`, value);
            }

        },

        types: {
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
        },

        templates: {},

        components: {}

    }

};
