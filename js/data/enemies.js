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
    { name: '史莱姆王', type: 'slime_king', hp: 80, atk: 12, def: 2, exp: 40, gold: 80, color: '#4a4', size: 40, render: 'boss_slime' },
    { name: '哥布林领主', type: 'goblin_lord', hp: 120, atk: 18, def: 4, exp: 60, gold: 120, color: '#484', size: 36, render: 'boss_goblin' },
    { name: 'orc王', type: 'orc_king', hp: 180, atk: 25, def: 8, exp: 100, gold: 180, color: '#484', size: 44, render: 'boss_orc' },
    { name: '黑暗法师', type: 'dark_mage', hp: 150, atk: 35, def: 5, exp: 150, gold: 250, color: '#848', size: 32, render: 'boss_mage' },
    { name: '火龙', type: 'fire_dragon', hp: 300, atk: 40, def: 15, exp: 300, gold: 500, color: '#a44', size: 56, render: 'boss_dragon' },
    { name: '冰魔', type: 'ice_devil', hp: 350, atk: 45, def: 18, exp: 400, gold: 600, color: '#aaf', size: 48, render: 'boss_ice' },
    { name: '恶魔领主', type: 'demon_lord', hp: 500, atk: 60, def: 25, exp: 600, gold: 1000, color: '#a2a', size: 52, render: 'boss_demon' }
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
    if (!window.discoveredEnemies[type]) {
        window.discoveredEnemies[type] = { name: name, count: 0 };
    }
    window.discoveredEnemies[type].count++;
    window.discoveredEnemies[type].name = name;
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
    
    const renderType = enemyType.render || enemyType.type;
    
    // Boss 渲染
    if (renderType.startsWith('boss_')) {
        if (renderType === 'boss_slime') {
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.2, y, w*0.6, h*0.5);
            ctx.fillRect(x + w*0.1, y + h*0.3, w*0.8, h*0.5);
            ctx.fillStyle = '#000';
            ctx.fillRect(x + w*0.3, y + h*0.2, w*0.12, h*0.12);
            ctx.fillRect(x + w*0.58, y + h*0.2, w*0.12, h*0.12);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(x + w*0.35, y + h*0.25, w*0.06, h*0.06);
            ctx.fillRect(x + w*0.59, y + h*0.25, w*0.06, h*0.06);
        } else if (renderType === 'boss_goblin') {
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.25, y, w*0.5, h*0.35);
            ctx.fillRect(x + w*0.15, y + h*0.3, w*0.7, h*0.5);
            ctx.fillRect(x + w*0.1, y + h*0.7, w*0.25, h*0.25);
            ctx.fillRect(x + w*0.65, y + h*0.7, w*0.25, h*0.25);
            ctx.fillStyle = '#f00';
            ctx.fillRect(x + w*0.3, y + h*0.15, w*0.1, h*0.1);
            ctx.fillRect(x + w*0.6, y + h*0.15, w*0.1, h*0.1);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(x + w*0.32, y + h*0.17, w*0.04, h*0.04);
            ctx.fillRect(x + w*0.62, y + h*0.17, w*0.04, h*0.04);
        } else if (renderType === 'boss_orc') {
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.25, y, w*0.5, h*0.35);
            ctx.fillRect(x + w*0.15, y + h*0.3, w*0.7, h*0.5);
            ctx.fillRect(x + w*0.2, y + h*0.75, w*0.2, h*0.2);
            ctx.fillRect(x + w*0.6, y + h*0.75, w*0.2, h*0.2);
            ctx.fillStyle = '#f00';
            ctx.fillRect(x + w*0.3, y + h*0.12, w*0.12, h*0.12);
            ctx.fillRect(x + w*0.58, y + h*0.12, w*0.12, h*0.12);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(x + w*0.32, y + h*0.15, w*0.06, h*0.06);
            ctx.fillRect(x + w*0.6, y + h*0.15, w*0.06, h*0.06);
        } else if (renderType === 'boss_mage') {
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.35, y, w*0.3, h*0.35);
            ctx.fillRect(x + w*0.25, y + h*0.3, w*0.5, h*0.5);
            ctx.fillRect(x + w*0.15, y + h*0.75, w*0.7, h*0.2);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(x + w*0.35, y + h*0.15, w*0.08, h*0.08);
            ctx.fillRect(x + w*0.57, y + h*0.15, w*0.08, h*0.08);
            ctx.fillStyle = '#0ff';
            ctx.fillRect(x + w*0.3, y + h*0.4, w*0.15, h*0.2);
            ctx.fillRect(x + w*0.55, y + h*0.4, w*0.15, h*0.2);
        } else if (renderType === 'boss_dragon') {
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.25, y, w*0.5, h*0.35);
            ctx.fillRect(x + w*0.1, y + h*0.25, w*0.3, h*0.25);
            ctx.fillRect(x + w*0.6, y + h*0.25, w*0.3, h*0.25);
            ctx.fillRect(x + w*0.15, y + h*0.45, w*0.7, h*0.4);
            ctx.fillRect(x + w*0.05, y + h*0.3, w*0.15, h*0.2);
            ctx.fillRect(x + w*0.8, y + h*0.3, w*0.15, h*0.2);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(x + w*0.3, y + h*0.1, w*0.1, h*0.1);
            ctx.fillRect(x + w*0.6, y + h*0.1, w*0.1, h*0.1);
            ctx.fillStyle = '#f00';
            ctx.fillRect(x + w*0.32, y + h*0.12, w*0.05, h*0.05);
            ctx.fillRect(x + w*0.62, y + h*0.12, w*0.05, h*0.05);
        } else if (renderType === 'boss_ice') {
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.3, y, w*0.4, h*0.4);
            ctx.fillRect(x + w*0.2, y + h*0.3, w*0.6, h*0.5);
            ctx.fillRect(x + w*0.1, y + h*0.5, w*0.2, h*0.3);
            ctx.fillRect(x + w*0.7, y + h*0.5, w*0.2, h*0.3);
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + w*0.35, y + h*0.2, w*0.08, h*0.08);
            ctx.fillRect(x + w*0.57, y + h*0.2, w*0.08, h*0.08);
            ctx.fillStyle = '#00f';
            ctx.fillRect(x + w*0.37, y + h*0.22, w*0.04, h*0.04);
            ctx.fillRect(x + w*0.59, y + h*0.22, w*0.04, h*0.04);
        } else if (renderType === 'boss_demon') {
            ctx.fillStyle = color;
            ctx.fillRect(x + w*0.3, y, w*0.4, h*0.35);
            ctx.fillRect(x + w*0.15, y + h*0.3, w*0.7, h*0.5);
            ctx.fillRect(x + w*0.05, y + h*0.7, w*0.2, h*0.25);
            ctx.fillRect(x + w*0.75, y + h*0.7, w*0.2, h*0.25);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(x + w*0.3, y + h*0.15, w*0.12, h*0.12);
            ctx.fillRect(x + w*0.58, y + h*0.15, w*0.12, h*0.12);
            ctx.fillStyle = '#f00';
            ctx.fillRect(x + w*0.34, y + h*0.18, w*0.04, h*0.04);
            ctx.fillRect(x + w*0.62, y + h*0.18, w*0.04, h*0.04);
        }
        return canvas.toDataURL();
    }
    
    // 普通怪物渲染（保持原有逻辑）
    if (renderType === 'slime') {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.2, y + h*0.3, w*0.6, h*0.5);
        ctx.fillRect(x + w*0.1, y + h*0.5, w*0.8, h*0.4);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w*0.3, y + h*0.4, w*0.1, h*0.1);
        ctx.fillRect(x + w*0.6, y + h*0.4, w*0.1, h*0.1);
    } else if (renderType === 'goblin') {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.3, y + h*0.1, w*0.4, h*0.3);
        ctx.fillRect(x + w*0.2, y + h*0.35, w*0.6, h*0.35);
        ctx.fillRect(x + w*0.15, y + h*0.65, w*0.2, h*0.25);
        ctx.fillRect(x + w*0.65, y + h*0.65, w*0.2, h*0.25);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w*0.35, y + h*0.2, w*0.08, h*0.08);
        ctx.fillRect(x + w*0.55, y + h*0.2, w*0.08, h*0.08);
    } else if (renderType === 'bat') {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + w*0.5, y + h*0.1);
        ctx.lineTo(x + w*0.2, y + h*0.7);
        ctx.lineTo(x + w*0.8, y + h*0.7);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w*0.35, y + h*0.35, w*0.1, h*0.1);
        ctx.fillRect(x + w*0.55, y + h*0.35, w*0.1, h*0.1);
    } else if (renderType === 'spider') {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.3, y + h*0.2, w*0.4, h*0.4);
        ctx.fillRect(x + w*0.1, y + h*0.35, w*0.15, h*0.1);
        ctx.fillRect(x + w*0.75, y + h*0.35, w*0.15, h*0.1);
        ctx.fillRect(x + w*0.05, y + h*0.5, w*0.15, h*0.1);
        ctx.fillRect(x + w*0.8, y + h*0.5, w*0.15, h*0.1);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w*0.35, y + h*0.3, w*0.1, h*0.1);
        ctx.fillRect(x + w*0.55, y + h*0.3, w*0.1, h*0.1);
    } else if (renderType === 'skeleton') {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.35, y + h*0.1, w*0.3, h*0.25);
        ctx.fillRect(x + w*0.3, y + h*0.35, w*0.4, h*0.35);
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

