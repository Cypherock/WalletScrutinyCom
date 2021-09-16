process.env.TZ = 'UTC' // fix timezone issues
const apple = require('app-store-scraper')
const dateFormat = require('dateformat')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const helper = require('./helper.js')

const allowedHeaders = [
  "wsId", // apps that belong together get same swId
  "title", // gets updated from platform
  "altTitle", // if the name is too generic, we use this to distinguish
  "authors", // contributors to the analysis
  "appId", // provider chosen identifier. We use this for the file name, too
  "appCountry", // if the app is not available in the default country US, we take stats from there
  "idd", // plaform provided identifier. By this we find the data at the platform
  "released", // gets provided by platform
  "updated", // platform reported latest update
  "version", // platform reported version
  "stars", // platform reported stars of this language-country
  "reviews", // platform reported count of reviews of this language-country
  "size", // platform reported size in bytes
  "website", // platform reported 
  "repository", // source code repository if available
  "issue", // issue we opened in their repository
  "icon", // icon name. appId.{jpg,png}
  "bugbounty", // link to bug bounty program if known
  "verdict",
  "date", // date the review was done/updated
  "signer", // the identifier of the release signing key
  "reviewArchive", // history of our reviews
  "providerTwitter",
  "providerLinkedIn",
  "providerFacebook",
  "providerReddit",
  "redirect_from"
]
const folder = "_iphone/"

function refreshAll() {
  fs.readdir(folder, (err, files) => {
    if (err) {
      console.error(`Could not list the directory ${folder}.`, err)
      process.exit(1);
    }
    files.forEach((file, index) => {
      refreshFile(file)
    })
  })
}

function refreshFile(fileName) {
  const appPath = path.join(folder, fileName)
  var parts = fs.readFileSync(appPath, 'utf8').split("---")
  const headerStr = parts[1]
  const body = parts.slice(2).join("---").replace(/^\s*[\r\n]/g, "")
  const header = yaml.load(headerStr)
  const appId = header.appId
  const idd = header.idd
  const appCountry = header.appCountry || "us"
  for(var i of Object.keys(header)) {
    if(allowedHeaders.indexOf(i) < 0) {
      console.error(`Losing property ${i} in ${appPath}.`)
    }
  }
  if (!"defunct".includes(header.verdict)) {
    apple.app({
        id: idd,
        lang: 'en',
        country: appCountry,
        throttle: 20}).then( app => {
      const iconPath = `images/wallet_icons/iphone/${appId}`
      helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
        writeResult(app, header, iconExtension, body)
      })
    }, (err) => {
      if (`${err}`.search(/404/) > -1) {
        console.error(`\n_iphone/${appId}.md not available (${header.verdict})`)
      } else {
        console.error(`\nError with ${appId} https://apps.apple.com/${appCountry}/app/id${idd} : ${err}`)
      }
    })
  }
}

function writeResult(app, header, iconExtension, body) {
  var altTitle = header.altTitle || ""
  if (altTitle.length > 0) altTitle = `"${altTitle}"`
  const authors = new Set(header.authors)
  var version = app.version || "various"
  const released = header.released || app.released
  var releasedString = ""
  if (released != undefined) {
    releasedString = dateFormat(released, "yyyy-mm-dd")
  }
  const reviewArchive = (header.reviewArchive || [])
      .filter(it => {
        // wip archval is not very helpful as it only means that we realized we had to re-evaluate. It's a pseudo verdict.
        return it.verdict != "wip" && it.verdict != undefined
      })
  const redirects = new Set(header.redirect_from)
  const p = `_iphone/${header.appId}.md`
  const f = fs.createWriteStream(p)
  process.stdout.write("🍎")
  var verdict = header.verdict
  var date = header.date
  // retire if needed
  const daysSinceUpdate = ((new Date()) - (new Date(app.updated))) / 1000 / 60 / 60 / 24
  if ( daysSinceUpdate > 720 ) {
    if ( verdict != "obsolete" ) {
      // mark obsolete if old and not obsoelte yet
      helper.addReviewArchive(reviewArchive, header)
      verdict = "obsolete"
      date = new Date()
    }
  } else if ( daysSinceUpdate > 360 ) {
    if ( verdict != "stale" ) {
      // mark stale if old and not stale yet
      helper.addReviewArchive(reviewArchive, header)
      verdict = "stale"
      date = new Date()
    }
  } else {
    if ( verdict == "stale" || verdict == "obsolete" ) {
      // stale/obsolete product was revived. We might have to look into it.
      helper.addReviewArchive(reviewArchive, header)
      if ( app.minInstalls < 1000 ) {
        verdict = "fewusers"
      } else {
        verdict = "wip"
      }
      console.log(`\nReviving iphone/${header.appId} (${verdict})`)
      date = new Date()
    }
  }
  f.write(`---
wsId: ${header.wsId || ""}
title: "${app.title}"
altTitle: ${altTitle}
authors:
${[...authors].map((item) => `- ${item}`).join("\n")}
appId: ${header.appId}
appCountry: ${header.appCountry || ""}
idd: ${header.idd}
released: ${releasedString}
updated: ${dateFormat(app.updated, "yyyy-mm-dd")}
version: "${version}"
stars: ${app.score || ""}
reviews: ${app.reviews || ""}
size: ${app.size}
website: ${app.developerWebsite || header.website || ""}
repository: ${header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.appId}.${iconExtension}
bugbounty: ${header.bugbounty || ""}
verdict: ${verdict}
date: ${dateFormat(date, "yyyy-mm-dd")}
signer: ${header.signer || ""}
reviewArchive:
${reviewArchive.map((item) => `- date: ${dateFormat(item.date, "yyyy-mm-dd")}
  version: "${item.version}"
  appHash: ${item.appHash || ""}
  gitRevision: ${item.gitRevision}
  verdict: ${item.verdict}`).join("\n")}

providerTwitter: ${header.providerTwitter || ""}
providerLinkedIn: ${header.providerLinkedIn || ""}
providerFacebook: ${header.providerFacebook || ""}
providerReddit: ${header.providerReddit || ""}

redirect_from:
${[...redirects].map((item) => "  - " + item).join("\n")}
---

${body}`)
}

module.exports = {
  refreshAll,
  refreshFile
}
