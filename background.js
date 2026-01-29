async function updateBadge() {
  const data = await chrome.storage.local.get("stack");
  const count = data.stack ? data.stack.length : 0;
  const text = count > 0 ? count.toString() : "";
  chrome.action.setBadgeText({ text: text });
  chrome.action.setBadgeBackgroundColor({ color: "#4682B4" });
}

chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd === "paste-all") {
    const data = await chrome.storage.local.get("stack");
    const stack = data.stack || [];
    if (stack.length === 0) return;

    const pasteText = stack.join("\n");
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (text) => {
          const el = document.activeElement;
          if (!el) return;
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            const start = el.selectionStart;
            const end = el.selectionEnd;
            el.setRangeText(text, start, end, "end");
          } else if (el.isContentEditable) {
            document.execCommand("insertText", false, text);
          } else {
            document.execCommand("insertText", false, text);
          }
        },
        args: [pasteText],
      });
      await chrome.storage.local.set({ stack: [] });
      updateBadge();
    }
  }
});

chrome.storage.onChanged.addListener(updateBadge);
updateBadge();
