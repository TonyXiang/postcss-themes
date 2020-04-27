/* eslint-disable max-len */
let fs = require('fs')
let path = require('path')
let postcss = require('postcss')

const ColorKeywords = [
  'transparent',
  'currentColor'
]

function hasColorKeyword (value) {
  let flag = false
  if (!value) {
    return flag
  }
  ColorKeywords.forEach(keyword => {
    if (value.includes(keyword)) {
      flag = true
    }
  })
  return flag
}

function useSyncTransform (themes) {
  let useSync = true
  themes.forEach(theme => {
    if (theme.filePath) {
      useSync = false
    }
  })
  return useSync
}

function readFile (from) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(from), 'utf8', (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

async function readTheme (theme) {
  let css = await readFile(theme.filePath)
  theme.variables = theme.variables || {}
  let fileCssRoot = postcss.parse(css)
  fileCssRoot.walkDecls(decl => {
    if (decl.prop.indexOf('--') === 0 && theme.variables[decl.prop] === undefined) {
      theme.variables[decl.prop] = decl.value
    }
  })
  if (!theme.className) {
    theme.className = path.basename(theme.filePath, '.css')
  }
}

function transformTheme (root, theme) {
  let temporaryRoot = postcss.parse('')
  let { className, variables } = theme
  if (className && variables && Object.keys(variables)) {
    let themeSelector = `.${ className }`
    let newRoot = root.clone()

    // remove unnecessary rules and declarations that not contain CSS variables
    newRoot.walkRules(rule => {
      let hasVariable = false
      rule.walkDecls(decl => {
        if (decl.prop.indexOf('--') !== 0 && (decl.value && !decl.value.includes('var(')) && !hasColorKeyword(decl.value)) {
          decl.remove()
        } else {
          hasVariable = true
        }
      })
      if (hasVariable === false) {
        rule.remove()
      }
    })

    // transform CSS variables
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

    // append to temporaryRoot
    newRoot.each(item => {
      if (item.type === 'rule') {
        if (item.selector === ':root') {
          item.selector = themeSelector
        } else if (item.selector.indexOf('--') !== 0) {
          item.selector = `${ themeSelector } ${ item.selector }`
        }
      }
      temporaryRoot.append(item)
    })
  }
  return temporaryRoot
}

function appendToRoot (root, list) {
  list.forEach(item => {
    item.each(q => {
      root.append(q)
    })
  })
}

module.exports = postcss.plugin('postcss-themes', (opts = { }) => {
  let { themes = [] } = opts
  if (themes && !Array.isArray(themes)) {
    themes = [themes]
  }

  function syncTransform (root) {
    let rootList = themes.map(theme => {
      return transformTheme(root, theme)
    })
    appendToRoot(root, rootList)
  }

  async function asyncTransform (root) {
    let jobs = themes.map(async theme => {
      if (theme.filePath) {
        await readTheme(theme)
        return transformTheme(root, theme)
      } else {
        return transformTheme(root, theme)
      }
    })
    let rootList = await Promise.all(jobs)
    appendToRoot(root, rootList)
  }

  let useSync = useSyncTransform(themes)

  return useSync ? syncTransform : asyncTransform
})
