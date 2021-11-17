// run this via sh script via docker

const fs = require('fs')
const helper = require('./scripts/helperPlayStore.js')

const newAppIds = process.argv.slice(2)

console.log(`Adding skeletons for ${newAppIds.length} apps ...`)

newAppIds.forEach(appId => {
    const path = `_android/${appId}.md`
    fs.exists(path, fileExists => {
      if (!fileExists) {
        const file = fs.createWriteStream(path)
        file.write(`---
appId: ${appId}
verdict: wip
---
`,
        err => {
          if (err) {
            console.error(`Error with id ${idd}: ${err}`)
          }
          // console.log(`Success: ${path}`)
          helper.refreshFile(`${appId}.md`)
        })
      } else {
        // console.warn(`${path} / http://walletscrutiny.com/android/${appId} already exists. Refreshing ...`)
        helper.refreshFile(`${appId}.md`)
      }
    })
})
