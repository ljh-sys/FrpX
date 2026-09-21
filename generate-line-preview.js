// SVG Line-Art Mascot generator for FrpX
const fs = require('fs');
const path = require('path');

// 统一色板
const BLUE = '#0284c7';       // 主线条深天蓝
const LIGHT_BLUE = '#38bdf8'; // 高亮天蓝
const ACCENT = '#0ea5e9';     // 重点蓝
const BG_FILL = '#e0f2fe';    // 微淡蓝半透明填充（增加层次）

function getSvgL1() {
  // Line 1: 极简几何线框机器人 (天线+圆角方头+大圆眼+微笑)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Antenna -->
  <line x1="256" y1="110" x2="256" y2="60" stroke="${BLUE}" stroke-width="28" stroke-linecap="round"/>
  <circle cx="256" cy="50" r="24" fill="${LIGHT_BLUE}" stroke="${BLUE}" stroke-width="16"/>

  <!-- Ears -->
  <line x1="70" y1="230" x2="70" y2="300" stroke="${BLUE}" stroke-width="28" stroke-linecap="round"/>
  <line x1="442" y1="230" x2="442" y2="300" stroke="${BLUE}" stroke-width="28" stroke-linecap="round"/>

  <!-- Head Contour -->
  <rect x="92" y="110" width="328" height="310" rx="90" fill="#f0f9ff" stroke="${BLUE}" stroke-width="32" stroke-linejoin="round"/>

  <!-- Eyes (Bold round filled dots) -->
  <circle cx="195" cy="245" r="28" fill="${BLUE}"/>
  <circle cx="317" cy="245" r="28" fill="${BLUE}"/>
  <circle cx="187" cy="237" r="9" fill="#ffffff"/>
  <circle cx="309" cy="237" r="9" fill="#ffffff"/>

  <!-- Smile -->
  <path d="M 226 315 Q 256 345 286 315" stroke="${BLUE}" stroke-width="24" stroke-linecap="round" fill="none"/>
</svg>`;
}

function getSvgL2() {
  // Line 2: 线性笑眼机器萌宠 (^ ^) 头顶双天线
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Dual Antennas -->
  <line x1="180" y1="120" x2="140" y2="55" stroke="${BLUE}" stroke-width="26" stroke-linecap="round"/>
  <circle cx="135" cy="48" r="20" fill="${LIGHT_BLUE}" stroke="${BLUE}" stroke-width="14"/>

  <line x1="332" y1="120" x2="372" y2="55" stroke="${BLUE}" stroke-width="26" stroke-linecap="round"/>
  <circle cx="377" cy="48" r="20" fill="${LIGHT_BLUE}" stroke="${BLUE}" stroke-width="14"/>

  <!-- Head Contour -->
  <rect x="88" y="118" width="336" height="300" rx="95" fill="#f0f9ff" stroke="${BLUE}" stroke-width="32" stroke-linejoin="round"/>

  <!-- Smiling Eyes (^ ^) -->
  <path d="M 160 250 Q 192 205 224 250" stroke="${BLUE}" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M 288 250 Q 320 205 352 250" stroke="${BLUE}" stroke-width="28" stroke-linecap="round" fill="none"/>

  <!-- Cute Blush Lines -->
  <line x1="145" y1="285" x2="165" y2="285" stroke="${LIGHT_BLUE}" stroke-width="14" stroke-linecap="round"/>
  <line x1="347" y1="285" x2="367" y2="285" stroke="${LIGHT_BLUE}" stroke-width="14" stroke-linecap="round"/>

  <!-- Open Smile -->
  <path d="M 235 305 Q 256 335 277 305" stroke="${BLUE}" stroke-width="20" stroke-linecap="round" fill="none"/>
</svg>`;
}

function getSvgL3() {
  // Line 3: 纯线条特工 + 线性 "X" 徽章（单线兼具极简与 FrpX 标志）
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Headphone / Ear Cups -->
  <rect x="62" y="210" width="30" height="96" rx="15" fill="${LIGHT_BLUE}" stroke="${BLUE}" stroke-width="24"/>
  <rect x="420" y="210" width="30" height="96" rx="15" fill="${LIGHT_BLUE}" stroke="${BLUE}" stroke-width="24"/>

  <!-- Headband / Antenna -->
  <path d="M 77 210 A 185 185 0 0 1 435 210" stroke="${BLUE}" stroke-width="24" stroke-linecap="round" fill="none"/>
  <circle cx="256" cy="65" r="18" fill="${LIGHT_BLUE}" stroke="${BLUE}" stroke-width="14"/>

  <!-- Head Outline -->
  <rect x="94" y="125" width="324" height="295" rx="85" fill="#f0f9ff" stroke="${BLUE}" stroke-width="30" stroke-linejoin="round"/>

  <!-- Visor inner frame (single line) -->
  <rect x="134" y="168" width="244" height="150" rx="45" fill="none" stroke="${LIGHT_BLUE}" stroke-width="18"/>

  <!-- Eyes inside visor -->
  <circle cx="202" cy="242" r="22" fill="${BLUE}"/>
  <circle cx="310" cy="242" r="22" fill="${BLUE}"/>

  <!-- X Badge at chin / chest -->
  <circle cx="256" cy="365" r="26" fill="#ffffff" stroke="${BLUE}" stroke-width="16"/>
  <line x1="244" y1="353" x2="268" y2="377" stroke="${BLUE}" stroke-width="12" stroke-linecap="round"/>
  <line x1="268" y1="353" x2="244" y2="377" stroke="${BLUE}" stroke-width="12" stroke-linecap="round"/>
</svg>`;
}

function getSvgL4() {
  // Line 4: 极简流线小电视 / 胶囊喵耳机器人 (双眼眨眼 > < 或萌眼 + 纯线条猫嘴)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Round Loop Antenna -->
  <circle cx="256" cy="68" r="32" stroke="${BLUE}" stroke-width="24" fill="none"/>
  <line x1="256" y1="100" x2="256" y2="120" stroke="${BLUE}" stroke-width="24" stroke-linecap="round"/>

  <!-- Head Contour -->
  <rect x="80" y="120" width="352" height="300" rx="105" fill="#f0f9ff" stroke="${BLUE}" stroke-width="32" stroke-linejoin="round"/>

  <!-- Big Line Eyes -->
  <rect x="165" y="210" width="46" height="74" rx="23" fill="${BLUE}"/>
  <rect x="301" y="210" width="46" height="74" rx="23" fill="${BLUE}"/>
  <circle cx="178" cy="230" r="8" fill="#ffffff"/>
  <circle cx="314" cy="230" r="8" fill="#ffffff"/>

  <!-- Cat Mouth :3 in clean lines -->
  <path d="M 230 310 Q 243 324 256 314 Q 269 324 282 310" stroke="${BLUE}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <!-- Bottom mini feet (lines) -->
  <line x1="180" y1="420" x2="180" y2="455" stroke="${BLUE}" stroke-width="26" stroke-linecap="round"/>
  <line x1="332" y1="420" x2="332" y2="455" stroke="${BLUE}" stroke-width="26" stroke-linecap="round"/>
</svg>`;
}

