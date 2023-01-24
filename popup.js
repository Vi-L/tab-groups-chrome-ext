// https://stackoverflow.com/a/46870005/6243352
async function getCookie(tabId) {
  const [{result}] = await chrome.scripting.executeScript({
    func: () => document.cookie,
    args: [],
    target: {
      tabId: tabId ??
        (await chrome.tabs.query({active: true, currentWindow: true}))[0].id
    },
    world: "MAIN",
  });
  return result;
}

(async () => {
  const cookie = await getCookie();

  // visible in the extension's devtools console
  console.log("popup:", cookie);

  // visible in the extension's DOM
  document.querySelector("div").textContent = cookie;
})();

