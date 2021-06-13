var pauseForInput
var searchInput
if (document.querySelectorAll(".wallet-search-placeholder").length > 0) {
  var searchParent = document.createElement("div")
  var resultsList = document.createElement("ul")
  resultsList.classList.add("results-list")
  searchParent.classList.add("walletSearch-parent")
  searchInput = document.createElement("input")
  var searchExitButton = document.createElement("span")
  searchExitButton.setAttribute("onclick", "blockEvent(event);exitSearch(1)")
  searchExitButton.classList.add("exit-search")
  searchExitButton.innerHTML = '<i class="fas fa-times"></i>'
  searchInput.setAttribute("oninput", "blockEvent(event);searchCatalogue(this)")
  searchInput.setAttribute("onclick", "blockEvent(event);heroUX(this)")
  searchInput.setAttribute("onfocus", "blockEvent(event);heroUX(this)")
  searchInput.setAttribute("onmouseenter", "blockEvent(event);scOOff()")
  searchInput.setAttribute("onmouseleave", "blockEvent(event);scOOn()")
  searchInput.setAttribute("placeholder", "Search wallets...")
  searchInput.classList.add("walletSearch")
  searchParent.append(searchInput)
  searchParent.append(searchExitButton)
  searchParent.append(resultsList)
  document.querySelectorAll(".wallet-search-placeholder")[0].replaceWith(searchParent)
}

function exitSearch(x) {
  document.querySelectorAll(".exit-search")[0].style.display = "none"
  document.querySelectorAll(".results-list")[0].style.display = "none"
  document.body.classList.remove("search-ui-active")
  window.removeEventListener('wheel', captureScrollForSearch)
  x && (searchInput.value = "")
  searchInput.blur()
}

document.getElementById("exitSearchTrigger").addEventListener("click", event => {
  if (event.target != this) {
    return
  }
  exitSearch()
})

var scrPos = 0
var scrollOverride = 0

function captureScrollForSearch(e) {  
  scrPos = scrPos + e.deltaY
  !scrollOverride && (
    document.querySelectorAll(".results-list")[0].scrollTop = scrPos
  )
}

function scOOff() {
  scrollOverride = 0
}

function scOOn() {
  scrollOverride = 1
}

function blockEvent(e) {
  e.stopPropagation()
  e.preventDefault()
}

function focusResults(e) {
  e.preventDefault()
  if (e.keyCode === "40") {
    document.querySelectorAll(".results-list")[0].querySelectorAll(".li")[0].focus()
  }
}

function searchCatalogue(termInput) {
  const bi = document.querySelectorAll(".exit-search")[0].querySelectorAll('i')[0]
  const result = document.createElement("ul")
  result.classList.add("results-list")
  const term = termInput.value.toUpperCase()
  const minTermLength = 1
  if (term.length > minTermLength) {
    var matchCounter = 0
    window.orderedObs.forEach(wallet => {
      if (wallet.title) {
        let searchableTerms = `${wallet.title} ${wallet.appId} ${wallet.website} ${wallet.website} ${wallet.category} ${wallet.verdict}`

        if (matchCounter < 1)
          result.innerHTML = "<li><a style='font-size:.7rem;opacity:.7;text-style:italics;'>No matches</a></li>"

        let index = searchableTerms.toLocaleUpperCase().indexOf(term)

        if (index !== -1) {
          if (matchCounter == 0) {
            result.innerHTML = ""
          }

          bi.classList.remove("fa-times")
          bi.classList.add("fa-circle-notch")
          const walletRow = document.createElement("li")
          walletRow.style['animation-delay'] = matchCounter * .1 + 's'
          walletRow.classList.add("actionable")
          var compactedResults = ''
          function cPlus(w) {
            const basePath = w.base_path || ""
            var analysisUrl = `${basePath}${w.url}`
            compactedResults += `<a class="result-pl-inner" onclick="window.location.href = '${analysisUrl}';"
              href='${analysisUrl}'>
              <img src='${basePath}/images/wallet_icons/${w.folder}/small/${w.icon}' class='results-list-wallet-icon' />
            <span>${w.altTitle || w.title}</span>
            
            <span class="badge-2 ${w.verdict}">
                <i class="${window.transcribeTag(w.folder).css}"></i>
                <span>${w.verdict}</span>
            </span>

            </a>`
          }
          cPlus(wallet)
          var det = ""
          if (wallet.versions && wallet.versions.length > 0) {
            for (i = 0; i < wallet.versions.length; i++) {
              searchableTerms += `${wallet.versions[i].category} ${wallet.versions[i].verdict} multi cross`;
              cPlus(wallet.versions[i])
            }
            det = "-hom"
          }
          walletRow.innerHTML = `<div class="${det}">${compactedResults}</div>`

          result.append(walletRow)
          matchCounter++
        }
      }
    })
  } else if (term.length != 0) {
    var l = document.createElement("li")
    var rem = (minTermLength + 1) - term.length
    var s = rem > 1 ? "s" : ""
    l.innerHTML = `<a style='font-size:.7rem;opacity:.7;text-style:italics;'>Enter ${rem} more character${s} to search all records</a>`
    result.append(l)
  }
  clearTimeout(pauseForInput)
  pauseForInput = setTimeout(function () {
    bi.classList.remove("fa-circle-notch")
    bi.classList.add("fa-times")
    document.querySelectorAll(".exit-search")[0].style.display = "inline-block"
    document.querySelectorAll(".results-list")[0].replaceWith(result)
  }, 500)
  searchScrollToTop(termInput)
}

function heroUX(termInput) {
  termInput.focus()
  termInput.select()
  searchScrollToTop(termInput)

  if (termInput.value.length > 0) {
    searchCatalogue(termInput)
  }
  window.innerWidth > 700 && (
    document.body.classList.add("search-ui-active"),
    window.addEventListener('wheel', captureScrollForSearch),
    document.querySelectorAll(".results-list")[0].addEventListener("mouseenter", function (e) { scrollOverride = 1 }),
    document.querySelectorAll(".results-list")[0].addEventListener("mouseleave",function(e){scrollOverride=0})
  )
}

function searchScrollToTop(termInput) {
  var s = window.pageYOffset + searchParent.getBoundingClientRect().top - 15
  if (window.innerWidth <= 700) {
    window.scrollTo({
      top: s,
      left: 0,
      behavior: 'smooth'
    })
  }
}

document.querySelectorAll(".sidebar-search-container").length > 0 && (
  document.querySelectorAll(".sidebar-search-container")[0].querySelectorAll(".walletSearch")[0].addEventListener("mouseleave", e => { e.currentTarget.value.length < 1 && (document.body.classList.remove("search-ui-active")) })
)

document.body.addEventListener("click", () => {
  exitSearch()
})