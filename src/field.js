module.exports = function (_, types) {

    var Field = {

        name: 'field',

        props: ['config', 'values', 'class'],

        template: '<partial :name="type"></partial>',

        data: function () {
            return _.extend({
                key: '',
                name: '',
                type: 'text',
                label: '',
                attrs: {},
                options: [],
                default: undefined
            }, this.config);
        },

        created: function () {
            this.$set('key', '["' + this.name.replace(/\./g, '"]["') + '"]');
            this.attrs.class = this.attrs.class || this.class;

            if (_.isUndefined(this.value) && !_.isUndefined(this.default)) {
                this.value = this.default;
            }
        },

        computed: {

            value: {

                get: function () {
                    return this.$get('values' + this.key);
                },

                set: function (value) {
                    this.$set('values' + this.key, value);
                }

            }

        },

        methods: {

            filterOptions: function (options) {

                var opts = [];

                if (!options) {
                    _.warn('Invalid options provided for ' + this.name);
                    return opts;
                }

                _.each(options, function (value, name) {
                    if (_.isObject(value)) {
                        opts.push({label: name, options: this.filterOptions(value)});
                    } else {
                        opts.push({text: name, value: value});
                    }
                }, this);

                return opts;
            }

        },

        filters: {

            options: function (options) {
                return this.filterOptions(options);
            }

        },

        partials: {},

        components: {}

    };

    _.each(types, function (type, name) {
        if (_.isString(type)) {
            Field.partials[name] = type;
        } else if (_.isObject(type)) {
            Field.partials[name] = '<component :is="type" :config="config" :value.sync="value"></component>';
            Field.components[name] = function (resolve) {
                resolve(type);
            };
        }
    });

    return Field;
};
