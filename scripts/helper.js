const fs = require('fs')
const https = require('https')
const FileType = require('file-type')

function downloadImageFile(url, path, callback) {
  const iconFile = fs.createWriteStream(path)
  const request = https.get(`${url}`, response => {
    response.pipe(iconFile)
    response.on('end', () => {
      (async () => {
        const mimetype = ((await FileType.fromFile(path)) || {'mime': "undefined"}).mime
        if (mimetype == "image/png") {
          iconExtension = "png"
        } else if (mimetype == "image/jpg" || mimetype == "image/jpeg") {
          iconExtension = "jpg"
        } else if (mimetype == "text/html" || mimetype == "text/plain") {
          console.error(`Not writing results to ${path}`)
          console.error(`Icon wrong mime type ${mimetype}. Skipping.`)
          console.error(body)
          return
        } else {
          console.error(`Not writing results to ${path}`)
          console.error(`Icon wrong mime type ${mimetype}. Skipping.`)
          return
        }
        callback(iconExtension)
        fs.rename(path, `${path}.${iconExtension}`, err => {
          if ( err ) console.log('ERROR: ' + err)
        })
      })()
    })
    response.on('error', err => {
      console.error(err)
    })
  })
  request.on('error', err => {
    console.error(err)
  })
}

function addReviewArchive(reviewArchive, header) {
  // don't archive undefined or pseudo verdicts
  if (header.verdict == undefined || "wip,fewusers,stale,obsolete".includes(header.verdict)) {
    return
  }
  reviewArchive.unshift({
    date: header.date,
    version: header.version,
    appHash: "",
    gitRevision: getMasterHead(),
    verdict: header.verdict
  })
}

function getMasterHead() {
  return `${fs.readFileSync('.git/refs/heads/master')}`.trim()
}

const defunctFile = '_data/defunct.yaml'
var defuncts = fs.readFileSync(defunctFile, 'utf8')
function was404(id) {
  const line = `- ${id}\n`
  return defuncts.match(line)
}

function addDefunctIfNew(id) {
  if (!was404(id)) {
    // newly defunct
    const line = `- ${id}\n`
    defuncts += line
    fs.appendFileSync(defunctFile, line)
    console.error(`\n${id}.md not available`)
  }
}

module.exports = {
  addReviewArchive,
  downloadImageFile,
  was404,
  addDefunctIfNew
}
