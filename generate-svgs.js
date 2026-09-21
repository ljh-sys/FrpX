// SVG generator for 4 Cute Blue Robot Mascot variants for FrpX
const fs = require('fs');
const path = require('path');

// 1. Variant A: "Pip / 皮皮" - Capsule Space Robot (Super clean, capsule head, visor, antenna with glowing bead)
// 2. Variant B: "Blink / 闪闪" - Happy Face Robot (Smiling eyes ^ ^, cheek blush, cute ears/antennas, soft rounded cube)
// 3. Variant C: "Proxy-X / 叉宝" - Core-X Agent Robot (Visor with subtle glowing X eyes/shield, ear muff antennas, high tech cute)
// 4. Variant D: "Chibi Bot / 圆圆" - Floating Chibi Orb Bot (Big glass dome visor, expressive glowing cyan oval eyes, round body)

function getSvgA(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
    <defs>
      <linearGradient id="bodyGradA" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="earGradA" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
      <linearGradient id="visorGradA" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <filter id="glowA" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    
    <!-- Shadow -->
    <ellipse cx="256" cy="470" rx="140" ry="18" fill="#000000" opacity="0.15"/>

    <!-- Antenna -->
    <rect x="246" y="56" width="20" height="50" rx="10" fill="#0284c7"/>
    <!-- Antenna Tip Bead (Glowing Cyan) -->
    <circle cx="256" cy="50" r="24" fill="#38bdf8"/>
    <circle cx="256" cy="50" r="16" fill="#67e8f9"/>
    <circle cx="252" cy="45" r="6" fill="#ffffff"/>

    <!-- Left / Right Ears / Dials -->
    <rect x="54" y="210" width="34" height="90" rx="17" fill="url(#earGradA)"/>
    <rect x="424" y="210" width="34" height="90" rx="17" fill="url(#earGradA)"/>

    <!-- Head / Main Body Outer -->
    <rect x="76" y="96" width="360" height="340" rx="110" fill="url(#bodyGradA)"/>
    <!-- Body Highlight Ring (Subtle top sheen) -->
    <path d="M 186 116 Q 256 106 326 116" stroke="#bae6fd" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.6"/>

    <!-- Visor (Dark Face Screen) -->
    <rect x="114" y="156" width="284" height="200" rx="60" fill="url(#visorGradA)"/>
    <!-- Visor Glass Reflection -->
    <path d="M 134 186 Q 256 168 378 186" stroke="#475569" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.4"/>

    <!-- Glowing Cyan Eyes (Capsule Shaped - friendly, wide-eyed) -->
    <g filter="url(#glowA)">
      <rect x="170" y="216" width="44" height="74" rx="22" fill="#38bdf8"/>
      <rect x="174" y="222" width="36" height="62" rx="18" fill="#a5f3fc"/>
      <circle cx="186" cy="236" r="8" fill="#ffffff"/>

      <rect x="298" y="216" width="44" height="74" rx="22" fill="#38bdf8"/>
      <rect x="302" y="222" width="36" height="62" rx="18" fill="#a5f3fc"/>
      <circle cx="314" cy="236" r="8" fill="#ffffff"/>
    </g>

    <!-- Cheeks (Blush) -->
    <ellipse cx="148" cy="310" rx="18" ry="9" fill="#38bdf8" opacity="0.5"/>
    <ellipse cx="364" cy="310" rx="18" ry="9" fill="#38bdf8" opacity="0.5"/>

    <!-- Tiny Mouth (Happy line) -->
    <path d="M 242 304 Q 256 318 270 304" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none"/>
  </svg>`;
}

function getSvgB(size) {
  // Variant B: Happy Face Cute Robot with Smile Eyes (^ ^) and Dual Antennas
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
    <defs>
      <linearGradient id="bodyGradB" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#60a5fa"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
      <linearGradient id="screenGradB" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
      <linearGradient id="hornGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
      <filter id="glowB" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Shadow -->
    <ellipse cx="256" cy="470" rx="130" ry="16" fill="#000000" opacity="0.15"/>

    <!-- Dual Cute Antennas (Left & Right tilted) -->
    <path d="M 170 120 L 130 50" stroke="#2563eb" stroke-width="16" stroke-linecap="round"/>
    <circle cx="126" cy="44" r="22" fill="#38bdf8"/>
    <circle cx="123" cy="40" r="8" fill="#ffffff"/>

    <path d="M 342 120 L 382 50" stroke="#2563eb" stroke-width="16" stroke-linecap="round"/>
    <circle cx="386" cy="44" r="22" fill="#38bdf8"/>
    <circle cx="383" cy="40" r="8" fill="#ffffff"/>

    <!-- Round Ear Pads -->
    <circle cx="68" cy="270" r="32" fill="#1d4ed8"/>
    <circle cx="68" cy="270" r="18" fill="#60a5fa"/>
    <circle cx="444" cy="270" r="32" fill="#1d4ed8"/>
    <circle cx="444" cy="270" r="18" fill="#60a5fa"/>

    <!-- Main Robot Head/Body -->
    <rect x="80" y="100" width="352" height="330" rx="100" fill="url(#bodyGradB)"/>
    <!-- Top Highlight Curve -->
    <path d="M 180 120 Q 256 110 332 120" stroke="#bfdbfe" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.6"/>

    <!-- Dark Screen -->
    <rect x="116" y="160" width="280" height="196" rx="56" fill="url(#screenGradB)"/>

    <!-- Happy Eyes (^  ^) -->
    <g filter="url(#glowB)">
      <path d="M 166 250 Q 192 210 218 250" stroke="#38bdf8" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M 294 250 Q 320 210 346 250" stroke="#38bdf8" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M 170 248 Q 192 214 214 248" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M 298 248 Q 320 214 342 248" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none"/>
    </g>

    <!-- Pinkish/Cyan Cute Blush -->
    <ellipse cx="156" cy="296" rx="20" ry="10" fill="#f43f5e" opacity="0.6"/>
    <ellipse cx="356" cy="296" rx="20" ry="10" fill="#f43f5e" opacity="0.6"/>

    <!-- Small Happy Open Mouth -->
    <path d="M 240 286 Q 256 312 272 286 Z" fill="#38bdf8"/>

    <!-- Bottom Status / Network indicator LED dots -->
    <circle cx="236" cy="380" r="8" fill="#38bdf8"/>
    <circle cx="256" cy="380" r="8" fill="#4ade80"/>
    <circle cx="276" cy="380" r="8" fill="#38bdf8"/>
  </svg>`;
}

