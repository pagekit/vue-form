/**
 * Install plugin.
 */

module.exports = function (Vue) {

    var _ = require('./lib/util')(Vue);
    var field = require('./fields')(_, Vue);
    var validator = require('./validator')(_);

    Vue.field = field;
    Vue.mixin(field.mixin);

    Vue.validator = validator;
    Vue.filter('valid', validator.filter);
    Vue.directive('validator', validator.directive);
    Vue.directive('validate', require('./validate')(_));

};

if (window.Vue) {
    Vue.use(module.exports);
}
