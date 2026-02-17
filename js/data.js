window.TILE = 32;
window.MAP_W = 15;
window.MAP_H = 20;

const itemQualities = {
    common: { name: '普通', color: '#fff', multiplier: 1.0 },
    uncommon: { name: '优秀', color: '#4f4', multiplier: 1.3 },
    rare: { name: '精良', color: '#44f', multiplier: 1.6 },
    epic: { name: '史诗', color: '#a4f', multiplier: 2.0 },
    legendary: { name: '传说', color: '#fa4', multiplier: 2.5 }
};

const baseItems = [
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
    
    { id: 'potion', name: '生命药水', type: 'consumable', heal: 30, icon: '🧪' },
    { id: 'potion2', name: '超级药水', type: 'consumable', heal: 80, icon: '⚗️' },
    { id: 'mpotion', name: '魔法药水', type: 'consumable', mp: 20, icon: '💧' },
    { id: 'mpotion2', name: '超级魔法药水', type: 'consumable', mp: 50, icon: '🧿' },
    { id: 'gold', name: '金币', type: 'treasure', value: 10, icon: '💰' }
];

function createItem(baseItem, quality, level = 1) {
    const q = itemQualities[quality];
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
    
    if (quality !== 'common') {
        item.name = q.name + item.name;
    }
    
    return item;
}

function generateRandomItem(type, level = 1) {
    const typeItems = baseItems.filter(i => i.type === type);
    if (typeItems.length === 0) return null;
    
    const rand = Math.random();
    let quality;
    if (rand < 0.5) quality = 'common';
    else if (rand < 0.75) quality = 'uncommon';
    else if (rand < 0.9) quality = 'rare';
    else if (rand < 0.97) quality = 'epic';
    else quality = 'legendary';
    
    const baseItem = typeItems[Math.floor(Math.random() * typeItems.length)];
    const item = createItem(baseItem, quality, level);
    item.uid = Date.now() + Math.random();
    return item;
}

function generateItemByQuality(quality, type, level = 1) {
    const typeItems = baseItems.filter(i => i.type === type);
    if (typeItems.length === 0) return null;
    const baseItem = typeItems[Math.floor(Math.random() * typeItems.length)];
    const item = createItem(baseItem, quality, level);
    item.uid = Date.now() + Math.random();
    return item;
}

window.items = baseItems.map(i => ({ ...i, atk: i.baseAtk, def: i.baseDef, maxHp: i.baseMaxHp, quality: 'common', qualityName: '普通', color: '#fff' }));
window.generateRandomItem = generateRandomItem;
window.generateItemByQuality = generateItemByQuality;
window.itemQualities = itemQualities;
window.baseItems = baseItems;

window.skills = [
    { id: 'slash', name: '斩击', icon: '⚔️', mp: 0, cd: 0, damage: 1.2, range: 50, type: 'single', desc: '物理攻击' },
    { id: 'fireball', name: '火球', icon: '🔥', mp: 15, cd: 60, damage: 1.8, range: 150, type: 'projectile', desc: '火焰魔法攻击', projectileColor: '#fa0', particleColor: '#fd4', size: 14, speed: 6, isFire: true },
    { id: 'thunder', name: '雷电', icon: '⚡', mp: 20, cd: 80, damage: 1.5, range: 180, type: 'projectile', desc: '雷电魔法攻击', projectileColor: '#0ff', particleColor: '#ff0', size: 10, speed: 8, isLightning: true },
    { id: 'vine', name: '藤蔓', icon: '🌿', mp: 15, cd: 70, damage: 1.0, range: 140, type: 'projectile', desc: '藤蔓魔法攻击', projectileColor: '#0f0', particleColor: '#4f4', size: 12, speed: 5, isVine: true },
    { id: 'tornado', name: '龙卷', icon: '🌪️', mp: 25, cd: 100, damage: 0.8, range: 160, type: 'projectile', desc: '龙卷风攻击', projectileColor: '#aaa', particleColor: '#ccc', size: 16, speed: 4, isTornado: true },
    { id: 'ice', name: '冰霜', icon: '❄️', mp: 18, cd: 75, damage: 1.3, range: 140, type: 'projectile', desc: '冰霜魔法攻击', projectileColor: '#0cf', particleColor: '#8ef', size: 12, speed: 6, isIce: true }
];

window.enemyTypes = [
    { name: '史莱姆', type: 'slime', hp: 15, atk: 3, def: 0, exp: 5, gold: 3, color: '#4a4' },
    { name: '哥布林', type: 'goblin', hp: 25, atk: 5, def: 1, exp: 8, gold: 5, color: '#484' },
    { name: '蝙蝠', type: 'bat', hp: 10, atk: 4, def: 0, exp: 6, gold: 4, color: '#448' },
    { name: '蜘蛛', type: 'spider', hp: 20, atk: 6, def: 1, exp: 7, gold: 5, color: '#444' }
];

window.bossTypes = [
    { name: '史莱姆王', type: 'slime_king', hp: 80, atk: 12, def: 2, exp: 40, gold: 80, color: '#4a4', size: 40 },
    { name: '哥布林领主', type: 'goblin_lord', hp: 120, atk: 18, def: 4, exp: 60, gold: 120, color: '#4a4', size: 36 },
    { name: 'orc王', type: 'orc_king', hp: 180, atk: 25, def: 8, exp: 100, gold: 180, color: '#484', size: 44 },
    { name: '黑暗法师', type: 'dark_mage', hp: 150, atk: 35, def: 5, exp: 150, gold: 250, color: '#848', size: 32 },
    { name: '火龙', type: 'fire_dragon', hp: 300, atk: 40, def: 15, exp: 300, gold: 500, color: '#a44', size: 56 },
    { name: '冰魔', type: 'ice_devil', hp: 350, atk: 45, def: 18, exp: 400, gold: 600, color: '#aaf', size: 48 },
    { name: '恶魔领主', type: 'demon_lord', hp: 500, atk: 60, def: 25, exp: 600, gold: 1000, color: '#a2a', size: 52 }
];
