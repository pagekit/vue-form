<template>

    <div>
        <div class="form-group" v-for="field in fields">
            <label v-if="field.type != 'checkbox'">{{ field.label }}</label>
            <component class="form-control" :is="field.type" :field="field"></component>
        </div>
    </div>

</template>

<script>

    import Vue from 'vue';

    export default {

        extends: Vue.component('fields'),

        fields: {

            number: '<input style="border: 1px solid red" type="number" v-bind="attrs" v-model="value">',

            custom: {

                template: '<input style="border: 1px solid red" type="text" v-bind="attrs" v-model="value">'

            }

        }

    };

</script>
