/* js/ui/modal.js — Sistema de mensagens estilizado */

const Modal = (() => {

  function init() {
    // Injeta os estilos
    const styles = `
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        animation: fadeIn 0.3s ease;
      }
      .modal-box {
        background: var(--parch-2);
        border: 1px solid var(--border);
        border-radius: var(--r-lg);
        padding: 32px;
        max-width: 440px;
        width: 90%;
        box-shadow: var(--shadow-lg);
        animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .modal-box .modal-icon { font-size: 48px; text-align: center; margin-bottom: 12px; }
      .modal-box .modal-title {
        font-family: 'Cinzel', serif;
        font-size: 18px;
        color: var(--gold);
        text-align: center;
        margin-bottom: 8px;
      }
      .modal-box .modal-msg {
        font-size: 15px;
        color: var(--ink-dim);
        text-align: center;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .modal-box .modal-input {
        width: 100%;
        padding: 10px 14px;
        background: var(--parch-3);
        border: 1px solid var(--border);
        border-radius: var(--r);
        color: var(--ink);
        font-size: 16px;
        margin-bottom: 16px;
        text-align: center;
      }
      .modal-box .modal-input:focus {
        border-color: var(--gold-dim);
        outline: none;
      }
      .modal-box .modal-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
      }
      .modal-box .modal-buttons .btn-gold { min-width: 100px; }
      .modal-box .modal-buttons .btn-ghost { min-width: 100px; }

      @keyframes modalPop {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    `;

    const style = document.createElement('style');
    style.textContent = styles;
    document.head.appendChild(style);
  }

  function alert(message, options = {}) {
    return new Promise((resolve) => {
      const { title = 'Atenção', icon = '📜' } = options;
      const overlay = createOverlay();

      overlay.innerHTML = `
        <div class="modal-box">
          <div class="modal-icon">${icon}</div>
          <div class="modal-title">${title}</div>
          <div class="modal-msg">${message}</div>
          <div class="modal-buttons">
            <button class="btn-gold" id="modal-ok">OK</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      overlay.querySelector('#modal-ok').addEventListener('click', () => {
        overlay.remove();
        resolve();
      });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { overlay.remove(); resolve(); }
      });
    });
  }

  function confirm(message, options = {}) {
    return new Promise((resolve) => {
      const {
        title = 'Confirmar',
        icon = '❓',
        confirmText = 'Sim',
        cancelText = 'Cancelar'
      } = options;

      const overlay = createOverlay();
      overlay.innerHTML = `
        <div class="modal-box">
          <div class="modal-icon">${icon}</div>
          <div class="modal-title">${title}</div>
          <div class="modal-msg">${message}</div>
          <div class="modal-buttons">
            <button class="btn-ghost" id="modal-cancel">${cancelText}</button>
            <button class="btn-gold" id="modal-confirm">${confirmText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      overlay.querySelector('#modal-confirm').addEventListener('click', () => {
        overlay.remove();
        resolve(true);
      });
      overlay.querySelector('#modal-cancel').addEventListener('click', () => {
        overlay.remove();
        resolve(false);
      });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { overlay.remove(); resolve(false); }
      });
    });
  }

  function prompt(message, options = {}) {
    return new Promise((resolve) => {
      const {
        title = 'Entrada',
        icon = '✏️',
        placeholder = 'Digite...',
        defaultValue = ''
      } = options;

      const overlay = createOverlay();
      overlay.innerHTML = `
        <div class="modal-box">
          <div class="modal-icon">${icon}</div>
          <div class="modal-title">${title}</div>
          <div class="modal-msg">${message}</div>
          <input class="modal-input" id="modal-input" type="text" placeholder="${placeholder}" value="${defaultValue}" autofocus>
          <div class="modal-buttons">
            <button class="btn-ghost" id="modal-cancel">Cancelar</button>
            <button class="btn-gold" id="modal-ok">OK</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      const input = overlay.querySelector('#modal-input');
      input.focus();
      input.select();

      function getResult() {
        return input.value.trim() || null;
      }

      overlay.querySelector('#modal-ok').addEventListener('click', () => {
        overlay.remove();
        resolve(getResult());
      });
      overlay.querySelector('#modal-cancel').addEventListener('click', () => {
        overlay.remove();
        resolve(null);
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          overlay.remove();
          resolve(getResult());
        }
        if (e.key === 'Escape') {
          overlay.remove();
          resolve(null);
        }
      });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { overlay.remove(); resolve(null); }
      });
    });
  }

  function toast(message, options = {}) {
    const { type = 'info', duration = 3000 } = options;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: '📜',
    };

    const colors = {
      success: 'var(--green)',
      error: 'var(--crimson)',
      warning: 'var(--yellow)',
      info: 'var(--gold)',
    };

    const toastEl = document.createElement('div');
    toastEl.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--parch-2);
      border: 1px solid var(--border);
      border-left: 4px solid ${colors[type] || 'var(--gold)'};
      border-radius: var(--r-md);
      padding: 14px 20px;
      padding-right: 44px;
      box-shadow: var(--shadow-lg);
      z-index: 99999;
      animation: fadeUp 0.4s ease both;
      max-width: 380px;
      width: 90%;
      backdrop-filter: blur(12px);
      background: rgba(16,15,12,0.92);
    `;
    toastEl.innerHTML = `
      <span style="font-size:18px;margin-right:10px;">${icons[type] || '📜'}</span>
      <span style="font-size:14px;color:var(--ink);">${message}</span>
      <button style="position:absolute;top:8px;right:10px;background:none;border:none;color:var(--ink-faint);font-size:16px;cursor:pointer;">✕</button>
    `;

    document.body.appendChild(toastEl);

    const closeBtn = toastEl.querySelector('button');
    closeBtn.addEventListener('click', () => {
      toastEl.style.animation = 'fadeIn 0.2s reverse';
      setTimeout(() => toastEl.remove(), 300);
    });

    setTimeout(() => {
      if (toastEl.parentNode) {
        toastEl.style.animation = 'fadeIn 0.2s reverse';
        setTimeout(() => toastEl.remove(), 300);
      }
    }, duration);

    return toastEl;
  }

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    return overlay;
  }

  // Inicializa
  init();

  return { alert, confirm, prompt, toast };

})();

window.Modal = Modal;
console.log('✅ Modal carregado!');
