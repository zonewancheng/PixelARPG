/**
 * PixelARPG - 敌人数据模块
 * 定义怪物和Boss的类型、数据和生成函数
 */

// 普通怪物类型
window.ENEMY_TYPES = [
    { name: '史莱姆', type: 'slime', hp: 15, atk: 3, def: 0, exp: 5, gold: 3, color: '#5f5', render: 'slime' },
    { name: '哥布林', type: 'goblin', hp: 25, atk: 5, def: 1, exp: 8, gold: 5, color: '#6f6', render: 'goblin' },
    { name: '蝙蝠', type: 'bat', hp: 10, atk: 4, def: 0, exp: 6, gold: 4, color: '#77b', render: 'bat' },
    { name: '蜘蛛', type: 'spider', hp: 20, atk: 6, def: 1, exp: 7, gold: 5, color: '#666', render: 'spider' },
    { name: '骷髅', type: 'skeleton', hp: 30, atk: 8, def: 2, exp: 12, gold: 8, color: '#eee', render: 'skeleton' },
    { name: '狼', type: 'wolf', hp: 25, atk: 10, def: 1, exp: 10, gold: 7, color: '#a75', render: 'wolf' },
    { name: '蛇', type: 'snake', hp: 18, atk: 7, def: 0, exp: 8, gold: 5, color: '#4f4', render: 'snake' },
    { name: '蝎子', type: 'scorpion', hp: 22, atk: 9, def: 2, exp: 9, gold: 6, color: '#a63', render: 'scorpion' }
];

// 兼容旧版本
window.enemyTypes = window.ENEMY_TYPES;

// Boss怪物类型
window.BOSS_TYPES = [
    { name: '史莱姆王', type: 'slime_king', hp: 80, atk: 12, def: 2, exp: 40, gold: 80, color: '#7f7', size: 40, render: 'boss_slime', skills: ['ice'] },
    { name: '哥布林领主', type: 'goblin_lord', hp: 120, atk: 18, def: 4, exp: 60, gold: 120, color: '#6f6', size: 36, render: 'boss_goblin', skills: ['vine'] },
    { name: '兽人统领', type: 'orc_king', hp: 180, atk: 25, def: 8, exp: 100, gold: 180, color: '#6f6', size: 44, render: 'boss_orc', skills: ['tornado'] },
    { name: '黑暗法师', type: 'dark_mage', hp: 150, atk: 35, def: 5, exp: 150, gold: 250, color: '#a7a', size: 32, render: 'boss_mage', skills: ['thunder', 'fireball'] },
    { name: '火龙', type: 'fire_dragon', hp: 300, atk: 40, def: 15, exp: 300, gold: 500, color: '#d55', size: 56, render: 'boss_dragon', skills: ['fireball', 'tornado'] },
    { name: '冰魔', type: 'ice_devil', hp: 350, atk: 45, def: 18, exp: 400, gold: 600, color: '#ccf', size: 48, render: 'boss_ice', skills: ['ice', 'thunder'] },
    { name: '恶魔领主', type: 'demon_lord', hp: 500, atk: 60, def: 25, exp: 600, gold: 1000, color: '#d6d', size: 52, render: 'boss_demon', skills: ['fireball', 'thunder', 'ice'] }
];

// 兼容旧版本
window.bossTypes = window.BOSS_TYPES;

// 怪物移动模式
window.ENEMY_MOVEMENT_PATTERNS = ['random', 'patrol', 'chase', 'flee', 'stationary'];

/**
 * 根据类型获取怪物数据
 * @param {string} type - 怪物类型
 * @returns {Object} 怪物数据
 */
window.getEnemyByType = function(type) {
    return window.ENEMY_TYPES.find(e => e.type === type);
};

/**
 * 根据类型获取Boss数据
 * @param {string} type - Boss类型
 * @returns {Object} Boss数据
 */
window.getBossByType = function(type) {
    return window.BOSS_TYPES.find(b => b.type === type);
};

/**
 * 根据怪物类型创建实例
 * @param {Object} enemyType - 怪物基础数据
 * @param {number} level - 怪物等级
 * @returns {Object} 怪物实例
 */
window.createEnemyFromType = function(enemyType, level = 1) {
    const mult = 1 + level * 0.15;
    return {
        ...enemyType,
        hp: Math.floor(enemyType.hp * mult),
        maxHp: Math.floor(enemyType.hp * mult),
        atk: Math.floor(enemyType.atk * mult),
        def: Math.floor(enemyType.def * mult),
        level: level,
        movement: window.ENEMY_MOVEMENT_PATTERNS[Math.floor(Math.random() * 4)]
    };
};

/**
 * 发现敌人（击杀时记录到图鉴）
 * @param {string} type - 怪物类型
 * @param {string} name - 怪物名称
 */
window.discoverEnemy = function(type, name) {
    if (!window.discoveredEnemies) window.discoveredEnemies = {};
    if (!window.discoveredEnemies[type]) {
        window.discoveredEnemies[type] = { name: name, count: 0 };
    }
    window.discoveredEnemies[type].count++;
    window.discoveredEnemies[type].name = name;
};

window.discoverSkill = function(skillId) {
    if (!window.discoveredSkills) window.discoveredSkills = {};
    if (!window.discoveredSkills[skillId]) {
        window.discoveredSkills[skillId] = true;
    }
};

window.discoverItem = function(itemId) {
    if (!window.discoveredItems) window.discoveredItems = {};
    if (!window.discoveredItems[itemId]) {
        window.discoveredItems[itemId] = true;
    }
};

/**
 * 渲染怪物图标（与游戏渲染一致）
 */
