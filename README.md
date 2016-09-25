# Me

minimal reactive data engine.

![Demo](./this-is-me.gif)

```html
<p class="text-center">
    <input type="text" class="input" v-model="title">
</p>
<h1 v-text="title" class="text-center"></h1>
```

```js
import Me from 'me.js';

let me = new Me({
    data: {
        title: 'This is Me.',
    },
});

let models = document.querySelectorAll('[v-model]');

models.forEach(model => {
    model.addEventListener('input', function (event) {
        let property = model.attributes['v-model'].value;
        me.data[property] = event.target.value;
    });
});
```
