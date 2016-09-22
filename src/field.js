import { each, warn, isObject, isUndefined} from './util';

export default {

    name: 'field',

    props: ['config'],

    data() {
        return Object.assign({
            name: '',
            type: 'text',
            label: '',
            attrs: {},
            options: [],
            default: undefined
        }, this.config);
    },

    computed: {

        key() {
            return `["${this.name.replace(/\./g, '"]["')}"]`;
        },

        value: {

            get() {

                var value = this.$parent.get(this);

                if (isUndefined(value) && !isUndefined(this.default)) {
                    if (value = this.default) {
                        this.$parent.set(this, value);
                    }
                }

                return value;
            },

            set(value) {

                if (!isUndefined(this.value) || value) {
                    this.$parent.set(this, value);
                }

            }

        }

    },

    methods: {

        filterOptions(options) {

            var opts = [];

            if (!options) {
                warn(`Invalid options provided for ${this.name}`);
                return opts;
            }

            each(options, (value, name) => {
                if (isObject(value)) {
                    opts.push({label: name, options: this.filterOptions(value)});
                } else {
                    opts.push({text: name, value: value});
                }
            });

            return opts;
        }

    },

    filters: {

        options(options) {
            return this.filterOptions(options);
        }

    }

};
