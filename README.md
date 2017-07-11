# vue-form

Form plugin for Vue.js

This plugin provides form rendering and validation given a configuration object.

## Rendering

A global `fields` component is registered which expects `config` and `model` props. Both can be a component data entry reference or an literal Array/Object.

**Example**

```javascript
<fields :config="fields" :model="model"></fields>
```

#### Config

The config Array declares the form fields and their settings being each field an declarative Object with the following options.

- **name** - `String` `required` - The field name associated with the model
- **label** - `String` - The field Label
- **type** - `String` `default: 'text'` - The field type
- **attrs** - `Object` - Additional element attributes
- **options** - `Array` - Key/Value set of options for options fields

**Example**

```javascript
data: function() {
    return {
        fields: {
            'my-text': {
                label: 'MyText'
            },
            'my-textarea': {
                label: 'MyTextarea',
                type: 'textarea'
            }
        }
    };
}
```

#### Fields

- **Text** - text type input
- **Textarea** - textarea element
- **Radio** - radio type input
- **Checkbox** - checkbox type input
- **Select** - select element

Fields are Vue components and as such custom ones can be declared.

**Example**

```javascript
Vue.component('myField', {
    props: ['value']
});
Vue.field.types.myfield = '<my-field :value.sync="value"></my-field>';
```

### Model

The model is an Vue data representation of your form data being each key the field name.

### Template

Vue-form has an inbuilt form template which can be override in the view.

```javascript
<fields :config="fields" :model="model" inline-template>
    <div v-for="field in fields" class="myFieldClass">
        <field :config="field" :values.sync="values"></field>
    </div>
</fields>
```

Or declare your custom one globally.

```javascript
Vue.field.templates.custom = '...';
```

```javascript
<fields :config="fields" :model="model" template="custom"></fields>
```

## Validation

`Validator` directive must be set on the form tag passing as an argument the name of the component property which should hold the validation results. A global `valid` filter is declared for preventing the form submission if validation fails.

```html
<form v-validator="form" @submit.prevent="submitFunction | valid"></form>
```

```javascript
data: function () {
    return {
        form: {}
    }
}
```

Each field that requires validation must have an name attribute which will be used to reference it. One or more `validate` directives will determine it validation rules accepting arguments if required.

```html
<input type="text" name="myField" v-validate:required v-validate:maxlength="50">
```

We can use the `form` Object to show visual indications.

```html
<span v-show="form.myField.invalid">Field cannot be blank</span>
```

### Custom Validators

You can declare custom field validators.

```javascript
Vue.validator.types.myValidator = function (value, arg) {
    ...
    return false || true;
};
```
