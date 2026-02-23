/**
 * PixelARPG - 装备/物品数据模块
 * 定义基础物品、物品生成和属性计算
 */

// 基础物品定义
window.BASE_ITEMS = [
    { id: 'weapon1', name: '铁剑', type: 'weapon', baseAtk: 8, icon: '🗡️', sprite: 'sword' },
    { id: 'weapon2', name: '焰火剑', type: 'weapon', baseAtk: 18, icon: '🔥', sprite: 'fire_sword' },
    { id: 'weapon3', name: '雷鸣剑', type: 'weapon', baseAtk: 28, icon: '⚡', sprite: 'thunder_sword' },
    { id: 'weapon4', name: '冰霜剑', type: 'weapon', baseAtk: 38, icon: '❄️', sprite: 'ice_sword' },
    { id: 'weapon5', name: '龙鳞剑', type: 'weapon', baseAtk: 55, icon: '🐉', sprite: 'dragon_sword' },
    { id: 'armor1', name: '布甲', type: 'armor', baseDef: 3, icon: '👕', sprite: 'cloth' },
    { id: 'armor2', name: '皮甲', type: 'armor', baseDef: 8, icon: '🧥', sprite: 'leather' },
    { id: 'armor3', name: '锁甲', type: 'armor', baseDef: 15, icon: '🛡️', sprite: 'mail' },
    { id: 'armor4', name: '板甲', type: 'armor', baseDef: 25, icon: '⚔️', sprite: 'plate' },
    { id: 'armor5', name: '龙鳞甲', type: 'armor', baseDef: 40, icon: '🐲', sprite: 'dragon' },
    { id: 'helmet1', name: '皮帽', type: 'helmet', baseDef: 2, icon: '🧢', sprite: 'leather_helm' },
    { id: 'helmet2', name: '铁盔', type: 'helmet', baseDef: 6, icon: '⛑️', sprite: 'iron_helm' },
    { id: 'helmet3', name: '银盔', type: 'helmet', baseDef: 12, icon: '🥈', sprite: 'silver_helm' },
    { id: 'helmet4', name: '金盔', type: 'helmet', baseDef: 20, icon: '👑', sprite: 'gold_helm' },
    { id: 'boots1', name: '草鞋', type: 'boots', baseDef: 1, icon: '👡', sprite: 'sandals' },
    { id: 'boots2', name: '皮靴', type: 'boots', baseDef: 4, icon: '👢', sprite: 'leather_boots' },
    { id: 'boots3', name: '铁靴', type: 'boots', baseDef: 8, icon: '👞', sprite: 'iron_boots' },
    { id: 'boots4', name: '魔法靴', type: 'boots', baseDef: 15, icon: '✨', sprite: 'magic_boots' },
    { id: 'ring1', name: '铁戒', type: 'ring', baseAtk: 2, baseDef: 2, icon: '💍', sprite: 'iron_ring' },
    { id: 'ring2', name: '银戒', type: 'ring', baseAtk: 5, baseDef: 5, icon: '💎', sprite: 'silver_ring' },
    { id: 'ring3', name: '金戒', type: 'ring', baseAtk: 10, baseDef: 8, icon: '🌟', sprite: 'gold_ring' },
    { id: 'ring4', name: '钻戒', type: 'ring', baseAtk: 18, baseDef: 15, icon: '💠', sprite: 'diamond_ring' },
    { id: 'necklace1', name: '皮项链', type: 'necklace', baseDef: 3, icon: '📿', sprite: 'bone_necklace' },
    { id: 'necklace2', name: '银项链', type: 'necklace', baseDef: 8, icon: '🔮', sprite: 'silver_necklace' },
    { id: 'necklace3', name: '金项链', type: 'necklace', baseDef: 15, icon: '👘', sprite: 'gold_necklace' },
    { id: 'necklace4', name: '龙牙项链', type: 'necklace', baseDef: 25, icon: '🐚', sprite: 'dragon_necklace' },
    { id: 'potion', name: '生命药水', type: 'consumable', heal: 30, icon: '❤️', price: 10 },
    { id: 'potion2', name: '超级生命药水', type: 'consumable', heal: 80, icon: '💖', price: 30 },
    { id: 'mpotion', name: '魔法药水', type: 'consumable', mp: 30, icon: '💙', price: 15 },
    { id: 'mpotion2', name: '超级魔法药水', type: 'consumable', mp: 80, icon: '💜', price: 45 }
];

