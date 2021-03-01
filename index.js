const { exec } = require('child_process')
const { watchFile } = require('fs')
const path = require('path')

const home = require('os').homedir()

var preferencesPlist = path.join(
  home,
  '/Library/Preferences/.GlobalPreferences.plist',
)

function changeTerminalTheme(theme) {
  console.log(`Changing theme to ${theme} mode`)
  if (theme === 'dark' || theme === 'light') {
    const themeNameCapitalized = theme.charAt(0).toUpperCase() + theme.slice(1)
    const pathToScript = path.join(
      __dirname,
      `scripts/set${themeNameCapitalized}TerminalTheme.scpt`,
    )

    exec(`osascript ${pathToScript}`, (error, stdout, stderr) => {
      if (error || stderr) console.warn(error, stderr)
      if (stdout) console.log(`[stdout]:\n${stdout}`)
    })
  }
}

watchFile(preferencesPlist, (eventType, filename) => {
  // preferences updated
  exec('defaults read -g AppleInterfaceStyle', (error, stdout) => {
    if (stdout) {
      if (stdout === 'Dark\n') {
        changeTerminalTheme('dark')
      } else {
        console.log(`[stdout]:\n${stdout}`)
      }
    } else {
      changeTerminalTheme('light')
    }
  })
})
