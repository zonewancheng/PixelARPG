/**
 * PixelARPG - NPC系统
 * 包含NPC数据和对话功能
 */

// NPC类型定义
window.NPC_TYPES = {
    shaman: {
        id: 'shaman',
        name: '萨满',
        description: '神秘的萨满，守护着这片土地',
        color: '#4A3728',
        size: 48,
        dialogues: [
            {
                id: 'welcome',
                text: '欢迎来到PixelARPG！我是这片土地的守护者。',
                next: 'welcome2'
            },
            {
                id: 'welcome2',
                text: '愿先祖的智慧指引你的道路，年轻的冒险者。',
                next: 'howtoplay'
            },
            {
                id: 'howtoplay',
                text: '使用方向键或WASD移动，点击攻击按钮或按空格攻击。',
                next: 'howtoplay2'
            },
            {
                id: 'howtoplay2',
                text: '击杀怪物获得经验和装备，击败Boss后找到传送阵进入下一关！',
                next: 'tips'
            },
            {
                id: 'tips',
                text: '记得拾取掉落的装备，打开面板查看属性。升级会获得全属性提升和5秒无敌护盾！',
                next: null
            }
        ]
    }
};

// NPC实例列表
window.npcs = [];

/**
 * 创建NPC实例
 * @param {string} type - NPC类型
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 */
window.createNPC = function(type, x, y) {
    const npcType = window.NPC_TYPES[type];
    if (!npcType) return null;
    
    return {
        ...npcType,
        x: x,
        y: y,
        w: npcType.size,
        h: npcType.size,
        dialogueIndex: 0,
        currentDialogue: npcType.dialogues[0]
    };
};

/**
 * 初始化出生点NPC（小猴子和房子）
 * @param {number} playerX - 玩家X坐标
 * @param {number} playerY - 玩家Y坐标
 */
window.initSpawnPoint = function(playerX, playerY) {
    // 清除旧NPC
    window.npcs = [];
    
    // 在玩家右侧创建萨满
    const shaman = window.createNPC('shaman', playerX + 100, playerY);
    if (shaman) {
        window.npcs.push(shaman);
    }
    
    // 发现NPC到图鉴
    if (window.discoveredNPCs) {
        window.discoveredNPCs['shaman'] = true;
    }
};

/**
 * 绘制萨满NPC（画布已偏移，直接使用世界坐标）
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} npc - NPC对象
 */
