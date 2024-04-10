(async () => {
  // event listeners for top buttons
  document.querySelector("#all-tabs-b").addEventListener("click", groupAllTabs)
  document.querySelector("#copy-urls-b").addEventListener("click", async () => {
    let res = ""
    const urls = await getTabURLs()
    for (const url of urls) {
      res += url + "\n\n"
    }
    await navigator.clipboard.writeText(res)
    document.querySelector("#copy-urls-b").innerText = "Copied!"
    setTimeout(() => {document.querySelector("#copy-urls-b").innerText = "Copy all URLs"}, 250);
  })

  // find the tab and group ids
  const tabIds = await getTabIds()
  const groupIds = await getGroupIds()
  // find the HTML div for the tab manager
  const tabsContainer = document.querySelector("#tabs-container")
  for (const tabId of tabIds) {
    const tab = await chrome.tabs.get(tabId)
    // add the info about the tab
    const tabDiv = document.createElement("div")
    tabDiv.className = "tab-div"
    const tabP = document.createElement("p")
    tabP.textContent = tab.title
    tabDiv.appendChild(tabP)
    // prepare the dropdown
    const dropdown = document.createElement("select")
    const noGroupOption = document.createElement("option")
    noGroupOption.textContent = "(no group)"
    noGroupOption.color = "black"
    dropdown.appendChild(noGroupOption)
    for (let i = groupIds.length-1; i >= 0; i--) { //add the leftmost group first (last index)
      const groupId = groupIds[i]
      const tabGroup = await chrome.tabGroups.get(groupId)
      const option = document.createElement("option")
      option.style.color = tabGroup.color
      option.textContent = `(${groupIds.length - i}) ${tabGroup.title}` // again, for some reason leftmost group is not index 0
      if (tab.groupId === groupId) {
        option.selected = "selected"
        dropdown.style.color = tabGroup.color //if selected, the color of the option won't show up
      }
      dropdown.addEventListener("change", ev => handleDropdown(ev, tabId))
      dropdown.appendChild(option)
    }
    tabDiv.appendChild(dropdown)
    tabsContainer.appendChild(tabDiv)
  }
})();

async function groupAllTabs() {
  const tabIds = await getTabIds()
  const groupId = await chrome.tabs.group({tabIds})
  // groupIds.push(groupId)
}

async function getTabURLs() {
  const tabs = await chrome.tabs.query({});
  const tabURLs = tabs.map((tab) => tab.url);
  return tabURLs
}

async function getTabIds() {
  const tabs = await chrome.tabs.query({});
  tabs.forEach(function(tab){
    console.log(tab.url, tab.id);
  })
  const tabIds = tabs.map((tab) => tab.id);
  return tabIds
}

async function getGroupIds() {
  const groups = await chrome.tabGroups.query({});
  groups.forEach(function(group){
    console.log(group.id);
  })
  const groupIds = groups.map((group) => group.id);
  return groupIds
}

async function handleDropdown(event, tabId) {
  //console.log(event.target.options[event.target.selectedIndex].textContent)
  const groupIds = await getGroupIds()
  for (const groupId of groupIds) {
    const group = await chrome.tabGroups.get(groupId)
    if (event.target.options[event.target.selectedIndex].textContent.slice(4) === group.title) {
      await chrome.tabs.group({tabIds: tabId, groupId})
      event.target.style.color = group.color // update color again
      return
    }
  }
  await chrome.tabs.ungroup(tabId);
  await chrome.tabs.move(tabId, {index: -1})
}


// * Old Code *
// https://stackoverflow.com/a/46870005/6243352
// async function getCookie(tabId) {
//   const [{result}] = await chrome.scripting.executeScript({
//     func: () => document.cookie,
//     args: [],
//     target: {
//       tabId: tabId ??
//         (await chrome.tabs.query({active: true, currentWindow: true}))[0].id
//     },
//     world: "MAIN",
//   });
//   return result;
// }