function getSvgC(size) {
  // Variant C: "Proxy-X" - Cyberpunk Cute Mascot with subtle "X" eye goggles & glowing antenna
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
    <defs>
      <linearGradient id="bodyGradC" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="visorGradC" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0369a1"/>
        <stop offset="100%" stop-color="#082f49"/>
      </linearGradient>
      <linearGradient id="goldAcc" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#06b6d4"/>
      </linearGradient>
      <filter id="glowC" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Shadow -->
    <ellipse cx="256" cy="470" rx="140" ry="18" fill="#000000" opacity="0.2"/>

    <!-- Central Signal Radar / Diamond Antenna -->
    <path d="M 256 36 L 276 72 L 256 108 L 236 72 Z" fill="#38bdf8"/>
    <circle cx="256" cy="72" r="8" fill="#ffffff"/>
    <rect x="248" y="100" width="16" height="24" rx="6" fill="#0284c7"/>

    <!-- Cyber Headphone Ears -->
    <rect x="52" y="196" width="38" height="116" rx="18" fill="#0ea5e9"/>
    <circle cx="71" cy="254" r="14" fill="#082f49"/>
    <circle cx="71" cy="254" r="6" fill="#38bdf8"/>
    
    <rect x="422" y="196" width="38" height="116" rx="18" fill="#0ea5e9"/>
    <circle cx="441" cy="254" r="14" fill="#082f49"/>
    <circle cx="441" cy="254" r="6" fill="#38bdf8"/>

    <!-- Main Head Unit -->
    <rect x="78" y="112" width="356" height="324" rx="96" fill="url(#bodyGradC)"/>
    <rect x="84" y="118" width="344" height="312" rx="90" stroke="#38bdf8" stroke-width="4" fill="none" opacity="0.4"/>

    <!-- Curved Goggle Visor Frame -->
    <rect x="110" y="172" width="292" height="172" rx="54" fill="#020617"/>

    <!-- Glowing Eyes with FrpX signature subtle '><' or stylized round-X -->
    <g filter="url(#glowC)">
      <!-- Left Eye: Cute Dynamic Wing / Angle -->
      <circle cx="196" cy="252" r="38" fill="#0284c7" opacity="0.3"/>
      <circle cx="196" cy="252" r="28" fill="#38bdf8"/>
      <circle cx="196" cy="252" r="18" fill="#e0f2fe"/>
      <circle cx="188" cy="244" r="7" fill="#ffffff"/>

      <!-- Right Eye -->
      <circle cx="316" cy="252" r="38" fill="#0284c7" opacity="0.3"/>
      <circle cx="316" cy="252" r="28" fill="#38bdf8"/>
      <circle cx="316" cy="252" r="18" fill="#e0f2fe"/>
      <circle cx="308" cy="244" r="7" fill="#ffffff"/>
    </g>

    <!-- Chest Port Badge / Core 'X' Emblem -->
    <g>
      <circle cx="256" cy="384" r="22" fill="#082f49" stroke="#38bdf8" stroke-width="3"/>
      <path d="M 248 376 L 264 392 M 264 376 L 248 392" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
    </g>
  </svg>`;
}

function getSvgD(size) {
  // Variant D: "Chibi Orb / 豆豆" - Ultra Cute Round TV Mascot with big glossy visor & smile
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
    <defs>
      <linearGradient id="bodyGradD" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
      <linearGradient id="screenGradD" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <filter id="glowD" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Shadow -->
    <ellipse cx="256" cy="466" rx="140" ry="18" fill="#000000" opacity="0.16"/>

    <!-- Cute Loop Antenna (Head Ring) -->
    <circle cx="256" cy="64" r="32" stroke="#38bdf8" stroke-width="14" fill="none"/>
    <rect x="249" y="94" width="14" height="26" fill="#1d4ed8"/>
    <circle cx="256" cy="46" r="8" fill="#bae6fd"/>

    <!-- Small rounded ears with speaker grill -->
    <rect x="56" y="210" width="30" height="80" rx="15" fill="#1e40af"/>
    <rect x="426" y="210" width="30" height="80" rx="15" fill="#1e40af"/>

    <!-- Big Round Squircle Body -->
    <rect x="74" y="112" width="364" height="324" rx="120" fill="url(#bodyGradD)"/>
    <!-- Top Specular Highlight -->
    <path d="M 180 134 Q 256 122 332 134" stroke="#ffffff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.5"/>

    <!-- Large Television / Monitor Visor -->
    <rect x="110" y="162" width="292" height="196" rx="68" fill="url(#screenGradD)"/>

    <!-- Big Kawaii Eyes -->
    <g filter="url(#glowD)">
      <!-- Left Eye -->
      <ellipse cx="186" cy="248" rx="28" ry="36" fill="#38bdf8"/>
      <ellipse cx="186" cy="248" rx="20" ry="28" fill="#bae6fd"/>
      <circle cx="178" cy="236" r="10" fill="#ffffff"/>
      <circle cx="194" cy="262" r="4" fill="#ffffff"/>

      <!-- Right Eye -->
      <ellipse cx="326" cy="248" rx="28" ry="36" fill="#38bdf8"/>
      <ellipse cx="326" cy="248" rx="20" ry="28" fill="#bae6fd"/>
      <circle cx="318" cy="236" r="10" fill="#ffffff"/>
      <circle cx="334" cy="262" r="4" fill="#ffffff"/>
    </g>

    <!-- Sweet blush -->
    <ellipse cx="150" cy="304" rx="18" ry="8" fill="#38bdf8" opacity="0.6"/>
    <ellipse cx="362" cy="304" rx="18" ry="8" fill="#38bdf8" opacity="0.6"/>

    <!-- Cute Smiling Cat/Bot Mouth :3 -->
    <path d="M 238 290 Q 248 300 256 292 Q 264 300 274 290" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none"/>

    <!-- Little Feet -->
    <rect x="160" y="426" width="56" height="24" rx="12" fill="#1e40af"/>
    <rect x="296" y="426" width="56" height="24" rx="12" fill="#1e40af"/>
  </svg>`;
}

const outDir = path.join(__dirname, '.iconwork');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'mascot-A.svg'), getSvgA(512));
fs.writeFileSync(path.join(outDir, 'mascot-B.svg'), getSvgB(512));
fs.writeFileSync(path.join(outDir, 'mascot-C.svg'), getSvgC(512));
fs.writeFileSync(path.join(outDir, 'mascot-D.svg'), getSvgD(512));
console.log('SVGs generated successfully');
