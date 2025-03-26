let timeTrackingData = {};

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ timeData: {} });
    console.log("✅ Time Tracking Extension Installed & Storage Initialized.");
});

chrome.tabs.onActivated.addListener(activeInfo => {
    trackTime();
});

function trackTime() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs.length === 0) return;

        let tab = tabs[0];
        let url = new URL(tab.url);
        let domain = url.hostname;
        let today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        chrome.storage.local.get(["timeData"], function (result) {
            let data = result.timeData || {};
            
            if (!data[today]) {
                data[today] = {};
            }

            if (!data[today][domain]) {
                data[today][domain] = 0;
            }

            data[today][domain] += 1; // Increase time spent count

            chrome.storage.local.set({ timeData: data }, function () {
                console.log("✅ Updated Time Data:", data);
            });
        });
    });
}

// Run tracking every minute
setInterval(trackTime, 60000);
