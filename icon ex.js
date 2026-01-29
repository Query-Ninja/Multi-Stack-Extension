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

    if (tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (text) => {
          const el = document.activeElement;
          if (!el) return;

          // Standard inputs
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            const start = el.selectionStart;
            const end = el.selectionEnd;
            el.setRangeText(text, start, end, "end");
          }
          // Content editable (Rich text editors)
          else if (el.isContentEditable) {
            document.execCommand("insertText", false, text);
          }
          // General fallback
          else {
            const input = document.createElement("textarea");
            document.body.appendChild(input);
            input.value = text;
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            alert("Items merged to system clipboard! Use Ctrl+V to paste.");
          }
        },
        args: [pasteText],
      });
      await chrome.storage.local.set({ stack: [] });
    }
  }
});
