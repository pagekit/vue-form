<template>

    <div class="container">

        <h1>Form</h1>

        <div class="row">
            <div class="col-md-6">
                <div class="panel panel-default">
                    <div class="panel-heading"><h2 class="panel-title">Regular Fields</h2></div>
                    <fields class="panel-body" :config="fields" :values="values" @update="update"/>
                </div>
            </div>
            <div class="col-md-6">
                <div class="panel panel-default">
                    <div class="panel-heading"><h2 class="panel-title">Custom Fields</h2></div>
                    <custom-fields class="panel-body" :config="fields" :values="values" @update="update"/>
                </div>
            </div>
        </div>

        <pre>{{ values | json }}</pre>
        <pre>{{ updated }}</pre>

    </div>

</template>

<script>

    import customFields from './custom-fields.vue';

    export default {

        components: {
            customFields
        },

        filters: {

            json: function (val) {
                return JSON.stringify(val, null, 2);
            }

        },

        data: () => ({

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

        }),

        methods: {

            update(field, value, prev) {
                this.updated = '@update >> ' + field.name + ': ' + JSON.stringify(value);
            }

        }

    };

</script>
