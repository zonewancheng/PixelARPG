/**
 * PixelARPG - 装备/物品数据模块
 * 定义基础物品、物品生成和属性计算
 */

// 基础物品定义 (不包含随机属性)
window.BASE_ITEMS = [
    { id: 'weapon1', name: '铁剑', type: 'weapon', baseAtk: 8, icon: '🗡️', sprite: 'sword' },
    { id: 'weapon2', name: '焰火剑', type: 'weapon', baseAtk: 18, icon: '🔥', sprite: 'fire_sword' },
    { id: 'weapon3', name: '雷鸣剑', type: 'weapon', baseAtk: 28, icon: '⚡', sprite: 'thunder_sword' },
    { id: 'weapon4', name: '寒冰剑', type: 'weapon', baseAtk: 24, icon: '❄️', sprite: 'ice_sword' },
    { id: 'weapon5', name: '恶魔之剑', type: 'weapon', baseAtk: 45, icon: '👹', sprite: 'demon_sword' },
    
    { id: 'armor1', name: '布衣', type: 'armor', baseDef: 3, icon: '👕', sprite: 'cloth' },
    { id: 'armor2', name: '皮甲', type: 'armor', baseDef: 8, icon: '🧥', sprite: 'leather' },
    { id: 'armor3', name: '铁甲', type: 'armor', baseDef: 15, icon: '🛡️', sprite: 'iron' },
    { id: 'armor4', name: '龙鳞甲', type: 'armor', baseDef: 25, icon: '🐉', sprite: 'dragon' },
    
    { id: 'helmet1', name: '布帽', type: 'helmet', baseDef: 2, icon: '🧢', sprite: 'cloth_helm' },
    { id: 'helmet2', name: '皮帽', type: 'helmet', baseDef: 5, icon: '🎩', sprite: 'leather_helm' },
    { id: 'helmet3', name: '铁头盔', type: 'helmet', baseDef: 10, icon: '⛑️', sprite: 'iron_helm' },
    
    { id: 'boots1', name: '草鞋', type: 'boots', baseDef: 2, icon: '🩰', sprite: 'grass_boots' },
    { id: 'boots2', name: '皮靴', type: 'boots', baseDef: 5, icon: '👢', sprite: 'leather_boots' },
    { id: 'boots3', name: '铁靴', type: 'boots', baseDef: 10, icon: '👞', sprite: 'iron_boots' },
    
    { id: 'ring1', name: '力量戒指', type: 'ring', baseAtk: 5, icon: '💍', sprite: 'power_ring' },
    { id: 'ring2', name: '敏捷戒指', type: 'ring', baseAtk: 3, baseDef: 3, icon: '💎', sprite: 'speed_ring' },
    { id: 'ring3', name: '生命戒指', type: 'ring', baseMaxHp: 30, icon: '💠', sprite: 'health_ring' },
    
    { id: 'neck1', name: '生命护符', type: 'necklace', baseMaxHp: 30, icon: '📿', sprite: 'health_amulet' },
    { id: 'neck2', name: '魔法护符', type: 'necklace', baseMaxMp: 20, icon: '🔮', sprite: 'magic_amulet' },
    { id: 'neck3', name: '力量项链', type: 'necklace', baseAtk: 10, icon: '📿', sprite: 'power_necklace' },
    
    { id: 'potion', name: '生命药水', type: 'consumable', heal: 30, icon: '🧪', price: 20 },
    { id: 'potion2', name: '超级药水', type: 'consumable', heal: 80, icon: '⚗️', price: 50 },
    { id: 'mpotion', name: '魔法药水', type: 'consumable', mp: 20, icon: '💧', price: 15 },
    { id: 'mpotion2', name: '超级魔法药水', type: 'consumable', mp: 50, icon: '🧿', price: 40 },
    { id: 'gold', name: '金币', type: 'treasure', value: 10, icon: '💰' }
];

// 物品类型列表
window.ITEM_TYPES = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace', 'consumable', 'treasure'];

/**
 * 渲染玩家外观（根据穿戴的装备）
 */
