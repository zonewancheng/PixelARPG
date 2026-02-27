/**
 * PixelARPG - 道具类（药水、消耗品）
 * 统一管理所有消耗品道具
 */

window.CONSUMABLES = [
    {
        id: 'gold',
        name: '金币',
        nameEn: 'Gold',
        type: 'treasure',
        icon: '💰',
        value: 10,
        desc: '游戏货币',
        color: '#ffd700',
        quality: 'common',
        qualityName: '普通'
    },
    {
        id: 'potion',
        name: '生命药水',
        nameEn: 'Health Potion',
        type: 'consumable',
        icon: '🧪',
        heal: 30,
        price: 20,
        desc: '恢复30点生命值',
        color: '#ff6666',
        quality: 'common',
        qualityName: '普通'
    },
    {
        id: 'potion2',
        name: '超级生命药水',
        nameEn: 'Super Health Potion',
        type: 'consumable',
        icon: '⚗️',
        heal: 80,
        price: 50,
        desc: '恢复80点生命值',
        color: '#ff4444',
        quality: 'rare',
        qualityName: '稀有'
    },
    {
        id: 'mpotion',
        name: '魔法药水',
        nameEn: 'Mana Potion',
        type: 'consumable',
        icon: '💧',
        mp: 20,
        price: 15,
        desc: '恢复20点魔法值',
        color: '#6688ff',
        quality: 'common',
        qualityName: '普通'
    },
    {
        id: 'mpotion2',
        name: '超级魔法药水',
        nameEn: 'Super Mana Potion',
        type: 'consumable',
        icon: '🧿',
        mp: 50,
        price: 40,
        desc: '恢复50点魔法值',
        color: '#4466ff',
        quality: 'rare',
        qualityName: '稀有'
    }
];

// 根据ID获取道具
window.getConsumableById = function(id) {
    return window.CONSUMABLES.find(c => c.id === id);
};

// 创建道具实例（用于背包）
window.createConsumableInstance = function(consumableId) {
    const consumable = window.getConsumableById(consumableId);
    if (!consumable) return null;
    
    return {
        ...consumable,
        uid: `${consumable.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isInstance: true
    };
};

// 渲染道具图标
window.renderConsumableIcon = function(consumable, size) {
    if (size === undefined) size = 24;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const cx = size / 2;
    const cy = size / 2;
    
    // 金币渲染
    if (consumable.id === 'gold') {
        // 外发光
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 4;
        
        // 金币主体
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // 内圈
        ctx.strokeStyle = '#daa520';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2);
        ctx.stroke();
        
        // G字母
        ctx.fillStyle = '#ff6600';
        ctx.font = `bold ${size * 0.4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('G', cx, cy);
        
        return canvas.toDataURL();
    }
    
    // 绘制瓶子轮廓
    ctx.fillStyle = consumable.color || '#ff6666';
    
    // 瓶身
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.25, cy + size * 0.3);
    ctx.lineTo(cx - size * 0.25, cy - size * 0.1);
    ctx.quadraticCurveTo(cx - size * 0.25, cy - size * 0.2, cx - size * 0.15, cy - size * 0.25);
    ctx.lineTo(cx - size * 0.15, cy - size * 0.35);
    ctx.lineTo(cx + size * 0.15, cy - size * 0.35);
    ctx.lineTo(cx + size * 0.15, cy - size * 0.25);
    ctx.quadraticCurveTo(cx + size * 0.25, cy - size * 0.2, cx + size * 0.25, cy - size * 0.1);
    ctx.lineTo(cx + size * 0.25, cy + size * 0.3);
    ctx.quadraticCurveTo(cx + size * 0.25, cy + size * 0.4, cx, cy + size * 0.4);
    ctx.quadraticCurveTo(cx - size * 0.25, cy + size * 0.4, cx - size * 0.25, cy + size * 0.3);
    ctx.fill();
    
    // 高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(cx - size * 0.1, cy, size * 0.08, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 瓶口
    ctx.fillStyle = '#888';
    ctx.fillRect(cx - size * 0.1, cy - size * 0.38, size * 0.2, size * 0.08);
    
    return canvas.toDataURL();
};

// 使用道具
window.useConsumable = function(consumable, player) {
    if (!consumable || !player) return false;
    
    // 治疗效果
    if (consumable.heal && consumable.heal > 0) {
        const healAmount = Math.min(consumable.heal, player.maxHp - player.hp);
        player.hp += healAmount;
        return { success: true, heal: healAmount };
    }
    
    // 魔法恢复
    if (consumable.mp && consumable.mp > 0) {
        const mpAmount = Math.min(consumable.mp, player.maxMp - player.mp);
        player.mp += mpAmount;
        return { success: true, mp: mpAmount };
    }
    
    return { success: false };
};
