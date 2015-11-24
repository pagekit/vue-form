/**
 * vue-form v0.1.0
 * Released under the MIT License.
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueForm"] = factory();
	else
		root["VueForm"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Install plugin.
	 */

	module.exports = function (Vue) {

	    var _ = __webpack_require__(1)(Vue);
	    var field = __webpack_require__(2)(_, Vue);
	    var validator = __webpack_require__(5)(_);

	    Vue.field = field;
	    Vue.mixin(field.mixin);

	    Vue.validator = validator;
	    Vue.filter('valid', validator.filter);
	    Vue.directive('validator', validator.directive);
	    Vue.directive('validate', __webpack_require__(7)(_));

	};

	if (window.Vue) {
	    Vue.use(module.exports);
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Utility functions.
	 */

	module.exports = function (Vue) {

	    var _ = Vue.util.extend({}, Vue.util), config = Vue.config;

	    _.warn = function (msg) {
	        if (window.console && (!config.silent || config.debug)) {
	            console.warn('[VueForm warn]: ' + msg);
	        }
	    };

	    _.each = function (obj, iterator, context) {

	        var i, key;

	        if (typeof obj.length == 'number') {
	            for (i = 0; i < obj.length; i++) {
	                iterator.call(context || obj[i], obj[i], i);
	            }
	        } else if (_.isObject(obj)) {
	            for (key in obj) {
	                if (obj.hasOwnProperty(key)) {
	                    iterator.call(context || obj[key], obj[key], key);
	                }
	            }
	        }

	        return obj;
	    };

	    _.pull = function (arr, value) {
	        arr.splice(arr.indexOf(value), 1);
	    };

	    _.attr = function (el, attr) {
	        return el ? el.getAttribute(attr) : null;
	    };

	    _.trigger = function (el, event) {

	        var e = document.createEvent('HTMLEvents');

	        e.initEvent(event, true, false);
	        el.dispatchEvent(e);
	    };

	    _.isString = function (value) {
	        return typeof value === 'string';
	    };

	    return _;
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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
	                            flds.push(field);
	                        } else {
	                            _.warn('Field name missing ' + JSON.stringify(field));
	                        }

	                    });

	                    return flds;
	                }

	            },

	            components: {
	                field: __webpack_require__(3)(_, _.extend(options.fields || {}, Fields.types))
	            }

	        };

	    }

	    Fields.mixin = {

	        created: function () {
	            this.$options.components.fields = Vue.extend(Fields(this.$options));
	        }

	    };

	    Fields.types = {
	        text: '<input type="text" v-bind="attrs" v-model="value">',
	        textarea: '<textarea v-bind="attrs" v-model="value"></textarea>',
	        radio: '<input type="radio" v-bind="attrs" v-model="value">',
	        checkbox: '<input type="checkbox" v-bind="attrs" v-model="value">',
	        select: '<select v-bind="attrs" v-model="value">' +
	                    '<template v-for="option in options | options">' +
	                        '<optgroup :label="option.label" v-if="option.label">' +
	                            '<option v-for="opt in option.options" :value="opt.value">{{ opt.text }}</option>' +
	                        '</optgroup>' +
	                        '<option :value="option.value" v-else>{{ option.text }}</option>' +
	                    '</template>' +
	                '</select>'
	    };

	    Fields.templates = {
	        default: __webpack_require__(4)
	    };

	    return Fields;
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function (_, types) {

	    var Field = {

	        name: 'field',

	        props: ['config', 'values'],

	        template: '<partial :name="type"></partial>',

	        data: function () {
	            return _.extend({
	                key: '',
	                name: '',
	                type: 'text',
	                label: '',
	                attrs: {},
	                options: []
	            }, this.config);
	        },

	        created: function () {
	            this.$set('key', '["' + this.name.replace('.', '"]["') + '"]');
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "<div v-for=\"field in fields\">\n    <label v-if=\"field.type != 'checkbox'\">{{ field.label }}</label>\n    <field :config=\"field\" :values.sync=\"values\"></field>\n</div>\n";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Validator for input validation.
	 */

	module.exports = function (_) {

	    return _.validator = {

	        dirs: [],

	        types: __webpack_require__(6),

	        add: function (dir) {
	            this.dirs.push(dir);
	        },

	        remove: function (dir) {
	            _.pull(this.dirs, dir);
	        },

	        instance: function (el) {

	            do {

	                if (el._validator) {
	                    return el._validator;
	                }

	                el = el.parentElement;

	            } while (el);

	        },

	        validate: function (el, submit) {

	            var validator = this.instance(el), results = {valid: true};

	            if (!validator) {
	                return;
	            }

	            this.dirs.forEach(function (dir) {

	                var valid = dir.validate(), el = dir.el, name = dir.name;

	                if (this.instance(el) !== validator) {
	                    return;
	                }

	                if (!el._touched && submit) {
	                    el._touched = true;
	                }

	                if (!el._touched && !valid) {
	                    valid = true;
	                    results.valid = false;
	                }

	                if (!results[name]) {
	                    results[name] = {
	                        valid: true,
	                        invalid: false,
	                        dirty: el._dirty,
	                        touched: el._touched
	                    };
	                }

	                results[name][dir.type] = !valid;

	                if (submit && results.valid && !valid) {
	                    el.focus();
	                }

	                if (results[name].valid && !valid) {
	                    results[name].valid = false;
	                    results[name].invalid = true;
	                    results.valid = false;
	                }

	            }, this);

	            results.invalid = !results.valid;

	            validator.results(results);

	            if (submit && results.invalid) {
	                _.trigger(validator.el, 'invalid');
	            }

	            return results.valid;
	        },

	        filter: function (fn) {
	            return function (e) {
	                e.preventDefault();

	                if (_.validator.validate(e.target, true)) {
	                    fn(e);
	                }

	            }.bind(this);
	        },

	        directive: {

	            bind: function () {

	                var self = this, name = this.arg || this.expression;

	                this.name = _.camelize(name);
	                this.el._validator = this;

	                this.vm.$set(this.name);
	                this.vm.$on('hook:compiled', function () {
	                    _.validator.validate(self.el);
	                });
	            },

	            unbind: function () {
	                this.vm.$delete(this.name);
	            },

	            results: function (results) {
	                this.vm.$set(this.name, _.extend({
	                    validate: this.validate.bind(this)
	                }, results));
	            },

	            validate: function () {
	                return _.validator.validate(this.el, true);
	            }

	        }

	    };

	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Validator functions.
	 */

	exports.required = function (value, arg) {

	    if (!(typeof arg == 'boolean')) {
	        arg = true;
	    }

	    if (typeof value == 'boolean') {
	        return !arg || value;
	    }

	    return !arg || !((value === null) || (value.length === 0));
	};

	exports.numeric = function (value) {
	    return /^[-+]?[0-9]+$/.test(value);
	};

	exports.integer = function (value) {
	    return /^(?:[-+]?(?:0|[1-9][0-9]*))$/.test(value);
	};

	exports.float = function (value) {
	    return /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/.test(value);
	};

	exports.alpha = function (value) {
	    return /^([A-Z]+)?$/i.test(value);
	};

	exports.alphaNum = function (value) {
	    return /^([0-9A-Z]+)?$/i.test(value);
	};

	exports.email = function (value) {
	    return /^([a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*)?$/i.test(value || 'a@a.aa');
	};

	exports.url = function (value) {
	    return /^((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)?$/.test(value);
	};

	exports.minLength = function (value, arg) {
	    return value && value.length && value.length >= +arg;
	};

	exports.maxLength = function (value, arg) {
	    return value && value.length && value.length <= +arg;
	};

	exports.length = function (value) {
	    return value && value.length == +arg;
	};

	exports.min = function (value, arg) {
	    return value >= +arg;
	};

	exports.max = function (value, arg) {
	    return value <= +arg;
	};

	exports.pattern = function (value, arg) {
	    var match = arg.match(new RegExp('^/(.*?)/([gimy]*)$'));
	    var regex = new RegExp(match[1], match[2]);
	    return regex.test(value);
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Validate directive.
	 */

	module.exports = function (_) {

	    return {

	        bind: function () {

	            var name = _.attr(this.el, 'name');

	            if (!name) {
	                return;
	            }

	            this.name = _.camelize(name);
	            this.type = this.arg || this.expression;
	            this.value = this.el.value;

	            this.el._dirty = false;
	            this.el._touched = false;

	            _.on(this.el, 'blur', this.listener.bind(this));
	            _.on(this.el, 'input', this.listener.bind(this));

	            _.validator.add(this);
	        },

	        unbind: function () {

	            _.off(this.el, 'blur', this.listener);
	            _.off(this.el, 'input', this.listener);

	            _.validator.remove(this);
	        },

	        update: function (value) {
	            this.args = value;
	        },

	        listener: function (e) {

	            if (e.relatedTarget && (e.relatedTarget.tagName === 'A' || e.relatedTarget.tagName === 'BUTTON')) {
	                return;
	            }

	            if (e.type == 'blur') {
	                this.el._touched = true;
	            }

	            if (this.el.value != this.value) {
	                this.el._dirty = true;
	            }

	            _.validator.validate(this.el);
	        },

	        validate: function () {

	            var validator = this.validator();

	            if (validator) {
	                return validator.call(this.vm, this.el.value, this.args);
	            }
	        },

	        validator: function () {

	            var vm = this.vm, validators;

	            do {

	                validators = vm.$options.validators || {};

	                if (validators[this.type]) {
	                    return validators[this.type];
	                }

	                vm = vm.$parent;

	            } while (vm);

	            return _.validator.types[this.type];
	        }

	    };

	};


/***/ }
/******/ ])
});
;