window.drawNPC = function(ctx, npc) {
    if (!npc) return;
    
    const x = npc.x;
    const y = npc.y;
    const size = npc.size;
    const time = Date.now() / 1000;
    
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x + size/2, y + size + 2, size * 0.35, size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 法杖（左手）
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + 2, y - 15, 4, size + 15);
    // 法杖顶部装饰
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + 4, y - 18, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#87CEEB';
    ctx.beginPath();
    ctx.arc(x + 4, y - 18, 4, 0, Math.PI * 2);
    ctx.fill();
    // 法杖羽毛
    ctx.fillStyle = '#E07020';
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 20);
    ctx.lineTo(x + 16, y - 28);
    ctx.lineTo(x + 10, y - 16);
    ctx.fill();
    
    // 身体（长袍）
    const breathe = Math.sin(time * 2) * 1;
    const robeGrad = ctx.createLinearGradient(x, y + size * 0.2, x, y + size);
    robeGrad.addColorStop(0, '#3D2817');
    robeGrad.addColorStop(0.5, '#4A3728');
    robeGrad.addColorStop(1, '#2D1810');
    ctx.fillStyle = robeGrad;
    ctx.beginPath();
    ctx.moveTo(x + size * 0.3, y + size * 0.25);
    ctx.quadraticCurveTo(x + size * 0.1, y + size * 0.5, x + 4, y + size);
    ctx.lineTo(x + size - 4, y + size);
    ctx.quadraticCurveTo(x + size * 0.9, y + size * 0.5, x + size * 0.7, y + size * 0.25);
    ctx.closePath();
    ctx.fill();
    
    // 长袍装饰（神秘符文）
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x + size * 0.35, y + size * 0.5, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + size * 0.65, y + size * 0.5, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.5, y + size * 0.35);
    ctx.lineTo(x + size * 0.5, y + size * 0.65);
    ctx.stroke();
    
    // 腰带
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + size * 0.2, y + size * 0.55, size * 0.6, 4);
    // 腰带装饰
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + size * 0.5, y + size * 0.57, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 头
    ctx.fillStyle = '#DEB887';
    ctx.beginPath();
    ctx.arc(x + size * 0.5, y + size * 0.18 + breathe * 0.3, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
    
    // 头发（白色长发）
    ctx.fillStyle = '#E8E8E8';
    ctx.beginPath();
    ctx.ellipse(x + size * 0.5, y + size * 0.12, size * 0.2, size * 0.12, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // 两侧长发
    ctx.beginPath();
    ctx.moveTo(x + size * 0.28, y + size * 0.1);
    ctx.quadraticCurveTo(x + size * 0.2, y + size * 0.4, x + size * 0.25, y + size * 0.6);
    ctx.lineTo(x + size * 0.32, y + size * 0.6);
    ctx.quadraticCurveTo(x + size * 0.3, y + size * 0.4, x + size * 0.35, y + size * 0.12);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.72, y + size * 0.1);
    ctx.quadraticCurveTo(x + size * 0.8, y + size * 0.4, x + size * 0.75, y + size * 0.6);
    ctx.lineTo(x + size * 0.68, y + size * 0.6);
    ctx.quadraticCurveTo(x + size * 0.7, y + size * 0.4, x + size * 0.65, y + size * 0.12);
    ctx.fill();
    
    // 萨满头饰（羽毛头冠）
    ctx.fillStyle = '#E07020';
    ctx.beginPath();
    ctx.moveTo(x + size * 0.35, y - 8);
    ctx.lineTo(x + size * 0.4, y - 20);
    ctx.lineTo(x + size * 0.45, y - 5);
    ctx.fill();
    ctx.fillStyle = '#20B2AA';
    ctx.beginPath();
    ctx.moveTo(x + size * 0.45, y - 6);
    ctx.lineTo(x + size * 0.5, y - 24);
    ctx.lineTo(x + size * 0.55, y - 6);
    ctx.fill();
    ctx.fillStyle = '#E07020';
    ctx.beginPath();
    ctx.moveTo(x + size * 0.55, y - 5);
    ctx.lineTo(x + size * 0.6, y - 20);
    ctx.lineTo(x + size * 0.65, y - 8);
    ctx.fill();
    
    // 眼睛（神秘感）
    const blinkPhase = Math.floor(time * 0.5) % 5;
    const eyeOpen = blinkPhase !== 0 ? 3 : 0.5;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + size * 0.42, y + size * 0.17, 2, eyeOpen, 0, 0, Math.PI * 2);
    ctx.ellipse(x + size * 0.58, y + size * 0.17, 2, eyeOpen, 0, 0, Math.PI * 2);
    ctx.fill();
    if (eyeOpen > 1) {
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.arc(x + size * 0.42, y + size * 0.17, 1, 0, Math.PI * 2);
        ctx.arc(x + size * 0.58, y + size * 0.17, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 胡须
    ctx.strokeStyle = '#E8E8E8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + size * 0.5, y + size * 0.22);
    ctx.lineTo(x + size * 0.5, y + size * 0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.42, y + size * 0.24);
    ctx.quadraticCurveTo(x + size * 0.38, y + size * 0.32, x + size * 0.35, y + size * 0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.58, y + size * 0.24);
    ctx.quadraticCurveTo(x + size * 0.62, y + size * 0.32, x + size * 0.65, y + size * 0.35);
    ctx.stroke();
    
    // 右手举起（施法姿势）
    ctx.fillStyle = '#DEB887';
    ctx.beginPath();
    ctx.arc(x + size * 0.78, y + size * 0.35, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 手中发光的法球
    const glowSize = 8 + Math.sin(time * 3) * 2;
    const glowGrad = ctx.createRadialGradient(x + size * 0.78, y + size * 0.32, 0, x + size * 0.78, y + size * 0.32, glowSize);
    glowGrad.addColorStop(0, 'rgba(135, 206, 250, 0.9)');
    glowGrad.addColorStop(0.5, 'rgba(70, 130, 180, 0.5)');
    glowGrad.addColorStop(1, 'rgba(70, 130, 180, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(x + size * 0.78, y + size * 0.32, glowSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#87CEEB';
    ctx.beginPath();
    ctx.arc(x + size * 0.78, y + size * 0.32, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 名字
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 2;
    ctx.fillText(npc.name, x + size/2, y - 28);
    ctx.shadowBlur = 0;
    
    // 交互提示
    ctx.font = '10px Arial';
    ctx.fillStyle = '#ff0';
    ctx.fillText('点击对话', x + size/2, y + size + 15);
};

/**
 * 绘制3层竹楼（画布已偏移，直接使用世界坐标）
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - 房子X坐标
 * @param {number} y - 房子Y坐标（1层底部）
 */
window.drawHouse = function(ctx, x, y) {
    const w = 80;
    const floorH = 48;
    const h = floorH * 3 + 20;
    const time = Date.now() / 1000;
    
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + 5, w * 0.55, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 竹子颜色
    const bambooLight = '#D4B896';
    const bambooMid = '#C4A876';
    const bambooDark = '#8B7355';
    const bambooShadow = '#6B5344';
    
    // ===== 1层（猴子所在层）=====
    const floor1Y = y - floorH;
    
    // 1层地板
    ctx.fillStyle = bambooMid;
    ctx.fillRect(x - 5, floor1Y, w + 10, 8);
    // 地板纹理
    ctx.strokeStyle = bambooShadow;
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 14, floor1Y);
        ctx.lineTo(x + i * 14, floor1Y + 8);
        ctx.stroke();
    }
    
    // 1层栏杆
    ctx.fillStyle = bambooLight;
    ctx.fillRect(x - 8, floor1Y + 8, 6, floorH - 16);
    ctx.fillRect(x + w + 2, floor1Y + 8, 6, floorH - 16);
    // 栏杆横杆
    ctx.fillStyle = bambooMid;
    ctx.fillRect(x - 8, floor1Y + 12, w + 16, 4);
    ctx.fillRect(x - 8, floor1Y + floorH - 20, w + 16, 4);
    // 栏杆竖杆
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(x + 8 + i * 16, floor1Y + 16, 3, floorH - 36);
        ctx.fillRect(x + w - 11 - i * 16, floor1Y + 16, 3, floorH - 36);
    }
    
    // ===== 2层 =====
    const floor2Y = floor1Y - floorH;
    
    // 2层地板
    ctx.fillStyle = bambooMid;
    ctx.fillRect(x, floor2Y, w, 6);
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 16, floor2Y);
        ctx.lineTo(x + i * 16, floor2Y + 6);
        ctx.stroke();
    }
    
    // 2层栏杆
    ctx.fillStyle = bambooLight;
    ctx.fillRect(x - 6, floor2Y + 6, 5, floorH - 12);
    ctx.fillRect(x + w + 1, floor2Y + 6, 5, floorH - 12);
    // 栏杆横杆
    ctx.fillStyle = bambooMid;
    ctx.fillRect(x - 6, floor2Y + 10, w + 12, 3);
    ctx.fillRect(x - 6, floor2Y + floorH - 15, w + 12, 3);
    // 栏杆竖杆
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(x + 6 + i * 18, floor2Y + 13, 2, floorH - 28);
        ctx.fillRect(x + w - 8 - i * 18, floor2Y + 13, 2, floorH - 28);
    }
    
    // ===== 3层（顶层）=====
    const floor3Y = floor2Y - floorH;
    
    // 3层地板
    ctx.fillStyle = bambooMid;
    ctx.fillRect(x + 4, floor3Y, w - 8, 5);
    
    // 3层栏杆
    ctx.fillStyle = bambooLight;
    ctx.fillRect(x - 2, floor3Y + 5, 4, floorH - 10);
    ctx.fillRect(x + w - 2, floor3Y + 5, 4, floorH - 10);
    // 栏杆横杆
    ctx.fillStyle = bambooMid;
    ctx.fillRect(x - 2, floor3Y + 8, w + 4, 3);
    ctx.fillRect(x - 2, floor3Y + floorH - 12, w + 4, 3);
    // 栏杆竖杆
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 4 + i * 24, floor3Y + 11, 2, floorH - 24);
        ctx.fillRect(x + w - 6 - i * 24, floor3Y + 11, 2, floorH - 24);
    }
    
    // ===== 茅草屋顶 =====
    const roofY = floor3Y - floorH;
    
    // 屋顶主体
    ctx.fillStyle = '#8B7355';
    ctx.beginPath();
    ctx.moveTo(x - 12, roofY + floorH * 0.7);
    ctx.lineTo(x + w/2, roofY - 5);
    ctx.lineTo(x + w + 12, roofY + floorH * 0.7);
    ctx.closePath();
    ctx.fill();
    
    // 茅草层
    ctx.fillStyle = '#A08060';
    for (let layer = 0; layer < 4; layer++) {
        const layerY = roofY + 5 + layer * 10;
        ctx.beginPath();
        ctx.moveTo(x - 10 + layer * 3, layerY + 15);
        ctx.lineTo(x + w/2, layerY - layer * 2);
        ctx.lineTo(x + w + 10 - layer * 3, layerY + 15);
        ctx.closePath();
        ctx.fill();
    }
    
    // 茅草纹理
    ctx.strokeStyle = '#6B5344';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
        const startX = x + 10 + i * 8;
        ctx.beginPath();
        ctx.moveTo(startX, roofY + 15 + (i % 2) * 5);
        ctx.lineTo(startX + (i < 4 ? -3 : 3), roofY + 5);
        ctx.stroke();
    }
    
    // ===== 装饰 =====
    // 1层灯笼
    const lanternSway = Math.sin(time * 2) * 2;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 5 + lanternSway * 0.5, floor1Y + 20, 3, 8);
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.ellipse(x - 3.5 + lanternSway * 0.5, floor1Y + 35, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD700';
    ctx.font = '5px serif';
    ctx.textAlign = 'center';
    ctx.fillText('福', x - 3.5 + lanternSway * 0.5, floor1Y + 37);
    
    // 2层灯笼
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 3 - lanternSway * 0.3, floor2Y + 18, 2, 6);
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.ellipse(x - 2 - lanternSway * 0.3, floor2Y + 30, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 竹子支撑柱
    ctx.fillStyle = bambooDark;
    ctx.fillRect(x - 10, y - 10, 8, 12);
    ctx.fillRect(x + w + 2, y - 10, 8, 12);
};

