// ── Navigation ──

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-' + page).classList.add('active');
        if (page === 'config') initEditor();
        if (page === 'versions') {
            // Only load if no data displayed yet
            const list = document.getElementById('versionList');
            if (!list.querySelector('.version-item')) {
                loadVersions();
            }
        }
        if (page === 'logs') startLogPoll();
        if (page === 'settings') loadSettings();

        // Stop log poll when leaving logs page
        if (page !== 'logs') stopLogPoll();
    });
});

// ── Home: Toggle frpc ──

let frpcInstalled = true;

async function checkFrpcInstalled() {
    try {
        const resp = await fetch('/api/has_frpc');
        const data = await resp.json();
        frpcInstalled = data.exists;
        if (!frpcInstalled) {
            updateHomeGuided('点击下载 frpc');
        }
    } catch(e) {}
}

async function toggleFrpc() {
    // If frpc.exe is missing, navigate to versions page
    if (!frpcInstalled) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const verTab = document.querySelector('[data-page="versions"]');
        verTab.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-versions').classList.add('active');
        loadVersions();
        return;
    }

    const btn = document.getElementById('btnToggle');
    const running = btn.classList.contains('running');

    if (running) {
        const resp = await fetch('/api/stop', { method: 'POST' });
        const data = await resp.json();
        if (data.ok) updateHomeStatus(false);
        else updateHomeStatus(true);
    } else {
        const resp = await fetch('/api/start', { method: 'POST' });
        const data = await resp.json();
        if (data.ok) {
            updateHomeStatus(true);
        } else {
            updateHomeStatus(false, data.error || '启动失败');
        }
    }
}

function updateHomeGuided(hintText) {
    const btn = document.getElementById('btnToggle');
    const fabPlay = document.getElementById('fabPlay');
    const fabStop = document.getElementById('fabStop');
    const fabDownload = document.getElementById('fabDownload');
    const hint = document.getElementById('homeHint');

    btn.classList.remove('running');
    fabPlay.style.display = 'none';
    fabStop.style.display = 'none';
    fabDownload.style.display = '';
    hint.textContent = hintText;
}

function updateHomeStatus(running, error) {
    const btn = document.getElementById('btnToggle');
    const fabPlay = document.getElementById('fabPlay');
    const fabStop = document.getElementById('fabStop');
    const hint = document.getElementById('homeHint');
    document.getElementById('fabDownload').style.display = 'none';

    if (error) {
        btn.classList.remove('running');
        fabPlay.style.display = '';
        fabStop.style.display = 'none';
        hint.textContent = error;
        return;
    }

    if (running) {
        btn.classList.add('running');
        fabPlay.style.display = 'none';
        fabStop.style.display = '';
        hint.textContent = '点击按钮停止 frpc';
    } else {
        btn.classList.remove('running');
        fabPlay.style.display = '';
        fabStop.style.display = 'none';
        hint.textContent = '点击按钮启动 frpc';
    }
}

async function refreshStatus() {
    try {
        // Check frpc.exe existence first
        const hResp = await fetch('/api/has_frpc');
        const hData = await hResp.json();
        frpcInstalled = hData.exists;
        if (!frpcInstalled) {
            updateHomeGuided('点击下载 frpc');
            return;
        }

        const resp = await fetch('/api/status');
        const data = await resp.json();
        const hint = document.getElementById('homeHint');

        updateHomeStatus(data.running);

        if (data.running && data.config) {
            hint.textContent = '运行中 · ' + data.config.server;
        }
    } catch(e) {
        // HTTP server not ready yet
    }
}

// ── Config Editor ──

let cmEditor = null;
let editorBackoff = 0;

function initEditor() {
    if (cmEditor) {
        // Already created — just refresh after layout stabilizes
        requestAnimationFrame(() => { cmEditor.refresh(); });
        return;
    }
    // Lazy init: create CodeMirror only when user first navigates to config
    const ta = document.getElementById('tomlEditor');
    if (!ta) return;

    cmEditor = CodeMirror.fromTextArea(ta, {
        mode: 'toml',
        theme: 'eclipse',
        lineNumbers: true,
        lineWrapping: false,
        tabSize: 2,
        indentUnit: 2,
        viewportMargin: 10,
    });
    cmEditor.setSize('100%', '100%');
    loadConfig();
}

async function loadConfig() {
    if (!cmEditor) return;
    try {
        const resp = await fetch('/api/config');
        const data = await resp.json();
        if (data.content !== undefined) {
            cmEditor.setValue(data.content);
            cmEditor.clearHistory();
            cmEditor.refresh();
        }
    } catch(e) {
        console.error('Failed to load config:', e);
    }
}

