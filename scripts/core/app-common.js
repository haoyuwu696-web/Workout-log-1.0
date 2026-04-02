(function initFitLogCommon(global) {
  const NAMESPACE = 'fitlog:';

  function getKey(key) {
    return key.startsWith(NAMESPACE) ? key : `${NAMESPACE}${key}`;
  }

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(getKey(key));
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(getKey(key), JSON.stringify(value));
  }

  function remove(key) {
    localStorage.removeItem(getKey(key));
  }

  function upsertArrayItem(key, item, matcher) {
    const list = read(key, []);
    const matchFn = matcher || ((candidate) => candidate.id === item.id);
    const index = list.findIndex(matchFn);
    if (index === -1) {
      list.push(item);
    } else {
      list[index] = item;
    }
    write(key, list);
    return list;
  }

  function appendArrayItem(key, item) {
    const list = read(key, []);
    list.push(item);
    write(key, list);
    return list;
  }

  function clearNamespace() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(NAMESPACE)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  function getSettings() {
    return {
      weightUnit: 'kg',
      reminderTime: '18:00',
      theme: 'auto',
      defaultHome: 'index',
      timerSound: 'on',
      ...read('settings', {})
    };
  }

  function showToast(message, type, options) {
    const opts = options || {};
    const toastType = type || 'info';
    const position = opts.position || (toastType === 'success' ? 'bottom' : 'top');
    let toast = document.getElementById('fitlog-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'fitlog-toast';
      toast.className =
        'left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm text-white z-[9999] shadow-lg hidden transition-all duration-200';
      const host = document.querySelector('.phone-container');
      if (host) {
        toast.classList.add('absolute');
        host.appendChild(toast);
      } else {
        toast.classList.add('fixed');
        document.body.appendChild(toast);
      }
    }
    toast.classList.remove(
      'hidden',
      'bg-green-500',
      'bg-red-500',
      'bg-gray-800',
      'bg-blue-500'
    );
    toast.classList.add(
      toastType === 'error'
        ? 'bg-red-500'
        : toastType === 'success'
          ? 'bg-green-500'
          : toastType === 'info'
            ? 'bg-blue-500'
            : 'bg-gray-800'
    );
    if (position === 'top') {
      toast.style.top = 'calc(env(safe-area-inset-top, 0px) + 48px)';
      toast.style.bottom = 'auto';
    } else {
      toast.style.bottom = 'calc(env(safe-area-inset-bottom, 0px) + 92px)';
      toast.style.top = 'auto';
    }
    toast.textContent = message;
    setTimeout(() => toast.classList.add('hidden'), 1800);
  }

  function validateNumber(value, options) {
    const opts = options || {};
    const label = opts.label || '该字段';
    const unit = opts.unit || '';

    if ((value === '' || value === null || value === undefined) && opts.required) {
      return { ok: false, message: `${label}为必填项` };
    }

    if (value === '' || value === null || value === undefined) {
      return { ok: true, value: null };
    }

    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return { ok: false, message: `${label}请输入有效数值` };
    }

    if (typeof opts.min === 'number' && numeric < opts.min) {
      return {
        ok: false,
        message: `${label}不能小于 ${opts.min}${unit}`,
        suggestion: `建议输入 ${opts.min}${unit} 以上`
      };
    }

    if (typeof opts.max === 'number' && numeric > opts.max) {
      return {
        ok: false,
        message: `${label}不能大于 ${opts.max}${unit}`,
        suggestion: `建议输入 ${opts.max}${unit} 以下`
      };
    }

    return { ok: true, value: numeric };
  }

  function setLoading(button, loading, text) {
    if (!button) return;
    button.disabled = loading;
    if (loading) {
      button.dataset.rawText = button.textContent;
      button.textContent = text || '处理中...';
      button.classList.add('opacity-70');
    } else {
      button.textContent = button.dataset.rawText || button.textContent;
      button.classList.remove('opacity-70');
    }
  }

  function setEmptyState(container, text, actionText, onAction) {
    if (!container) return;
    const actionButton = actionText
      ? `<button type="button" class="btn-primary mt-3 touch-target" data-empty-action>${actionText}</button>`
      : '';
    container.innerHTML = `<div class="card text-center text-sm text-gray-400 py-6">${text}${actionButton}</div>`;
    if (actionText && typeof onAction === 'function') {
      const btn = container.querySelector('[data-empty-action]');
      if (btn) {
        btn.addEventListener('click', onAction);
      }
    }
  }

  function createListItem(title, subtitle, extraText) {
    return `
      <div class="card flex items-center justify-between py-3">
        <div>
          <div class="font-semibold text-sm">${title || '--'}</div>
          <div class="text-xs text-gray-500 mt-1">${subtitle || ''}</div>
        </div>
        <div class="text-xs text-gray-400">${extraText || ''}</div>
      </div>
    `;
  }

  function applyTheme() {
    const settings = getSettings();
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = settings.theme === 'dark' || (settings.theme === 'auto' && prefersDark);
    document.documentElement.classList.toggle('dark', useDark);
  }

  function currentPageFile() {
    const raw = window.location.pathname || '';
    const normalized = raw.replace(/\\/g, '/');
    const seg = normalized.split('/').filter(Boolean);
    return seg.length ? seg[seg.length - 1] : 'index.html';
  }

  const chartTheme = {
    color: ['#007AFF', '#4ADE80', '#FF9500', '#EF4444'],
    textStyle: {
      fontFamily:
        'SF Pro Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
    },
    grid: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 30,
      containLabel: true
    }
  };

  function bindChartResize(chartInstance) {
    if (!chartInstance) {
      return () => {};
    }
    const handler = () => chartInstance.resize();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }

  function setupTabBar() {
    const current = currentPageFile();
    const tabAliasMap = {
      'calories.html': 'index.html',
      'timer.html': 'workout.html'
    };
    const currentTab = tabAliasMap[current] || current;
    const tabItems = Array.from(document.querySelectorAll('.tab-bar .tab-item'));

    let hasMatch = false;
    tabItems.forEach((item) => {
      const href = item.getAttribute('href') || '';
      const isActive = href.endsWith(currentTab);
      item.classList.toggle('active', isActive);
      hasMatch = hasMatch || isActive;
    });

    if (!hasMatch && tabItems.length > 0) {
      tabItems[0].classList.add('active');
    }
  }

  function setupPageStatePersistence() {
    const page = currentPageFile();
    const storageKey = `page-state:${page}`;
    const fields = Array.from(document.querySelectorAll('input[id], select[id], textarea[id], [data-persist-key]'));

    if (!fields.length) return;

    const savedState = read(storageKey, {});

    fields.forEach((field) => {
      const key = field.dataset.persistKey || field.id;
      if (!key || !(key in savedState)) return;
      const savedValue = savedState[key];

      if (field.type === 'checkbox') {
        field.checked = Boolean(savedValue);
      } else if (field.type === 'radio') {
        field.checked = field.value === savedValue;
      } else {
        field.value = savedValue;
      }
    });

    const persistState = () => {
      const nextState = {};
      fields.forEach((field) => {
        const key = field.dataset.persistKey || field.id;
        if (!key) return;

        if (field.type === 'checkbox') {
          nextState[key] = field.checked;
        } else if (field.type === 'radio') {
          if (field.checked) nextState[key] = field.value;
        } else {
          nextState[key] = field.value;
        }
      });
      write(storageKey, nextState);
    };

    fields.forEach((field) => {
      field.addEventListener('input', persistState);
      field.addEventListener('change', persistState);
    });
  }

  function setFieldError(field, message) {
    if (!field) return;
    field.classList.add('ring-1', 'ring-red-400');

    const fieldKey = field.dataset.persistKey || field.id || field.name;
    const errorId = `fitlog-field-error-${fieldKey}`;
    let errorEl = document.getElementById(errorId);

    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.id = errorId;
      errorEl.className = 'text-xs text-red-500 mt-1';
      field.insertAdjacentElement('afterend', errorEl);
    }

    errorEl.textContent = message;
  }

  function clearFieldError(field) {
    if (!field) return;
    field.classList.remove('ring-1', 'ring-red-400');

    const fieldKey = field.dataset.persistKey || field.id || field.name;
    const errorEl = document.getElementById(`fitlog-field-error-${fieldKey}`);
    if (errorEl) {
      errorEl.remove();
    }
  }

  function setupFormValidation() {
    const fields = Array.from(document.querySelectorAll('[data-validate="number"]'));
    if (!fields.length) return;

    fields.forEach((field) => {
      const runValidation = () => {
        const min = field.dataset.min !== undefined ? Number(field.dataset.min) : undefined;
        const max = field.dataset.max !== undefined ? Number(field.dataset.max) : undefined;
        const required = field.dataset.required === 'true';
        const label = field.dataset.label || field.name || '该字段';
        const unit = field.dataset.unit || '';

        const result = validateNumber(field.value, { min, max, required, label, unit });
        if (!result.ok) {
          const message = result.suggestion ? `${result.message}（${result.suggestion}）` : result.message;
          setFieldError(field, message);
          return false;
        }

        clearFieldError(field);
        return true;
      };

      field.addEventListener('change', runValidation);
      field.addEventListener('blur', runValidation);
    });
  }

  function optimizeTouch() {
    const styleId = 'fitlog-touch-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .tab-item, button, a.btn-primary, input, select, textarea { -webkit-tap-highlight-color: transparent; }
        .tab-item, button, .touch-target { min-height: 44px; }
        .content-area { -webkit-overflow-scrolling: touch; overscroll-behavior-y: contain; }
      `;
      document.head.appendChild(style);
    }
  }

  function maybeRedirectToDefaultHome() {
    const settings = getSettings();
    const current = currentPageFile();
    const target = `${settings.defaultHome || 'index'}.html`;
    if (current === 'index.html' && target !== 'index.html' && !sessionStorage.getItem('fitlog:skip-home-redirect')) {
      sessionStorage.setItem('fitlog:skip-home-redirect', '1');
      window.location.replace(`./${target}`);
    }
    if (current !== 'index.html') {
      sessionStorage.removeItem('fitlog:skip-home-redirect');
    }
  }

  function maybeRemindWeightLog() {
    try {
      const records = read('body:records', []);
      if (!Array.isArray(records) || !records.length) return;

      const latestDateText = records
        .map((item) => String(item?.date || '').slice(0, 10))
        .filter(Boolean)
        .sort()
        .pop();
      if (!latestDateText) return;

      const latestDate = new Date(`${latestDateText}T00:00:00`);
      if (Number.isNaN(latestDate.getTime())) return;

      const todayText = new Date().toISOString().slice(0, 10);
      const today = new Date(`${todayText}T00:00:00`);
      const diffDays = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) return;

      const remindKey = `fitlog:weight-reminder:${todayText}`;
      if (localStorage.getItem(remindKey) === '1') return;
      localStorage.setItem(remindKey, '1');

      const message = `距离上次体重录入已 ${diffDays} 天，记得更新身体数据。`;
      showToast(message, 'info');

      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          // 仅在已授权时发送系统通知，避免无提示弹窗打扰。
          new Notification('FitLog 体重提醒', { body: message });
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
  }

  function initPage() {
    applyTheme();
    setupTabBar();
    setupPageStatePersistence();
    setupFormValidation();
    optimizeTouch();
    maybeRedirectToDefaultHome();
    maybeRemindWeightLog();
  }

  global.FitLogCommon = {
    storage: { read, write, remove, clearNamespace, upsertArrayItem, appendArrayItem },
    getSettings,
    showToast,
    validateNumber,
    setLoading,
    setEmptyState,
    createListItem,
    setFieldError,
    clearFieldError,
    currentPageFile,
    chart: { chartTheme, bindChartResize },
    initPage
  };
})(window);
