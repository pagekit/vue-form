/**
 * Install plugin.
 */

import Util from './util';
import Fields from './fields';
import { Validate } from './validate';
import { Validator, Filter, Directive } from './validator';

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    Util(Vue);

    Vue.field = Fields(Vue);

    Vue.mixin({

        created() {
            this.$options.components.fields = Vue.extend(Vue.field);
        }

    });

    Vue.validator = Validator;
    Vue.filter('valid', Filter);
    Vue.directive('validator', Directive);
    Vue.directive('validate', Validate);

    Vue.config.optionMergeStrategies.types = Vue.config.optionMergeStrategies.props;

}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;
