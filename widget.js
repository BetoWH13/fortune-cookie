// misfortune widget.js

(function () {
  const container = document.getElementById('misfortune-widget');
  if (!container) return;

  const script = document.currentScript;
  const base = script.src.split('/').slice(0, -1).join('/');

  fetch(base + '/misfortunes.js')
    .then(res => res.text())
    .then(code => {
      const module = { exports: {} };
      eval(code); // Load misfortunes into module.exports

      const misfortunes = module.exports.default || module.exports;
      const quote = misfortunes[Math.floor(Math.random() * misfortunes.length)];

      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        font-family: 'Courier New', monospace;
        background-color: #2a2a2a;
        color: #f0f0f0;
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        margin: 20px auto;
      `;

      const quoteEl = document.createElement('p');
      quoteEl.textContent = `"${quote}"`;
      quoteEl.style.fontStyle = 'italic';

      const link = document.createElement('a');
      link.href = 'https://misfortunecookie.top';
      link.textContent = '☠️ Crack another cookie';
      link.style.cssText = `
        display: inline-block;
        margin-top: 10px;
        text-decoration: none;
        color: #e74c3c;
      `;

      wrapper.appendChild(quoteEl);
      wrapper.appendChild(link);
      container.appendChild(wrapper);
    })
    .catch(err => {
      console.error('Misfortune widget error:', err);
    });
})();
