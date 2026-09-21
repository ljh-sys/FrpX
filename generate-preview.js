// Clean SVG generator for 4 Cute Blue Robot Mascot variants for FrpX
const fs = require('fs');
const path = require('path');

function getSvgA() {
  // A: 皮皮 (Pip) - 太空舱大眼萌
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bodyA" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="earA" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  
  <!-- Antenna -->
  <rect x="246" y="60" width="20" height="46" rx="10" fill="#0284c7"/>
  <circle cx="256" cy="50" r="26" fill="#38bdf8"/>
  <circle cx="256" cy="50" r="16" fill="#a5f3fc"/>
  <circle cx="251" cy="44" r="6" fill="#ffffff"/>

  <!-- Ears -->
  <rect x="52" y="210" width="36" height="92" rx="18" fill="url(#earA)"/>
  <rect x="424" y="210" width="36" height="92" rx="18" fill="url(#earA)"/>

  <!-- Head/Body -->
  <rect x="76" y="96" width="360" height="340" rx="110" fill="url(#bodyA)"/>
  <path d="M 180 120 Q 256 108 332 120" stroke="#bae6fd" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.6"/>

  <!-- Visor -->
  <rect x="114" y="156" width="284" height="200" rx="60" fill="#0f172a"/>
  
  <!-- Glowing Cyan Eyes -->
  <rect x="168" y="212" width="46" height="76" rx="23" fill="#38bdf8"/>
  <rect x="173" y="218" width="36" height="64" rx="18" fill="#a5f3fc"/>
  <circle cx="185" cy="232" r="8" fill="#ffffff"/>

  <rect x="298" y="212" width="46" height="76" rx="23" fill="#38bdf8"/>
  <rect x="303" y="218" width="36" height="64" rx="18" fill="#a5f3fc"/>
  <circle cx="315" cy="232" r="8" fill="#ffffff"/>

  <!-- Blush -->
  <ellipse cx="146" cy="308" rx="16" ry="8" fill="#38bdf8" opacity="0.45"/>
  <ellipse cx="366" cy="308" rx="16" ry="8" fill="#38bdf8" opacity="0.45"/>

  <!-- Smile -->
  <path d="M 242 302 Q 256 316 270 302" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none"/>
</svg>`;
}

function getSvgB() {
  // B: 闪闪 (Blink) - 双天线笑眯眯
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bodyB" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>

  <!-- Dual Antennas -->
  <path d="M 170 120 L 132 50" stroke="#2563eb" stroke-width="16" stroke-linecap="round"/>
  <circle cx="128" cy="44" r="22" fill="#38bdf8"/>
  <circle cx="125" cy="40" r="7" fill="#ffffff"/>

  <path d="M 342 120 L 380 50" stroke="#2563eb" stroke-width="16" stroke-linecap="round"/>
  <circle cx="384" cy="44" r="22" fill="#38bdf8"/>
  <circle cx="381" cy="40" r="7" fill="#ffffff"/>

  <!-- Ears -->
  <circle cx="68" cy="270" r="32" fill="#1d4ed8"/>
  <circle cx="68" cy="270" r="18" fill="#60a5fa"/>
  <circle cx="444" cy="270" r="32" fill="#1d4ed8"/>
  <circle cx="444" cy="270" r="18" fill="#60a5fa"/>

  <!-- Main Head -->
  <rect x="80" y="100" width="352" height="330" rx="100" fill="url(#bodyB)"/>
  <path d="M 180 122 Q 256 112 332 122" stroke="#bfdbfe" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.6"/>

  <!-- Visor -->
  <rect x="116" y="160" width="280" height="196" rx="56" fill="#0f172a"/>

  <!-- Smiling Eyes (^ ^) -->
  <path d="M 166 250 Q 192 208 218 250" stroke="#38bdf8" stroke-width="15" stroke-linecap="round" fill="none"/>
  <path d="M 294 250 Q 320 208 346 250" stroke="#38bdf8" stroke-width="15" stroke-linecap="round" fill="none"/>
  <path d="M 172 248 Q 192 216 212 248" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M 300 248 Q 320 216 340 248" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>

  <!-- Blush -->
  <ellipse cx="154" cy="294" rx="18" ry="9" fill="#f43f5e" opacity="0.65"/>
  <ellipse cx="358" cy="294" rx="18" ry="9" fill="#f43f5e" opacity="0.65"/>

  <!-- Open Smile -->
  <path d="M 240 284 Q 256 312 272 284 Z" fill="#38bdf8"/>

  <!-- Network LED indicator dots -->
  <circle cx="236" cy="380" r="8" fill="#38bdf8"/>
  <circle cx="256" cy="380" r="8" fill="#4ade80"/>
  <circle cx="276" cy="380" r="8" fill="#38bdf8"/>
</svg>`;
}

