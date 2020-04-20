# PostCSS Themes

[PostCSS] plugin to add themes in CSS file.

[PostCSS]: https://github.com/postcss/postcss

[![Build Status](https://travis-ci.com/TonyXiang/postcss-themes.svg?branch=master)](https://travis-ci.com/TonyXiang/postcss-themes)

## Usage

```bash
npm install postcss-themes -D
```

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-themes')({
+     themes: {
+       filePath: 'theme-aaa.css',
+     }
+   }),

// or use `className` and `variables`
+   require('postcss-themes')({
+     themes: {
+       className: 'theme-aaa',
+       variables: {
+         '--main-color': 'red',
+       }
+     }
+   }),

// or set "themes" to be type Array
+   require('postcss-themes')({
+     themes: [{
+       filePath: 'theme-aaa.css',
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
}
.foo {
  font-size: 16px;
  color: var(--main-color);
}
```

### theme-aaa.css
```css
:root {
  --main-color: red;
}
```

### Output CSS
```css
:root { 
  --main-color: green;
}
.foo {
  font-size: 16px;
  color: var(--main-color);
}
.theme-aaa { 
  --main-color: red;
}
.theme-aaa .foo {
  color: var(--main-color);
}
```

### Change Theme
```javascript
document.body.className = document.body.className + ' theme-aaa'
```

### Attribute
| attribute | intro | type | default |
| --- | --- | --- |  --- |
| themes | themes data | `ThemeObject`\|Array\<`ThemeObject`\> | - |

### ThemeObject
| attribute | intro | type | default |
| --- | --- | --- |  --- |
| className | the theme className. | string | - |
| filePath | The path of CSS file that define CSS variables; The fileName will be the theme `className` by default if `className` is not defined. | string | - |
| variables | The CSS variables in CSS files that `filePath` linked to will bo ignored If the same CSS variables are defined not only in `variables` but also in the CSS file | object | - |
