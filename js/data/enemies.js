/**
 * PixelARPG - 敌人数据模块
 * 定义怪物和Boss的类型、数据和生成函数
 */

// 普通怪物类型
window.ENEMY_TYPES = [
    { name: '史莱姆', type: 'slime', hp: 15, atk: 3, def: 0, exp: 5, gold: 3, color: '#4a4', render: 'slime' },
    { name: '哥布林', type: 'goblin', hp: 25, atk: 5, def: 1, exp: 8, gold: 5, color: '#484', render: 'goblin' },
    { name: '蝙蝠', type: 'bat', hp: 10, atk: 4, def: 0, exp: 6, gold: 4, color: '#448', render: 'bat' },
    { name: '蜘蛛', type: 'spider', hp: 20, atk: 6, def: 1, exp: 7, gold: 5, color: '#444', render: 'spider' },
    { name: '骷髅', type: 'skeleton', hp: 30, atk: 8, def: 2, exp: 12, gold: 8, color: '#ccc', render: 'skeleton' },
    { name: '狼', type: 'wolf', hp: 25, atk: 10, def: 1, exp: 10, gold: 7, color: '#864', render: 'wolf' },
    { name: '蛇', type: 'snake', hp: 18, atk: 7, def: 0, exp: 8, gold: 5, color: '#262', render: 'snake' },
    { name: '蝎子', type: 'scorpion', hp: 22, atk: 9, def: 2, exp: 9, gold: 6, color: '#842', render: 'scorpion' }
];

// 兼容旧版本
window.enemyTypes = window.ENEMY_TYPES;