// 已发现的NPC（图鉴用）
window.discoveredNPCs = window.discoveredNPCs || {};

// 当前对话状态
window.currentDialogueNpc = null;
window.currentDialogueIndex = 0;
window.dialogueOpen = false;
window.dialogueTyping = false;
window.dialogueTypeTimer = null;

/**
 * 显示对话面板
 * @param {Object} npc - NPC对象
 */
window.showDialogue = function(npc) {
    if (!npc || !npc.dialogues) return;
    
    window.currentDialogueNpc = npc;
    window.currentDialogueIndex = 0;
    window.dialogueTyping = false;
    
    const panel = document.getElementById('dialogue-panel');
    const nameEl = document.getElementById('dialogue-npc-name');
    
    if (!panel) return;
    
    nameEl.textContent = npc.name;
    
    // 绘制萨满头像
    const avatarCanvas = document.getElementById('dialogue-npc-avatar');
    if (avatarCanvas) {
        const actx = avatarCanvas.getContext('2d');
        actx.clearRect(0, 0, 64, 80);
        
        // 背景圆
        actx.fillStyle = 'rgba(74, 55, 40, 0.5)';
        actx.beginPath();
        actx.arc(32, 40, 30, 0, Math.PI * 2);
        actx.fill();
        
        // 长袍
        actx.fillStyle = '#3D2817';
        actx.beginPath();
        actx.moveTo(18, 45);
        actx.lineTo(10, 80);
        actx.lineTo(54, 80);
        actx.lineTo(46, 45);
        actx.closePath();
        actx.fill();
        
        // 腰带
        actx.fillStyle = '#8B4513';
        actx.fillRect(16, 58, 32, 4);
        actx.fillStyle = '#FFD700';
        actx.beginPath();
        actx.arc(32, 60, 3, 0, Math.PI * 2);
        actx.fill();
        
        // 符文装饰
        actx.strokeStyle = '#FFD700';
        actx.lineWidth = 0.8;
        actx.beginPath();
        actx.arc(24, 52, 3, 0, Math.PI * 2);
        actx.stroke();
        actx.beginPath();
        actx.arc(40, 52, 3, 0, Math.PI * 2);
        actx.stroke();
        
        // 头
        actx.fillStyle = '#DEB887';
        actx.beginPath();
        actx.arc(32, 30, 13, 0, Math.PI * 2);
        actx.fill();
        
        // 白发
        actx.fillStyle = '#E8E8E8';
        actx.beginPath();
        actx.ellipse(32, 22, 14, 8, 0, Math.PI, Math.PI * 2);
        actx.fill();
        // 侧发
        actx.beginPath();
        actx.moveTo(18, 24);
        actx.quadraticCurveTo(13, 40, 16, 55);
        actx.lineTo(22, 55);
        actx.quadraticCurveTo(20, 40, 23, 27);
        actx.fill();
        actx.beginPath();
        actx.moveTo(46, 24);
        actx.quadraticCurveTo(51, 40, 48, 55);
        actx.lineTo(42, 55);
        actx.quadraticCurveTo(44, 40, 41, 27);
        actx.fill();
        
        // 头冠羽毛
        actx.fillStyle = '#E07020';
        actx.beginPath();
        actx.moveTo(20, 16);
        actx.lineTo(23, 2);
        actx.lineTo(26, 14);
        actx.fill();
        actx.fillStyle = '#20B2AA';
        actx.beginPath();
        actx.moveTo(28, 14);
        actx.lineTo(32, 0);
        actx.lineTo(36, 14);
        actx.fill();
        actx.fillStyle = '#E07020';
        actx.beginPath();
        actx.moveTo(38, 14);
        actx.lineTo(41, 2);
        actx.lineTo(44, 16);
        actx.fill();
        
        // 眼睛
        actx.fillStyle = '#000';
        actx.beginPath();
        actx.arc(26, 30, 2.5, 0, Math.PI * 2);
        actx.arc(38, 30, 2.5, 0, Math.PI * 2);
        actx.fill();
        actx.fillStyle = '#87CEEB';
        actx.beginPath();
        actx.arc(26, 30, 1.2, 0, Math.PI * 2);
        actx.arc(38, 30, 1.2, 0, Math.PI * 2);
        actx.fill();
        
        // 胡须
        actx.strokeStyle = '#E8E8E8';
        actx.lineWidth = 1.2;
        actx.beginPath();
        actx.moveTo(32, 35);
        actx.lineTo(32, 44);
        actx.stroke();
        actx.beginPath();
        actx.moveTo(26, 36);
        actx.quadraticCurveTo(22, 40, 20, 44);
        actx.stroke();
        actx.beginPath();
        actx.moveTo(38, 36);
        actx.quadraticCurveTo(42, 40, 44, 44);
        actx.stroke();
    }
    
    window.renderDialogueContent();
    panel.style.display = 'block';
    window.dialogueOpen = true;
};

