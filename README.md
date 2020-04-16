# PostCSS Themes

[PostCSS] plugin to add themes in CSS file.

[PostCSS]: https://github.com/postcss/postcss

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-themes')({
+     themes: {
+       className: 'theme-aaa',
+       variables: {
+         '--main-color': 'red',
+         '--error-color': 'blue'
+       }
+     }
+   }),

// or set "themes" to be type Array
+   require('postcss-themes')({
+     themes: [{
+       className: 'theme-aaa',
+       variables: {
+         '--main-color': 'red',
+         '--error-color': 'blue'
+       }
+     }]
+   }),
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage

### Input CSS
```css
:root { 
  --main-color: green;
  --error-color: yellow;
}
.foo {
  font-size: 16px;
  color: var(--main-color);
}
.bar {
  color: var(--error-color);
}
```

### Output CSS
```css
:root { 
  --main-color: green;
  --error-color: yellow;
}
.foo {
  font-size: 16px;
  color: var(--main-color);
}
.bar {
  color: var(--error-color);
}
.theme-aaa { 
  --main-color: red;
  --error-color: blue;
}
.theme-aaa .foo {
  color: var(--main-color);
}
.theme-aaa .bar {
  color: var(--error-color);
}
```
