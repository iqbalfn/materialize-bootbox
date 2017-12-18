materialize-bootbox
===================

[Bootbox](http://bootboxjs.com) like plugins for [Materialize 1.0](http://next.materializecss.com/).

Instalation
-----------

```html
<!-- Compiled and minified CSS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-alpha.2/css/materialize.min.css">

<!-- Compiled and minified JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-alpha.2/js/materialize.min.js"></script>

<!-- Materialize Bootbox -->
<script src="static/js/mzbox.min.js"></script>
```

Usage
-----

```js
mzbox.alert(message);
mzbox.alert(message, title);
mzbox.alert(message, callback);
mzbox.alert(message, title, callback);
mzbox.alert(options);

mzbox.confirm(message);
mzbox.confirm(message, title);
mzbox.confirm(message, callback);
mzbox.confirm(message, title, callback);
mzbox.confirm(options);

mzbox.prompt(message);
mzbox.prompt(message, title);
mzbox.prompt(message, callback);
mzbox.prompt(message, title, value);
mzbox.prompt(message, title, callback);
mzbox.prompt(message, title, value, callback);
mzbox.prompt(options);

mzbox.dialog(options);
```

## TODO

1. Dynamic HTML5 Input range not renderred by materialize.
1. Prompt for:
    1. Chips
    1. Pickers
    1. Switches?

## License

It's MIT.

The plugins require materialize to be alive.
Please refer to [materialize](https://github.com/dogfalo/materialize/) license.

For the docs, please also see [prism](https://github.com/PrismJS/prism) license.

## Changelog

### 0.0.2

1. Add buttons options `default` that will set the box button on focus right after
    the box visible.