var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?linkedin\.com/;

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

/*chrome.browserAction.onClicked.addListener(function (tab) {
  console.log(tab.url);
  if (urlRegex.test(tab.url)) {
    console.log("here")
  }
  // console.log(document.all[0].outerHTML);
});*/