/**
 * Install plugin.
 */

import Util from './util';
import Fields, { Mixin } from './fields';
import { Validate } from './validate';
import { Validator, Filter, Directive } from './validator';

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    Util(Vue);

    Vue.field = Fields;
    Vue.mixin(Mixin);

    Vue.validator = Validator;
    Vue.filter('valid', Filter);
    Vue.directive('validator', Directive);
    Vue.directive('validate', Validate);
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;