import { each, warn, isObject, isUndefined} from './util';

export default {

    name: 'field',

    props: ['field', 'class'],

    data() {
        return Object.assign({
            key: '',
            name: '',
            type: 'text',
            label: '',
            attrs: {},
            options: [],
            default: undefined
        }, this.field);
    },

    created() {

        this.key = `["${this.name.replace(/\./g, '"]["')}"]`;

    },

    computed: {

        value: {

            get() {

                var value = this.$parent.getField(this);

                if (isUndefined(value) && !isUndefined(this.default)) {
                    if (this.default) {
                        this.$parent.setField(this, this.default, value);
                    }
                    return this.default
                }

                return value;
            },

            set(value) {

                if (!isUndefined(this.value) || value) {
                    this.$parent.setField(this, value, this.value);
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