// Boss怪物类型
window.BOSS_TYPES = [
    { name: '史莱姆王', type: 'slime_king', hp: 80, atk: 12, def: 2, exp: 40, gold: 80, color: '#4a4', size: 40, render: 'boss_slime', skills: ['ice'] },
    { name: '哥布林领主', type: 'goblin_lord', hp: 120, atk: 18, def: 4, exp: 60, gold: 120, color: '#484', size: 36, render: 'boss_goblin', skills: ['vine'] },
    { name: 'orc王', type: 'orc_king', hp: 180, atk: 25, def: 8, exp: 100, gold: 180, color: '#484', size: 44, render: 'boss_orc', skills: ['tornado'] },
    { name: '黑暗法师', type: 'dark_mage', hp: 150, atk: 35, def: 5, exp: 150, gold: 250, color: '#848', size: 32, render: 'boss_mage', skills: ['thunder', 'fireball'] },
    { name: '火龙', type: 'fire_dragon', hp: 300, atk: 40, def: 15, exp: 300, gold: 500, color: '#a44', size: 56, render: 'boss_dragon', skills: ['fireball', 'tornado'] },
    { name: '冰魔', type: 'ice_devil', hp: 350, atk: 45, def: 18, exp: 400, gold: 600, color: '#aaf', size: 48, render: 'boss_ice', skills: ['ice', 'thunder'] },
    { name: '恶魔领主', type: 'demon_lord', hp: 500, atk: 60, def: 25, exp: 600, gold: 1000, color: '#a2a', size: 52, render: 'boss_demon', skills: ['fireball', 'thunder', 'ice'] }
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
    
    const color = enemyType.color || '#4a4';
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
            // 哥布林领主 - 带角和盔甲
            // 身体
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.25, y + h*0.35, w*0.5, h*0.45);
            
            // 盔甲
            ctx.fillStyle = '#654';
            ctx.fillRect(x + w*0.2, y + h*0.4, w*0.6, h*0.15);
            ctx.fillStyle = '#876';
            ctx.fillRect(x + w*0.3, y + h*0.42, w*0.4, h*0.1);
            // 盔甲铆钉
            ctx.fillStyle = '#a98';
            ctx.beginPath();
            ctx.arc(x + w*0.25, y + h*0.47, w*0.02, 0, Math.PI*2);
            ctx.arc(x + w*0.5, y + h*0.47, w*0.02, 0, Math.PI*2);
            ctx.arc(x + w*0.75, y + h*0.47, w*0.02, 0, Math.PI*2);
            ctx.fill();
            
            // 头部
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, y + h*0.25, w*0.22, 0, Math.PI*2);
            ctx.fill();
            
            // 尖耳朵
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + w*0.1, y + h*0.25);
            ctx.lineTo(x + w*0.02, y + h*0.15);
            ctx.lineTo(x + w*0.15, y + h*0.2);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.9, y + h*0.25);
            ctx.lineTo(x + w*0.98, y + h*0.15);
            ctx.lineTo(x + w*0.85, y + h*0.2);
            ctx.closePath();
            ctx.fill();
            
            // 角
            ctx.fillStyle = '#cba';
            ctx.beginPath();
            ctx.moveTo(x + w*0.3, y + h*0.15);
            ctx.lineTo(x + w*0.2, y + h*0.02);
            ctx.lineTo(x + w*0.38, y + h*0.1);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.7, y + h*0.15);
            ctx.lineTo(x + w*0.8, y + h*0.02);
            ctx.lineTo(x + w*0.62, y + h*0.1);
            ctx.closePath();
            ctx.fill();
            
            // 眼睛 - 红眼
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(x + w*0.4, y + h*0.25, w*0.06, 0, Math.PI*2);
            ctx.arc(x + w*0.6, y + h*0.25, w*0.06, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(x + w*0.41, y + h*0.24, w*0.02, 0, Math.PI*2);
            ctx.arc(x + w*0.61, y + h*0.24, w*0.02, 0, Math.PI*2);
            ctx.fill();
            
            // 尖牙
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(x + w*0.45, y + h*0.35);
            ctx.lineTo(x + w*0.48, y + h*0.42);
            ctx.lineTo(x + w*0.51, y + h*0.35);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.52, y + h*0.35);
            ctx.lineTo(x + w*0.55, y + h*0.42);
            ctx.lineTo(x + w*0.58, y + h*0.35);
            ctx.fill();
            
            // 腿部
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.2, y + h*0.75, w*0.15, h*0.2);
            ctx.fillRect(x + w*0.65, y + h*0.75, w*0.15, h*0.2);
            // 鞋子
            ctx.fillStyle = '#432';
            ctx.fillRect(x + w*0.18, y + h*0.88, w*0.2, h*0.1);
            ctx.fillRect(x + w*0.62, y + h*0.88, w*0.2, h*0.1);
            
        } else if (renderType === 'boss_orc') {
            // Orc王 - 强壮，带尖牙和纹身
            // 宽厚的身体
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + w*0.15, y + h*0.35);
            ctx.lineTo(x + w*0.1, y + h*0.8);
            ctx.lineTo(x + w*0.9, y + h*0.8);
            ctx.lineTo(x + w*0.85, y + h*0.35);
            ctx.closePath();
            ctx.fill();
            
            // 腹肌线条
            ctx.strokeStyle = '#363';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w*0.35, y + h*0.5);
            ctx.lineTo(x + w*0.35, y + h*0.7);
            ctx.moveTo(x + w*0.5, y + h*0.48);
            ctx.lineTo(x + w*0.5, y + h*0.72);
            ctx.moveTo(x + w*0.65, y + h*0.5);
            ctx.lineTo(x + w*0.65, y + h*0.7);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w*0.35, y + h*0.58);
            ctx.lineTo(x + w*0.65, y + h*0.58);
            ctx.moveTo(x + w*0.35, y + h*0.68);
            ctx.lineTo(x + w*0.65, y + h*0.68);
            ctx.stroke();
            
            // 头部
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, y + h*0.25, w*0.25, 0, Math.PI*2);
            ctx.fill();
            
            // 头盔
            ctx.fillStyle = '#444';
            ctx.fillRect(x + w*0.25, y + h*0.08, w*0.5, h*0.12);
            ctx.fillStyle = '#666';
            ctx.fillRect(x + w*0.3, y + h*0.1, w*0.4, h*0.06);
            
            // 眼睛
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(x + w*0.4, y + h*0.28, w*0.05, 0, Math.PI*2);
            ctx.arc(x + w*0.6, y + h*0.28, w*0.05, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(x + w*0.4, y + h*0.28, w*0.025, 0, Math.PI*2);
            ctx.arc(x + w*0.6, y + h*0.28, w*0.025, 0, Math.PI*2);
            ctx.fill();
            
            // 獠牙
            ctx.fillStyle = '#ffe';
            ctx.beginPath();
            ctx.moveTo(x + w*0.42, y + h*0.38);
            ctx.lineTo(x + w*0.45, y + h*0.5);
            ctx.lineTo(x + w*0.48, y + h*0.38);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.52, y + h*0.38);
            ctx.lineTo(x + w*0.55, y + h*0.5);
            ctx.lineTo(x + w*0.58, y + h*0.38);
            ctx.fill();
            
            // 手臂肌肉
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(x + w*0.1, y + h*0.45, w*0.1, h*0.18, -0.3, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x + w*0.9, y + h*0.45, w*0.1, h*0.18, 0.3, 0, Math.PI*2);
            ctx.fill();
            
            // 腿部
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.25, y + h*0.78, w*0.18, h*0.18);
            ctx.fillRect(x + w*0.57, y + h*0.78, w*0.18, h*0.18);
            // 护腿
            ctx.fillStyle = '#333';
            ctx.fillRect(x + w*0.23, y + h*0.85, w*0.22, h*0.12);
            ctx.fillRect(x + w*0.55, y + h*0.85, w*0.22, h*0.12);
            
        } else if (renderType === 'boss_mage') {
            // 黑暗法师 - 带兜帽和法杖
            // 袍子
            ctx.fillStyle = '#424';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.95);
            ctx.lineTo(x + w*0.15, y + h*0.4);
            ctx.lineTo(x + w*0.25, y + h*0.25);
            ctx.lineTo(x + w*0.75, y + h*0.25);
            ctx.lineTo(x + w*0.85, y + h*0.4);
            ctx.closePath();
            ctx.fill();
            
            // 袍子纹理
            ctx.strokeStyle = '#636';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.95);
            ctx.lineTo(cx, y + h*0.4);
            ctx.stroke();
            
            // 兜帽
            ctx.fillStyle = '#313';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.25, w*0.22, Math.PI, 0);
            ctx.lineTo(x + w*0.78, y + h*0.4);
            ctx.lineTo(x + w*0.22, y + h*0.4);
            ctx.closePath();
            ctx.fill();
            
            // 脸部阴影
            ctx.fillStyle = '#212';
            ctx.fillRect(x + w*0.38, y + h*0.32, w*0.24, h*0.12);
            
            // 发光的眼睛
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = 5;
            ctx.fillStyle = '#0ff';
            ctx.beginPath();
            ctx.arc(x + w*0.42, y + h*0.38, w*0.04, 0, Math.PI*2);
            ctx.arc(x + w*0.58, y + h*0.38, w*0.04, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // 法杖
            ctx.fillStyle = '#654';
            ctx.fillRect(x + w*0.85, y + h*0.2, w*0.05, h*0.7);
            // 法杖顶部
            ctx.fillStyle = '#0ff';
            ctx.beginPath();
            ctx.arc(x + w*0.875, y + h*0.18, w*0.08, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#aff';
            ctx.beginPath();
            ctx.arc(x + w*0.875, y + h*0.18, w*0.04, 0, Math.PI*2);
            ctx.fill();
            
            // 魔法书
            ctx.fillStyle = '#432';
            ctx.fillRect(x + w*0.15, y + h*0.55, w*0.2, h*0.15);
            ctx.fillStyle = '#654';
            ctx.fillRect(x + w*0.17, y + h*0.57, w*0.16, h*0.11);
            // 符文
            ctx.fillStyle = '#0ff';
            ctx.fillRect(x + w*0.22, y + h*0.6, w*0.02, h*0.05);
            ctx.fillRect(x + w*0.26, y + h*0.6, w*0.02, h*0.05);
            
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
            // 恶魔领主 - 地狱风格
            // 翅膀
            ctx.fillStyle = '#311';
            // 左翼
            ctx.beginPath();
            ctx.moveTo(x + w*0.35, y + h*0.3);
            ctx.lineTo(x + w*0.02, y + h*0.15);
            ctx.lineTo(x + w*0.05, y + h*0.55);
            ctx.lineTo(x + w*0.25, y + h*0.6);
            ctx.closePath();
            ctx.fill();
            // 右翼
            ctx.beginPath();
            ctx.moveTo(x + w*0.65, y + h*0.3);
            ctx.lineTo(x + w*0.98, y + h*0.15);
            ctx.lineTo(x + w*0.95, y + h*0.55);
            ctx.lineTo(x + w*0.75, y + h*0.6);
            ctx.closePath();
            ctx.fill();
            
            // 身体
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.25);
            ctx.lineTo(x + w*0.7, y + h*0.4);
            ctx.lineTo(x + w*0.65, y + h*0.8);
            ctx.lineTo(x + w*0.35, y + h*0.8);
            ctx.lineTo(x + w*0.3, y + h*0.4);
            ctx.closePath();
            ctx.fill();
            
            // 腹肌
            ctx.strokeStyle = '#525';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w*0.4, y + h*0.5);
            ctx.lineTo(x + w*0.6, y + h*0.5);
            ctx.moveTo(x + w*0.38, y + h*0.6);
            ctx.lineTo(x + w*0.62, y + h*0.6);
            ctx.moveTo(x + w*0.4, y + h*0.7);
            ctx.lineTo(x + w*0.6, y + h*0.7);
            ctx.stroke();
            
            // 角
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(x + w*0.35, y + h*0.2);
            ctx.lineTo(x + w*0.2, y + h*0.02);
            ctx.lineTo(x + w*0.45, y + h*0.15);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.65, y + h*0.2);
            ctx.lineTo(x + w*0.8, y + h*0.02);
            ctx.lineTo(x + w*0.55, y + h*0.15);
            ctx.closePath();
            ctx.fill();
            
            // 眼睛 - 火焰
            const time = Date.now() / 200;
            ctx.shadowColor = '#f00';
            ctx.shadowBlur = 10;
            ctx.fillStyle = `rgb(255, ${50 + Math.sin(time)*30}, 0)`;
            ctx.beginPath();
            ctx.arc(x + w*0.42, y + h*0.32, w*0.06, 0, Math.PI*2);
            ctx.arc(x + w*0.58, y + h*0.32, w*0.06, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // 爪子
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(x + w*0.15, y + h*0.7);
            ctx.lineTo(x + w*0.08, y + h*0.9);
            ctx.lineTo(x + w*0.18, y + h*0.85);
            ctx.lineTo(x + w*0.2, y + h*0.95);
            ctx.lineTo(x + w*0.25, y + h*0.82);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.85, y + h*0.7);
            ctx.lineTo(x + w*0.92, y + h*0.9);
            ctx.lineTo(x + w*0.82, y + h*0.85);
            ctx.lineTo(x + w*0.8, y + h*0.95);
            ctx.lineTo(x + w*0.75, y + h*0.82);
            ctx.closePath();
            ctx.fill();
        }
        return canvas.toDataURL();
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
        // 哥布林 - 尖耳朵和小个子
        // 身体
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.3, y + h*0.4, w*0.4, h*0.35);
        
        // 头部
        ctx.beginPath();
        ctx.arc(cx, y + h*0.25, w*0.18, 0, Math.PI*2);
        ctx.fill();
        
        // 尖耳朵
        ctx.beginPath();
        ctx.moveTo(x + w*0.15, y + h*0.25);
        ctx.lineTo(x + w*0.02, y + h*0.15);
        ctx.lineTo(x + w*0.18, y + h*0.2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w*0.85, y + h*0.25);
        ctx.lineTo(x + w*0.98, y + h*0.15);
        ctx.lineTo(x + w*0.82, y + h*0.2);
        ctx.closePath();
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(x + w*0.42, y + h*0.25, w*0.03, 0, Math.PI*2);
        ctx.arc(x + w*0.58, y + h*0.25, w*0.03, 0, Math.PI*2);
        ctx.fill();
        
        // 短腿
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.32, y + h*0.7, w*0.12, h*0.2);
        ctx.fillRect(x + w*0.56, y + h*0.7, w*0.12, h*0.2);
        
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
        // 蜘蛛 - 带腿和腹部
        // 腹部
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx, y + h*0.55, w*0.2, h*0.22, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 腹部花纹
        ctx.fillStyle = '#a31';
        ctx.beginPath();
        ctx.ellipse(cx, y + h*0.5, w*0.1, h*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 头
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, y + h*0.3, w*0.1, 0, Math.PI*2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + w*0.45, y + h*0.28, w*0.025, 0, Math.PI*2);
        ctx.arc(x + w*0.5, y + h*0.26, w*0.025, 0, Math.PI*2);
        ctx.arc(x + w*0.55, y + h*0.26, w*0.025, 0, Math.PI*2);
        ctx.arc(x + w*0.6, y + h*0.28, w*0.025, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + w*0.45, y + h*0.28, w*0.012, 0, Math.PI*2);
        ctx.arc(x + w*0.5, y + h*0.26, w*0.012, 0, Math.PI*2);
        ctx.arc(x + w*0.55, y + h*0.26, w*0.012, 0, Math.PI*2);
        ctx.arc(x + w*0.6, y + h*0.28, w*0.012, 0, Math.PI*2);
        ctx.fill();
        
        // 腿
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for(let i=0; i<4; i++) {
            const angleL = Math.PI - 0.3 - i*0.2;
            const angleR = -0.3 + i*0.2;
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.4);
            ctx.lineTo(cx + Math.cos(angleL)*w*0.25, y + h*0.4 + Math.sin(angleL)*h*0.15);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.4);
            ctx.lineTo(cx + Math.cos(angleR)*w*0.25, y + h*0.4 + Math.sin(angleR)*h*0.15);
            ctx.stroke();
        }
        
    } else if (renderType === 'skeleton') {
        // 骷髅 - 骨头质感
        // 头骨
        ctx.fillStyle = '#dcb';
        ctx.beginPath();
        ctx.arc(cx, y + h*0.22, w*0.15, 0, Math.PI*2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + w*0.42, y + h*0.2, w*0.04, 0, Math.PI*2);
        ctx.arc(x + w*0.58, y + h*0.2, w*0.04, 0, Math.PI*2);
        ctx.fill();
        
        // 鼻子
        ctx.beginPath();
        ctx.arc(cx, y + h*0.25, w*0.015, 0, Math.PI*2);
        ctx.fill();
        
        // 牙齿
        ctx.fillStyle = '#fff';
        for(let i=0; i<4; i++) {
            ctx.fillRect(x + w*0.42 + i*w*0.05, y + h*0.32, w*0.02, h*0.04);
        }
        
        // 肋骨
        ctx.fillStyle = '#dcb';
        for(let i=0; i<4; i++) {
            ctx.fillRect(x + w*0.3, y + h*0.4 + i*h*0.08, w*0.4, h*0.03);
        }
        ctx.fillRect(x + w*0.45, y + h*0.38, w*0.1, h*0.32);
        
        // 手臂
        ctx.fillRect(x + w*0.15, y + h*0.45, w*0.1, h*0.25);
        ctx.fillRect(x + w*0.75, y + h*0.45, w*0.1, h*0.25);
        
        // 腿
        ctx.fillRect(x + w*0.35, y + h*0.7, w*0.08, h*0.25);
        ctx.fillRect(x + w*0.57, y + h*0.7, w*0.08, h*0.25);
        ctx.fillRect(x + w*0.2, y + h*0.65, w*0.15, h*0.2);
        ctx.fillRect(x + w*0.65, y + h*0.65, w*0.15, h*0.2);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w*0.38, y + h*0.2, w*0.08, h*0.08);
        ctx.fillRect(x + w*0.54, y + h*0.2, w*0.08, h*0.08);
    } else if (renderType === 'wolf') {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.25, y + h*0.3, w*0.5, h*0.35);
        ctx.fillRect(x + w*0.15, y + h*0.5, w*0.25, h*0.25);
        ctx.fillRect(x + w*0.6, y + h*0.5, w*0.25, h*0.25);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w*0.3, y + h*0.35, w*0.1, h*0.1);
        ctx.fillRect(x + w*0.55, y + h*0.35, w*0.1, h*0.1);
    } else if (renderType === 'snake') {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.3, y + h*0.2, w*0.4, h*0.15);
        ctx.fillRect(x + w*0.25, y + h*0.3, w*0.5, h*0.15);
        ctx.fillRect(x + w*0.2, y + h*0.4, w*0.6, h*0.15);
        ctx.fillRect(x + w*0.15, y + h*0.5, w*0.7, h*0.15);
        ctx.fillRect(x + w*0.2, y + h*0.6, w*0.6, h*0.15);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(x + w*0.35, y + h*0.25, w*0.08, h*0.05);
        ctx.fillRect(x + w*0.55, y + h*0.25, w*0.08, h*0.05);
    } else if (renderType === 'scorpion') {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.25, y + h*0.35, w*0.5, h*0.3);
        ctx.fillRect(x + w*0.1, y + h*0.4, w*0.15, h*0.1);
        ctx.fillRect(x + w*0.75, y + h*0.4, w*0.15, h*0.1);
        ctx.fillRect(x + w*0.05, y + h*0.45, w*0.15, h*0.1);
        ctx.fillRect(x + w*0.8, y + h*0.45, w*0.15, h*0.1);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w*0.35, y + h*0.4, w*0.1, h*0.08);
        ctx.fillRect(x + w*0.55, y + h*0.4, w*0.1, h*0.08);
    } else {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.25, y + h*0.2, w*0.5, h*0.5);
        ctx.fillRect(x + w*0.15, y + h*0.5, w*0.7, h*0.35);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w*0.3, y + h*0.35, w*0.12, h*0.12);
        ctx.fillRect(x + w*0.58, y + h*0.35, w*0.12, h*0.12);
    }
    
    return canvas.toDataURL();
};

