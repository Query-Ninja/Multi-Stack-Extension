async function load() {
  const list = document.getElementById('list');
  const { stack = [] } = await chrome.storage.local.get("stack");
  list.innerHTML = stack.length ? "" : "<p>Empty</p>";
  [...stack].reverse().forEach(text => {
    const d = document.createElement('div');
    d.className = 'item';
    d.textContent = text;
    list.appendChild(d);
  });
}

document.getElementById('clearBtn').addEventListener('click', async () => {
  await chrome.storage.local.set({ stack: [] });
  load();
});

load();