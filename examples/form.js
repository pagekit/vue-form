import Vue from 'vue';
import VueForm from 'vue-form';
import customFields from './custom-fields.vue';

Vue.use(VueForm);

new Vue({

    el: '#app',

    components: {
        customFields
    },

    filters: {

        json: function (val) {
            return JSON.stringify(val, null, 2);
        }

    },

    data: {

        fields: {

            text: {
                label: 'Text',
                type: 'text'
            },

            textarea: {
                label: 'Textarea',
                type: 'textarea'
            },

            select: {
                label: 'Select',
                type: 'select',
                default: 1,
                options: {
                    one: 1,
                    two: 2,
                    three: 3
                }
            },

            number: {
                label: 'Number',
                type: 'number'
            },

            custom: {

                label: 'Custom',
                type: 'custom'

            },

            show: {
                type: 'checkbox',
                default: true
            },

            _show: {
                label: 'Show/Hide',
                type: 'text',
                show: 'show'
            },

            enable: {
                type: 'checkbox',
                default: true
            },

            _enable: {
                label: 'Enable/Disable',
                type: 'text',
                enable: function (values) {
                    return values.enable;
                }
            },

            'nested.text': {
                label: 'Nested Text',
                type: 'text'
            }

        },

        values: {},
        updated: ''

    },

    methods: {

        update: function (field, value, prev) {
            this.updated = '@update >> ' + field.name + ': ' + JSON.stringify(value);
        }

    }

});