/**
 * 渲染对话内容
 */
window.renderDialogueContent = function() {
    const npc = window.currentDialogueNpc;
    if (!npc) return;
    
    const dialogue = npc.dialogues[window.currentDialogueIndex];
    if (!dialogue) return;
    
    const textEl = document.getElementById('dialogue-text');
    const hintEl = document.getElementById('dialogue-hint');
    
    // 清除之前的打字效果
    if (window.dialogueTypeTimer) {
        clearInterval(window.dialogueTypeTimer);
    }
    
    // 打字机效果
    const text = dialogue.text;
    textEl.textContent = '';
    let charIndex = 0;
    window.dialogueTyping = true;
    
    window.dialogueTypeTimer = setInterval(() => {
        if (charIndex < text.length) {
            textEl.textContent += text[charIndex];
            charIndex++;
        } else {
            clearInterval(window.dialogueTypeTimer);
            window.dialogueTyping = false;
            window.dialogueTypeTimer = null;
        }
    }, 25);
    
    // 显示提示
    hintEl.textContent = '点击/空格继续';
};

/**
 * 继续对话（空格键/点击调用）
 */
window.continueDialogue = function() {
    const npc = window.currentDialogueNpc;
    if (!npc) return;
    
    const dialogue = npc.dialogues[window.currentDialogueIndex];
    if (!dialogue) return;
    
    // 如果正在打字，立即显示全部文字
    if (window.dialogueTyping) {
        if (window.dialogueTypeTimer) {
            clearInterval(window.dialogueTypeTimer);
            window.dialogueTypeTimer = null;
        }
        const textEl = document.getElementById('dialogue-text');
        textEl.textContent = dialogue.text;
        window.dialogueTyping = false;
        return;
    }
    
    // 继续下一段或结束
    if (dialogue.next) {
        const nextIdx = npc.dialogues.findIndex(d => d.id === dialogue.next);
        if (nextIdx >= 0) {
            window.currentDialogueIndex = nextIdx;
            window.renderDialogueContent();
        }
    } else {
        window.closeDialogue();
    }
};

