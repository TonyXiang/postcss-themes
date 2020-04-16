/* eslint-disable max-len */
let postcss = require('postcss')

module.exports = postcss.plugin('postcss-themes', (opts = { }) => {
  let { themes = [] } = opts
  if (themes && !Array.isArray(themes)) {
    themes = [themes]
  }
  // Work with options here
  // eslint-disable-next-line no-unused-vars
  return function (root, result) {
    themes.forEach(theme => {
      let defaultRoot = root.clone()
      let { className, variables } = theme
      if (className && variables && Object.keys(variables)) {
        let themeSelector = `.${ className }`
        let newRoot = defaultRoot.clone()
        newRoot.walkRules(rule => {
          let hasVariable = false
          rule.walkDecls(decl => {
            if (decl.prop.indexOf('--') !== 0 && (decl.value && !decl.value.includes('var('))) {
              decl.remove()
            } else {
              hasVariable = true
            }
          })
          if (hasVariable === false) {
            rule.remove()
          }
        })
        newRoot.walkDecls(decl => {
          if (decl.prop.indexOf('--') === 0) {
            let nativeValue = variables[decl.prop]
            let transformValue = variables[decl.prop.substring(2, decl.prop.length)]
            if (nativeValue !== undefined) {
              decl.value = nativeValue
            } else if (transformValue !== undefined) {
              decl.value = transformValue
            }
          }
        })

        newRoot.each(rule => {
          if (rule.type === 'rule') {
            if (rule.selector === ':root') {
              rule.selector = themeSelector
            } else if (rule.selector.indexOf('--') !== 0) {
              rule.selector = `${ themeSelector } ${ rule.selector }`
            }
          }
          root.append(rule)
        })
      }
    })
  }
})