window.renderPlayerSprite = function(ctx, player, x, y, w, h) {
    const dir = player.dirX > 0 ? 1 : (player.dirX < 0 ? -1 : 1);
    
    // 基础身体
    ctx.fillStyle = '#fa0';
    ctx.fillRect(x + 8, y, 8, 4);
    ctx.fillStyle = '#f80';
    ctx.fillRect(x + 4, y + 4, 16, 12);
    
    // 根据 armor 渲染衣服
    if (player.armor && player.armor.sprite) {
        const armorSprite = player.armor.sprite;
        if (armorSprite === 'dragon') {
            ctx.fillStyle = '#a55';
            ctx.fillRect(x + 4, y + 4, 16, 14);
            ctx.fillStyle = '#c77';
            ctx.fillRect(x + 6, y + 6, 12, 10);
            ctx.fillStyle = '#fdd';
            ctx.fillRect(x + 8, y + 8, 8, 3);
        } else if (armorSprite === 'iron') {
            ctx.fillStyle = '#888';
            ctx.fillRect(x + 4, y + 4, 16, 14);
            ctx.fillStyle = '#aaa';
            ctx.fillRect(x + 6, y + 6, 12, 10);
            ctx.fillStyle = '#ccc';
            ctx.fillRect(x + 10, y + 8, 4, 4);
        } else if (armorSprite === 'leather') {
            ctx.fillStyle = '#a85';
            ctx.fillRect(x + 4, y + 4, 16, 12);
            ctx.fillStyle = '#c97';
            ctx.fillRect(x + 6, y + 6, 12, 8);
        } else {
            ctx.fillStyle = '#a85';
            ctx.fillRect(x + 4, y + 4, 16, 12);
        }
    }
    
    // 腿部
    ctx.fillStyle = '#f80';
    ctx.fillRect(x + 8, y + 16, 8, 12);
    
    ctx.fillStyle = '#a52';
    if (dir > 0) {
        ctx.fillRect(x + 14, y + 20, 4, 8);
        ctx.fillRect(x + 10, y + 26, 4, 4);
    } else {
        ctx.fillRect(x + 6, y + 20, 4, 8);
        ctx.fillRect(x + 10, y + 26, 4, 4);
    }
    
    // 武器
    if (player.weapon && player.attacking === 0) {
        const wp = player.weapon.sprite;
        const handX = dir > 0 ? x + 18 : x - 6;
        const handY = y + 14;
        
        if (wp === 'fire_sword') {
            ctx.fillStyle = '#f00';
            ctx.fillRect(handX + 2, handY, 4, 16);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(handX, handY + 12, 8, 4);
        } else if (wp === 'thunder_sword') {
            ctx.fillStyle = '#ff0';
            ctx.fillRect(handX + 3, handY, 2, 16);
            ctx.fillStyle = '#0ff';
            ctx.fillRect(handX, handY + 12, 8, 4);
        } else if (wp === 'ice_sword') {
            ctx.fillStyle = '#0cf';
            ctx.fillRect(handX + 2, handY, 4, 16);
            ctx.fillStyle = '#8ef';
            ctx.fillRect(handX, handY + 12, 8, 4);
        } else if (wp === 'demon_sword') {
            ctx.fillStyle = '#a0a';
            ctx.fillRect(handX + 1, handY, 6, 16);
            ctx.fillStyle = '#f0f';
            ctx.fillRect(handX - 1, handY + 12, 10, 4);
        } else {
            ctx.fillStyle = '#aaa';
            ctx.fillRect(handX + 2, handY + 2, 4, 12);
            ctx.fillStyle = '#888';
            ctx.fillRect(handX, handY + 10, 8, 4);
        }
    }
    
    // 头盔
    if (player.helmet && player.helmet.sprite) {
        const helmSprite = player.helmet.sprite;
        if (helmSprite === 'iron_helm') {
            ctx.fillStyle = '#888';
            ctx.fillRect(x + 6, y - 2, 12, 6);
            ctx.fillStyle = '#aaa';
            ctx.fillRect(x + 8, y, 8, 2);
        } else if (helmSprite === 'leather_helm') {
            ctx.fillStyle = '#a85';
            ctx.fillRect(x + 7, y, 10, 4);
        }
    }
};