/**
 * 关闭对话面板
 */
window.closeDialogue = function() {
    const panel = document.getElementById('dialogue-panel');
    if (panel) {
        panel.style.display = 'none';
    }
    window.currentDialogueNpc = null;
    window.currentDialogueIndex = 0;
    window.dialogueOpen = false;
    window.dialogueTyping = false;
    if (window.dialogueTypeTimer) {
        clearInterval(window.dialogueTypeTimer);
        window.dialogueTypeTimer = null;
    }
};

/**
 * 初始化对话面板事件
 */
window.initDialoguePanel = function() {
    const panel = document.getElementById('dialogue-panel');
    const contentArea = document.getElementById('dialogue-content-area');
    const closeBtn = document.getElementById('dialogue-close-btn');
    
    if (!panel) return;
    
    // 关闭按钮
    if (closeBtn) {
        closeBtn.onclick = () => {
            window.closeDialogue();
        };
    }
    
    // 点击内容区域继续对话
    if (contentArea) {
        contentArea.onclick = () => {
            window.continueDialogue();
        };
    }
    
    // 空格键继续对话，ESC关闭
    document.addEventListener('keydown', (e) => {
        if (panel.style.display !== 'block') return;
        
        if (e.key === ' ') {
            e.preventDefault();
            window.continueDialogue();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            window.closeDialogue();
        }
    });
};

