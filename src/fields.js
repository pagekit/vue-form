module.exports = function (_) {

    return _.field = {

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

        created: function() {

            if (!this.fields || !this.values) {
                _.warn('Invalid config or model provided');
                this.$options.template = '';
                return;
            }

            if (!this.$options.template) {
                this.$options.template = this.$options.templates[this.template];
            }

        },

        computed: {

            fields: function () {

                var vm = this;

                if (_.isObject(this.config)) {
                    return this.filterFields(this.config);
                }

                do {

                    if (_.isObject(vm.$options[this.config])) {
                        return this.filterFields(vm.$options[this.config]);
                    }

                    vm = vm.$parent;

                } while (vm);

            },

            values: function () {

                var vm = this;

                if (_.isObject(this.model)) {
                    return this.model;
                }

                do {

                    if (_.isObject(vm.$get(this.model))) {
                        return vm.$get(this.model);
                    }

                    vm = vm.$parent;

                } while (vm);

            }

        },

        methods: {

            filterFields: function (fields) {

                var arr = _.isArray(fields), flds = [];

                _.each(fields, function (field, name) {

                    if (!_.isString(field.name) && !arr) {
                        field.name = name;
                    }

                    if (_.isString(field.name)) {
                        flds.push(field);
                    } else {
                        _.warn('Field name missing ' + JSON.stringify(field));
                    }

                });

                return flds;
            }

        },

        components: {
            field: require('./field')(_)
        },

        templates: {
            default: require('./templates/default.html')
        },

        types: {
            text: '<input type="text" v-bind="attrs" v-model="value">',
            textarea: '<textarea v-bind="attrs" v-model="value"></textarea>',
            radio: '<input type="radio" v-bind="attrs" v-model="value">',
            checkbox: '<input type="checkbox" v-bind="attrs" v-model="value">',
            // TODO does not support optgroups yet
            select: '<select v-bind="attrs" v-model="value"><option v-for="option in options | options" :value="option.value">{{ option.text }}</option></select>'
        }

    };

};