const outDir = path.join(__dirname, '.iconwork');
fs.writeFileSync(path.join(outDir, 'line-1.svg'), getSvgL1());
fs.writeFileSync(path.join(outDir, 'line-2.svg'), getSvgL2());
fs.writeFileSync(path.join(outDir, 'line-3.svg'), getSvgL3());
fs.writeFileSync(path.join(outDir, 'line-4.svg'), getSvgL4());

function htmlPage() {
  const svgs = [getSvgL1(), getSvgL2(), getSvgL3(), getSvgL4()];
  
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
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 10px;
  }
  .card-desc {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.5;
    text-align: center;
    min-height: 48px;
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
    background: #0284c7;
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

  <h1>FrpX 极简线条风吉祥物设计方案 (Line-Art Robot)</h1>
  <p class="desc">纯粹、轻盈、现代的线条轮廓勾勒 · 拒绝杂色与厚重面罩 · 绝佳的 16/24/32px 任务栏与标题栏通透感</p>

  <div class="grid">
    <!-- Card 1 -->
    <div class="card">
      <div class="card-title">方案 1 · 极简萌圆 (Poko)</div>
      <div class="card-tag">极简纯线框 · 经典大圆眼</div>
      <div class="card-preview">${svgs[0]}</div>
      <div class="card-desc">纯净粗线条勾勒出圆角头盔与小圆天线，两颗清澈的大圆眼和一个温暖的微笑。极简明快，像现代矢量插画。</div>
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

    <!-- Card 2 -->
    <div class="card">
      <div class="card-title">方案 2 · 笑脸精灵 (Niko)</div>
      <div class="card-tag">双天线 (^ ^) · 治愈系线条</div>
      <div class="card-preview">${svgs[1]}</div>
      <div class="card-desc">双倾角小天线，仅用两道优美的弧线勾勒出一对天真开心的笑眼 (^ ^)，线条极简又有极高的情绪辨识度。</div>
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

    <!-- Card 3 -->
    <div class="card">
      <div class="card-title">方案 3 · 极客小特工 (X-Agent)</div>
      <div class="card-tag">耳麦头环 · 极简 X 徽章</div>
      <div class="card-preview">${svgs[2]}</div>
      <div class="card-desc">佩戴轻盈耳麦与头梁弧线，内部双层线框，底部带精致的 X 标志徽章。线条极客感十足，完美点题 FrpX。</div>
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

    <!-- Card 4 -->
    <div class="card">
      <div class="card-title">方案 4 · 圆环喵嘴 (Mimi)</div>
      <div class="card-tag">圆环天线 · 胶囊眼与猫猫嘴</div>
      <div class="card-preview">${svgs[3]}</div>
      <div class="card-desc">圆环雷达天线，胶囊大眼配上可爱的双弧线猫猫嘴 (:3)，下方两只小立足。线条灵动俏皮，充满生机。</div>
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
      <div class="app-icon active" title="方案 1">${svgs[0]}</div>
      <div class="app-icon active" title="方案 2">${svgs[1]}</div>
      <div class="app-icon active" title="方案 3">${svgs[2]}</div>
      <div class="app-icon active" title="方案 4">${svgs[3]}</div>
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
      <div class="app-icon active" title="方案 1">${svgs[0]}</div>
      <div class="app-icon active" title="方案 2">${svgs[1]}</div>
      <div class="app-icon active" title="方案 3">${svgs[2]}</div>
      <div class="app-icon active" title="方案 4">${svgs[3]}</div>
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
      <span style="font-weight:600; font-size:12px;">FrpX - 方案 1 窗口标题栏实机效果 (16×16px)</span>
      <div class="win-btns">— □ ✕</div>
    </div>
  </div>
  <div class="mock-window">
    <div class="win-titlebar">
      <div style="width:16px; height:16px;">${svgs[1]}</div>
      <span style="font-weight:600; font-size:12px;">FrpX - 方案 2 窗口标题栏实机效果 (16×16px)</span>
      <div class="win-btns">— □ ✕</div>
    </div>
  </div>

</body>
</html>`;
}

fs.writeFileSync(path.join(outDir, 'line-preview.html'), htmlPage());
console.log('Line preview generated');
