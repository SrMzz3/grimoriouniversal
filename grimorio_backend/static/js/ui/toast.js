/* js/ui/toast.js — Sistema de notificações (substitui o alert do navegador) */

const Toast = (() => {

  const DURATION = 4200;
  let container = null;

  // ============================================================
  // ESTILOS
  // ============================================================
  function injectStyles() {
    if (document.getElementById('toast-styles')) return;

    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      #toast-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99998;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-end;
        pointer-events: none;
        max-width: 380px;
      }

      .toast-item {
        pointer-events: auto;
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        min-width: 260px;
        max-width: 380px;
        padding: 14px 40px 14px 16px;
        background: rgba(16,15,12,0.94);
        backdrop-filter: blur(12px);
        border: 1px solid var(--border);
        border-left: 4px solid var(--gold);
        border-radius: var(--r-md);
        box-shadow: var(--shadow-lg);
        animation: toastIn 0.38s cubic-bezier(0.34, 1.4, 0.64, 1) both;
        overflow: hidden;
      }

      .toast-item.toast-out {
        animation: toastOut 0.3s ease both;
      }

      .toast-item.toast-success { border-left-color: var(--green); }
      .toast-item.toast-error   { border-left-color: var(--crimson); }
      .toast-item.toast-warning { border-left-color: var(--yellow); }
      .toast-item.toast-info    { border-left-color: var(--gold); }

      .toast-icon {
        font-size: 19px;
        line-height: 1.2;
        flex-shrink: 0;
      }

      .toast-body { flex: 1; min-width: 0; }

      .toast-title {
        font-family: 'Cinzel', serif;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: .04em;
        color: var(--gold);
        margin-bottom: 3px;
      }
      .toast-item.toast-success .toast-title { color: var(--green); }
      .toast-item.toast-error   .toast-title { color: var(--red); }
      .toast-item.toast-warning .toast-title { color: var(--yellow); }

      .toast-msg {
        font-size: 13.5px;
        color: var(--ink-dim);
        line-height: 1.45;
        word-wrap: break-word;
      }

      .toast-close {
        position: absolute;
        top: 8px;
        right: 10px;
        background: none;
        border: none;
        color: var(--ink-faint);
        font-size: 15px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: color var(--t-fast);
      }
      .toast-close:hover { color: var(--ink); }

      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        width: 100%;
        background: var(--gold-dim);
        opacity: .5;
        transform-origin: left center;
        animation: toastProgress linear forwards;
      }
      .toast-item:hover .toast-progress { animation-play-state: paused; }

      @keyframes toastIn {
        from { opacity: 0; transform: translateX(40px) scale(.96); }
        to   { opacity: 1; transform: translateX(0) scale(1); }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translateX(0) scale(1); }
        to   { opacity: 0; transform: translateX(40px) scale(.96); }
      }
      @keyframes toastProgress {
        from { transform: scaleX(1); }
        to   { transform: scaleX(0); }
      }

      @media (max-width: 640px) {
        #toast-container {
          left: 12px;
          right: 12px;
          bottom: 12px;
          max-width: none;
          align-items: stretch;
        }
        .toast-item { min-width: 0; max-width: none; width: 100%; }
      }
    `;
    document.head.appendChild(style);
  }

  function getContainer() {
    if (container && document.body.contains(container)) return container;
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  // ============================================================
  // NÚCLEO
  // ============================================================
  function show(type, message, title, options) {
    injectStyles();
    options = options || {};

    const icons = {
      success: '✅',
      error:   '❌',
      warning: '⚠️',
      info:    '📜',
    };

    const defaultTitles = {
      success: 'Sucesso',
      error:   'Erro',
      warning: 'Atenção',
      info:    'Aviso',
    };

    const duration = options.duration || DURATION;
    const item = document.createElement('div');
    item.className = 'toast-item toast-' + type;

    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    icon.textContent = options.icon || icons[type] || '📜';
    item.appendChild(icon);

    const body = document.createElement('div');
    body.className = 'toast-body';

    const titleEl = document.createElement('div');
    titleEl.className = 'toast-title';
    titleEl.textContent = title || defaultTitles[type] || 'Aviso';
    body.appendChild(titleEl);

    const msgEl = document.createElement('div');
    msgEl.className = 'toast-msg';
    msgEl.textContent = message == null ? '' : String(message);
    body.appendChild(msgEl);

    item.appendChild(body);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', function() { dismiss(item); });
    item.appendChild(closeBtn);

    const progress = document.createElement('div');
    progress.className = 'toast-progress';
    progress.style.animationDuration = duration + 'ms';
    item.appendChild(progress);

    getContainer().appendChild(item);

    // Auto-remove quando a barra de progresso termina (ela pausa no hover)
    progress.addEventListener('animationend', function() { dismiss(item); });

    return item;
  }

  function dismiss(item) {
    if (!item || item.classList.contains('toast-out')) return;
    item.classList.add('toast-out');
    setTimeout(function() {
      if (item.parentNode) item.parentNode.removeChild(item);
    }, 320);
  }

  function clear() {
    if (!container) return;
    Array.prototype.slice.call(container.children).forEach(dismiss);
  }

  // ============================================================
  // API PÚBLICA
  // ============================================================
  return {
    success: function(message, title, options) { return show('success', message, title, options); },
    error:   function(message, title, options) { return show('error',   message, title, options); },
    warning: function(message, title, options) { return show('warning', message, title, options); },
    info:    function(message, title, options) { return show('info',    message, title, options); },
    show:    show,
    dismiss: dismiss,
    clear:   clear,
  };

})();

window.Toast = Toast;
console.log('✅ Toast carregado!');
