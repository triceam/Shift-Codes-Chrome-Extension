var lastTabId = 0;
var lastSelectionText = "";

// handle context menu "clock" callback
function handleContextClick(e, tab) {
  /*console.log("item " + e.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(e));
  console.log("tab: " + JSON.stringify(tab));*/

  lastTabId = 0;
  lastSelectionText= "";

  if (e.selectionText) {
    // The user selected some text, assume they've selected the 
    // correct text, and submit it as a shift code
    lastSelectionText = e.selectionText.trim();
    
    var newURL = "https://shift.gearboxsoftware.com/rewards";
    chrome.tabs.create({ url: newURL }, function(tab) {
      lastTabId = tab.id;
    });
  }
}

// handle tab loading
// when the new tab is loaded, if it is the same one that was created from the 
// context menu click, then inject the selected shift code *after* loading is complete
chrome.tabs.onUpdated.addListener(function (tabId , info) {
  if (info.status === 'complete') {
    if (lastTabId == tabId) {
      console.log("submitting: " + lastSelectionText)

      let script='document.querySelector("#shift_code_input").value = "'+lastSelectionText+'";';
      script += 'document.querySelector("#shift_code_check").click();';
      chrome.tabs.executeScript(tabId, {"code":script}, function (result){
        console.log("submitted");
      })
      
      
    }
  }
});


  // Create context menu item.
var title = "Redeem Shift Code";
var id = chrome.contextMenus.create({
  "title": title, 
  "contexts":["selection"],
  "onclick": handleContextClick
});