window.renderEnemyIcon = function(enemyType, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const color = enemyType.color || '#5f5';
    const w = size;
    const h = size;
    const x = 0;
    const y = 0;
    const cx = x + w / 2;
    const cy = y + h / 2;
    
    const renderType = enemyType.render || enemyType.type;
    
    // Boss 渲染 - 精美像素设计
    if (renderType.startsWith('boss_')) {
        if (renderType === 'boss_slime') {
            // 史莱姆王 - 巨型果冻状，带皇冠和滴落效果
            const time = Date.now() / 500;
            const bounce = Math.sin(time) * 3;
            
            // 底部阴影
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(cx, y + h*0.9, w*0.4, h*0.08, 0, 0, Math.PI*2);
            ctx.fill();
            
            // 主体 - 波浪边缘
            ctx.fillStyle = color;
            ctx.beginPath();
            for(let i=0; i<20; i++) {
                const angle = (i/20) * Math.PI * 2;
                const r = w*0.35 + Math.sin(angle*5 + time) * 3;
                const px = cx + Math.cos(angle) * r;
                const py = y + h*0.45 + Math.sin(angle) * r * 0.6 + bounce;
                if(i===0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            
            // 内部高光
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.ellipse(cx - w*0.1, y + h*0.35 + bounce, w*0.15, h*0.1, -0.3, 0, Math.PI*2);
            ctx.fill();
            
            // 眼睛
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(cx - w*0.12, y + h*0.4 + bounce, w*0.08, 0, Math.PI*2);
            ctx.arc(cx + w*0.12, y + h*0.4 + bounce, w*0.08, 0, Math.PI*2);
            ctx.fill();
            
            // 眼睛高光
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(cx - w*0.1, y + h*0.38 + bounce, w*0.03, 0, Math.PI*2);
            ctx.arc(cx + w*0.14, y + h*0.38 + bounce, w*0.03, 0, Math.PI*2);
            ctx.fill();
            
            // 皇冠
            ctx.fillStyle = '#fd4';
            ctx.beginPath();
            ctx.moveTo(cx - w*0.2, y + h*0.2 + bounce);
            ctx.lineTo(cx - w*0.15, y + h*0.05 + bounce);
            ctx.lineTo(cx - w*0.05, y + h*0.15 + bounce);
            ctx.lineTo(cx, y + h*0.02 + bounce);
            ctx.lineTo(cx + w*0.05, y + h*0.15 + bounce);
            ctx.lineTo(cx + w*0.15, y + h*0.05 + bounce);
            ctx.lineTo(cx + w*0.2, y + h*0.2 + bounce);
            ctx.closePath();
            ctx.fill();
            
            // 宝石
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.12 + bounce, w*0.04, 0, Math.PI*2);
            ctx.fill();
            
        } else if (renderType === 'boss_goblin') {
            // 哥布林领主 - 带呼吸、角抖动、手臂摆动
            const time = Date.now() / 500;
            const breathe = Math.sin(time) * 2;
            const hornTwitch = Math.sin(time * 2) * 1;
            const armSwing = Math.sin(time * 0.7) * 3;
            
            // 身体 - 呼吸动画
            ctx.fillStyle = color;
            const bodyY = y + h*0.35 - breathe*0.2;
            ctx.fillRect(x + w*0.25, bodyY, w*0.5, h*0.45 + breathe*0.3);
            
            // 盔甲 - 随呼吸移动
            ctx.fillStyle = '#654';
            ctx.fillRect(x + w*0.2, bodyY + h*0.05, w*0.6, h*0.15);
            ctx.fillStyle = '#876';
            ctx.fillRect(x + w*0.3, bodyY + h*0.07, w*0.4, h*0.1);
            // 盔甲铆钉
            ctx.fillStyle = '#a98';
            ctx.beginPath();
            ctx.arc(x + w*0.25, bodyY + h*0.12, w*0.02, 0, Math.PI*2);
            ctx.arc(x + w*0.5, bodyY + h*0.12, w*0.02, 0, Math.PI*2);
            ctx.arc(x + w*0.75, bodyY + h*0.12, w*0.02, 0, Math.PI*2);
            ctx.fill();
            
            // 头部 - 摇摆
            const headX = cx + Math.sin(time * 0.5) * 1;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(headX, y + h*0.25 + breathe*0.1, w*0.22, 0, Math.PI*2);
            ctx.fill();
            
            // 尖耳朵 - 抖动
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(headX - w*0.12, y + h*0.25 + breathe*0.1);
            ctx.lineTo(x + w*0.02, y + h*0.15 + hornTwitch);
            ctx.lineTo(headX - w*0.07, y + h*0.2 + breathe*0.1);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(headX + w*0.12, y + h*0.25 + breathe*0.1);
            ctx.lineTo(x + w*0.98, y + h*0.15 - hornTwitch);
            ctx.lineTo(headX + w*0.07, y + h*0.2 + breathe*0.1);
            ctx.closePath();
            ctx.fill();
            
            // 角 - 抖动动画
            ctx.fillStyle = '#cba';
            ctx.beginPath();
            ctx.moveTo(headX - w*0.02, y + h*0.15 + breathe*0.1);
            ctx.lineTo(x + w*0.2 + hornTwitch, y + h*0.02);
            ctx.lineTo(headX + w*0.06, y + h*0.1 + breathe*0.1);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(headX + w*0.02, y + h*0.15 + breathe*0.1);
            ctx.lineTo(x + w*0.8 - hornTwitch, y + h*0.02);
            ctx.lineTo(headX - w*0.06, y + h*0.1 + breathe*0.1);
            ctx.closePath();
            ctx.fill();
            
            // 眼睛 - 发光
            ctx.fillStyle = '#f00';
            ctx.shadowColor = '#f00';
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.arc(headX - w*0.08, y + h*0.25 + breathe*0.1, w*0.06, 0, Math.PI*2);
            ctx.arc(headX + w*0.08, y + h*0.25 + breathe*0.1, w*0.06, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(headX - w*0.07, y + h*0.24 + breathe*0.1, w*0.02, 0, Math.PI*2);
            ctx.arc(headX + w*0.07, y + h*0.24 + breathe*0.1, w*0.02, 0, Math.PI*2);
            ctx.fill();
            
            // 尖牙
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(headX - w*0.03, y + h*0.35 + breathe*0.1);
            ctx.lineTo(headX, y + h*0.42 + breathe*0.1);
            ctx.lineTo(headX + w*0.03, y + h*0.35 + breathe*0.1);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(headX + w*0.02, y + h*0.35 + breathe*0.1);
            ctx.lineTo(headX + w*0.05, y + h*0.42 + breathe*0.1);
            ctx.lineTo(headX + w*0.08, y + h*0.35 + breathe*0.1);
            ctx.fill();
            
            // 手臂 - 摆动
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.12 + armSwing, bodyY + h*0.2, w*0.12, h*0.3);
            ctx.fillRect(x + w*0.76 - armSwing, bodyY + h*0.2, w*0.12, h*0.3);
            
            // 武器 - 巨斧
            ctx.fillStyle = '#888';
            ctx.save();
            ctx.translate(x + w*0.82 - armSwing, bodyY + h*0.3);
            ctx.rotate(Math.sin(time)*0.2);
            ctx.fillRect(-w*0.03, -h*0.15, w*0.06, h*0.4);
            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.moveTo(-w*0.12, h*0.15);
            ctx.lineTo(w*0.12, h*0.15);
            ctx.lineTo(w*0.08, h*0.35);
            ctx.lineTo(-w*0.08, h*0.35);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // 腿部 - 站立微动
            ctx.fillStyle = color;
            const legMove = Math.sin(time * 1.5) * 0.8;
            ctx.fillRect(x + w*0.2 + legMove, y + h*0.75 + breathe*0.2, w*0.15, h*0.2);
            ctx.fillRect(x + w*0.65 - legMove, y + h*0.75 + breathe*0.2, w*0.15, h*0.2);
            // 鞋子
            ctx.fillStyle = '#432';
            ctx.fillRect(x + w*0.18 + legMove, y + h*0.88 + breathe*0.2, w*0.2, h*0.1);
            ctx.fillRect(x + w*0.62 - legMove, y + h*0.88 + breathe*0.2, w*0.2, h*0.1);
            
        } else if (renderType === 'boss_orc') {
            // Orc王 - 强壮，带呼吸、肌肉起伏和战斧摆动
            const time = Date.now() / 600;
            const breathe = Math.sin(time) * 2.5;
            const chestExpand = Math.sin(time * 0.8) * 3;
            const armSway = Math.sin(time * 0.6) * 4;
            
            // 宽厚的身体 - 呼吸时胸部扩张
            ctx.fillStyle = color;
            const chestW = w*0.75 + chestExpand;
            const chestX = x + w*0.5 - chestW/2;
            ctx.beginPath();
            ctx.moveTo(chestX + chestW*0.05, y + h*0.35 + breathe);
            ctx.lineTo(chestX, y + h*0.8 + breathe*0.5);
            ctx.lineTo(chestX + chestW, y + h*0.8 + breathe*0.5);
            ctx.lineTo(chestX + chestW*0.95, y + h*0.35 + breathe);
            ctx.closePath();
            ctx.fill();
            
            // 腹肌线条 - 随呼吸移动
            ctx.strokeStyle = '#363';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(chestX + chestW*0.25, y + h*0.5 + breathe*0.8);
            ctx.lineTo(chestX + chestW*0.25, y + h*0.7 + breathe*0.6);
            ctx.moveTo(x + w*0.5, y + h*0.48 + breathe*0.8);
            ctx.lineTo(x + w*0.5, y + h*0.72 + breathe*0.6);
            ctx.moveTo(chestX + chestW*0.75, y + h*0.5 + breathe*0.8);
            ctx.lineTo(chestX + chestW*0.75, y + h*0.7 + breathe*0.6);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(chestX + chestW*0.25, y + h*0.58 + breathe*0.7);
            ctx.lineTo(chestX + chestW*0.75, y + h*0.58 + breathe*0.7);
            ctx.moveTo(chestX + chestW*0.25, y + h*0.68 + breathe*0.6);
            ctx.lineTo(chestX + chestW*0.75, y + h*0.68 + breathe*0.6);
            ctx.stroke();
            
            // 头部 - 随呼吸轻微移动
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, y + h*0.25 + breathe*0.3, w*0.25, 0, Math.PI*2);
            ctx.fill();
            
            // 头盔
            ctx.fillStyle = '#444';
            ctx.fillRect(x + w*0.25, y + h*0.08 + breathe*0.3, w*0.5, h*0.12);
            ctx.fillStyle = '#666';
            ctx.fillRect(x + w*0.3, y + h*0.1 + breathe*0.3, w*0.4, h*0.06);
            // 头盔尖刺
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.moveTo(x + w*0.5, y + h*0.08 + breathe*0.3);
            ctx.lineTo(x + w*0.45, y + h*0.02 + breathe*0.3);
            ctx.lineTo(x + w*0.55, y + h*0.02 + breathe*0.3);
            ctx.closePath();
            ctx.fill();
            
            // 眼睛 - 发光
            ctx.fillStyle = '#f00';
            ctx.shadowColor = '#f00';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(x + w*0.4, y + h*0.28 + breathe*0.3, w*0.05, 0, Math.PI*2);
            ctx.arc(x + w*0.6, y + h*0.28 + breathe*0.3, w*0.05, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(x + w*0.4, y + h*0.28 + breathe*0.3, w*0.025, 0, Math.PI*2);
            ctx.arc(x + w*0.6, y + h*0.28 + breathe*0.3, w*0.025, 0, Math.PI*2);
            ctx.fill();
            
            // 獠牙 - 随头部移动
            ctx.fillStyle = '#ffe';
            ctx.beginPath();
            ctx.moveTo(x + w*0.42, y + h*0.38 + breathe*0.3);
            ctx.lineTo(x + w*0.45, y + h*0.5 + breathe*0.3);
            ctx.lineTo(x + w*0.48, y + h*0.38 + breathe*0.3);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.52, y + h*0.38 + breathe*0.3);
            ctx.lineTo(x + w*0.55, y + h*0.5 + breathe*0.3);
            ctx.lineTo(x + w*0.58, y + h*0.38 + breathe*0.3);
            ctx.fill();
            
            // 手臂肌肉 - 摆动
            ctx.fillStyle = color;
            ctx.save();
            ctx.translate(x + w*0.12, y + h*0.45 + breathe*0.5);
            ctx.rotate(-0.3 + armSway*0.02);
            ctx.beginPath();
            ctx.ellipse(0, 0, w*0.1, h*0.18, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
            
            ctx.save();
            ctx.translate(x + w*0.88, y + h*0.45 + breathe*0.5);
            ctx.rotate(0.3 - armSway*0.02);
            ctx.beginPath();
            ctx.ellipse(0, 0, w*0.1, h*0.18, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
            
            // 战斧 - 巨大武器摆动
            ctx.save();
            ctx.translate(x + w*0.88 + armSway, y + h*0.5 + breathe*0.5);
            ctx.rotate(Math.sin(time*0.8)*0.15);
            // 斧柄
            ctx.fillStyle = '#543';
            ctx.fillRect(-w*0.04, -h*0.2, w*0.08, h*0.5);
            // 斧刃
            ctx.fillStyle = '#888';
            ctx.beginPath();
            ctx.moveTo(-w*0.04, -h*0.2);
            ctx.lineTo(w*0.15, -h*0.35);
            ctx.lineTo(w*0.2, -h*0.15);
            ctx.lineTo(w*0.15, h*0.05);
            ctx.lineTo(-w*0.04, h*0.1);
            ctx.closePath();
            ctx.fill();
            // 斧刃高光
            ctx.fillStyle = '#aaa';
            ctx.beginPath();
            ctx.moveTo(0, -h*0.2);
            ctx.lineTo(w*0.12, -h*0.3);
            ctx.lineTo(w*0.15, -h*0.15);
            ctx.lineTo(w*0.1, h*0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // 腿部 - 站立微动
            ctx.fillStyle = color;
            const legMove = Math.sin(time) * 1;
            ctx.fillRect(x + w*0.25 + legMove, y + h*0.78 + breathe*0.3, w*0.18, h*0.18);
            ctx.fillRect(x + w*0.57 - legMove, y + h*0.78 + breathe*0.3, w*0.18, h*0.18);
            // 护腿
            ctx.fillStyle = '#333';
            ctx.fillRect(x + w*0.23 + legMove, y + h*0.85 + breathe*0.3, w*0.22, h*0.12);
            ctx.fillRect(x + w*0.55 - legMove, y + h*0.85 + breathe*0.3, w*0.22, h*0.12);
            
        } else if (renderType === 'boss_mage') {
            // 黑暗法师 - 带漂浮动画、法杖发光脉动、符文旋转
            const time = Date.now() / 600;
            const floatY = Math.sin(time) * 3;
            const staffGlow = 5 + Math.sin(time * 2) * 3;
            const runePulse = Math.sin(time * 1.5);
            
            // 袍子 - 随漂浮移动
            ctx.fillStyle = '#424';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.95 + floatY);
            ctx.lineTo(x + w*0.15, y + h*0.4 + floatY);
            ctx.lineTo(x + w*0.25, y + h*0.25 + floatY);
            ctx.lineTo(x + w*0.75, y + h*0.25 + floatY);
            ctx.lineTo(x + w*0.85, y + h*0.4 + floatY);
            ctx.closePath();
            ctx.fill();
            
            // 袍子纹理 - 流动效果
            ctx.strokeStyle = '#636';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.95 + floatY);
            ctx.lineTo(cx, y + h*0.4 + floatY);
            ctx.stroke();
            // 魔法纹路
            for(let i=0; i<3; i++) {
                ctx.strokeStyle = `rgba(0,255,255,${0.3 + runePulse*0.2})`;
                ctx.beginPath();
                ctx.moveTo(x + w*(0.3 + i*0.2), y + h*(0.5 + i*0.1) + floatY);
                ctx.lineTo(x + w*(0.35 + i*0.15), y + h*(0.55 + i*0.1) + floatY);
                ctx.stroke();
            }
            
            // 兜帽
            ctx.fillStyle = '#313';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.25 + floatY, w*0.22, Math.PI, 0);
            ctx.lineTo(x + w*0.78, y + h*0.4 + floatY);
            ctx.lineTo(x + w*0.22, y + h*0.4 + floatY);
            ctx.closePath();
            ctx.fill();
            
            // 脸部阴影
            ctx.fillStyle = '#212';
            ctx.fillRect(x + w*0.38, y + h*0.32 + floatY, w*0.24, h*0.12);
            
            // 发光的眼睛 - 闪烁
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = staffGlow;
            ctx.fillStyle = '#0ff';
            ctx.beginPath();
            ctx.arc(x + w*0.42, y + h*0.38 + floatY, w*0.04, 0, Math.PI*2);
            ctx.arc(x + w*0.58, y + h*0.38 + floatY, w*0.04, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // 法杖 - 漂浮并旋转
            ctx.save();
            ctx.translate(x + w*0.85, y + h*0.5 + floatY);
            ctx.rotate(Math.sin(time*0.5)*0.05);
            // 法杖柄
            ctx.fillStyle = '#654';
            ctx.fillRect(-w*0.025, -h*0.3, w*0.05, h*0.7);
            // 法杖顶部 - 发光脉动
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = staffGlow;
            ctx.fillStyle = '#0ff';
            ctx.beginPath();
            ctx.arc(0, -h*0.32, w*0.08, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#aff';
            ctx.beginPath();
            ctx.arc(0, -h*0.32, w*0.04, 0, Math.PI*2);
            ctx.fill();
            // 魔法粒子
            ctx.fillStyle = `rgba(0,255,255,${0.5 + runePulse*0.3})`;
            for(let i=0; i<4; i++) {
                const angle = time + i * Math.PI/2;
                ctx.beginPath();
                ctx.arc(Math.cos(angle)*w*0.1, -h*0.32 + Math.sin(angle)*w*0.05, w*0.02, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
            ctx.restore();
            
            // 魔法书 - 翻页效果
            ctx.save();
            ctx.translate(x + w*0.2, y + h*0.6 + floatY);
            ctx.rotate(Math.sin(time*0.3)*0.1);
            ctx.fillStyle = '#432';
            ctx.fillRect(-w*0.1, -h*0.07, w*0.2, h*0.15);
            ctx.fillStyle = '#654';
            ctx.fillRect(-w*0.08, -h*0.05, w*0.16, h*0.11);
            // 旋转符文
            ctx.fillStyle = `rgba(0,255,255,${0.7 + runePulse*0.3})`;
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = 2;
            ctx.fillRect(-w*0.03 + Math.cos(time)*w*0.02, -h*0.03, w*0.02, h*0.06);
            ctx.fillRect(w*0.01 + Math.cos(time + Math.PI)*w*0.02, -h*0.03, w*0.02, h*0.06);
            ctx.shadowBlur = 0;
            ctx.restore();
            
            // 魔法光环 - 脚下旋转
            ctx.strokeStyle = `rgba(0,255,255,${0.2 + runePulse*0.2})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for(let i=0; i<8; i++) {
                const angle = time*0.5 + i * Math.PI/4;
                const r = w*0.15 + Math.sin(time + i)*w*0.02;
                if(i===0) ctx.moveTo(cx + Math.cos(angle)*r, y + h*0.85 + floatY + Math.sin(angle)*w*0.05);
                else ctx.lineTo(cx + Math.cos(angle)*r, y + h*0.85 + floatY + Math.sin(angle)*w*0.05);
            }
            ctx.closePath();
            ctx.stroke();
            
        } else if (renderType === 'boss_dragon') {
            // 火龙 - 带翅膀和龙息
            const time = Date.now() / 300;
            
            // 翅膀
            ctx.fillStyle = '#633';
            // 左翼
            ctx.beginPath();
            ctx.moveTo(x + w*0.35, y + h*0.35);
            ctx.lineTo(x + w*0.05, y + h*0.55 + Math.sin(time)*3);
            ctx.quadraticCurveTo(x + w*0.1, y + h*0.3, x + w*0.25, y + h*0.25);
            ctx.closePath();
            ctx.fill();
            // 右翼
            ctx.beginPath();
            ctx.moveTo(x + w*0.65, y + h*0.35);
            ctx.lineTo(x + w*0.95, y + h*0.55 + Math.cos(time)*3);
            ctx.quadraticCurveTo(x + w*0.9, y + h*0.3, x + w*0.75, y + h*0.25);
            ctx.closePath();
            ctx.fill();
            
            // 身体
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(cx, y + h*0.5, w*0.25, h*0.35, 0, 0, Math.PI*2);
            ctx.fill();
            
            // 腹部鳞片
            ctx.fillStyle = '#a44';
            for(let row=0; row<3; row++) {
                for(let col=0; col<2; col++) {
                    ctx.beginPath();
                    ctx.arc(cx + (col-0.5)*w*0.1, y + h*0.4 + row*h*0.12, w*0.04, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            
            // 龙头
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + w*0.3, y + h*0.25);
            ctx.lineTo(x + w*0.25, y + h*0.45);
            ctx.lineTo(x + w*0.5, y + h*0.5);
            ctx.lineTo(x + w*0.75, y + h*0.45);
            ctx.lineTo(x + w*0.7, y + h*0.25);
            ctx.closePath();
            ctx.fill();
            
            // 龙角
            ctx.fillStyle = '#ca8';
            ctx.beginPath();
            ctx.moveTo(x + w*0.35, y + h*0.22);
            ctx.lineTo(x + w*0.3, y + h*0.05);
            ctx.lineTo(x + w*0.42, y + h*0.18);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.65, y + h*0.22);
            ctx.lineTo(x + w*0.7, y + h*0.05);
            ctx.lineTo(x + w*0.58, y + h*0.18);
            ctx.closePath();
            ctx.fill();
            
            // 眼睛
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.ellipse(x + w*0.4, y + h*0.3, w*0.05, h*0.08, -0.3, 0, Math.PI*2);
            ctx.ellipse(x + w*0.6, y + h*0.3, w*0.05, h*0.08, 0.3, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(x + w*0.4, y + h*0.32, w*0.025, 0, Math.PI*2);
            ctx.arc(x + w*0.6, y + h*0.32, w*0.025, 0, Math.PI*2);
            ctx.fill();
            
            // 龙息（火焰）
            ctx.fillStyle = `rgba(255, ${100 + Math.sin(time*2)*50}, 0, 0.7)`;
            ctx.beginPath();
            ctx.moveTo(x + w*0.45, y + h*0.45);
            ctx.lineTo(x + w*0.2, y + h*0.6 + Math.sin(time*3)*5);
            ctx.lineTo(x + w*0.25, y + h*0.5 + Math.sin(time*3)*3);
            ctx.lineTo(x + w*0.5, y + h*0.48);
            ctx.lineTo(x + w*0.55, y + h*0.5 + Math.sin(time*3)*3);
            ctx.lineTo(x + w*0.6, y + h*0.6 + Math.sin(time*3)*5);
            ctx.closePath();
            ctx.fill();
            
        } else if (renderType === 'boss_ice') {
            // 冰魔 - 水晶形态
            const time = Date.now() / 400;
            
            // 身体 - 冰晶
            ctx.fillStyle = '#8af';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.1);
            ctx.lineTo(x + w*0.75, y + h*0.35);
            ctx.lineTo(x + w*0.65, y + h*0.7);
            ctx.lineTo(cx, y + h*0.95);
            ctx.lineTo(x + w*0.35, y + h*0.7);
            ctx.lineTo(x + w*0.25, y + h*0.35);
            ctx.closePath();
            ctx.fill();
            
            // 内部高光
            ctx.fillStyle = '#cef';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.2);
            ctx.lineTo(x + w*0.6, y + h*0.38);
            ctx.lineTo(x + w*0.55, y + h*0.6);
            ctx.lineTo(cx, y + h*0.8);
            ctx.lineTo(x + w*0.45, y + h*0.6);
            ctx.lineTo(x + w*0.4, y + h*0.38);
            ctx.closePath();
            ctx.fill();
            
            // 核心
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.35);
            ctx.lineTo(x + w*0.55, y + h*0.45);
            ctx.lineTo(cx, y + h*0.7);
            ctx.lineTo(x + w*0.45, y + h*0.45);
            ctx.closePath();
            ctx.fill();
            
            // 眼睛
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#0ff';
            ctx.beginPath();
            ctx.arc(x + w*0.42, y + h*0.42, w*0.04, 0, Math.PI*2);
            ctx.arc(x + w*0.58, y + h*0.42, w*0.04, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // 冰晶粒子
            ctx.fillStyle = `rgba(200, 240, 255, ${0.5 + Math.sin(time)*0.3})`;
            for(let i=0; i<5; i++) {
                const angle = time + i * Math.PI*2/5;
                const dist = w*0.35 + Math.sin(time*2 + i)*5;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(angle)*dist, y + h*0.5 + Math.sin(angle)*dist*0.3, w*0.03, 0, Math.PI*2);
                ctx.fill();
            }
            
        } else if (renderType === 'boss_demon') {
            // 恶魔领主 - 地狱风格，带翅膀扇动、呼吸、火焰脉动
            const time = Date.now() / 400;
            const wingFlap = Math.sin(time * 1.5) * 8;
            const breathe = Math.sin(time) * 2;
            const firePulse = Math.sin(time * 3);
            const bodySway = Math.sin(time * 0.7) * 1.5;
            
            // 翅膀 - 扇动动画
            ctx.fillStyle = '#311';
            // 左翼
            ctx.beginPath();
            ctx.moveTo(x + w*0.35 + bodySway, y + h*0.3 + breathe);
            ctx.lineTo(x + w*0.02, y + h*0.15 + wingFlap);
            ctx.quadraticCurveTo(x + w*0.05, y + h*0.4, x + w*0.25, y + h*0.6 + breathe);
            ctx.closePath();
            ctx.fill();
            // 右翼
            ctx.beginPath();
            ctx.moveTo(x + w*0.65 + bodySway, y + h*0.3 + breathe);
            ctx.lineTo(x + w*0.98, y + h*0.15 + wingFlap);
            ctx.quadraticCurveTo(x + w*0.95, y + h*0.4, x + w*0.75, y + h*0.6 + breathe);
            ctx.closePath();
            ctx.fill();
            
            // 身体 - 呼吸和摇摆
            ctx.fillStyle = color;
            ctx.save();
            ctx.translate(cx + bodySway, y + h*0.5 + breathe);
            ctx.scale(1 + breathe*0.01, 1 + breathe*0.01);
            ctx.beginPath();
            ctx.moveTo(0, -h*0.25);
            ctx.lineTo(w*0.2, -h*0.1);
            ctx.lineTo(w*0.15, h*0.3);
            ctx.lineTo(-w*0.15, h*0.3);
            ctx.lineTo(-w*0.2, -h*0.1);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // 腹肌 - 随呼吸起伏
            ctx.strokeStyle = '#525';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w*0.4 + bodySway, y + h*0.5 + breathe);
            ctx.lineTo(x + w*0.6 + bodySway, y + h*0.5 + breathe);
            ctx.moveTo(x + w*0.38 + bodySway, y + h*0.6 + breathe);
            ctx.lineTo(x + w*0.62 + bodySway, y + h*0.6 + breathe);
            ctx.moveTo(x + w*0.4 + bodySway, y + h*0.7 + breathe);
            ctx.lineTo(x + w*0.6 + bodySway, y + h*0.7 + breathe);
            ctx.stroke();
            
            // 角 - 恶魔角
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(x + w*0.35 + bodySway, y + h*0.2 + breathe);
            ctx.lineTo(x + w*0.2, y + h*0.02);
            ctx.lineTo(x + w*0.45 + bodySway, y + h*0.15 + breathe);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.65 + bodySway, y + h*0.2 + breathe);
            ctx.lineTo(x + w*0.8, y + h*0.02);
            ctx.lineTo(x + w*0.55 + bodySway, y + h*0.15 + breathe);
            ctx.closePath();
            ctx.fill();
            
            // 眼睛 - 火焰脉动
            ctx.shadowColor = '#f00';
            ctx.shadowBlur = 10 + firePulse * 5;
            ctx.fillStyle = `rgb(255, ${50 + firePulse*30}, 0)`;
            ctx.beginPath();
            ctx.arc(x + w*0.42 + bodySway, y + h*0.32 + breathe, w*0.06, 0, Math.PI*2);
            ctx.arc(x + w*0.58 + bodySway, y + h*0.32 + breathe, w*0.06, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // 嘴 - 火焰呼吸
            ctx.fillStyle = `rgba(255,100,0,${0.5 + firePulse*0.3})`;
            ctx.beginPath();
            ctx.moveTo(x + w*0.45 + bodySway, y + h*0.38 + breathe);
            ctx.lineTo(x + w*0.5 + bodySway, y + h*0.55 + breathe + firePulse*2);
            ctx.lineTo(x + w*0.55 + bodySway, y + h*0.38 + breathe);
            ctx.closePath();
            ctx.fill();
            
            // 爪子 - 开合动画
            const clawOpen = Math.sin(time * 2) * 3;
            ctx.fillStyle = '#000';
            // 左爪
            ctx.save();
            ctx.translate(x + w*0.15 + bodySway, y + h*0.7 + breathe);
            ctx.rotate(-0.2 + clawOpen*0.02);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-w*0.07, h*0.2);
            ctx.lineTo(w*0.03, h*0.15);
            ctx.lineTo(w*0.05, h*0.25);
            ctx.lineTo(w*0.1, h*0.12);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            // 右爪
            ctx.save();
            ctx.translate(x + w*0.85 + bodySway, y + h*0.7 + breathe);
            ctx.rotate(0.2 - clawOpen*0.02);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(w*0.07, h*0.2);
            ctx.lineTo(-w*0.03, h*0.15);
            ctx.lineTo(-w*0.05, h*0.25);
            ctx.lineTo(-w*0.1, h*0.12);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // 尾巴 - 摆动
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + w*0.5 + bodySway, y + h*0.8 + breathe);
            ctx.quadraticCurveTo(x + w*0.3, y + h*0.95, x + w*0.5 + Math.sin(time)*5, y + h*0.98);
            ctx.quadraticCurveTo(x + w*0.7, y + h*0.95, x + w*0.5 + bodySway, y + h*0.8 + breathe);
            ctx.fill();
            // 尾巴尖刺
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(x + w*0.5 + Math.sin(time)*5 - w*0.03, y + h*0.98);
            ctx.lineTo(x + w*0.5 + Math.sin(time)*5, y + h*1.02);
            ctx.lineTo(x + w*0.5 + Math.sin(time)*5 + w*0.03, y + h*0.98);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    // 普通怪物渲染 - 精美像素设计
    if (renderType === 'slime') {
        // 史莱姆 - 弹跳果冻
        const time = Date.now() / 600;
        const bounce = Math.abs(Math.sin(time)) * 4;
        
        // 底部阴影
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, y + h*0.85, w*0.25 * (1-bounce/15), h*0.05, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 身体 - 波浪边缘
        ctx.fillStyle = color;
        ctx.beginPath();
        for(let i=0; i<16; i++) {
            const angle = (i/16) * Math.PI * 2;
            const r = w*0.25 + Math.sin(angle*4 + time*3) * 2;
            const px = cx + Math.cos(angle) * r;
            const py = y + h*0.5 - bounce + Math.sin(angle) * r * 0.5;
            if(i===0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        
        // 高光
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.ellipse(cx - w*0.08, y + h*0.4 - bounce, w*0.1, h*0.06, -0.3, 0, Math.PI*2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx - w*0.08, y + h*0.45 - bounce, w*0.04, 0, Math.PI*2);
        ctx.arc(cx + w*0.08, y + h*0.45 - bounce, w*0.04, 0, Math.PI*2);
        ctx.fill();
        
    } else if (renderType === 'goblin') {
        // 哥布林 - 尖耳朵和小个子，带呼吸和耳朵抖动
        const time = Date.now() / 500;
        const breathe = Math.sin(time) * 1.5;
        const earTwitch = Math.sin(time * 3) * 2;
        
        // 身体 - 呼吸动画
        ctx.fillStyle = color;
        const bodyH = h*0.35 + breathe * 0.3;
        ctx.fillRect(x + w*0.3, y + h*0.4 - breathe*0.2, w*0.4, bodyH);
        
        // 头部 - 轻微摇摆
        const headX = cx + Math.sin(time * 0.5) * 1;
        ctx.beginPath();
        ctx.arc(headX, y + h*0.25 + breathe*0.1, w*0.18, 0, Math.PI*2);
        ctx.fill();
        
        // 尖耳朵 - 抖动动画
        ctx.beginPath();
        ctx.moveTo(headX - w*0.03, y + h*0.25);
        ctx.lineTo(x + w*0.02, y + h*0.15 + earTwitch);
        ctx.lineTo(headX + w*0.03, y + h*0.2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(headX + w*0.03, y + h*0.25);
        ctx.lineTo(x + w*0.98, y + h*0.15 - earTwitch);
        ctx.lineTo(headX - w*0.03, y + h*0.2);
        ctx.closePath();
        ctx.fill();
        
        // 眼睛 - 闪烁
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(headX - w*0.06, y + h*0.25 + breathe*0.1, w*0.03, 0, Math.PI*2);
        ctx.arc(headX + w*0.06, y + h*0.25 + breathe*0.1, w*0.03, 0, Math.PI*2);
        ctx.fill();
        
        // 短腿 - 站立微动
        ctx.fillStyle = color;
        const legOffset = Math.sin(time * 2) * 0.5;
        ctx.fillRect(x + w*0.32 + legOffset, y + h*0.7 + breathe*0.2, w*0.12, h*0.2);
        ctx.fillRect(x + w*0.56 - legOffset, y + h*0.7 + breathe*0.2, w*0.12, h*0.2);
        
        // 武器 - 短刀
        ctx.fillStyle = '#888';
        ctx.fillRect(x + w*0.7, y + h*0.45 + Math.sin(time)*2, w*0.08, h*0.25);
        ctx.fillStyle = '#654';
        ctx.fillRect(x + w*0.68, y + h*0.42 + Math.sin(time)*2, w*0.12, h*0.05);
        
    } else if (renderType === 'bat') {
        // 蝙蝠 - 翅膀扇动
        const time = Date.now() / 150;
        const wingY = Math.sin(time) * 8;
        
        // 身体
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx, y + h*0.5, w*0.12, h*0.18, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 翅膀
        ctx.beginPath();
        ctx.moveTo(x + w*0.35, y + h*0.45);
        ctx.lineTo(x + w*0.05, y + h*0.25 + wingY);
        ctx.quadraticCurveTo(x + w*0.15, y + h*0.5 + wingY*0.5, x + w*0.35, y + h*0.55);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w*0.65, y + h*0.45);
        ctx.lineTo(x + w*0.95, y + h*0.25 + wingY);
        ctx.quadraticCurveTo(x + w*0.85, y + h*0.5 + wingY*0.5, x + w*0.65, y + h*0.55);
        ctx.closePath();
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(x + w*0.45, y + h*0.45, w*0.03, 0, Math.PI*2);
        ctx.arc(x + w*0.55, y + h*0.45, w*0.03, 0, Math.PI*2);
        ctx.fill();
        
    } else if (renderType === 'spider') {
        // 蜘蛛 - 带腿和腹部，腿会动
        const time = Date.now() / 300;
        const breathe = Math.sin(time) * 1;
        
        // 腹部 - 呼吸脉动
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx, y + h*0.55 + breathe*0.5, w*0.2, h*0.22 + breathe*0.3, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 腹部花纹
        ctx.fillStyle = '#a31';
        ctx.beginPath();
        ctx.ellipse(cx, y + h*0.5 + breathe*0.5, w*0.1, h*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 头
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, y + h*0.3 + breathe*0.3, w*0.1, 0, Math.PI*2);
        ctx.fill();
        
        // 眼睛 - 发光
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + w*0.45, y + h*0.28 + breathe*0.3, w*0.025, 0, Math.PI*2);
        ctx.arc(x + w*0.5, y + h*0.26 + breathe*0.3, w*0.025, 0, Math.PI*2);
        ctx.arc(x + w*0.55, y + h*0.26 + breathe*0.3, w*0.025, 0, Math.PI*2);
        ctx.arc(x + w*0.6, y + h*0.28 + breathe*0.3, w*0.025, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + w*0.45, y + h*0.28 + breathe*0.3, w*0.012, 0, Math.PI*2);
        ctx.arc(x + w*0.5, y + h*0.26 + breathe*0.3, w*0.012, 0, Math.PI*2);
        ctx.arc(x + w*0.55, y + h*0.26 + breathe*0.3, w*0.012, 0, Math.PI*2);
        ctx.arc(x + w*0.6, y + h*0.28 + breathe*0.3, w*0.012, 0, Math.PI*2);
        ctx.fill();
        
        // 腿 - 蠕动动画
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for(let i=0; i<4; i++) {
            const legMove = Math.sin(time + i * 0.8) * 3;
            const angleL = Math.PI - 0.3 - i*0.2;
            const angleR = -0.3 + i*0.2;
            
            // 左腿
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.4 + breathe*0.3);
            ctx.lineTo(cx + Math.cos(angleL)*w*0.2, y + h*0.4 + Math.sin(angleL)*h*0.1 + legMove);
            ctx.lineTo(cx + Math.cos(angleL)*w*0.28, y + h*0.4 + Math.sin(angleL)*h*0.18 + legMove*1.5);
            ctx.stroke();
            
            // 右腿
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.4 + breathe*0.3);
            ctx.lineTo(cx + Math.cos(angleR)*w*0.2, y + h*0.4 + Math.sin(angleR)*h*0.1 - legMove);
            ctx.lineTo(cx + Math.cos(angleR)*w*0.28, y + h*0.4 + Math.sin(angleR)*h*0.18 - legMove*1.5);
            ctx.stroke();
        }
        
    } else if (renderType === 'skeleton') {
        // 骷髅 - 骨头质感，带呼吸和武器摆动
        const time = Date.now() / 600;
        const breathe = Math.sin(time) * 1;
        const armSwing = Math.sin(time * 0.8) * 3;
        
        // 头骨 - 轻微摇摆
        ctx.fillStyle = '#dcb';
        ctx.beginPath();
        ctx.arc(cx + Math.sin(time*0.3)*0.5, y + h*0.22 + breathe*0.2, w*0.15, 0, Math.PI*2);
        ctx.fill();
        
        // 眼睛 - 发光
        ctx.fillStyle = '#0f0';
        ctx.shadowColor = '#0f0';
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(x + w*0.42, y + h*0.2 + breathe*0.2, w*0.04, 0, Math.PI*2);
        ctx.arc(x + w*0.58, y + h*0.2 + breathe*0.2, w*0.04, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 鼻子
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx + Math.sin(time*0.3)*0.5, y + h*0.25 + breathe*0.2, w*0.015, 0, Math.PI*2);
        ctx.fill();
        
        // 牙齿
        ctx.fillStyle = '#fff';
        for(let i=0; i<4; i++) {
            ctx.fillRect(x + w*0.42 + i*w*0.05, y + h*0.32 + breathe*0.2, w*0.02, h*0.04);
        }
        
        // 肋骨 - 呼吸动画
        ctx.fillStyle = '#dcb';
        for(let i=0; i<4; i++) {
            const ribMove = Math.sin(time + i*0.5) * 1;
            ctx.fillRect(x + w*0.3 + ribMove, y + h*0.4 + i*h*0.08, w*0.4, h*0.03);
        }
        ctx.fillRect(x + w*0.45, y + h*0.38, w*0.1, h*0.32);
        
        // 手臂 - 摆动
        ctx.fillRect(x + w*0.15 + armSwing, y + h*0.45, w*0.1, h*0.25);
        ctx.fillRect(x + w*0.75 - armSwing, y + h*0.45, w*0.1, h*0.25);
        
        // 武器 - 骨剑
        ctx.fillStyle = '#ccc';
        ctx.fillRect(x + w*0.12 + armSwing, y + h*0.35, w*0.06, h*0.35);
        ctx.fillRect(x + w*0.08 + armSwing, y + h*0.32, w*0.14, h*0.06);
        
        // 腿 - 站立微动
        ctx.fillStyle = '#dcb';
        const legMove = Math.sin(time * 1.5) * 0.5;
        ctx.fillRect(x + w*0.35 + legMove, y + h*0.7, w*0.08, h*0.25);
        ctx.fillRect(x + w*0.57 - legMove, y + h*0.7, w*0.08, h*0.25);
        ctx.fillRect(x + w*0.2, y + h*0.65, w*0.15, h*0.2);
        ctx.fillRect(x + w*0.65, y + h*0.65, w*0.15, h*0.2);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w*0.38, y + h*0.2, w*0.08, h*0.08);
        ctx.fillRect(x + w*0.54, y + h*0.2, w*0.08, h*0.08);
    } else if (renderType === 'wolf') {
        // 狼 - 带呼吸、尾巴摇摆和耳朵抖动
        const time = Date.now() / 400;
        const breathe = Math.sin(time) * 1.5;
        const tailWag = Math.sin(time * 2) * 5;
        const earTwitch = Math.sin(time * 3) * 1;
        
        // 身体 - 呼吸动画
        ctx.fillStyle = color;
        const bodyY = y + h*0.3 - breathe*0.3;
        ctx.fillRect(x + w*0.25, bodyY, w*0.5, h*0.35 + breathe*0.2);
        
        // 胸部 - 更明显呼吸
        ctx.fillStyle = '#975';
        ctx.beginPath();
        ctx.ellipse(cx, bodyY + h*0.25, w*0.15, h*0.12 + breathe*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 尾巴 - 摇摆动画
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + w*0.15, bodyY + h*0.25);
        ctx.quadraticCurveTo(x + w*0.05, bodyY + h*0.15 + tailWag, x + w*0.02, bodyY + h*0.25 + tailWag*1.5);
        ctx.quadraticCurveTo(x + w*0.05, bodyY + h*0.35 + tailWag, x + w*0.15, bodyY + h*0.35);
        ctx.closePath();
        ctx.fill();
        
        // 头部 - 带耳朵
        ctx.fillStyle = color;
        const headY = bodyY - h*0.05;
        ctx.beginPath();
        ctx.arc(cx, headY + h*0.1, w*0.18, 0, Math.PI*2);
        ctx.fill();
        
        // 耳朵 - 抖动
        ctx.beginPath();
        ctx.moveTo(x + w*0.35, headY);
        ctx.lineTo(x + w*0.32, headY - h*0.1 + earTwitch);
        ctx.lineTo(x + w*0.42, headY + h*0.02);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w*0.65, headY);
        ctx.lineTo(x + w*0.68, headY - h*0.1 - earTwitch);
        ctx.lineTo(x + w*0.58, headY + h*0.02);
        ctx.closePath();
        ctx.fill();
        
        // 眼睛 - 发光
        ctx.fillStyle = '#ff0';
        ctx.shadowColor = '#ff0';
        ctx.shadowBlur = 2;
        ctx.beginPath();
        ctx.ellipse(x + w*0.42, headY + h*0.08, w*0.04, h*0.05, 0, 0, Math.PI*2);
        ctx.ellipse(x + w*0.58, headY + h*0.08, w*0.04, h*0.05, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 腿 - 站立微动
        ctx.fillStyle = color;
        const legMove = Math.sin(time * 1.5) * 0.8;
        ctx.fillRect(x + w*0.18 + legMove, y + h*0.55, w*0.1, h*0.3);
        ctx.fillRect(x + w*0.3 - legMove, y + h*0.55, w*0.1, h*0.3);
        ctx.fillRect(x + w*0.6 + legMove, y + h*0.55, w*0.1, h*0.3);
        ctx.fillRect(x + w*0.72 - legMove, y + h*0.55, w*0.1, h*0.3);
        
        // 鼻子
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx, headY + h*0.18, w*0.04, 0, Math.PI*2);
        ctx.fill();
    } else if (renderType === 'snake') {
        // 蛇 - 带游动动画和舌头伸缩
        const time = Date.now() / 350;
        const slither = Math.sin(time) * 3;
        const tongueOut = Math.max(0, Math.sin(time * 3)) * 4;
        
        // 身体 - 波浪形游动
        ctx.fillStyle = color;
        const segments = [
            { x: 0.3, y: 0.2, w: 0.4, h: 0.15 },
            { x: 0.25, y: 0.3, w: 0.5, h: 0.15 },
            { x: 0.2, y: 0.4, w: 0.6, h: 0.15 },
            { x: 0.15, y: 0.5, w: 0.7, h: 0.15 },
            { x: 0.2, y: 0.6, w: 0.6, h: 0.15 }
        ];
        
        segments.forEach((seg, i) => {
            const offset = Math.sin(time + i * 0.7) * 2;
            ctx.fillRect(x + w*(seg.x + offset*0.01), y + h*seg.y, w*seg.w, h*seg.h);
        });
        
        // 腹部花纹
        ctx.fillStyle = '#3a3';
        for(let i=0; i<4; i++) {
            const offset = Math.sin(time + i * 0.7) * 2;
            ctx.beginPath();
            ctx.ellipse(x + w*(0.5 + offset*0.01), y + h*(0.25 + i*0.1), w*0.08, h*0.03, 0, 0, Math.PI*2);
            ctx.fill();
        }
        
        // 眼睛
        ctx.fillStyle = '#ff0';
        ctx.shadowColor = '#ff0';
        ctx.shadowBlur = 2;
        const headOffset = Math.sin(time) * 2;
        ctx.beginPath();
        ctx.ellipse(x + w*0.35 + headOffset*0.01, y + h*0.25, w*0.04, h*0.04, 0, 0, Math.PI*2);
        ctx.ellipse(x + w*0.55 + headOffset*0.01, y + h*0.25, w*0.04, h*0.04, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 舌头 - 伸缩动画
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(x + w*0.5 + headOffset*0.01, y + h*0.32);
        ctx.lineTo(x + w*0.48 + headOffset*0.01, y + h*0.32 + tongueOut);
        ctx.lineTo(x + w*0.5 + headOffset*0.01, y + h*0.30);
        ctx.lineTo(x + w*0.52 + headOffset*0.01, y + h*0.32 + tongueOut);
        ctx.closePath();
        ctx.fill();
    } else if (renderType === 'scorpion') {
        // 蝎子 - 带钳子开合、尾巴卷曲动画
        const time = Date.now() / 400;
        const pincerOpen = Math.sin(time * 2) * 3;
        const tailCurl = Math.sin(time) * 5;
        const breathe = Math.sin(time * 1.5) * 1;
        
        // 身体 - 呼吸
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.25, y + h*0.35 + breathe, w*0.5, h*0.3);
        
        // 腹部纹理
        ctx.fillStyle = '#631';
        for(let i=0; i<3; i++) {
            ctx.fillRect(x + w*(0.3 + i*0.15), y + h*(0.4 + i*0.05) + breathe, w*0.1, h*0.05);
        }
        
        // 头部
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x + w*0.5, y + h*0.32 + breathe, w*0.12, h*0.08, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 眼睛 - 发光
        ctx.fillStyle = '#0f0';
        ctx.shadowColor = '#0f0';
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(x + w*0.42, y + h*0.32 + breathe, w*0.03, 0, Math.PI*2);
        ctx.arc(x + w*0.58, y + h*0.32 + breathe, w*0.03, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 左钳 - 开合动画
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + w*0.25, y + h*0.45 + breathe);
        ctx.lineTo(x + w*0.1, y + h*0.4 + pincerOpen + breathe);
        ctx.lineTo(x + w*0.05, y + h*0.5 + pincerOpen*0.5 + breathe);
        ctx.lineTo(x + w*0.15, y + h*0.52 + breathe);
        ctx.closePath();
        ctx.fill();
        
        // 右钳 - 开合动画
        ctx.beginPath();
        ctx.moveTo(x + w*0.75, y + h*0.45 + breathe);
        ctx.lineTo(x + w*0.9, y + h*0.4 - pincerOpen + breathe);
        ctx.lineTo(x + w*0.95, y + h*0.5 - pincerOpen*0.5 + breathe);
        ctx.lineTo(x + w*0.85, y + h*0.52 + breathe);
        ctx.closePath();
        ctx.fill();
        
        // 尾巴 - 卷曲动画
        ctx.beginPath();
        ctx.moveTo(x + w*0.5, y + h*0.35 + breathe);
        ctx.quadraticCurveTo(x + w*0.5 + tailCurl, y + h*0.15, x + w*0.5 + tailCurl*1.5, y + h*0.25 + breathe);
        ctx.lineTo(x + w*0.5 + tailCurl*1.3, y + h*0.35 + breathe);
        ctx.quadraticCurveTo(x + w*0.5 + tailCurl*0.5, y + h*0.22, x + w*0.5, y + h*0.45 + breathe);
        ctx.fill();
        
        // 尾刺
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(x + w*0.5 + tailCurl*1.5, y + h*0.25 + breathe);
        ctx.lineTo(x + w*0.48 + tailCurl*1.5, y + h*0.15 + breathe);
        ctx.lineTo(x + w*0.52 + tailCurl*1.5, y + h*0.15 + breathe);
        ctx.closePath();
        ctx.fill();
        
        // 腿
        ctx.fillStyle = color;
        const legMove = Math.sin(time * 2) * 0.5;
        for(let i=0; i<3; i++) {
            ctx.fillRect(x + w*(0.2 + i*0.15) + legMove, y + h*0.65 + i*0.02, w*0.03, h*0.12);
            ctx.fillRect(x + w*(0.8 - i*0.15) - legMove, y + h*0.65 + i*0.02, w*0.03, h*0.12);
        }
    } else {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.25, y + h*0.2, w*0.5, h*0.5);
        ctx.fillRect(x + w*0.15, y + h*0.5, w*0.7, h*0.35);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w*0.3, y + h*0.35, w*0.12, h*0.12);
        ctx.fillRect(x + w*0.58, y + h*0.35, w*0.12, h*0.12);
    }
    
    return canvas;
};