async function saveConfig() {
    if (!cmEditor) return;
    const content = cmEditor.getValue();
    const btn = document.querySelector('#page-config .btn-filled');

    // Validate TOML format before saving
    const errors = validateTOML(content);
    if (errors.length > 0) {
        const origHTML = btn.innerHTML;
        btn.textContent = '✗ ' + errors[0];
        btn.style.background = '#EA4335';
        setTimeout(() => { btn.innerHTML = origHTML; btn.style.background = ''; }, 2000);
        return;
    }

    try {
        const resp = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });
        const data = await resp.json();
        if (data.ok) {
            const origHTML = btn.innerHTML;
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/></svg> 已保存';
            btn.classList.add('saved');
            setTimeout(() => {
                btn.innerHTML = origHTML;
                btn.classList.remove('saved');
            }, 1500);
        }
    } catch(e) {
        console.error('Failed to save config:', e);
    }
}

function validateTOML(text) {
    const errs = [];
    const lines = text.split('\n');
    let bracketDepth = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        const ln = i + 1;

        if (!trimmed || trimmed.startsWith('#')) continue;

        // 1. Check for unbalanced brackets
        for (const ch of trimmed) {
            if (ch === '[') bracketDepth++;
            if (ch === ']') bracketDepth--;
            if (bracketDepth < 0) {
                errs.push(ln + ':多余]');
                bracketDepth = 0;
            }
        }

        // 2. Check table headers
        if (trimmed.startsWith('[')) {
            // Check [[array]] first
            if (trimmed.startsWith('[[')) {
                if (!trimmed.endsWith(']]')) {
                    errs.push(ln + ':缺少]]');
                    continue;
                }
            } else {
                // Check [section]
                if (!trimmed.endsWith(']')) {
                    errs.push(ln + ':缺少]');
                    continue;
                }
            }
            const name = trimmed.replace(/^\[+|\]+$/g, '').trim();
            if (!name) {
                errs.push(ln + ':空表名');
                continue;
            }
            continue;
        }

        // 3. Check key-value pairs
        if (trimmed.includes('=')) {
            const eqIdx = trimmed.indexOf('=');
            const key = trimmed.substring(0, eqIdx).trim();
            const val = trimmed.substring(eqIdx + 1).trim();

            if (!key) {
                errs.push(ln + ':空键名');
                continue;
            }
            if (val === '') {
                errs.push(ln + ':空值');
                continue;
            }
            if (val.startsWith('"') && (!val.endsWith('"') || val.length < 2)) {
                errs.push(ln + ':引号未闭合');
                continue;
            }
            if (val.startsWith("'") && (!val.endsWith("'") || val.length < 2)) {
                errs.push(ln + ':引号未闭合');
                continue;
            }
        }
    }

    if (bracketDepth > 0) errs.push('缺少]');
    return errs;
}

async function reloadConfig() {
    await loadConfig();
    if (cmEditor) cmEditor.refresh();
}

// ── Versions ──

window.downloadingVersions = new Set();
let downloadingVersions = window.downloadingVersions;

async function loadVersions() {
    const list = document.getElementById('versionList');
    list.innerHTML = '<div class="loading">加载中…</div>';
    try {
        const resp = await fetch('/api/versions');
        const data = await resp.json();
        renderVersionList(data);
    } catch(e) {
        list.innerHTML = '<div class="error-text">网络错误，请检查网络连接</div>';
    }
}

function renderVersionList(data) {
    const list = document.getElementById('versionList');

    if (data.error) {
        list.innerHTML = '<div class="error-text">获取失败，请检查网络连接</div>';
        return;
    }

    if (!data.versions || data.versions.length === 0) {
        list.innerHTML = '<div class="loading">无可用版本</div>';
        return;
    }

    const anyDownloading = downloadingVersions.size > 0;

    list.innerHTML = data.versions.map(v => {
        let actions = '';
        const isInstalled = (v.tag === data.current);

        if (anyDownloading) {
            // Any operation in progress - disable all buttons
            if (isInstalled) {
                actions = '<button class="btn-text-sm btn-active" disabled>使用中</button>';
            } else if (downloadingVersions.has(v.tag)) {
                actions = '<button class="btn-text-sm" disabled>下载中…</button>';
            } else {
                actions = '<button class="btn-text-sm" disabled>获取</button>';
            }
        } else {
            // No operation in progress - enable buttons
            if (isInstalled) {
                actions = '<button class="btn-text-sm btn-active" disabled>使用中</button>';
            } else {
                actions = '<button class="btn-text-sm" onclick="downloadVersion(\'' + escHtml(v.tag) + '\',\'' + escHtml(v.url) + '\', this)">获取</button>';
            }
        }

        let badges = '';

        // Format date as YYYY-MM-DD
        let dateStr = '';
        if (v.date) {
            const m = v.date.match(/^(\d{4}-\d{2}-\d{2})/);
            if (m) dateStr = m[1];
        }

        return `
            <div class="version-item">
                <div class="version-item-main">
                    <div class="version-item-line1">
                        <span class="version-tag">${escHtml(v.tag)}</span>
                        ${badges}
                    </div>
                    ${dateStr ? '<span class="version-date">' + dateStr + '</span>' : ''}
                </div>
                <div class="version-item-action">${actions}</div>
            </div>
        `;
    }).join('');
}


