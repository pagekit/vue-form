module.exports = function (_, Vue) {

    function Fields(options) {

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

            created: function () {

                if (!this.fields || !this.values) {
                    _.warn('Invalid config or model provided');
                    this.$options.template = '';
                    return;
                }

                if (!this.$options.template) {
                    this.$options.template = Fields.templates[this.template];
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
                            if (!field.show || (new Vue({data: this.values})).$eval(field.show)) {
                                flds.push(field);
                            }
                        } else {
                            _.warn('Field name missing ' + JSON.stringify(field));
                        }

                    }.bind(this));

                    return flds;
                }

            },

            components: {
                field: require('./field')(_, _.extend(options.fields || {}, Fields.types))
            }

        };

    }

    Fields.mixin = {

        created: function () {
            this.$options.components.fields = Vue.extend(Fields(this.$options));
        }

    };

    Fields.types = {
        text:       '<input type="text" v-bind="attrs" v-model="value">',
        textarea:   '<textarea v-bind="attrs" v-model="value"></textarea>',
        radio:      '<template v-for="option in options | options">' +
                        '<input type="radio" v-bind="attrs" :value="option.value" v-model="value"> <label>{{ option.text }}</label>' +
                    '</template>',
        checkbox:   '<input type="checkbox" v-bind="attrs" v-model="value">',
        select:     '<select v-bind="attrs" v-model="value">' +
                        '<template v-for="option in options | options">' +
                            '<optgroup :label="option.label" v-if="option.label">' +
                                '<option v-for="opt in option.options" :value="opt.value">{{ opt.text }}</option>' +
                            '</optgroup>' +
                            '<option :value="option.value" v-else>{{ option.text }}</option>' +
                        '</template>' +
                    '</select>'
    };

    Fields.templates = {
        default: require('./templates/default.html')
    };

    return Fields;
};
