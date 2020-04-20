let postcss = require('postcss')

let plugin = require('./')

async function run (input, output, opts) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

const input = `:root { 
  --main-color: green;
}
.foo {
  font-size: 16px;
  color: var(--main-color);
}
`

const output = `:root { 
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
`

const outputMulti = `:root { 
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
.theme-bbb { 
  --main-color: blue;
}
.theme-bbb .foo {
  color: var(--main-color);
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
