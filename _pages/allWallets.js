---
layout: compress
permalink: /allWallets.js
---

(() => {
  window.wallets = []
  const data = {% include allAppList.html %}
  const verdicts = data.verdicts
  const folders = ["hardware", "android", "iphone"]
  folders.forEach(folder => {
    const folderData = data[folder]
    const category = folderData.category
    const apps = folderData.apps
    apps.forEach(w => {
      w.category = category
      w.folder = folder
      w.message = verdicts[w.verdict].message
      w.verdictText = verdicts[w.verdict].title
      window.wallets.push(w)
    })
  })
})()
