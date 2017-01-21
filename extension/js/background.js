chrome.runtime.onMessage.addListener(function(request) {
			alert(request.status);
    if (request.status === 'display') {
        chrome.tabs.create({
            url: chrome.extension.getURL('dialog.html'),
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true
                // incognito, top, left, ...
            });
        });
    }
});
function setPassword(password) {
    // Do something, eg..:
    console.log(password);
};s