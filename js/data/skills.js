/**
 * PixelARPG - 技能数据模块
 * 定义玩家可使用的技能
 */

window.SKILLS = [
    { 
        id: 'slash', 
        name: '斩击', 
        icon: '⚔️', 
        mp: 0, 
        cd: 0, 
        damage: 1.2, 
        range: 50, 
        type: 'single', 
        desc: '物理攻击', 
        render: 'slash',
        slashColor: '#fff',
        slashGlow: '#0cf'
    },
    { 
        id: 'fireball', 
        name: '火球', 
        icon: '🔥', 
        mp: 15, 
        cd: 60, 
        damage: 1.8, 
        range: 150, 
        type: 'projectile', 
        desc: '火焰魔法攻击', 
        coreColor: '#ff0',
        innerColor: '#f80', 
        outerColor: '#f00',
        glowColor: '#f40',
        size: 10, 
        speed: 6, 
        isFire: true, 
        render: 'fireball' 
    },
    { 
        id: 'thunder', 
        name: '雷电', 
        icon: '⚡', 
        mp: 20, 
        cd: 80, 
        damage: 1.5, 
        range: 180, 
        type: 'projectile', 
        desc: '雷电魔法攻击', 
        boltColor: '#ff0',
        coreColor: '#fff',
        glowColor: '#0ff',
        size: 8, 
        speed: 8, 
        isLightning: true, 
        render: 'thunder' 
    },
    { 
        id: 'vine', 
        name: '藤蔓', 
        icon: '🌿', 
        mp: 15, 
        cd: 70, 
        damage: 1.0, 
        range: 140, 
        type: 'projectile', 
        desc: '藤蔓魔法攻击', 
        stemColor: '#2a1',
        leafColor: '#4f4',
        thornColor: '#8f8',
        glowColor: '#6c6',
        size: 9, 
        speed: 5, 
        isVine: true, 
        render: 'vine' 
    },
    { 
        id: 'tornado', 
        name: '龙卷', 
        icon: '🌪️', 
        mp: 25, 
        cd: 100, 
        damage: 0.8, 
        range: 160, 
        type: 'projectile', 
        desc: '龙卷风攻击', 
        coreColor: '#ccc',
        midColor: '#aaa',
        outerColor: '#888',
        debrisColor: '#666',
        size: 12,
        speed: 4, 
        isTornado: true, 
        render: 'tornado' 
    },
    { 
        id: 'ice', 
        name: '冰霜', 
        icon: '❄️', 
        mp: 18, 
        cd: 75, 
        damage: 1.3, 
        range: 140, 
        type: 'projectile', 
        desc: '冰霜魔法攻击', 
        coreColor: '#fff',
        crystalColor: '#8ef',
        edgeColor: '#0cf',
        glowColor: '#cef',
        size: 9, 
        speed: 6, 
        isIce: true, 
        render: 'ice' 
    },
    { 
        id: 'invincible_shield', 
        name: '无敌光环', 
        icon: '⚜️', 
        mp: 0, 
        cd: 0, 
        damage: 0, 
        range: 0, 
        type: 'passive', 
        desc: '被动技能：进入新关卡或升级时获得5秒无敌光环', 
        passive: true,
        passiveTrigger: 'level_start',
        duration: 300,
        color: '#ffd700',
        render: 'shield'
    }
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
window.renderSkillIcon = function(skill, size) {
    if (size === undefined) size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const cx = size / 2;
    const cy = size / 2;
    const w = size;
    const h = size;
    
    const renderType = skill.render || skill.id;
    
    if (renderType === 'slash') {
        // 新月 - 中间厚两头尖，朝向左上方45度
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-Math.PI * 0.25); // 旋转45度朝向左上方
        
        // 外发光
        ctx.shadowColor = '#0cf';
        ctx.shadowBlur = 8;
        
        // 月牙主体 - 使用贝塞尔曲线实现中间厚两头尖
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(-size * 0.35, 0);
        ctx.quadraticCurveTo(-size * 0.15, -size * 0.25, size * 0.35, -size * 0.15);
        ctx.quadraticCurveTo(size * 0.25, 0, size * 0.35, size * 0.15);
        ctx.quadraticCurveTo(-size * 0.15, size * 0.25, -size * 0.35, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        
    } else if (renderType === 'fireball') {
        // 火球 - 多层火焰球体
        // 外发光
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size*0.4);
        gradient.addColorStop(0, skill.coreColor || '#ff0');
        gradient.addColorStop(0.3, skill.innerColor || '#f80');
        gradient.addColorStop(0.6, skill.outerColor || '#f00');
        gradient.addColorStop(1, 'rgba(255,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, size*0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // 内核
        ctx.fillStyle = skill.coreColor || '#ff0';
        ctx.beginPath();
        ctx.arc(cx, cy, size*0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 高光
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx - size*0.05, cy - size*0.05, size*0.08, 0, Math.PI * 2);
        ctx.fill();
        
    } else if (renderType === 'thunder') {
        // 雷电 - 锯齿状闪电
        ctx.save();
        ctx.translate(cx, cy);
        
        // 发光效果
        ctx.shadowColor = skill.glowColor || '#0ff';
        ctx.shadowBlur = 10;
        
        // 主闪电
        ctx.strokeStyle = skill.boltColor || '#ff0';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'miter';
        ctx.beginPath();
        ctx.moveTo(-size*0.1, -size*0.35);
        ctx.lineTo(size*0.05, -size*0.1);
        ctx.lineTo(-size*0.15, size*0.05);
        ctx.lineTo(size*0.1, size*0.35);
        ctx.stroke();
        
        // 闪电核心
        ctx.strokeStyle = skill.coreColor || '#fff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-size*0.05, -size*0.3);
        ctx.lineTo(size*0.02, -size*0.08);
        ctx.lineTo(-size*0.1, size*0.03);
        ctx.lineTo(size*0.05, size*0.3);
        ctx.stroke();
        
        // 分支闪电
        ctx.strokeStyle = 'rgba(255,255,0,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-size*0.1, -size*0.15);
        ctx.lineTo(-size*0.25, -size*0.05);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size*0.05, size*0.1);
        ctx.lineTo(size*0.2, size*0.15);
        ctx.stroke();
        
        ctx.restore();
        
    } else if (renderType === 'vine') {
        // 藤蔓 - 带叶子的藤蔓缠绕
        ctx.save();
        ctx.translate(cx, cy);
        
        // 主藤蔓茎
        ctx.strokeStyle = skill.stemColor || '#2a1';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-size*0.15, size*0.3);
        ctx.quadraticCurveTo(0, 0, size*0.1, -size*0.3);
        ctx.stroke();
        
        // 藤蔓叶子
        ctx.fillStyle = skill.leafColor || '#4f4';
        
        // 叶子1
        ctx.beginPath();
        ctx.ellipse(-size*0.15, -size*0.05, size*0.12, size*0.06, Math.PI/4, 0, Math.PI*2);
        ctx.fill();
        
        // 叶子2
        ctx.beginPath();
        ctx.ellipse(size*0.1, size*0.1, size*0.1, size*0.05, -Math.PI/3, 0, Math.PI*2);
        ctx.fill();
        
        // 叶子3
        ctx.beginPath();
        ctx.ellipse(0, -size*0.2, size*0.08, size*0.04, Math.PI/6, 0, Math.PI*2);
        ctx.fill();
        
        // 小叶子装饰
        ctx.fillStyle = skill.thornColor || '#8f8';
        ctx.beginPath();
        ctx.ellipse(-size*0.05, size*0.15, size*0.05, size*0.03, Math.PI/2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
        
    } else if (renderType === 'tornado') {
        // 龙卷 - 螺旋上升的旋风
        ctx.save();
        ctx.translate(cx, cy);
        
        // 绘制多层旋转的椭圆表示旋风
        const time = Date.now() / 200;
        
        for (let i = 0; i < 5; i++) {
            const y = -size*0.25 + i * size*0.12;
            const rx = size * (0.08 + i * 0.03);
            const ry = size * 0.04;
            const rotation = time + i * 0.5;
            
            ctx.save();
            ctx.translate(0, y);
            ctx.rotate(rotation);
            
            ctx.fillStyle = i % 2 === 0 ? (skill.midColor || '#aaa') : (skill.coreColor || '#ccc');
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI*2);
            ctx.fill();
            
            ctx.restore();
        }
        
        // 中心 debris
        ctx.fillStyle = skill.debrisColor || '#666';
        for (let i = 0; i < 4; i++) {
            const angle = time * 2 + i * Math.PI / 2;
            const dist = size * 0.15;
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist * 0.3, size*0.03, 0, Math.PI*2);
            ctx.fill();
        }
        
        ctx.restore();
        
    } else if (renderType === 'ice') {
        // 冰霜 - 六边形雪花冰晶
        ctx.save();
        ctx.translate(cx, cy);
        
        // 发光效果
        ctx.shadowColor = skill.glowColor || '#cef';
        ctx.shadowBlur = 8;
        
        // 绘制六边形雪花
        ctx.fillStyle = skill.edgeColor || '#0cf';
        for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate(i * Math.PI / 3);
            
            // 六角之一
            ctx.beginPath();
            ctx.moveTo(0, -size*0.05);
            ctx.lineTo(size*0.08, -size*0.25);
            ctx.lineTo(size*0.04, -size*0.28);
            ctx.lineTo(0, -size*0.08);
            ctx.lineTo(-size*0.04, -size*0.28);
            ctx.lineTo(-size*0.08, -size*0.25);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }
        
        // 中心水晶
        ctx.fillStyle = skill.crystalColor || '#8ef';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const r = size * 0.12;
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();
        
        // 核心
        ctx.fillStyle = skill.coreColor || '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, size*0.06, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
        
    } else if (renderType === 'shield') {
        // 无敌光环 - 金色圆形光罩，与玩家身上渲染一致
        ctx.save();
        ctx.translate(cx, cy);
        
        const time = Date.now() / 100;
        const flashAlpha = 0.35 + Math.sin(time) * 0.15;
        
        // 外发光
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;
        
        // 金色圆形光罩
        const grad = ctx.createRadialGradient(0, 0, size*0.15, 0, 0, size*0.45);
        grad.addColorStop(0, `rgba(255, 215, 0, 0)`);
        grad.addColorStop(0.5, `rgba(255, 215, 0, ${flashAlpha})`);
        grad.addColorStop(0.8, `rgba(255, 215, 0, ${flashAlpha * 0.6})`);
        grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, size*0.45, 0, Math.PI * 2);
        ctx.fill();
        
        // 光罩边缘
        ctx.strokeStyle = `rgba(255, 220, 100, ${0.5 + Math.sin(time * 1.5) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, size*0.45, 0, Math.PI * 2);
        ctx.stroke();
        
        // 中心小圆点
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, size*0.08, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
    } else {
        ctx.fillStyle = '#888';
        ctx.fillRect(w*0.3, h*0.3, w*0.4, h*0.4);
    }
    
    return canvas.toDataURL();
};