function getSvgC() {
  // C: 叉宝 (Proxy-X) - 极客特工，带 X 核心徽章
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bodyC" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <!-- Diamond Antenna -->
  <path d="M 256 34 L 278 72 L 256 110 L 234 72 Z" fill="#38bdf8"/>
  <circle cx="256" cy="72" r="8" fill="#ffffff"/>
  <rect x="248" y="100" width="16" height="20" fill="#0284c7"/>

  <!-- Cyber Ear Pads -->
  <rect x="52" y="196" width="38" height="116" rx="18" fill="#0ea5e9"/>
  <circle cx="71" cy="254" r="14" fill="#082f49"/>
  <circle cx="71" cy="254" r="6" fill="#38bdf8"/>
  
  <rect x="422" y="196" width="38" height="116" rx="18" fill="#0ea5e9"/>
  <circle cx="441" cy="254" r="14" fill="#082f49"/>
  <circle cx="441" cy="254" r="6" fill="#38bdf8"/>

  <!-- Head -->
  <rect x="78" y="112" width="356" height="324" rx="96" fill="url(#bodyC)"/>
  <rect x="84" y="118" width="344" height="312" rx="90" stroke="#38bdf8" stroke-width="4" fill="none" opacity="0.35"/>

  <!-- Visor -->
  <rect x="110" y="172" width="292" height="172" rx="54" fill="#020617"/>

  <!-- Eyes -->
  <circle cx="196" cy="252" r="34" fill="#0284c7" opacity="0.4"/>
  <circle cx="196" cy="252" r="24" fill="#38bdf8"/>
  <circle cx="196" cy="252" r="14" fill="#e0f2fe"/>
  <circle cx="190" cy="246" r="6" fill="#ffffff"/>

  <circle cx="316" cy="252" r="34" fill="#0284c7" opacity="0.4"/>
  <circle cx="316" cy="252" r="24" fill="#38bdf8"/>
  <circle cx="316" cy="252" r="14" fill="#e0f2fe"/>
  <circle cx="310" cy="246" r="6" fill="#ffffff"/>

  <!-- Core 'X' Emblem -->
  <circle cx="256" cy="382" r="24" fill="#082f49" stroke="#38bdf8" stroke-width="3"/>
  <path d="M 247 373 L 265 391 M 265 373 L 247 391" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round"/>
</svg>`;
}

function getSvgD() {
  // D: 豆豆 (Chibi-Bot) - 圆润电视主机与高光萌眼
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bodyD" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>

  <!-- Loop Antenna -->
  <circle cx="256" cy="64" r="34" stroke="#38bdf8" stroke-width="14" fill="none"/>
  <rect x="249" y="94" width="14" height="26" fill="#1d4ed8"/>
  <circle cx="256" cy="45" r="8" fill="#bae6fd"/>

  <!-- Ears -->
  <rect x="56" y="210" width="30" height="80" rx="15" fill="#1e40af"/>
  <rect x="426" y="210" width="30" height="80" rx="15" fill="#1e40af"/>

  <!-- Head/Body -->
  <rect x="74" y="112" width="364" height="324" rx="120" fill="url(#bodyD)"/>
  <path d="M 180 134 Q 256 122 332 134" stroke="#ffffff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.45"/>

  <!-- Visor -->
  <rect x="110" y="162" width="292" height="196" rx="68" fill="#0f172a"/>

  <!-- Cute Eyes -->
  <ellipse cx="186" cy="248" rx="28" ry="36" fill="#38bdf8"/>
  <ellipse cx="186" cy="248" rx="18" ry="26" fill="#bae6fd"/>
  <circle cx="178" cy="236" r="9" fill="#ffffff"/>
  <circle cx="194" cy="260" r="4" fill="#ffffff"/>

  <ellipse cx="326" cy="248" rx="28" ry="36" fill="#38bdf8"/>
  <ellipse cx="326" cy="248" rx="18" ry="26" fill="#bae6fd"/>
  <circle cx="318" cy="236" r="9" fill="#ffffff"/>
  <circle cx="334" cy="260" r="4" fill="#ffffff"/>

  <!-- Blush -->
  <ellipse cx="150" cy="302" rx="16" ry="8" fill="#38bdf8" opacity="0.5"/>
  <ellipse cx="362" cy="302" rx="16" ry="8" fill="#38bdf8" opacity="0.5"/>

  <!-- Cat Mouth :3 -->
  <path d="M 238 290 Q 248 300 256 292 Q 264 300 274 290" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none"/>

  <!-- Feet -->
  <rect x="160" y="426" width="56" height="24" rx="12" fill="#1e40af"/>
  <rect x="296" y="426" width="56" height="24" rx="12" fill="#1e40af"/>
</svg>`;
}