async function downloadVersion(tag, url, btn) {
    downloadingVersions.add(tag);

    // Immediately disable all buttons
    document.querySelectorAll('.version-item .btn-text-sm').forEach(b => {
        b.disabled = true;
        if (b !== btn && !b.classList.contains('btn-active')) {
            b.textContent = '获取';
        }
    });

    btn.textContent = '下载中…';

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const resp = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag, url }),
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await resp.json();
        if (data.ok) {
            btn.textContent = '完成 ✓';
            checkFrpcInstalled();
            downloadingVersions.delete(tag);
            setTimeout(() => { loadVersions(); refreshStatus(); }, 1200);
        } else {
            downloadingVersions.delete(tag);
            btn.textContent = '下载失败';
            setTimeout(() => loadVersions(), 3000);
        }
    } catch(e) {
        downloadingVersions.delete(tag);
        if (e.name === 'AbortError') {
            btn.textContent = '下载超时';
        } else {
            btn.textContent = '网络错误';
        }
        setTimeout(() => loadVersions(), 3000);
    }
}

// ── Dropdown ──

function toggleDropdown(id) {
    const dd = document.getElementById(id);
    const wasOpen = dd.classList.contains('open');
    // Close all dropdowns
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    if (!wasOpen) dd.classList.add('open');
}

function selectDropdown(id, value, label, el) {
    const dd = document.getElementById(id);
    dd.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    const labelSpan = dd.querySelector(id === 'dropdownCloseBehavior' ? '#dropdownCloseLabel' : '');
    if (labelSpan) labelSpan.textContent = label;
    dd.classList.remove('open');
    if (id === 'dropdownCloseBehavior') saveSetting('close_behavior', value);
}

// Click outside to close dropdowns
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
});

// ── Settings ──

async function loadSettings() {
    try {
        const resp = await fetch('/api/settings');
        const data = await resp.json();
        const val = data.close_behavior || 'exit';
        const dd = document.getElementById('dropdownCloseBehavior');
        dd.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        const activeItem = dd.querySelector(`[data-value="${val}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            document.getElementById('dropdownCloseLabel').textContent = activeItem.textContent;
        }
        document.getElementById('settingAutoStart').checked = data.autostart || false;
        document.getElementById('settingAutoStartFrpc').checked = data.auto_start_frpc || false;
    } catch(e) {}
}

async function saveSetting(key, value) {
    try {
        const dd = document.getElementById('dropdownCloseBehavior');
        const activeItem = dd.querySelector('.dropdown-item.active');
        const closeBehavior = activeItem ? activeItem.dataset.value : 'exit';
        const settings = {
            close_behavior: closeBehavior,
            autostart: document.getElementById('settingAutoStart').checked,
            auto_start_frpc: document.getElementById('settingAutoStartFrpc').checked,
        };
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        await fetch('/api/apply_settings', { method: 'POST' });
    } catch(e) {}
}

// ── Utils ──

function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ── Logs Page ──

let logPollTimer = null;
let logLastCount = 0;

function startLogPoll() {
    if (logPollTimer) return;
    pollLogs();
    logPollTimer = setInterval(pollLogs, 1000);
}

function stopLogPoll() {
    if (logPollTimer) {
        clearInterval(logPollTimer);
        logPollTimer = null;
    }
}

async function pollLogs() {
    try {
        const resp = await fetch('/api/logs');
        const data = await resp.json();
        if (!data.logs || data.logs.length === logLastCount) return;

        const terminal = document.getElementById('logTerminal');
        const wasAtBottom = terminal.scrollHeight - terminal.scrollTop - terminal.clientHeight < 30;

        terminal.innerHTML = data.logs.map(l => {
            // Strip ANSI escape codes
            const cleanText = l.text.replace(/\x1b\[[0-9;]*m/g, '');
            let cls = '';
            const t = cleanText.toLowerCase();
            if (t.includes('[e]') || t.includes('error') || t.includes('fail')) cls = 'log-error';
            else if (t.includes('[w]') || t.includes('warn')) cls = 'log-warn';
            else if (t.includes('[i]') || t.includes('info')) cls = 'log-info';
            return '<div class="log-line"><span class="log-time">' + escHtml(l.time) + '</span><span class="log-text ' + cls + '">' + escHtml(cleanText) + '</span></div>';
        }).join('');

        logLastCount = data.logs.length;

        if (wasAtBottom) {
            terminal.scrollTop = terminal.scrollHeight;
        }
    } catch(e) {}
}

async function clearLogs() {
    try {
        await fetch('/api/logs', { method: 'DELETE' });
        document.getElementById('logTerminal').innerHTML = '';
        logLastCount = 0;
    } catch(e) {}
}

// ── Init ──

setInterval(refreshStatus, 3000);
checkFrpcInstalled();
refreshStatus();

if (document.getElementById('page-config').classList.contains('active')) {
    initEditor();
}
