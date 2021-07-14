let postcss = require('postcss')

let plugin = require('./')

async function run (input, output, opts) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

const input = `
@import url supports( supports-query );
@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
       url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
}
:root {
  --main-color: green;
}

.foo {
  font-size: 16px;
  color: var(--main-color);
}
.bar {
  color: #000;
}
@keyframes pale {
  from {
    color: var(--main-color);
  }

  to {
    color: #fff;
  }
}
@media screen and (min-width: 900px) {
  .article {
    padding: 1rem 3rem;
    background-color: var(--main-color);
  }
}
@media screen and (min-width: 600px) {
  .article {
    padding: 5rem;
  }
}
`

const output = `
@import url supports( supports-query );
@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
       url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
}
:root {
  --main-color: green;
}

.foo {
  font-size: 16px;
  color: var(--main-color);
}
.bar {
  color: #000;
}
@keyframes pale {
  from {
    color: var(--main-color);
  }

  to {
    color: #fff;
  }
}
@media screen and (min-width: 900px) {
  .article {
    padding: 1rem 3rem;
    background-color: var(--main-color);
  }
}
@media screen and (min-width: 600px) {
  .article {
    padding: 5rem;
  }
}
.theme-aaa {
  --main-color: red;
}
.theme-aaa .foo {
  color: var(--main-color);
}
@media screen and (min-width: 900px) {
  .theme-aaa .article {
    background-color: var(--main-color);
  }
}
@media screen and (min-width: 600px) {
}
`

const outputMulti = `
@import url supports( supports-query );
@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
       url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
}
:root {
  --main-color: green;
}

.foo {
  font-size: 16px;
  color: var(--main-color);
}
.bar {
  color: #000;
}
@keyframes pale {
  from {
    color: var(--main-color);
  }

  to {
    color: #fff;
  }
}
@media screen and (min-width: 900px) {
  .article {
    padding: 1rem 3rem;
    background-color: var(--main-color);
  }
}
@media screen and (min-width: 600px) {
  .article {
    padding: 5rem;
  }
}
.theme-aaa {
  --main-color: red;
}
.theme-aaa .foo {
  color: var(--main-color);
}
@media screen and (min-width: 900px) {
  .theme-aaa .article {
    background-color: var(--main-color);
  }
}
@media screen and (min-width: 600px) {
}
.theme-bbb {
  --main-color: blue;
}
.theme-bbb .foo {
  color: var(--main-color);
}
@media screen and (min-width: 900px) {
  .theme-bbb .article {
    background-color: var(--main-color);
  }
}
@media screen and (min-width: 600px) {
}
`

const classNameAndVariables = {
  themes: {
    className: 'theme-aaa',
    variables: {
      '--main-color': 'red'
    }
  }
}

const filePath = {
  themes: {
    filePath: 'themes/theme-aaa.css'
  }
}

const classNameAndFilePath = {
  themes: {
    className: 'theme-aaa',
    filePath: 'themes/theme-aaa-copy.css'
  }
}

const variablesAndFilePath = {
  themes: {
    className: 'theme-aaa',
    filePath: 'themes/theme-bbb.css',
    variables: {
      '--main-color': 'red'
    }
  }
}

const multipleThemes = {
  themes: [
    { filePath: 'themes/theme-aaa.css' },
    { filePath: 'themes/theme-bbb.css' }
  ]
}

it('postcss-themes test theme.className && theme.variables', async () => {
  await run(input, output, classNameAndVariables)
})

it('postcss-themes test theme.filePath', async () => {
  await run(input, output, filePath)
})

it('postcss-themes test theme.className overwrite theme.filePath', async () => {
  await run(input, output, classNameAndFilePath)
})

it('postcss-themes test theme.variables overwrite theme.filePath', async () => {
  await run(input, output, variablesAndFilePath)
})

it('postcss-themes test multiple themes', async () => {
  await run(input, outputMulti, multipleThemes)
})