// 兼容旧版本 - 基础物品列表 (带默认属性)
window.items = window.BASE_ITEMS.map(i => ({ 
    ...i, 
    atk: i.baseAtk, 
    def: i.baseDef, 
    maxHp: i.baseMaxHp, 
    quality: 'common', 
    qualityName: '普通', 
    color: '#fff' 
}));

// 品质配置
window.QUALITIES = {
    common: { name: '普通', color: '#fff', multiplier: 1 },
    uncommon: { name: '优秀', color: '#1eff00', multiplier: 1.5 },
    rare: { name: '稀有', color: '#0070dd', multiplier: 2.5 },
    epic: { name: '史诗', color: '#a335ee', multiplier: 4 },
    legendary: { name: '传说', color: '#ff8000', multiplier: 7 }
};

// 生成随机物品
window.generateRandomItem = function(type, level = 1) {
    const typeItems = window.BASE_ITEMS.filter(i => i.type === type);
    if (typeItems.length === 0) return null;
    
    const rand = Math.random();
    let quality;
    if (rand < 0.5) quality = 'common';
    else if (rand < 0.75) quality = 'uncommon';
    else if (rand < 0.9) quality = 'rare';
    else if (rand < 0.97) quality = 'epic';
    else quality = 'legendary';
    
    const baseItem = typeItems[Math.floor(Math.random() * typeItems.length)];
    return window.generateItemByQuality(quality, baseItem.type, level);
};

// 按品质生成物品
window.generateItemByQuality = function(quality, type, level = 1) {
    const q = window.QUALITIES[quality] || window.QUALITIES.common;
    const typeItems = window.BASE_ITEMS.filter(i => i.type === type);
    if (typeItems.length === 0) return null;
    
    const baseItem = typeItems[Math.floor(Math.random() * typeItems.length)];
    const item = { ...baseItem };
    
    if (item.baseAtk) item.atk = Math.floor(item.baseAtk * q.multiplier);
    if (item.baseDef) item.def = Math.floor(item.baseDef * q.multiplier);
    if (item.baseMaxHp) item.maxHp = Math.floor(item.baseMaxHp * q.multiplier);
    if (item.baseMaxMp) item.maxMp = Math.floor(item.baseMaxMp * q.multiplier);
    
    item.quality = quality;
    item.qualityName = q.name;
    item.color = q.color;
    
    if (quality !== 'common') {
        item.name = q.name + item.name;
    }
    
    const basePrice = item.baseAtk * 2 || item.baseDef * 3 || item.baseMaxHp * 0.5 || item.baseMaxMp * 1 || item.price || 10;
    item.price = Math.floor(basePrice * q.multiplier * (1 + level * 0.1));
    
    return item;
};

// 获取物品属性描述
window.getItemStats = function(item) {
    if (!item) return '';
    let stats = '';
    if (item.atk) stats += ` ATK:${item.atk}`;
    if (item.atkPercent) stats += ` ATK%+${item.atkPercent}%`;
    if (item.def) stats += ` DEF:${item.def}`;
    if (item.defPercent) stats += ` DEF%+${item.defPercent}%`;
    if (item.maxHp) stats += ` HP+${item.maxHp}`;
    if (item.maxMp) stats += ` MP+${item.maxMp}`;
    if (item.hpRegen) stats += ` HP回${item.hpRegen}/s`;
    if (item.mpRegen) stats += ` MP回${item.mpRegen}/s`;
    return stats;
};

