/**
 * PixelARPG - 技能数据模块
 * 定义玩家可使用的技能
 */

window.SKILLS = [
    { id: 'slash', name: '斩击', icon: '⚔️', mp: 0, cd: 0, damage: 1.2, range: 50, type: 'single', desc: '物理攻击', render: 'slash' },
    { id: 'fireball', name: '火球', icon: '🔥', mp: 15, cd: 60, damage: 1.8, range: 150, type: 'projectile', desc: '火焰魔法攻击', projectileColor: '#fa0', particleColor: '#fd4', size: 14, speed: 6, isFire: true, render: 'fireball' },
    { id: 'thunder', name: '雷电', icon: '⚡', mp: 20, cd: 80, damage: 1.5, range: 180, type: 'projectile', desc: '雷电魔法攻击', projectileColor: '#0ff', particleColor: '#ff0', size: 10, speed: 8, isLightning: true, render: 'thunder' },
    { id: 'vine', name: '藤蔓', icon: '🌿', mp: 15, cd: 70, damage: 1.0, range: 140, type: 'projectile', desc: '藤蔓魔法攻击', projectileColor: '#0f0', particleColor: '#4f4', size: 12, speed: 5, isVine: true, render: 'vine' },
    { id: 'tornado', name: '龙卷', icon: '🌪️', mp: 25, cd: 100, damage: 0.8, range: 160, type: 'projectile', desc: '龙卷风攻击', projectileColor: '#aaa', particleColor: '#ccc', size: 16, speed: 4, isTornado: true, render: 'tornado' },
    { id: 'ice', name: '冰霜', icon: '❄️', mp: 18, cd: 75, damage: 1.3, range: 140, type: 'projectile', desc: '冰霜魔法攻击', projectileColor: '#0cf', particleColor: '#8ef', size: 12, speed: 6, isIce: true, render: 'ice' }
];

// 兼容旧版本
window.skills = window.SKILLS;

/**
 * 根据ID获取技能
 */
window.getSkillById = function(skillId) {
    return window.SKILLS.find(s => s.id === skillId);
};

/**
 * 根据索引获取技能
 */
window.getSkillByIndex = function(index) {
    return window.SKILLS[index] || null;
};

/**
 * 创建技能实例（可用于玩家或怪物）
 */
window.createSkillInstance = function(skillId, owner) {
    const skill = window.getSkillById(skillId);
    if (!skill) return null;
    
    return {
        ...skill,
        owner: owner,
        x: owner.x || owner.x + 16,
        y: owner.y || owner.y + 16,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 300,
        hitEnemies: new Set()
    };
};

/**
 * 技能效果应用（通用函数，可用于玩家或怪物）
 */
window.applySkillEffect = function(skill, target, attacker) {
    if (!skill || !target || !attacker) return 0;
    
    let damage = 0;
    const baseDamage = attacker.atk || 10;
    
    // 根据技能类型计算伤害
    if (skill.damage) {
        damage = Math.floor(baseDamage * skill.damage);
    }
    
    // 特殊效果
    if (skill.isFire) {
        damage = Math.floor(damage * 1.2); // 火属性增伤
    } else if (skill.isIce) {
        damage = Math.floor(damage * 1.1); // 冰属性
    } else if (skill.isLightning) {
        damage = Math.floor(damage * 1.3); // 雷属性高伤
    }
    
    // 应用伤害
    if (damage > 0 && target.hp !== undefined) {
        const def = target.def || 0;
        const actualDamage = Math.max(1, damage - def);
        target.hp -= actualDamage;
    }
    
    return damage;
};

/**
 * 技能实例更新（移动投射物等）
 */
window.updateSkillInstance = function(skill, dt) {
    if (!skill) return;
    
    skill.life += dt;
    
    // 移动投射物
    if (skill.type === 'projectile') {
        skill.x += skill.vx * dt * 0.06;
        skill.y += skill.vy * dt * 0.06;
    }
    
    // 检查生命周期
    if (skill.life > skill.maxLife) {
        return false; // 技能结束
    }
    
    return true;
};

/**
 * 技能渲染（可用于图鉴预览）
 */
window.renderSkillIcon = function(skill, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const w = size;
    const h = size;
    const x = 0;
    const y = 0;
    
    const renderType = skill.render || skill.id;
    
    if (renderType === 'slash') {
        ctx.fillStyle = '#ccc';
        ctx.fillRect(x + w*0.1, y + h*0.4, w*0.6, h*0.15);
        ctx.fillStyle = '#888';
        ctx.fillRect(x + w*0.65, y + h*0.35, w*0.15, h*0.25);
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + w*0.2, y + h*0.35, w*0.02, h*0.25);
    } else if (renderType === 'fireball') {
        ctx.fillStyle = skill.projectileColor || '#f60';
        ctx.beginPath();
        ctx.arc(x + w*0.5, y + h*0.5, w*0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = skill.particleColor || '#ff0';
        ctx.beginPath();
        ctx.arc(x + w*0.5, y + h*0.4, w*0.15, 0, Math.PI * 2);
        ctx.fill();
    } else if (renderType === 'thunder') {
        ctx.fillStyle = skill.projectileColor || '#0ff';
        ctx.fillRect(x + w*0.4, y + h*0.2, w*0.2, h*0.6);
        ctx.fillRect(x + w*0.2, y + h*0.4, w*0.2, h*0.3);
        ctx.fillRect(x + w*0.6, y + h*0.3, w*0.2, h*0.4);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(x + w*0.45, y + h*0.3, w*0.1, h*0.3);
    } else if (renderType === 'vine') {
        ctx.fillStyle = skill.projectileColor || '#0a0';
        ctx.fillRect(x + w*0.3, y + h*0.2, w*0.15, h*0.6);
        ctx.fillRect(x + w*0.45, y + h*0.3, w*0.15, h*0.5);
        ctx.fillRect(x + w*0.2, y + h*0.5, w*0.15, h*0.2);
        ctx.fillStyle = '#4f4';
        ctx.fillRect(x + w*0.35, y + h*0.3, w*0.05, h*0.15);
    } else if (renderType === 'tornado') {
        ctx.fillStyle = skill.projectileColor || '#888';
        ctx.beginPath();
        ctx.arc(x + w*0.5, y + h*0.3, w*0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + w*0.5, y + h*0.5, w*0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + w*0.5, y + h*0.7, w*0.15, 0, Math.PI * 2);
        ctx.fill();
    } else if (renderType === 'ice') {
        ctx.fillStyle = skill.projectileColor || '#0cf';
        ctx.fillRect(x + w*0.35, y + h*0.15, w*0.3, h*0.7);
        ctx.fillRect(x + w*0.25, y + h*0.3, w*0.5, h*0.15);
        ctx.fillRect(x + w*0.15, y + h*0.45, w*0.7, h*0.15);
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + w*0.4, y + h*0.35, w*0.08, h*0.25);
    } else {
        ctx.fillStyle = '#888';
        ctx.fillRect(x + w*0.3, y + h*0.3, w*0.4, h*0.4);
    }
    
    return canvas.toDataURL();
};
