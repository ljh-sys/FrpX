// Generate Professional Tech Company Style SVGs for FrpX
const fs = require('fs');
const path = require('path');

// 1. 方案 A：Tunnel Portal (隧道折叠门) - 极简高阶几何网络
function getSvgA() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="gradA" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="gradA2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <!-- Outer hexagonal / geometric tunnel -->
  <path d="M 256 60 L 430 160 L 430 352 L 256 452 L 82 352 L 82 160 Z" 
        fill="none" stroke="url(#gradA)" stroke-width="36" stroke-linejoin="round"/>
  <!-- Inner core portal (rotated/forwarding) -->
  <path d="M 256 165 L 345 216 L 345 318 L 256 369 L 167 318 L 167 216 Z" 
        fill="none" stroke="url(#gradA2)" stroke-width="28" stroke-linejoin="round"/>
  <!-- Center penetrating conduit / core node -->
  <circle cx="256" cy="267" r="28" fill="#0284c7"/>
</svg>`;
}

// 2. 方案 B：Sync Rings / Dual Mesh (类似 RustDesk / Tailscale / Docker 现代几何连通环)
function getSvgB() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="gradB1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="gradB2" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <!-- Left/Local Node ring arc -->
  <path d="M 220 130 A 130 130 0 1 0 220 382" 
        fill="none" stroke="url(#gradB1)" stroke-width="46" stroke-linecap="round"/>
  <!-- Right/Remote Node ring arc -->
  <path d="M 292 382 A 130 130 0 1 0 292 130" 
        fill="none" stroke="url(#gradB2)" stroke-width="46" stroke-linecap="round"/>
  <!-- Connection bridge / flow dot -->
  <circle cx="256" cy="256" r="26" fill="#0ea5e9"/>
</svg>`;
}

// 3. 方案 C：Hyper-X (穿透折叠 X 拓扑) - 类似 HashiCorp / Cloudflare / NetBird
function getSvgC() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="gradC1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="gradC2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#075985"/>
    </linearGradient>
  </defs>
  <!-- Stream 1: Forward pipeline -->
  <path d="M 110 110 L 402 402" stroke="url(#gradC1)" stroke-width="56" stroke-linecap="round"/>
  <!-- Stream 2: Intersecting tunnel split (clean gap for professional depth) -->
  <path d="M 402 110 L 305 207" stroke="url(#gradC2)" stroke-width="56" stroke-linecap="round"/>
  <path d="M 207 305 L 110 402" stroke="url(#gradC2)" stroke-width="56" stroke-linecap="round"/>
  <!-- Central node focus -->
  <circle cx="256" cy="256" r="20" fill="#38bdf8"/>
</svg>`;
}

// 4. 方案 D：Network Node Fold (端口映射折纸几何) - 纯正现代大厂云原生风
function getSvgD() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="gradD1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="gradD2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <!-- Main faceted isometric polygon block 1 -->
  <path d="M 256 70 L 416 162 L 256 255 L 96 162 Z" fill="url(#gradD1)"/>
  <!-- Facet 2 (Left depth) -->
  <path d="M 96 162 L 256 255 L 256 442 L 96 348 Z" fill="#0284c7"/>
  <!-- Facet 3 (Right depth) -->
  <path d="M 256 255 L 416 162 L 416 348 L 256 442 Z" fill="#0369a1"/>
  <!-- Center cutout / tunnel conduit hole -->
  <polygon points="256,190 320,227 256,264 192,227" fill="#0b0f19" opacity="0.3"/>
</svg>`;
}

const outDir = path.join(__dirname, '.iconwork');
fs.writeFileSync(path.join(outDir, 'corp-1.svg'), getSvgA());
fs.writeFileSync(path.join(outDir, 'corp-2.svg'), getSvgB());
fs.writeFileSync(path.join(outDir, 'corp-3.svg'), getSvgC());
fs.writeFileSync(path.join(outDir, 'corp-4.svg'), getSvgD());

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
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    padding: 14px;
  }
  .card-desc {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.5;
    text-align: center;
    min-height: 48px;
    margin-bottom: 12px;
  }

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
    width: 170px;
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

  <h1>FrpX 大厂级现代技术架构风 Logo (Cloud-Native Infrastructure Style)</h1>
  <p class="desc">对标 Docker、Kubernetes、Tailscale、Cloudflare、RustDesk 等一线网络基础设施与云原生工具设计准则</p>

  <div class="grid">
    <!-- Card 1 -->
    <div class="card">
      <div class="card-title">方案 A · 隧道虫洞 (Tunnel Hex)</div>
      <div class="card-tag">对标：Kubernetes / Cloudflare</div>
      <div class="card-preview">${svgs[0]}</div>
      <div class="card-desc">正六边形嵌套空间隧道，中心聚焦穿透信道核心。极致严谨的几何比例，代表强大的内网穿透能力与网络拓扑。</div>
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
      <div class="card-title">方案 B · 互联双环 (Mesh Rings)</div>
      <div class="card-tag">对标：RustDesk / LocalSend / Tailscale</div>
      <div class="card-preview">${svgs[1]}</div>
      <div class="card-desc">内外网两个节点形成的咬合互通环，中间是贯穿的高速数据流。极具张力的动态圆弧，兼具极简与流体连通感。</div>
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
      <div class="card-title">方案 C · 跨越穿透 (Hyper-X)</div>
      <div class="card-tag">对标：HashiCorp / NetBird / GitHub</div>
      <div class="card-preview">${svgs[2]}</div>
      <div class="card-desc">大厂最经典的分层折叠 X 拓扑！一条贯通管道从深空破出，另一条优雅跨接断开，具有专业深度，彻底告别关闭叉。</div>
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
      <div class="card-title">方案 D · 拓扑微方 (Prism Node)</div>
      <div class="card-tag">对标：Docker / Web3 / 现代云服务</div>
      <div class="card-preview">${svgs[3]}</div>
      <div class="card-desc">等轴测等比科技魔方，中心留有隧道打通的空隙。三维折光与空间质感，极具现代企业级 PaaS / 基础设施严谨度。</div>
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
    <span>🖥️ 与 Windows 任务栏（32px）和常用主流应用并排对比</span>
  </div>

  <!-- Simulated Light Taskbar -->
  <div class="taskbar light">
    <span class="taskbar-label">浅色任务栏实机对比:</span>
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
    <span class="taskbar-label">深色任务栏实机对比:</span>
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
      <div style="width:16px; height:16px;">${svgs[1]}</div>
      <span style="font-weight:600; font-size:12px;">FrpX - 方案 B 窗口标题栏效果 (16×16px)</span>
      <div class="win-btns">— □ ✕</div>
    </div>
  </div>
  <div class="mock-window">
    <div class="win-titlebar">
      <div style="width:16px; height:16px;">${svgs[2]}</div>
      <span style="font-weight:600; font-size:12px;">FrpX - 方案 C 窗口标题栏效果 (16×16px)</span>
      <div class="win-btns">— □ ✕</div>
    </div>
  </div>

</body>
</html>`;
}

fs.writeFileSync(path.join(outDir, 'corp-preview.html'), htmlPage());
console.log('Corp preview generated');
