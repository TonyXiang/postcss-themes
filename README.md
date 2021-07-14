# PostCSS Themes

[PostCSS] plugin to add themes in CSS file.

[PostCSS]: https://github.com/postcss/postcss

[![Build Status](https://travis-ci.com/TonyXiang/postcss-themes.svg?branch=master)](https://travis-ci.com/TonyXiang/postcss-themes)

Note about at-rules:
Except for [Conditional Group At-rules](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule#conditional_group_rules), others will simply be ignored because of irrelevance. `@keyframes` may contain css varialbe, but it's not feasible to deduce their scope values at build time.

## Usage

```bash
npm install postcss-themes -D
```

```javascript
module.exports = {
  plugins: [
    'postcss-themes': {
      themes: {
        filePath: 'theme-aaa.css',
      }
    },
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

### Work With Other Postcss Plugins
```javascript
module.exports = {
  plugins: [
    'postcss-themes': {
      themes: {
        filePath: 'theme-aaa.css',
      }
    },
    'postcss-css-variables': {},
    'postcss-preset-env': {
      ...
    }
  ]
}
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
| variables | CSS variables; The CSS variables in CSS files will bo ignored If the same CSS variables are defined not only in `variables` but also in the CSS file that `filePath` linked to. | object | - |
