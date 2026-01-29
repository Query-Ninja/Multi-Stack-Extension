document.addEventListener("copy", () => {
  // Give the browser a moment to capture the selection
  setTimeout(async () => {
    const selection = window.getSelection().toString().trim();

    // Safety check: Ensure selection exists and extension API is available
    if (selection && typeof chrome !== "undefined" && chrome.storage) {
      try {
        const data = await chrome.storage.local.get("stack");
        const stack = data.stack || [];
        stack.push(selection);
        await chrome.storage.local.set({ stack: stack });
        console.log("Multi-Copy: Added to stack.");
      } catch (e) {
        console.error("Multi-Copy Storage Error:", e);
      }
    }
  }, 100);
});
