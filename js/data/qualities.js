/**
 * PixelARPG - 物品品质数据模块
 * 定义装备品质等级、颜色和属性倍率
 */

window.ITEM_QUALITIES = {
    common: { name: '普通', color: '#fff', multiplier: 1.0 },
    uncommon: { name: '优秀', color: '#4f4', multiplier: 1.3 },
    rare: { name: '精良', color: '#44f', multiplier: 1.6 },
    epic: { name: '史诗', color: '#a4f', multiplier: 2.0 },
    legendary: { name: '传说', color: '#fa4', multiplier: 2.5 }
};

window.EQUIPMENT_SLOTS = {
    weapon: { name: '武器', icon: '🗡️' },
    armor: { name: '衣服', icon: '👕' },
    helmet: { name: '帽子', icon: '🧢' },
    boots: { name: '鞋子', icon: '👢' },
    ring: { name: '戒指', icon: '💍' },
    necklace: { name: '项链', icon: '📿' }
};

window.QUALITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