/**
 * 渲染玩家头像（用于角色面板和左上角头像）
 */
window.renderPlayerIcon = function(player, size = 48) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const dummyPlayer = {
        dirX: player.dirX || 1,
        armor: player.armor,
        weapon: player.weapon,
        helmet: player.helmet,
        attacking: 0
    };
    
    const scale = size / 32;
    window.renderPlayerSprite(ctx, dummyPlayer, 0, 0, size, size);
    
    return canvas.toDataURL();
};

/**
 * 渲染装备图标（用于背包、商店、图鉴等）
 */
window.renderEquipmentIcon = function(item, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const color = item.color || '#888';
    const w = size;
    const h = size;
    const x = 0;
    const y = 0;
    
    const sprite = item.sprite || item.type;
    
    // 武器渲染
    if (item.type === 'weapon') {
        if (sprite === 'fire_sword') {
            ctx.fillStyle = '#a00';
            ctx.fillRect(x + w*0.35, y + h*0.1, w*0.15, h*0.5);
            ctx.fillStyle = '#c74';
            ctx.fillRect(x + w*0.3, y + h*0.55, w*0.25, h*0.2);
            ctx.fillStyle = '#f96';
            ctx.fillRect(x + w*0.35, y + h*0.7, w*0.15, h*0.15);
            ctx.fillStyle = '#f00';
            ctx.fillRect(x + w*0.38, y + h*0.05, w*0.1, h*0.08);
        } else if (sprite === 'thunder_sword') {
            ctx.fillStyle = '#cc0';
            ctx.fillRect(x + w*0.4, y + h*0.1, w*0.1, h*0.5);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(x + w*0.35, y + h*0.55, w*0.2, h*0.2);
            ctx.fillStyle = '#0ff';
            ctx.fillRect(x + w*0.3, y, w*0.3, h*0.1);
            ctx.fillRect(x + w*0.45, y + h*0.1, w*0.1, h*0.3);
        } else if (sprite === 'ice_sword') {
            ctx.fillStyle = '#08c';
            ctx.fillRect(x + w*0.4, y + h*0.1, w*0.1, h*0.5);
            ctx.fillStyle = '#8ef';
            ctx.fillRect(x + w*0.35, y + h*0.55, w*0.2, h*0.2);
            ctx.fillStyle = '#cef';
            ctx.fillRect(x + w*0.3, y, w*0.3, h*0.15);
        } else if (sprite === 'demon_sword') {
            ctx.fillStyle = '#606';
            ctx.fillRect(x + w*0.35, y + h*0.1, w*0.15, h*0.5);
            ctx.fillStyle = '#909';
            ctx.fillRect(x + w*0.3, y + h*0.55, w*0.25, h*0.2);
            ctx.fillStyle = '#f0f';
            ctx.fillRect(x + w*0.25, y + h*0.7, w*0.35, h*0.1);
        } else {
            ctx.fillStyle = '#888';
            ctx.fillRect(x + w*0.4, y + h*0.15, w*0.1, h*0.5);
            ctx.fillStyle = '#aaa';
            ctx.fillRect(x + w*0.35, y + h*0.6, w*0.2, h*0.15);
        }
    }
    // 护甲渲染
    else if (item.type === 'armor') {
        if (sprite === 'dragon') {
            ctx.fillStyle = '#a55';
            ctx.fillRect(x + w*0.15, y + h*0.2, w*0.7, h*0.5);
            ctx.fillStyle = '#c77';
            ctx.fillRect(x + w*0.2, y + h*0.3, w*0.6, h*0.3);
            ctx.fillStyle = '#fdd';
            ctx.fillRect(x + w*0.25, y + h*0.35, w*0.5, h*0.1);
        } else if (sprite === 'iron') {
            ctx.fillStyle = '#777';
            ctx.fillRect(x + w*0.15, y + h*0.2, w*0.7, h*0.5);
            ctx.fillStyle = '#999';
            ctx.fillRect(x + w*0.2, y + h*0.3, w*0.6, h*0.3);
            ctx.fillStyle = '#ccc';
            ctx.fillRect(x + w*0.35, y + h*0.4, w*0.3, h*0.1);
        } else if (sprite === 'leather') {
            ctx.fillStyle = '#a73';
            ctx.fillRect(x + w*0.2, y + h*0.25, w*0.6, h*0.45);
            ctx.fillStyle = '#c95';
            ctx.fillRect(x + w*0.25, y + h*0.35, w*0.5, h*0.25);
        } else {
            ctx.fillStyle = '#a85';
            ctx.fillRect(x + w*0.2, y + h*0.25, w*0.6, h*0.45);
        }
    }
    // 头盔渲染
    else if (item.type === 'helmet') {
        if (sprite === 'iron_helm') {
            ctx.fillStyle = '#777';
            ctx.fillRect(x + w*0.2, y + h*0.15, w*0.6, h*0.5);
            ctx.fillStyle = '#999';
            ctx.fillRect(x + w*0.25, y + h*0.2, w*0.5, h*0.35);
            ctx.fillStyle = '#555';
            ctx.fillRect(x + w*0.35, y + h*0.1, w*0.3, h*0.1);
        } else if (sprite === 'leather_helm') {
            ctx.fillStyle = '#a73';
            ctx.fillRect(x + w*0.2, y + h*0.2, w*0.6, h*0.45);
            ctx.fillStyle = '#c95';
            ctx.fillRect(x + w*0.25, y + h*0.25, w*0.5, h*0.3);
        } else {
            ctx.fillStyle = '#a85';
            ctx.fillRect(x + w*0.25, y + h*0.25, w*0.5, h*0.4);
        }
    }
    // 鞋子渲染
    else if (item.type === 'boots') {
        if (sprite === 'iron_boots') {
            ctx.fillStyle = '#777';
            ctx.fillRect(x + w*0.2, y + h*0.3, w*0.25, h*0.5);
            ctx.fillRect(x + w*0.55, y + h*0.3, w*0.25, h*0.5);
        } else if (sprite === 'leather_boots') {
            ctx.fillStyle = '#a73';
            ctx.fillRect(x + w*0.2, y + h*0.35, w*0.25, h*0.45);
            ctx.fillRect(x + w*0.55, y + h*0.35, w*0.25, h*0.45);
        } else {
            ctx.fillStyle = '#7a5';
            ctx.fillRect(x + w*0.2, y + h*0.4, w*0.25, h*0.4);
            ctx.fillRect(x + w*0.55, y + h*0.4, w*0.25, h*0.4);
        }
    }
    // 戒指渲染
    else if (item.type === 'ring') {
        if (sprite === 'power_ring') {
            ctx.fillStyle = '#d44';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.5, w*0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f66';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.5, w*0.15, 0, Math.PI * 2);
            ctx.fill();
        } else if (sprite === 'speed_ring') {
            ctx.fillStyle = '#4dd';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.5, w*0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#aff';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.5, w*0.15, 0, Math.PI * 2);
            ctx.fill();
        } else if (sprite === 'health_ring') {
            ctx.fillStyle = '#4a4';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.5, w*0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#6c6';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.5, w*0.15, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.5, w*0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x + w*0.4, y + h*0.4, w*0.1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    // 项链渲染
    else if (item.type === 'necklace') {
        if (sprite === 'health_amulet') {
            ctx.fillStyle = '#d44';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.4, w*0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(x + w*0.45, y + h*0.55, w*0.1, h*0.3);
            ctx.fillStyle = '#f66';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.4, w*0.1, 0, Math.PI * 2);
            ctx.fill();
        } else if (sprite === 'magic_amulet') {
            ctx.fillStyle = '#44d';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.4, w*0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(x + w*0.45, y + h*0.55, w*0.1, h*0.3);
            ctx.fillStyle = '#66f';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.4, w*0.1, 0, Math.PI * 2);
            ctx.fill();
        } else if (sprite === 'power_necklace') {
            ctx.fillStyle = '#d4d';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.4, w*0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(x + w*0.45, y + h*0.55, w*0.1, h*0.3);
            ctx.fillStyle = '#f6f';
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.4, w*0.1, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x + w*0.5, y + h*0.4, w*0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(x + w*0.45, y + h*0.55, w*0.1, h*0.3);
        }
    }
    else {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.3, y + h*0.3, w*0.4, h*0.4);
    }
    
    return canvas.toDataURL();
};

