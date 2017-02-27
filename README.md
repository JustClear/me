# Me

## Get started

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Me</title>
</head>
<body>
    <div class="me" :text="title" @click="change"></div>
</body>
</html>
```

```js
import Me from 'me.js';

new Me({
    el: document.querySelector('.me'),
    data() {
        return {
            title: 'This is Me.',
        };
    },
    methods: {
        change() {
            this.$data.title = 'Title Changed.';
        }
    },
});
```
