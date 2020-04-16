let postcss = require('postcss')

let plugin = require('./')

async function run (input, output, opts) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

const input = `:root { 
  --main-color: green;
  --error-color: yellow;
}
.foo {
  font-size: 16px;
  color: var(--main-color);
}
.bar {
  color: var(--error-color);
}`

const output = `:root { 
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
}`

const opts = {
  themes: {
    className: 'theme-aaa',
    variables: {
      '--main-color': 'red',
      '--error-color': 'blue'
    }
  }
}
it('postcss-themes test', async () => {
  await run(input, output, opts)
})