const outDir = path.join(__dirname, '.iconwork');
fs.writeFileSync(path.join(outDir, 'mascot-A.svg'), getSvgA());
fs.writeFileSync(path.join(outDir, 'mascot-B.svg'), getSvgB());
fs.writeFileSync(path.join(outDir, 'mascot-C.svg'), getSvgC());
fs.writeFileSync(path.join(outDir, 'mascot-D.svg'), getSvgD());

function htmlPage() {
  const svgs = [getSvgA(), getSvgB(), getSvgC(), getSvgD()];
  
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: #0b0f19;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif;
    color: #f1f5f9;
    padding: 30px;
    width: 1200px;
  }
  h1 { font-size: 26px; font-weight: 700; margin-bottom: 8px; color: #38bdf8; }
  p.desc { font-size: 14px; color: #94a3b8; margin-bottom: 24px; }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }
  .card {
    background: #1e293b;
    border-radius: 16px;
    border: 1px solid #334155;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
  }
  .card-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
    color: #ffffff;
  }
  .card-tag {
    font-size: 11px;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    padding: 2px 8px;
    border-radius: 10px;
    margin-bottom: 16px;
  }
  .card-preview {
    width: 180px;
    height: 180px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card-desc {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.5;
    text-align: center;
    min-height: 54px;
    margin-bottom: 12px;
  }

  /* Multi-scale preview */
  .scale-strip {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    padding: 12px 14px;
    background: rgba(15, 23, 42, 0.6);
    border-radius: 10px;
    width: 100%;
    justify-content: center;
  }
  .scale-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .scale-lbl {
    font-size: 9px;
    color: #64748b;
  }

  /* Taskbar Simulation section */
  .section-title {
    font-size: 17px;
    font-weight: 600;
    margin: 28px 0 14px;
    color: #e2e8f0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .mock-window {
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    overflow: hidden;
    margin-bottom: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .win-titlebar {
    height: 38px;
    background: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 14px;
    font-size: 12px;
    color: #1e293b;
    gap: 10px;
  }
  .win-btns { margin-left: auto; color: #94a3b8; font-size: 12px; letter-spacing: 6px; }

  .taskbar {
    height: 52px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 18px;
    gap: 16px;
    margin-bottom: 14px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  }
  .taskbar.light {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
  }
  .taskbar.dark {
    background: #1e293b;
    border: 1px solid #334155;
  }
  .taskbar-label {
    font-size: 12px;
    font-weight: 600;
    width: 150px;
  }
  .taskbar.light .taskbar-label { color: #334155; }
  .taskbar.dark .taskbar-label { color: #cbd5e1; }

  .app-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .app-icon.active::after {
    content: '';
    position: absolute;
    bottom: -6px;
    width: 16px;
    height: 3px;
    background: #38bdf8;
    border-radius: 2px;
  }
  .dummy-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    opacity: 0.9;
  }
</style>
</head>
<body>

  <h1>FrpX 吉祥物图标设计方案</h1>
  <p class="desc">专为代理守护进程 (Frp Daemon) 设计的 4 款可爱蓝色机器人 · 告别关闭按钮误区 · 优化 16/24/32px 任务栏清晰度</p>

  <div class="grid">
    <!-- Card A -->
    <div class="card">
      <div class="card-title">方案 A · 皮皮 (Pip)</div>
      <div class="card-tag">太空舱 · 呆萌发光大眼</div>
      <div class="card-preview">${svgs[0]}</div>
      <div class="card-desc">圆润太空舱头盔，头顶小发光天线珠，深色面罩 + 发光大眼与可爱腮红。轮廓纯粹，极小尺寸下最清晰耐看。</div>
      <div class="scale-strip">
        <div class="scale-item">
          <div style="width:48px;height:48px;">${svgs[0]}</div>
          <span class="scale-lbl">48px</span>
        </div>
        <div class="scale-item">
          <div style="width:32px;height:32px;">${svgs[0]}</div>
          <span class="scale-lbl">32px</span>
        </div>
        <div class="scale-item">
          <div style="width:24px;height:24px;">${svgs[0]}</div>
          <span class="scale-lbl">24px</span>
        </div>
        <div class="scale-item">
          <div style="width:16px;height:16px;">${svgs[0]}</div>
          <span class="scale-lbl">16px</span>
        </div>
      </div>
    </div>

    <!-- Card B -->
    <div class="card">
      <div class="card-title">方案 B · 闪闪 (Blink)</div>
      <div class="card-tag">笑眯眯 (^ ^) · 亲和力萌宠</div>
      <div class="card-preview">${svgs[1]}</div>
      <div class="card-desc">头顶双天线，面罩是一对开心的发光笑眼 (^ ^) 与萌萌腮红，底部带三色端口连通状态灯，非常讨人喜欢。</div>
      <div class="scale-strip">
        <div class="scale-item">
          <div style="width:48px;height:48px;">${svgs[1]}</div>
          <span class="scale-lbl">48px</span>
        </div>
        <div class="scale-item">
          <div style="width:32px;height:32px;">${svgs[1]}</div>
          <span class="scale-lbl">32px</span>
        </div>
        <div class="scale-item">
          <div style="width:24px;height:24px;">${svgs[1]}</div>
          <span class="scale-lbl">24px</span>
        </div>
        <div class="scale-item">
          <div style="width:16px;height:16px;">${svgs[1]}</div>
          <span class="scale-lbl">16px</span>
        </div>
      </div>
    </div>

    <!-- Card C -->
    <div class="card">
      <div class="card-title">方案 C · 叉宝 (Proxy-X)</div>
      <div class="card-tag">硬核极客 · X 能量核心</div>
      <div class="card-preview">${svgs[2]}</div>
      <div class="card-desc">科技感更强的小特工！耳麦天线 + 护目镜，胸前嵌有专属发光 "X" 端口核心，完美保留软件名称中的 X 基因。</div>
      <div class="scale-strip">
        <div class="scale-item">
          <div style="width:48px;height:48px;">${svgs[2]}</div>
          <span class="scale-lbl">48px</span>
        </div>
        <div class="scale-item">
          <div style="width:32px;height:32px;">${svgs[2]}</div>
          <span class="scale-lbl">32px</span>
        </div>
        <div class="scale-item">
          <div style="width:24px;height:24px;">${svgs[2]}</div>
          <span class="scale-lbl">24px</span>
        </div>
        <div class="scale-item">
          <div style="width:16px;height:16px;">${svgs[2]}</div>
          <span class="scale-lbl">16px</span>
        </div>
      </div>
    </div>

    <!-- Card D -->
    <div class="card">
      <div class="card-title">方案 D · 豆豆 (Chibi-Bot)</div>
      <div class="card-tag">圆润电视主机 · 水汪汪高光眼</div>
      <div class="card-preview">${svgs[3]}</div>
      <div class="card-desc">通灵性的复古微型主机机器人，圆环雷达天线，两只水汪汪的高光圆眼与猫猫小嘴 (:3)，小短腿憨态可掬。</div>
      <div class="scale-strip">
        <div class="scale-item">
          <div style="width:48px;height:48px;">${svgs[3]}</div>
          <span class="scale-lbl">48px</span>
        </div>
        <div class="scale-item">
          <div style="width:32px;height:32px;">${svgs[3]}</div>
          <span class="scale-lbl">32px</span>
        </div>
        <div class="scale-item">
          <div style="width:24px;height:24px;">${svgs[3]}</div>
          <span class="scale-lbl">24px</span>
        </div>
        <div class="scale-item">
          <div style="width:16px;height:16px;">${svgs[3]}</div>
          <span class="scale-lbl">16px</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Windows Real UI Mockup -->
  <div class="section-title">
    <span>🖥️ Windows 实机尺寸模拟对比（任务栏 32px + 标题栏 16px）</span>
  </div>

  <!-- Simulated Light Taskbar -->
  <div class="taskbar light">
    <span class="taskbar-label">浅色任务栏 (32px):</span>
    <div style="display:flex; gap:18px; align-items:center;">
      <div class="app-icon active" title="方案 A">${svgs[0]}</div>
      <div class="app-icon active" title="方案 B">${svgs[1]}</div>
      <div class="app-icon active" title="方案 C">${svgs[2]}</div>
      <div class="app-icon active" title="方案 D">${svgs[3]}</div>
      <div style="width: 1px; height: 24px; background:#cbd5e1; margin: 0 4px;"></div>
      <!-- Common apps for reference -->
      <div class="dummy-icon" style="background:#0078d4; display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">Edge</div>
      <div class="dummy-icon" style="background:#22c55e; display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">微信</div>
      <div class="dummy-icon" style="background:#f59e0b; display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">文件夹</div>
    </div>
  </div>

  <!-- Simulated Dark Taskbar -->
  <div class="taskbar dark">
    <span class="taskbar-label">深色任务栏 (32px):</span>
    <div style="display:flex; gap:18px; align-items:center;">
      <div class="app-icon active" title="方案 A">${svgs[0]}</div>
      <div class="app-icon active" title="方案 B">${svgs[1]}</div>
      <div class="app-icon active" title="方案 C">${svgs[2]}</div>
      <div class="app-icon active" title="方案 D">${svgs[3]}</div>
      <div style="width: 1px; height: 24px; background:#475569; margin: 0 4px;"></div>
      <div class="dummy-icon" style="background:#0078d4; display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">Edge</div>
      <div class="dummy-icon" style="background:#22c55e; display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">微信</div>
      <div class="dummy-icon" style="background:#f59e0b; display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">文件夹</div>
    </div>
  </div>

  <!-- Title bar mockup -->
  <div class="mock-window">
    <div class="win-titlebar">
      <div style="width:16px; height:16px;">${svgs[0]}</div>
      <span style="font-weight:600; font-size:12px;">FrpX - 方案 A 窗口标题栏实机效果 (16×16px)</span>
      <div class="win-btns">— □ ✕</div>
    </div>
  </div>
  <div class="mock-window">
    <div class="win-titlebar">
      <div style="width:16px; height:16px;">${svgs[1]}</div>
      <span style="font-weight:600; font-size:12px;">FrpX - 方案 B 窗口标题栏实机效果 (16×16px)</span>
      <div class="win-btns">— □ ✕</div>
    </div>
  </div>

</body>
</html>`;
}

fs.writeFileSync(path.join(outDir, 'mascot-preview.html'), htmlPage());
console.log('Regenerated preview HTML');