/**
 * 根据基础物品、品质和等级创建完整物品
 * @param {Object} baseItem - 基础物品数据
 * @param {string} quality - 品质等级 (common/uncommon/rare/epic/legendary)
 * @param {number} level - 物品等级
 * @returns {Object} 完整的物品对象
 */
window.createItem = function(baseItem, quality, level = 1) {
    const q = window.ITEM_QUALITIES[quality];
    const item = { 
        ...baseItem, 
        quality: quality,
        qualityName: q.name,
        color: q.color,
        level: level
    };
    
    const mult = q.multiplier * (1 + level * 0.1);
    
    if (item.baseAtk) item.atk = Math.floor(item.baseAtk * mult);
    if (item.baseDef) item.def = Math.floor(item.baseDef * mult);
    if (item.baseMaxHp) item.maxHp = Math.floor(item.baseMaxHp * mult);
    if (item.baseMaxMp) item.maxMp = Math.floor(item.baseMaxMp * mult);
    
    // 高品质物品可能有额外属性
    if (quality === 'uncommon' || quality === 'rare' || quality === 'epic' || quality === 'legendary') {
        if (Math.random() < 0.3) {
            item.atkPercent = Math.floor(q.multiplier * 5);
        }
        if (Math.random() < 0.3) {
            item.defPercent = Math.floor(q.multiplier * 5);
        }
        if (Math.random() < 0.2) {
            item.hpRegen = Math.floor(q.multiplier * 0.5);
        }
        if (Math.random() < 0.2) {
            item.mpRegen = Math.floor(q.multiplier * 0.5);
        }
    }
    
    // 非普通品质在名称前加品质前缀
    if (quality !== 'common') {
        item.name = q.name + item.name;
    }
    
    // 计算价格
    const basePrice = item.baseAtk * 2 || item.baseDef * 3 || item.baseMaxHp * 0.5 || item.baseMaxMp * 1 || item.price || 10;
    item.price = Math.floor(basePrice * q.multiplier * (1 + level * 0.1));
    
    return item;
};