// 玩家渲染函数（使用精灵图系统）
window.renderPlayerSprite = function(ctx, player, x, y, w, h) {
    // 尝试使用精灵图系统
    if (window.SpriteManager) {
        const sprite = window.SpriteManager.generateDefaultHero();
        if (sprite) {
            window.SpriteManager.render(ctx, sprite, player, x, y, w, h);
            return;
        }
    }
    
    // 回退：简单渲染
    const cx = x + w / 2;
    const time = Date.now() / 1000;
    const breathe = Math.sin(time * 2) * 1.5;
    
    const skinColor = '#ffe4d0';
    const hairColor = '#f4c542';
    const eyeColor = '#40d0b0';
    const clothesColor = '#4a9eff';
    
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, y + h * 0.92, w * 0.25, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 身体
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(cx, y + h*0.35 + breathe, w*0.22, 0, Math.PI*2);
    ctx.fill();
    
    // 头发
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.arc(cx, y + h*0.28 + breathe, w*0.25, Math.PI, 0);
    ctx.fill();
    
    // 眼睛
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - 5, y + h*0.35 + breathe, 4, 0, Math.PI*2);
    ctx.arc(cx + 5, y + h*0.35 + breathe, 4, 0, Math.PI*2);
    ctx.fill();
    
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(cx - 5, y + h*0.35 + breathe, 2, 0, Math.PI*2);
    ctx.arc(cx + 5, y + h*0.35 + breathe, 2, 0, Math.PI*2);
    ctx.fill();
    
    // 衣服
    ctx.fillStyle = clothesColor;
    ctx.fillRect(x + w*0.22, y + h*0.5 + breathe, w*0.56, h*0.35);
    
    // 武器
    if (player?.weapon) {
        ctx.fillStyle = player.weapon.color || '#aaa';
        ctx.save();
        ctx.translate(cx + 15, y + h*0.35 + breathe);
        ctx.rotate(Math.sin(time * 3) * 0.1);
        ctx.fillRect(-4, -15, 8, 35);
        ctx.restore();
    }
};