// 玩家是否正在走向NPC
window.playerWalkingToNPC = false;
window.targetNPC = null;

/**
 * 玩家走向NPC并对话
 * @param {Object} npc - NPC对象
 */
window.walkToNPCAndTalk = function(npc) {
    if (!npc || !window.player) return;
    
    const player = window.player;
    const npcCenterX = npc.x + npc.size / 2;
    const npcCenterY = npc.y + npc.size / 2;
    const playerCenterX = player.x + player.w / 2;
    const playerCenterY = player.y + player.h / 2;
    
    const dx = npcCenterX - playerCenterX;
    const dy = npcCenterY - playerCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // 如果距离足够近（2.5格），直接对话
    const talkRange = window.TILE * 2.5;
    if (dist <= talkRange) {
        window.showDialogue(npc);
        return;
    }
    
    // 否则设置目标，让玩家走过去
    window.targetNPC = npc;
    window.playerWalkingToNPC = true;
};

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof window.initDialoguePanel === 'function') {
            window.initDialoguePanel();
        }
    }, 400);
});

/**
 * 检查点击是否在NPC范围内
 * @param {number} screenX - 屏幕X坐标
 * @param {number} screenY - 屏幕Y坐标
 * @param {number} camX - 摄像机X
 * @param {number} camY - 摄像机Y
 * @returns {Object|null} - NPC对象或null
 */
window.getNPCAtClick = function(screenX, screenY, camX, camY) {
    if (!window.npcs) return null;
    
    for (const npc of window.npcs) {
        const size = npc.size || 24;
        
        // 将NPC世界坐标转换为屏幕坐标
        const npcScreenX = npc.x - camX;
        const npcScreenY = npc.y - camY;
        
        // 扩大点击区域
        const hitArea = size * 2;
        
        // 检查点击是否在NPC范围内
        if (screenX >= npcScreenX - hitArea/2 && screenX <= npcScreenX + size + hitArea/2 &&
            screenY >= npcScreenY - hitArea/2 && screenY <= npcScreenY + size + hitArea/2) {
            return npc;
        }
    }
    return null;
};
