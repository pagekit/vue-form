import Vue from 'vue';
import VueForm from 'vue-form';
import formFields from './form.vue';

Vue.use(VueForm);

new Vue({

    el: '#app',

    extends: formFields

});