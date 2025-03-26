const restrictedPages = ["chrome://", "https://chrome.google.com", "https://mail.google.com"];

if (!restrictedPages.some((url) => window.location.href.startsWith(url))) {
  let startTime = Date.now();
  let isActive = true;

  // Monitor user activity to mark the page as active
  const activityEvents = ["mousemove", "keydown", "click"];
  activityEvents.forEach((event) => {
    document.addEventListener(event, () => {
      isActive = true;
    });
  });

  // Function to send message to background
  function sendData() {
    if (isActive) {
      const timeSpent = (Date.now() - startTime) / 1000;

      // Check if extension context is still valid
      if (!chrome.runtime || !chrome.runtime.id) {
        console.warn("Extension context invalidated. Skipping message send.");
        return;
      }

      try {
        chrome.runtime.sendMessage({ timeSpent, url: window.location.href }, (response) => {
          if (chrome.runtime.lastError) {
            const errMsg = chrome.runtime.lastError.message;
            console.warn("Message sending failed:", errMsg);
            // If error indicates extension context is invalid, stop further messages
            if (errMsg && errMsg.includes("Extension context invalidated")) {
              clearInterval(timer);
            }
          } else {
            console.log("Message sent successfully:", response);
          }
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }

      startTime = Date.now();
      isActive = false;
    }
  }

  // Safe function to send message, with try-catch and interval clearing on error
  function safeSendData() {
    try {
      if (chrome.runtime && chrome.runtime.id) {
        sendData();
      } else {
        console.warn("Extension context invalidated. Skipping data send.");
        clearInterval(timer);
      }
    } catch (error) {
      console.error("Error in safeSendData:", error);
      clearInterval(timer);
    }
  }

  // Start periodic message sending and save interval ID in timer
  const timer = setInterval(safeSendData, 5000);
} else {
  console.warn("Extension is not allowed to run on this page:", window.location.href);
}