/**
 * 随机生成物品
 * @param {string} type - 物品类型
 * @param {number} level - 物品等级
 * @returns {Object} 随机物品
 */
window.generateRandomItem = function(type, level = 1) {
    const typeItems = window.BASE_ITEMS.filter(i => i.type === type);
    if (typeItems.length === 0) return null;
    
    // 品质概率: 50% common, 25% uncommon, 15% rare, 7% epic, 3% legendary
    const rand = Math.random();
    let quality;
    if (rand < 0.5) quality = 'common';
    else if (rand < 0.75) quality = 'uncommon';
    else if (rand < 0.9) quality = 'rare';
    else if (rand < 0.97) quality = 'epic';
    else quality = 'legendary';
    
    const baseItem = typeItems[Math.floor(Math.random() * typeItems.length)];
    return window.createItem(baseItem, quality, level);
};

/**
 * 根据指定品质生成物品
 * @param {string} quality - 品质等级
 * @param {string} type - 物品类型
 * @param {number} level - 物品等级
 * @returns {Object} 指定品质的物品
 */
window.generateItemByQuality = function(quality, type, level = 1) {
    const typeItems = window.BASE_ITEMS.filter(i => i.type === type);
    if (typeItems.length === 0) return null;
    const baseItem = typeItems[Math.floor(Math.random() * typeItems.length)];
    const item = window.createItem(baseItem, quality, level);
    item.uid = Date.now() + Math.random();
    return item;
};

/**
 * 获取物品属性描述
 * @param {Object} item - 物品对象
 * @returns {string} 属性描述字符串
 */
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