// 装备图标渲染（精细Canvas绘制）
window.renderEquipmentIcon = function(item, size) {
    if (!item) return null;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const cx = size / 2;
    const sprite = item.sprite || '';
    const color = item.color || '#fff';
    
    // 根据类型和sprite绘制
    if (item.type === 'weapon') {
        drawWeaponIcon(ctx, cx, size, sprite, color);
    } else if (item.type === 'armor') {
        drawArmorIcon(ctx, cx, size, sprite, color);
    } else if (item.type === 'helmet') {
        drawHelmetIcon(ctx, cx, size, sprite, color);
    } else if (item.type === 'boots') {
        drawBootsIcon(ctx, cx, size, sprite, color);
    } else if (item.type === 'ring') {
        drawRingIcon(ctx, cx, size, sprite, color);
    } else if (item.type === 'necklace') {
        drawNecklaceIcon(ctx, cx, size, sprite, color);
    } else if (item.type === 'consumable') {
        drawConsumableIcon(ctx, cx, size, item);
    } else {
        // 默认显示emoji
        ctx.fillStyle = color;
        ctx.font = `${size * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon || '?', cx, cx);
    }
    
    return canvas;
};

// 绘制武器图标
function drawWeaponIcon(ctx, cx, size, sprite, color) {
    const h = size * 0.8;
    const w = size * 0.15;
    const x = cx - w/2;
    const y = size * 0.1;
    
    // 刀柄
    ctx.fillStyle = '#654';
    ctx.fillRect(cx - w*1.5, y + h * 0.75, w*3, h * 0.25);
    ctx.fillStyle = '#876';
    ctx.fillRect(cx - w, y + h * 0.78, w*2, h * 0.18);
    
    // 刀镡
    ctx.fillStyle = '#999';
    ctx.fillRect(cx - w*3, y + h * 0.68, w*6, h * 0.08);
    
    // 刀身
    if (sprite === 'fire_sword') {
        // 火焰剑
        const grad = ctx.createLinearGradient(x, y, x, y + h * 0.7);
        grad.addColorStop(0, '#ff0');
        grad.addColorStop(0.5, '#f80');
        grad.addColorStop(1, '#f00');
        ctx.fillStyle = grad;
    } else if (sprite === 'thunder_sword') {
        // 雷鸣剑
        const grad = ctx.createLinearGradient(x, y, x, y + h * 0.7);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, '#8ef');
        grad.addColorStop(1, '#00f');
        ctx.fillStyle = grad;
    } else if (sprite === 'ice_sword') {
        // 冰霜剑
        const grad = ctx.createLinearGradient(x, y, x, y + h * 0.7);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.5, '#8ff');
        grad.addColorStop(1, '#08f');
        ctx.fillStyle = grad;
    } else if (sprite === 'dragon_sword') {
        // 龙鳞剑
        ctx.fillStyle = '#d00';
    } else {
        // 铁剑
        const grad = ctx.createLinearGradient(x, y, x, y + h * 0.7);
        grad.addColorStop(0, '#eee');
        grad.addColorStop(0.5, '#aaa');
        grad.addColorStop(1, '#888');
        ctx.fillStyle = grad;
    }
    
    // 绘制刀身
    ctx.beginPath();
    ctx.moveTo(cx - w*2, y + h * 0.68);
    ctx.lineTo(cx - w, y + h * 0.25);
    ctx.lineTo(cx, y);
    ctx.lineTo(cx + w, y + h * 0.25);
    ctx.lineTo(cx + w*2, y + h * 0.68);
    ctx.closePath();
    ctx.fill();
    
    // 高光
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.moveTo(cx - w*0.5, y + h * 0.6);
    ctx.lineTo(cx - w*0.3, y + h * 0.2);
    ctx.lineTo(cx, y + h * 0.1);
    ctx.lineTo(cx, y + h * 0.5);
    ctx.closePath();
    ctx.fill();
}

// 绘制盔甲图标
function drawArmorIcon(ctx, cx, size, sprite, color) {
    const w = size * 0.6;
    const h = size * 0.75;
    const x = cx - w/2;
    const y = size * 0.12;
    
    if (sprite === 'dragon') {
        // 龙鳞甲
        ctx.fillStyle = '#d00';
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.lineTo(x + w, y + h * 0.3);
        ctx.lineTo(x + w * 0.9, y + h);
        ctx.lineTo(cx, y + h * 0.9);
        ctx.lineTo(x + w * 0.1, y + h);
        ctx.lineTo(x, y + h * 0.3);
        ctx.closePath();
        ctx.fill();
        
        // 龙鳞纹理
        ctx.fillStyle = '#f55';
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3 - row; col++) {
                ctx.beginPath();
                ctx.arc(cx + (col - 1 + row * 0.5) * w * 0.2, y + h * 0.3 + row * h * 0.2, w * 0.08, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    } else if (sprite === 'plate') {
        // 板甲
        ctx.fillStyle = '#666';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#888';
        ctx.fillRect(x + w * 0.1, y + h * 0.1, w * 0.8, h * 0.8);
        ctx.fillStyle = '#aaa';
        ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.3);
    } else if (sprite === 'mail') {
        // 锁甲
        ctx.fillStyle = '#555';
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 4; col++) {
                ctx.beginPath();
                ctx.arc(x + w * 0.15 + col * w * 0.22, y + h * 0.15 + row * h * 0.18, w * 0.08, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    } else if (sprite === 'leather') {
        // 皮甲
        ctx.fillStyle = '#a65';
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.lineTo(x + w, y + h * 0.25);
        ctx.lineTo(x + w * 0.85, y + h);
        ctx.lineTo(cx, y + h * 0.85);
        ctx.lineTo(x + w * 0.15, y + h);
        ctx.lineTo(x, y + h * 0.25);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#c87';
        ctx.fillRect(x + w * 0.3, y + h * 0.2, w * 0.4, h * 0.4);
    } else {
        // 布甲
        ctx.fillStyle = '#668';
        ctx.fillRect(x + w * 0.1, y, w * 0.8, h);
        ctx.fillStyle = '#88a';
        ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.5);
    }
}

// 绘制头盔图标
function drawHelmetIcon(ctx, cx, size, sprite, color) {
    const r = size * 0.35;
    const y = size * 0.4;
    
    if (sprite === 'gold_helm') {
        ctx.fillStyle = '#fc0';
        ctx.beginPath();
        ctx.arc(cx, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fe8';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
    } else if (sprite === 'silver_helm') {
        ctx.fillStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(cx, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#eee';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
    } else if (sprite === 'iron_helm') {
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(cx, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#888';
        ctx.fillRect(cx - r * 0.8, y + r * 0.3, r * 1.6, r * 0.4);
    } else {
        ctx.fillStyle = '#864';
        ctx.beginPath();
        ctx.arc(cx, y, r, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#a86';
        ctx.fillRect(cx - r, y, r * 2, r * 0.8);
    }
}

// 绘制靴子图标
function drawBootsIcon(ctx, cx, size, sprite, color) {
    const w = size * 0.25;
    const h = size * 0.5;
    
    ctx.fillStyle = sprite === 'magic_boots' ? '#80f' : sprite === 'iron_boots' ? '#666' : sprite === 'leather_boots' ? '#864' : '#c94';
    
    // 左靴
    ctx.fillRect(cx - w * 1.3, size * 0.25, w, h);
    ctx.fillRect(cx - w * 1.8, size * 0.65, w * 1.2, h * 0.25);
    
    // 右靴
    ctx.fillRect(cx + w * 0.3, size * 0.3, w, h);
    ctx.fillRect(cx, size * 0.75, w * 1.2, h * 0.25);
}

// 绘制戒指图标
function drawRingIcon(ctx, cx, size, sprite, color) {
    const r = size * 0.3;
    const y = size * 0.5;
    
    if (sprite === 'diamond_ring') {
        ctx.strokeStyle = '#fc0';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#8ff';
        ctx.beginPath();
        ctx.moveTo(cx, y - r * 0.8);
        ctx.lineTo(cx - r * 0.4, y);
        ctx.lineTo(cx + r * 0.4, y);
        ctx.closePath();
        ctx.fill();
    } else if (sprite === 'gold_ring') {
        ctx.strokeStyle = '#fc0';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(cx, y - r * 0.5, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
    } else if (sprite === 'silver_ring') {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, y, r, 0, Math.PI * 2);
        ctx.stroke();
    } else {
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, y, r, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// 绘制项链图标
function drawNecklaceIcon(ctx, cx, size, sprite, color) {
    ctx.strokeStyle = sprite === 'dragon_necklace' ? '#f80' : sprite === 'gold_necklace' ? '#fc0' : sprite === 'silver_necklace' ? '#ccc' : '#864';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(size * 0.2, size * 0.2);
    ctx.quadraticCurveTo(cx, size * 0.5, size * 0.8, size * 0.2);
    ctx.stroke();
    
    // 吊坠
    ctx.fillStyle = sprite === 'dragon_necklace' ? '#f00' : sprite === 'gold_necklace' ? '#fc0' : '#888';
    ctx.beginPath();
    ctx.arc(cx, size * 0.5, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
}

// 绘制消耗品图标
function drawConsumableIcon(ctx, cx, size, item) {
    if (item.heal) {
        // 生命药水 - 红色瓶
        ctx.fillStyle = '#f44';
        ctx.beginPath();
        ctx.moveTo(cx - size * 0.15, size * 0.15);
        ctx.lineTo(cx + size * 0.15, size * 0.15);
        ctx.lineTo(cx + size * 0.2, size * 0.3);
        ctx.lineTo(cx + size * 0.25, size * 0.85);
        ctx.lineTo(cx - size * 0.25, size * 0.85);
        ctx.lineTo(cx - size * 0.2, size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f88';
        ctx.fillRect(cx - size * 0.15, size * 0.35, size * 0.2, size * 0.3);
    } else if (item.mp) {
        // 魔法药水 - 蓝色瓶
        ctx.fillStyle = '#44f';
        ctx.beginPath();
        ctx.moveTo(cx - size * 0.15, size * 0.15);
        ctx.lineTo(cx + size * 0.15, size * 0.15);
        ctx.lineTo(cx + size * 0.2, size * 0.3);
        ctx.lineTo(cx + size * 0.25, size * 0.85);
        ctx.lineTo(cx - size * 0.25, size * 0.85);
        ctx.lineTo(cx - size * 0.2, size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#88f';
        ctx.fillRect(cx - size * 0.15, size * 0.35, size * 0.2, size * 0.3);
    }
}

// 玩家图标渲染（用于UI面板显示，使用精灵图系统保持一致）
window.renderPlayerIcon = function(player, size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // 尝试使用精灵图系统
    if (window.SpriteManager) {
        const sprite = window.SpriteManager.generateDefaultHero();
        if (sprite && sprite.frames && sprite.frames.down && sprite.frames.down.idle) {
            // 获取idle第一帧
            const frame = sprite.frames.down.idle[0];
            if (frame) {
                // 绘制精灵帧到canvas
                ctx.drawImage(frame, 0, 0, size, size);
                return canvas;
            }
        }
    }
    
    // 回退：手动绘制（与精灵图风格一致）
    const cx = size / 2;
    const time = Date.now() / 1000;
    const breathe = Math.sin(time * 2) * size * 0.01;
    
    // 获取皮肤配置
    const skin = window.PlayerSkins?.getCurrentSkin() || {};
    const skinColor = skin.skinColor || '#ffe4d0';
    const hairColor = skin.hairColor || '#f4c542';
    const eyeColor = skin.eyeColor || '#40d0b0';
    const clothesColor = skin.clothesColor || '#4a9eff';
    
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, size * 0.9, size * 0.2, size * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 腿（与精灵图一致）
    ctx.fillStyle = clothesColor;
    ctx.fillRect(cx - size * 0.16, size * 0.6 + breathe, size * 0.12, size * 0.25);
    ctx.fillRect(cx + size * 0.03, size * 0.6 + breathe, size * 0.12, size * 0.25);
    
    // 身体
    ctx.fillStyle = clothesColor;
    ctx.beginPath();
    ctx.roundRect(cx - size * 0.22, size * 0.35 + breathe, size * 0.44, size * 0.28, size * 0.06);
    ctx.fill();
    
    // 手臂
    ctx.fillStyle = skinColor;
    ctx.fillRect(cx - size * 0.28, size * 0.38 + breathe, size * 0.09, size * 0.25);
    ctx.fillRect(cx + size * 0.19, size * 0.38 + breathe, size * 0.09, size * 0.25);
    
    // 头部
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(cx, size * 0.25 + breathe, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
    
    // 头发
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.arc(cx, size * 0.2 + breathe, size * 0.2, Math.PI, 0);
    ctx.fill();
    // 侧发
    ctx.fillRect(cx - size * 0.18, size * 0.2 + breathe, size * 0.07, size * 0.15);
    ctx.fillRect(cx + size * 0.11, size * 0.2 + breathe, size * 0.07, size * 0.15);
    
    // 眼睛
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - size * 0.06, size * 0.27 + breathe, size * 0.05, 0, Math.PI * 2);
    ctx.arc(cx + size * 0.06, size * 0.27 + breathe, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(cx - size * 0.06, size * 0.27 + breathe, size * 0.025, 0, Math.PI * 2);
    ctx.arc(cx + size * 0.06, size * 0.27 + breathe, size * 0.025, 0, Math.PI * 2);
    ctx.fill();
    
    // 武器（如果有）
    if (player?.weapon) {
        const weaponColor = player.weapon.color || '#aaa';
        ctx.fillStyle = weaponColor;
        ctx.save();
        ctx.translate(cx + size * 0.25, size * 0.35 + breathe);
        ctx.rotate(Math.sin(time * 3) * 0.15);
        ctx.fillRect(-size * 0.05, -size * 0.2, size * 0.1, size * 0.4);
        ctx.restore();
    }
    
    return canvas;
};
