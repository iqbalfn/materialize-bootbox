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
<script src="static/js/mzbox.js"></script>
```

Usage
-----

```js
bootbox.alert(message);
bootbox.alert(message, title);
bootbox.alert(message, callback);
bootbox.alert(message, title, callback);
bootbox.alert(options);

bootbox.confirm(message);
bootbox.confirm(message, title);
bootbox.confirm(message, callback);
bootbox.confirm(message, title, callback);
bootbox.confirm(options);

bootbox.prompt(message);
bootbox.prompt(message, title);
bootbox.prompt(message, callback);
bootbox.prompt(message, title, value);
bootbox.prompt(message, title, callback);
bootbox.prompt(message, title, value, callback);
bootbox.prompt(options);

bootbox.dialog(options);
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

For the docs, please also see [prism](https://github.com/PrismJS/prism).

## Changelog

### 0.0.2

1. Add buttons options `default` that will set the box button on focus right after
    the box visible.