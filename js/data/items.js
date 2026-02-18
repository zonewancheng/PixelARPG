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
    { id: 'potion_inv', name: '生命药水', type: 'consumable_inventory', heal: 30, icon: '🧪', price: 20 },
    { id: 'potion2_inv', name: '超级药水', type: 'consumable_inventory', heal: 80, icon: '⚗️', price: 50 },
    { id: 'mpotion_inv', name: '魔法药水', type: 'consumable_inventory', mp: 20, icon: '💧', price: 15 },
    { id: 'mpotion2_inv', name: '超级魔法药水', type: 'consumable_inventory', mp: 50, icon: '🧿', price: 40 },
    { id: 'gold', name: '金币', type: 'treasure', value: 10, icon: '💰' }
];

// 物品类型列表
window.ITEM_TYPES = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace', 'consumable', 'treasure'];

/**
 * 渲染玩家外观（根据穿戴的装备）
 */
window.renderPlayerSprite = function(ctx, player, x, y, w, h) {
    const dir = player.dirX > 0 ? 1 : (player.dirX < 0 ? -1 : 1);
    const cx = x + w / 2;
    const time = Date.now() / 1000;
    const breathe = Math.sin(time * 2) * 1.5;
    
    // 原神风格角色基础设计
    // 皮肤颜色
    const skinColor = '#fdb';
    const skinShadow = '#eaa';
    
    // 头发颜色（深棕色，类似旅行者）
    const hairColor = '#654';
    const hairHighlight = '#875';
    
    // 衣服基础色
    const clothesColor = '#567';
    const clothesDark = '#456';
    const clothesLight = '#789';
    
    // ========== 计算武器位置（用于层级判断）==========
    let weaponBehind = false;
    let weaponX, weaponY, weaponCanvas, weaponSize = 22;
    let weaponAngle = 0;

    if (player.weapon && window.renderEquipmentIcon) {
        const orbitRadius = w * 0.45;
        
        // 计算武器旋转角度：旋转一周（2秒）后停顿5秒
        const cycleDuration = 7000; // 2秒旋转 + 5秒停顿 = 7秒一个周期
        const currentTime = Date.now() % cycleDuration;
        const rotationDuration = 2000; // 2秒旋转时间
        
        let angle;
        if (currentTime < rotationDuration) {
            // 旋转阶段
            angle = (currentTime / rotationDuration) * Math.PI * 2;
        } else {
            // 停顿阶段，保持在最后的角度
            angle = Math.PI * 2;
        }
        
        weaponAngle = angle + (dir > 0 ? 0 : Math.PI);
        weaponX = cx + Math.cos(weaponAngle) * orbitRadius;
        weaponY = y + h * 0.5 + Math.sin(weaponAngle) * orbitRadius * 0.4;
        weaponCanvas = window.renderEquipmentIcon(player.weapon, weaponSize);

        // 判断武器是否在身体后面（y坐标大于身体中心）
        weaponBehind = weaponY > y + h * 0.55;
    }

    // ========== 绘制背后的武器 ==========
    if (weaponBehind && weaponCanvas) {
        drawWeapon(ctx, weaponX, weaponY, weaponCanvas, weaponSize, player.weapon.color, player.attacking > 0, player.attacking ? (20 - player.attacking) / 20 : 0);
    }
    
    // ========== 头部（动漫风格）==========
    
    // 脸部基础
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(cx, y + h*0.18, w*0.18, 0, Math.PI*2);
    ctx.fill();
    
    // 头发 - 后层
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.arc(cx, y + h*0.15, w*0.2, Math.PI, 0);
    ctx.lineTo(x + w*0.85, y + h*0.25);
    ctx.lineTo(x + w*0.15, y + h*0.25);
    ctx.closePath();
    ctx.fill();
    
    // 头发 - 前刘海
    ctx.beginPath();
    ctx.moveTo(x + w*0.2, y + h*0.08);
    ctx.quadraticCurveTo(x + w*0.35, y + h*0.15, x + w*0.4, y + h*0.12);
    ctx.quadraticCurveTo(x + w*0.5, y + h*0.18, x + w*0.6, y + h*0.12);
    ctx.quadraticCurveTo(x + w*0.65, y + h*0.15, x + w*0.8, y + h*0.08);
    ctx.lineTo(x + w*0.75, y + h*0.03);
    ctx.quadraticCurveTo(cx, y - h*0.02, x + w*0.25, y + h*0.03);
    ctx.closePath();
    ctx.fill();
    
    // 头发高光
    ctx.fillStyle = hairHighlight;
    ctx.beginPath();
    ctx.ellipse(x + w*0.35, y + h*0.08, w*0.04, h*0.03, -0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w*0.55, y + h*0.1, w*0.03, h*0.02, 0.3, 0, Math.PI*2);
    ctx.fill();
    
    // 眼睛 - 动漫风格大眼睛
    const eyeY = y + h*0.2;
    const leftEyeX = x + w*0.38;
    const rightEyeX = x + w*0.62;
    
    // 眼白
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, w*0.05, h*0.06, 0, 0, Math.PI*2);
    ctx.ellipse(rightEyeX, eyeY, w*0.05, h*0.06, 0, 0, Math.PI*2);
    ctx.fill();
    
    // 眼珠（青色，类似风元素）
    ctx.fillStyle = '#0aa';
    ctx.beginPath();
    ctx.arc(leftEyeX + (dir > 0 ? 1 : -1), eyeY, w*0.035, 0, Math.PI*2);
    ctx.arc(rightEyeX + (dir > 0 ? 1 : -1), eyeY, w*0.035, 0, Math.PI*2);
    ctx.fill();
    
    // 眼睛高光
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(leftEyeX + (dir > 0 ? 2 : 0), eyeY - 1, w*0.015, 0, Math.PI*2);
    ctx.arc(rightEyeX + (dir > 0 ? 2 : 0), eyeY - 1, w*0.015, 0, Math.PI*2);
    ctx.fill();
    
    // 眉毛
    ctx.strokeStyle = hairColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftEyeX - 3, eyeY - 6);
    ctx.lineTo(leftEyeX + 3, eyeY - 7);
    ctx.moveTo(rightEyeX - 3, eyeY - 7);
    ctx.lineTo(rightEyeX + 3, eyeY - 6);
    ctx.stroke();
    
    // 鼻子
    ctx.fillStyle = skinShadow;
    ctx.beginPath();
    ctx.arc(cx, y + h*0.23, 1, 0, Math.PI*2);
    ctx.fill();
    
    // 嘴巴（微笑）
    ctx.strokeStyle = '#c99';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, y + h*0.26, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();
    
    // 耳朵
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.ellipse(x + w*0.22, y + h*0.2, w*0.03, h*0.05, 0, 0, Math.PI*2);
    ctx.ellipse(x + w*0.78, y + h*0.2, w*0.03, h*0.05, 0, 0, Math.PI*2);
    ctx.fill();
    
    // ========== 身体 ==========
    
    // 脖子
    ctx.fillStyle = skinColor;
    ctx.fillRect(cx - 3, y + h*0.3, 6, h*0.05);
    
    // 基础衣服（高领设计）
    ctx.fillStyle = clothesColor;
    ctx.beginPath();
    ctx.moveTo(cx - 8, y + h*0.35);
    ctx.lineTo(cx + 8, y + h*0.35);
    ctx.lineTo(cx + 10, y + h*0.45);
    ctx.lineTo(cx - 10, y + h*0.45);
    ctx.closePath();
    ctx.fill();
    
    // 衣服装饰线条
    ctx.fillStyle = clothesLight;
    ctx.fillRect(cx - 2, y + h*0.36, 4, h*0.08);
    
    // 身体主体
    ctx.fillStyle = clothesColor;
    ctx.beginPath();
    ctx.moveTo(cx - 10, y + h*0.45 + breathe * 0.3);
    ctx.lineTo(cx + 10, y + h*0.45 + breathe * 0.3);
    ctx.lineTo(cx + 12, y + h*0.7 + breathe * 0.2);
    ctx.lineTo(cx - 12, y + h*0.7 + breathe * 0.2);
    ctx.closePath();
    ctx.fill();
    
    // 衣服阴影/褶皱
    ctx.fillStyle = clothesDark;
    ctx.beginPath();
    ctx.moveTo(cx - 8, y + h*0.5 + breathe * 0.3);
    ctx.lineTo(cx - 6, y + h*0.65 + breathe * 0.2);
    ctx.lineTo(cx - 10, y + h*0.68 + breathe * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 8, y + h*0.5 + breathe * 0.3);
    ctx.lineTo(cx + 6, y + h*0.65 + breathe * 0.2);
    ctx.lineTo(cx + 10, y + h*0.68 + breathe * 0.2);
    ctx.closePath();
    ctx.fill();
    
    // 腰带
    ctx.fillStyle = '#432';
    ctx.fillRect(cx - 11, y + h*0.68 + breathe * 0.2, 22, h*0.04);
    ctx.fillStyle = '#ca8';
    ctx.fillRect(cx - 3, y + h*0.69 + breathe * 0.2, 6, h*0.02);
    
    // 根据 armor 渲染护甲（叠加在基础衣服上）
    if (player.armor && window.renderEquipmentIcon) {
        const armorCanvas = window.renderEquipmentIcon(player.armor, 24);
        ctx.save();
        ctx.globalAlpha = 0.9;
        // 护甲呼吸动画
        const armorPulse = 1 + Math.sin(time * 2.5) * 0.03;
        ctx.translate(x + 12, y + h*0.55 + breathe * 0.3);
        ctx.scale(0.75 * armorPulse, 0.75 * armorPulse);
        ctx.drawImage(armorCanvas, -12, -12);
        
        // 护甲发光效果
        if (player.armor.quality === 'legendary' || player.armor.quality === 'epic') {
            ctx.globalAlpha = 0.15 + Math.sin(time * 3) * 0.1;
            const glowColor = player.armor.color || '#fa0';
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 10 + Math.sin(time * 4) * 5;
            ctx.drawImage(armorCanvas, -12, -12);
        }
        ctx.restore();
    }
    
    // ========== 手臂 ==========
    
    // 左臂
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.ellipse(x + w*0.15, y + h*0.5, w*0.04, h*0.12, -0.2, 0, Math.PI*2);
    ctx.fill();
    
    // 右臂
    ctx.beginPath();
    ctx.ellipse(x + w*0.85, y + h*0.5, w*0.04, h*0.12, 0.2, 0, Math.PI*2);
    ctx.fill();
    
    // 手套/护腕
    ctx.fillStyle = clothesDark;
    ctx.fillRect(x + w*0.1, y + h*0.58, w*0.08, h*0.06);
    ctx.fillRect(x + w*0.82, y + h*0.58, w*0.08, h*0.06);
    
    // ========== 腿部 ==========
    
    // 判断是否在移动
    const isMoving = (dir !== 0) || (keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight'] || keys['w'] || keys['s'] || keys['a'] || keys['d']);
    
    // 腿部摆动动画 - 更明显的旋转摆动
    let leftLegAngle = 0;
    let rightLegAngle = 0;
    if (isMoving) {
        const legSwing = Math.sin(time * 12) * 0.2; // 旋转角度 ±0.2弧度
        leftLegAngle = legSwing;
        rightLegAngle = -legSwing;
    }
    
    // 裤子 - 左腿（带旋转动画）
    ctx.fillStyle = '#345';
    ctx.save();
    ctx.translate(x + w*0.34, y + h*0.82);
    ctx.rotate(leftLegAngle);
    ctx.fillRect(-w*0.09, -h*0.1, w*0.18, h*0.2);
    ctx.restore();
    
    // 裤子 - 右腿（带旋转动画）
    ctx.save();
    ctx.translate(x + w*0.66, y + h*0.82);
    ctx.rotate(rightLegAngle);
    ctx.fillRect(-w*0.09, -h*0.1, w*0.18, h*0.2);
    ctx.restore();
    
    // 腿部高光
    ctx.fillStyle = '#456';
    ctx.save();
    ctx.translate(x + w*0.34, y + h*0.82);
    ctx.rotate(leftLegAngle);
    ctx.fillRect(-w*0.06, -h*0.08, w*0.04, h*0.16);
    ctx.restore();
    
    ctx.save();
    ctx.translate(x + w*0.66, y + h*0.82);
    ctx.rotate(rightLegAngle);
    ctx.fillRect(-w*0.06, -h*0.08, w*0.04, h*0.16);
    ctx.restore();
    
    // 如果有靴子，在腿部显示靴子效果（带腿部旋转动画）
    if (player.boots && window.renderEquipmentIcon) {
        const bootCanvas = window.renderEquipmentIcon(player.boots, 16);
        // 左靴子 - 跟随左腿旋转
        ctx.save();
        ctx.translate(x + w*0.34, y + h*0.88);
        ctx.rotate(leftLegAngle);
        ctx.scale(0.5, 0.5);
        ctx.drawImage(bootCanvas, -8, -8);
        ctx.restore();
        
        // 右靴子 - 跟随右腿旋转
        ctx.save();
        ctx.translate(x + w*0.66, y + h*0.88);
        ctx.rotate(rightLegAngle);
        ctx.scale(0.5, 0.5);
        ctx.drawImage(bootCanvas, -8, -8);
        ctx.restore();
    } else {
        // 默认靴子 - 跟随腿部旋转
        ctx.fillStyle = '#432';
        ctx.save();
        ctx.translate(x + w*0.34, y + h*0.88);
        ctx.rotate(leftLegAngle);
        ctx.fillRect(-w*0.11, -h*0.05, w*0.22, h*0.1);
        ctx.restore();
        
        ctx.save();
        ctx.translate(x + w*0.66, y + h*0.88);
        ctx.rotate(rightLegAngle);
        ctx.fillRect(-w*0.11, -h*0.05, w*0.22, h*0.1);
        ctx.restore();
    }
    
    // ========== 头盔（叠加）==========
    
    if (player.helmet && window.renderEquipmentIcon) {
        const helmCanvas = window.renderEquipmentIcon(player.helmet, 20);
        ctx.save();
        ctx.globalAlpha = 0.95;
        // 头盔轻微上下浮动
        const helmBob = Math.sin(time * 2.5) * 0.5;
        ctx.translate(x + w*0.5, y + h*0.12 + helmBob);
        ctx.scale(0.8, 0.8);
        ctx.drawImage(helmCanvas, -10, -10);
        
        // 头盔高光闪烁
        if (player.helmet.quality === 'legendary' || player.helmet.quality === 'epic') {
            const shineAlpha = 0.2 + Math.sin(time * 4) * 0.15;
            ctx.globalAlpha = shineAlpha;
            const helmColor = player.helmet.color || '#fa0';
            ctx.shadowColor = helmColor;
            ctx.shadowBlur = 8;
            ctx.drawImage(helmCanvas, -10, -10);
        }
        ctx.restore();
    }
    
    // ========== 饰品 ==========
    
    // 戒指 - 发光脉动动画
    if (player.ring && window.renderEquipmentIcon) {
        const ringCanvas = window.renderEquipmentIcon(player.ring, 12);
        const ringX = dir > 0 ? x + w*0.88 : x + w*0.12;
        
        // 戒指发光效果
        if (player.ring.quality && player.ring.quality !== 'common') {
            const ringGlow = 0.2 + Math.sin(time * 3) * 0.15;
            ctx.fillStyle = player.ring.color || '#fa0';
            ctx.globalAlpha = ringGlow;
            ctx.beginPath();
            ctx.arc(ringX, y + h*0.62, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        
        ctx.save();
        ctx.translate(ringX, y + h*0.62);
        // 戒指轻微脉动
        const ringPulse = 1 + Math.sin(time * 2) * 0.05;
        ctx.scale(0.4 * ringPulse, 0.4 * ringPulse);
        ctx.drawImage(ringCanvas, -6, -6);
        ctx.restore();
    }
    
    // 项链 - 摇摆动画
    if (player.necklace && window.renderEquipmentIcon) {
        const neckCanvas = window.renderEquipmentIcon(player.necklace, 14);
        ctx.save();
        // 项链摇摆
        const neckSwing = Math.sin(time * 2) * 0.05;
        ctx.translate(x + w*0.5, y + h*0.4);
        ctx.rotate(neckSwing);
        ctx.scale(0.45, 0.45);
        ctx.drawImage(neckCanvas, -7, -7);
        
        // 项链发光
        if (player.necklace.quality && player.necklace.quality !== 'common') {
            const neckGlow = 0.15 + Math.sin(time * 2.5) * 0.1;
            ctx.globalAlpha = neckGlow;
            ctx.shadowColor = player.necklace.color || '#fa0';
            ctx.shadowBlur = 8;
            ctx.drawImage(neckCanvas, -7, -7);
        }
        ctx.restore();
    }
    
    // ========== 绘制前面的武器（在所有身体元素之后，确保显示在最上层）==========
    if (!weaponBehind && weaponCanvas) {
        drawWeapon(ctx, weaponX, weaponY, weaponCanvas, weaponSize, player.weapon.color, player.attacking > 0, player.attacking ? (20 - player.attacking) / 20 : 0);
        // 移除武器到手的连线
    }
    
    // 元素光芒效果（风元素）
    ctx.fillStyle = `rgba(0, 200, 200, ${0.1 + Math.sin(time * 3) * 0.05})`;
    ctx.beginPath();
    ctx.arc(cx, y + h*0.5, w*0.25 + Math.sin(time * 2) * 2, 0, Math.PI*2);
    ctx.fill();
    
    // 辅助函数：绘制武器
    function drawWeapon(ctx, wx, wy, wCanvas, wSize, wColor, isAttacking = false, attackProgress = 0) {
        // 武器阴影
        const shadowDir = window.getShadowDirection ? window.getShadowDirection() : {x: 4, y: 6};
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(wx + shadowDir.x, wy + wSize/3 + shadowDir.y, wSize/3, wSize/6, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.save();
        ctx.translate(wx, wy);

        // 如果正在攻击，添加挥舞效果
        if (isAttacking && attackProgress > 0) {
            const swingAngle = Math.sin(attackProgress * Math.PI) * Math.PI * 0.5;
            ctx.rotate(Math.PI + swingAngle);
        } else {
            ctx.rotate(Math.PI); // 垂直朝下
        }

        // 移除发光效果
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        // 绘制武器（移除描边）
        ctx.drawImage(wCanvas, -wSize/2, -wSize/2);

        ctx.restore();
    }
};

/**
 * 渲染玩家头像（用于角色面板和左上角头像）
 */
window.renderPlayerIcon = function(player, size = 48) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size + 16; // 增加高度容纳武器
    const ctx = canvas.getContext('2d');
    
    const dummyPlayer = {
        dirX: player.dirX || 1,
        armor: player.armor,
        weapon: player.weapon,
        helmet: player.helmet,
        attacking: 0
    };
    
    const scale = size / 32;
    // 向下渲染玩家（y+16偏移）
    window.renderPlayerSprite(ctx, dummyPlayer, 0, 16, size, size);
    
    return canvas;
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
    
    // 武器渲染 - 完整的剑设计：把手、刀镡、刃、尖尖
    if (item.type === 'weapon') {
        const cx = x + w * 0.5;
        const bladeW = w * 0.15;
        
        if (sprite === 'fire_sword') {
            // 火焰剑 - 红色系 - 更鲜艳
            // 1. 把手 (handle)
            ctx.fillStyle = '#6a3a2a';
            ctx.fillRect(cx - bladeW*0.4, y + h*0.75, bladeW*0.8, h*0.22);
            ctx.fillStyle = '#8a5a4a';
            ctx.fillRect(cx - bladeW*0.25, y + h*0.78, bladeW*0.5, h*0.16);
            
            // 2. 刀镡 (guard)
            ctx.fillStyle = '#c00';
            ctx.fillRect(cx - bladeW*1.5, y + h*0.7, bladeW*3, h*0.08);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(cx - bladeW, y + h*0.71, bladeW*2, h*0.06);
            
            // 3. 刃 (blade) - 逐渐变窄 - 更鲜艳的红色
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.moveTo(cx - bladeW, y + h*0.7);
            ctx.lineTo(cx - bladeW*0.6, y + h*0.25);
            ctx.lineTo(cx, y + h*0.05);
            ctx.lineTo(cx + bladeW*0.6, y + h*0.25);
            ctx.lineTo(cx + bladeW, y + h*0.7);
            ctx.closePath();
            ctx.fill();
            
            // 4. 刃的亮部 - 亮橙色
            ctx.fillStyle = '#ff6';
            ctx.beginPath();
            ctx.moveTo(cx - bladeW*0.3, y + h*0.65);
            ctx.lineTo(cx - bladeW*0.15, y + h*0.3);
            ctx.lineTo(cx, y + h*0.12);
            ctx.lineTo(cx + bladeW*0.15, y + h*0.3);
            ctx.lineTo(cx + bladeW*0.3, y + h*0.65);
            ctx.closePath();
            ctx.fill();
            
            // 5. 尖尖 (tip) - 亮黄色
            ctx.fillStyle = '#ff8';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.02);
            ctx.lineTo(cx - bladeW*0.3, y + h*0.12);
            ctx.lineTo(cx + bladeW*0.3, y + h*0.12);
            ctx.closePath();
            ctx.fill();
            
        } else if (sprite === 'thunder_sword') {
            // 雷电剑 - 黄色/青色系 - 更鲜艳
            // 1. 把手
            ctx.fillStyle = '#336';
            ctx.fillRect(cx - bladeW*0.35, y + h*0.75, bladeW*0.7, h*0.22);
            ctx.fillStyle = '#558';
            ctx.fillRect(cx - bladeW*0.2, y + h*0.78, bladeW*0.4, h*0.16);
            
            // 2. 刀镡 - 闪电形状
            ctx.fillStyle = '#fd0';
            ctx.fillRect(cx - bladeW*1.8, y + h*0.7, bladeW*3.6, h*0.08);
            ctx.fillStyle = '#ff6';
            ctx.beginPath();
            ctx.moveTo(cx - bladeW, y + h*0.69);
            ctx.lineTo(cx - bladeW*0.3, y + h*0.75);
            ctx.lineTo(cx + bladeW*0.3, y + h*0.69);
            ctx.lineTo(cx + bladeW*0.8, y + h*0.75);
            ctx.lineTo(cx + bladeW, y + h*0.71);
            ctx.lineTo(cx + bladeW*0.3, y + h*0.78);
            ctx.lineTo(cx - bladeW*0.3, y + h*0.71);
            ctx.closePath();
            ctx.fill();
            
            // 3. 刃 - 闪电纹理
            ctx.fillStyle = '#dc0';
            ctx.beginPath();
            ctx.moveTo(cx - bladeW*0.9, y + h*0.7);
            ctx.lineTo(cx - bladeW*0.5, y + h*0.35);
            ctx.lineTo(cx - bladeW*0.2, y + h*0.5);
            ctx.lineTo(cx, y + h*0.08);
            ctx.lineTo(cx + bladeW*0.2, y + h*0.5);
            ctx.lineTo(cx + bladeW*0.5, y + h*0.35);
            ctx.lineTo(cx + bladeW*0.9, y + h*0.7);
            ctx.closePath();
            ctx.fill();
            
            // 4. 闪电亮部
            ctx.fillStyle = '#ff8';
            ctx.beginPath();
            ctx.moveTo(cx - bladeW*0.25, y + h*0.65);
            ctx.lineTo(cx - bladeW*0.1, y + h*0.4);
            ctx.lineTo(cx, y + h*0.15);
            ctx.lineTo(cx + bladeW*0.1, y + h*0.4);
            ctx.lineTo(cx + bladeW*0.25, y + h*0.65);
            ctx.closePath();
            ctx.fill();
            
            // 5. 尖尖
            ctx.fillStyle = '#cff';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.03);
            ctx.lineTo(cx - bladeW*0.25, y + h*0.13);
            ctx.lineTo(cx + bladeW*0.25, y + h*0.13);
            ctx.closePath();
            ctx.fill();
            
        } else if (sprite === 'ice_sword') {
            // 寒冰剑 - 蓝白色系 - 更鲜艳
            // 1. 把手 - 冰晶质感
            ctx.fillStyle = '#358';
            ctx.fillRect(cx - bladeW*0.4, y + h*0.75, bladeW*0.8, h*0.22);
            for(let i=0; i<3; i++) {
                ctx.fillStyle = i%2===0 ? '#57a' : '#adf';
                ctx.fillRect(cx - bladeW*0.3 + i*bladeW*0.2, y + h*0.76 + i*h*0.06, bladeW*0.25, h*0.05);
            }
            
            // 2. 刀镡 - 雪花形状
            ctx.fillStyle = '#adf';
            for(let i=0; i<6; i++) {
                const angle = (i * Math.PI) / 3;
                const r1 = bladeW * 1.5;
                const r2 = bladeW * 0.5;
                ctx.beginPath();
                ctx.moveTo(cx, y + h*0.73);
                ctx.lineTo(cx + Math.cos(angle)*r1, y + h*0.73 + Math.sin(angle)*r1*0.3);
                ctx.lineTo(cx + Math.cos(angle)*r2, y + h*0.73 + Math.sin(angle)*r2*0.3);
                ctx.closePath();
                ctx.fill();
            }
            ctx.fillStyle = '#dff';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.73, bladeW*0.4, 0, Math.PI*2);
            ctx.fill();
            
            // 3. 刃 - 冰晶形状 - 更亮的蓝色
            ctx.fillStyle = '#8cf';
            ctx.beginPath();
            ctx.moveTo(cx - bladeW*0.8, y + h*0.7);
            ctx.lineTo(cx - bladeW*0.5, y + h*0.45);
            ctx.lineTo(cx - bladeW*0.7, y + h*0.3);
            ctx.lineTo(cx - bladeW*0.3, y + h*0.2);
            ctx.lineTo(cx, y + h*0.06);
            ctx.lineTo(cx + bladeW*0.3, y + h*0.2);
            ctx.lineTo(cx + bladeW*0.7, y + h*0.3);
            ctx.lineTo(cx + bladeW*0.5, y + h*0.45);
            ctx.lineTo(cx + bladeW*0.8, y + h*0.7);
            ctx.closePath();
            ctx.fill();
            
            // 4. 冰晶亮部 - 更亮
            ctx.fillStyle = '#eff';
            ctx.beginPath();
            ctx.moveTo(cx - bladeW*0.2, y + h*0.6);
            ctx.lineTo(cx - bladeW*0.1, y + h*0.35);
            ctx.lineTo(cx, y + h*0.18);
            ctx.lineTo(cx + bladeW*0.1, y + h*0.35);
            ctx.lineTo(cx + bladeW*0.2, y + h*0.6);
            ctx.closePath();
            ctx.fill();
            
            // 5. 尖尖 - 冰锥
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.02);
            ctx.lineTo(cx - bladeW*0.2, y + h*0.12);
            ctx.lineTo(cx + bladeW*0.2, y + h*0.12);
            ctx.closePath();
            ctx.fill();
            
        } else if (sprite === 'demon_sword') {
            // 恶魔剑 - 紫色/暗色系 - 更鲜艳
            // 1. 把手 - 骨质纹理
            ctx.fillStyle = '#323';
            ctx.fillRect(cx - bladeW*0.45, y + h*0.72, bladeW*0.9, h*0.26);
            // 骨节
            for(let i=0; i<4; i++) {
                ctx.fillStyle = i%2===0 ? '#545' : '#323';
                ctx.beginPath();
                ctx.arc(cx, y + h*0.75 + i*h*0.05, bladeW*(0.4 - i*0.05), 0, Math.PI*2);
                ctx.fill();
            }
            
            // 2. 刀镡 - 恶魔翅膀形状
            ctx.fillStyle = '#707';
            // 左翼
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.72);
            ctx.lineTo(cx - bladeW*2, y + h*0.6);
            ctx.lineTo(cx - bladeW*1.5, y + h*0.75);
            ctx.lineTo(cx - bladeW*2, y + h*0.85);
            ctx.lineTo(cx, y + h*0.78);
            ctx.closePath();
            ctx.fill();
            // 右翼
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.72);
            ctx.lineTo(cx + bladeW*2, y + h*0.6);
            ctx.lineTo(cx + bladeW*1.5, y + h*0.75);
            ctx.lineTo(cx + bladeW*2, y + h*0.85);
            ctx.lineTo(cx, y + h*0.78);
            ctx.closePath();
            ctx.fill();
            // 中心宝石 - 更亮的紫色
            ctx.fillStyle = '#f0f';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.68);
            ctx.lineTo(cx - bladeW*0.3, y + h*0.75);
            ctx.lineTo(cx, y + h*0.82);
            ctx.lineTo(cx + bladeW*0.3, y + h*0.75);
            ctx.closePath();
            ctx.fill();
            
            // 3. 刃 - 弯曲的恶魔刀 - 更鲜艳的紫色
            ctx.fillStyle = '#606';
            ctx.beginPath();
            ctx.moveTo(cx - bladeW*0.7, y + h*0.72);
            ctx.quadraticCurveTo(cx - bladeW*0.5, y + h*0.4, cx - bladeW*0.3, y + h*0.25);
            ctx.lineTo(cx, y + h*0.08);
            ctx.lineTo(cx + bladeW*0.3, y + h*0.25);
            ctx.quadraticCurveTo(cx + bladeW*0.5, y + h*0.4, cx + bladeW*0.7, y + h*0.72);
            ctx.closePath();
            ctx.fill();
            
            // 4. 血槽 - 更亮的紫色
            ctx.fillStyle = '#a0a';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.68);
            ctx.quadraticCurveTo(cx - bladeW*0.15, y + h*0.4, cx, y + h*0.15);
            ctx.quadraticCurveTo(cx + bladeW*0.15, y + h*0.4, cx, y + h*0.68);
            ctx.closePath();
            ctx.fill();
            
            // 5. 尖尖 - 恶魔角 - 更亮的粉色
            ctx.fillStyle = '#f8f';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.03);
            ctx.lineTo(cx - bladeW*0.25, y + h*0.15);
            ctx.lineTo(cx - bladeW*0.1, y + h*0.12);
            ctx.lineTo(cx, y + h*0.06);
            ctx.lineTo(cx + bladeW*0.1, y + h*0.12);
            ctx.lineTo(cx + bladeW*0.25, y + h*0.15);
            ctx.closePath();
            ctx.fill();
            
        } else {
            // 默认铁剑 - 更鲜艳的金属色
            // 1. 把手
            ctx.fillStyle = '#654';
            ctx.fillRect(cx - bladeW*0.35, y + h*0.75, bladeW*0.7, h*0.22);
            ctx.fillStyle = '#876';
            ctx.fillRect(cx - bladeW*0.2, y + h*0.78, bladeW*0.4, h*0.16);
            
            // 2. 刀镡
            ctx.fillStyle = '#999';
            ctx.fillRect(cx - bladeW*1.3, y + h*0.71, bladeW*2.6, h*0.06);
            ctx.fillStyle = '#bbb';
            ctx.fillRect(cx - bladeW, y + h*0.72, bladeW*2, h*0.04);
            
            // 3. 刃
            ctx.fillStyle = '#aaa';
            ctx.beginPath();
            ctx.moveTo(cx - bladeW*0.7, y + h*0.71);
            ctx.lineTo(cx - bladeW*0.4, y + h*0.3);
            ctx.lineTo(cx, y + h*0.1);
            ctx.lineTo(cx + bladeW*0.4, y + h*0.3);
            ctx.lineTo(cx + bladeW*0.7, y + h*0.71);
            ctx.closePath();
            ctx.fill();
            
            // 4. 刃亮部
            ctx.fillStyle = '#ddd';
            ctx.beginPath();
            ctx.moveTo(cx - bladeW*0.2, y + h*0.65);
            ctx.lineTo(cx - bladeW*0.1, y + h*0.35);
            ctx.lineTo(cx, y + h*0.18);
            ctx.lineTo(cx + bladeW*0.1, y + h*0.35);
            ctx.lineTo(cx + bladeW*0.2, y + h*0.65);
            ctx.closePath();
            ctx.fill();
            
            // 5. 尖尖
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.06);
            ctx.lineTo(cx - bladeW*0.2, y + h*0.15);
            ctx.lineTo(cx + bladeW*0.2, y + h*0.15);
            ctx.closePath();
            ctx.fill();
        }
    }
    // 护甲渲染 - 完整的胸甲设计
    else if (item.type === 'armor') {
        const cx = x + w * 0.5;
        if (sprite === 'dragon') {
            // 龙鳞甲 - 带尖刺和鳞片纹理 - 更鲜艳
            // 主体护甲
            ctx.fillStyle = '#a33';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.15);
            ctx.lineTo(x + w*0.85, y + h*0.3);
            ctx.lineTo(x + w*0.8, y + h*0.75);
            ctx.lineTo(cx, y + h*0.85);
            ctx.lineTo(x + w*0.2, y + h*0.75);
            ctx.lineTo(x + w*0.15, y + h*0.3);
            ctx.closePath();
            ctx.fill();
            // 龙鳞纹理
            ctx.fillStyle = '#c66';
            for(let row=0; row<3; row++) {
                for(let col=0; col<3-row; col++) {
                    ctx.beginPath();
                    ctx.arc(cx + (col-1+row*0.5)*w*0.2, y + h*0.35 + row*h*0.15, w*0.08, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            // 肩部尖刺
            ctx.fillStyle = '#e88';
            ctx.beginPath();
            ctx.moveTo(x + w*0.15, y + h*0.3);
            ctx.lineTo(x + w*0.05, y + h*0.2);
            ctx.lineTo(x + w*0.2, y + h*0.25);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.85, y + h*0.3);
            ctx.lineTo(x + w*0.95, y + h*0.2);
            ctx.lineTo(x + w*0.8, y + h*0.25);
            ctx.fill();
            // 中央红宝石
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.45, w*0.1, 0, Math.PI*2);
            ctx.fill();
            
        } else if (sprite === 'iron') {
            // 铁甲 - 金属板甲样式 - 更鲜艳的金属色
            // 胸甲主体
            ctx.fillStyle = '#777';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.15);
            ctx.lineTo(x + w*0.8, y + h*0.25);
            ctx.lineTo(x + w*0.75, y + h*0.8);
            ctx.lineTo(cx, y + h*0.88);
            ctx.lineTo(x + w*0.25, y + h*0.8);
            ctx.lineTo(x + w*0.2, y + h*0.25);
            ctx.closePath();
            ctx.fill();
            // 金属光泽
            ctx.fillStyle = '#999';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.18);
            ctx.lineTo(x + w*0.7, y + h*0.27);
            ctx.lineTo(x + w*0.68, y + h*0.5);
            ctx.lineTo(cx, y + h*0.55);
            ctx.lineTo(x + w*0.32, y + h*0.5);
            ctx.lineTo(x + w*0.3, y + h*0.27);
            ctx.closePath();
            ctx.fill();
            // 铆钉装饰
            ctx.fillStyle = '#555';
            for(let i=0; i<3; i++) {
                ctx.beginPath();
                ctx.arc(cx, y + h*0.35 + i*h*0.15, w*0.04, 0, Math.PI*2);
                ctx.fill();
            }
            // 肩甲
            ctx.fillStyle = '#666';
            ctx.fillRect(x + w*0.1, y + h*0.22, w*0.15, h*0.25);
            ctx.fillRect(x + w*0.75, y + h*0.22, w*0.15, h*0.25);
            
        } else if (sprite === 'leather') {
            // 皮甲 - 皮革背心样式 - 更鲜艳的棕色
            // 主体
            ctx.fillStyle = '#a75';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.18);
            ctx.lineTo(x + w*0.75, y + h*0.28);
            ctx.lineTo(x + w*0.72, y + h*0.78);
            ctx.lineTo(cx, y + h*0.85);
            ctx.lineTo(x + w*0.28, y + h*0.78);
            ctx.lineTo(x + w*0.25, y + h*0.28);
            ctx.closePath();
            ctx.fill();
            // 缝线
            ctx.strokeStyle = '#753';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w*0.3, y + h*0.3);
            ctx.lineTo(x + w*0.32, y + h*0.75);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w*0.7, y + h*0.3);
            ctx.lineTo(x + w*0.68, y + h*0.75);
            ctx.stroke();
            // 皮带扣
            ctx.fillStyle = '#543';
            ctx.fillRect(cx - w*0.08, y + h*0.4, w*0.16, h*0.08);
            ctx.fillStyle = '#dba';
            ctx.fillRect(cx - w*0.04, y + h*0.42, w*0.08, h*0.04);
            // 肩部护垫
            ctx.fillStyle = '#864';
            ctx.beginPath();
            ctx.arc(x + w*0.2, y + h*0.35, w*0.1, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w*0.8, y + h*0.35, w*0.1, 0, Math.PI*2);
            ctx.fill();
            
        } else {
            // 布衣 - 简单长袍 - 更鲜艳
            // 袍子主体
            ctx.fillStyle = '#ca7';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.15);
            ctx.lineTo(x + w*0.7, y + h*0.25);
            ctx.lineTo(x + w*0.75, y + h*0.85);
            ctx.lineTo(cx, y + h*0.9);
            ctx.lineTo(x + w*0.25, y + h*0.85);
            ctx.lineTo(x + w*0.3, y + h*0.25);
            ctx.closePath();
            ctx.fill();
            // 衣领
            ctx.fillStyle = '#edc';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.15);
            ctx.lineTo(x + w*0.6, y + h*0.22);
            ctx.lineTo(cx, y + h*0.35);
            ctx.lineTo(x + w*0.4, y + h*0.22);
            ctx.closePath();
            ctx.fill();
            // 腰带
            ctx.fillStyle = '#975';
            ctx.fillRect(x + w*0.28, y + h*0.55, w*0.44, h*0.06);
            ctx.fillStyle = '#ba8';
            ctx.fillRect(cx - w*0.05, y + h*0.56, w*0.1, h*0.04);
        }
    }
    // 头盔渲染 - 完整的头部装备
    else if (item.type === 'helmet') {
        const cx = x + w * 0.5;
        if (sprite === 'iron_helm') {
            // 铁头盔 - 全覆式骑士头盔 - 更鲜艳的金属色
            // 头盔主体
            ctx.fillStyle = '#777';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.45, w*0.35, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            // 面甲
            ctx.fillStyle = '#888';
            ctx.fillRect(x + w*0.25, y + h*0.45, w*0.5, h*0.25);
            // 观察缝
            ctx.fillStyle = '#333';
            ctx.fillRect(x + w*0.3, y + h*0.5, w*0.15, h*0.05);
            ctx.fillRect(x + w*0.55, y + h*0.5, w*0.15, h*0.05);
            // 顶部装饰
            ctx.fillStyle = '#999';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.08);
            ctx.lineTo(cx - w*0.08, y + h*0.18);
            ctx.lineTo(cx + w*0.08, y + h*0.18);
            ctx.closePath();
            ctx.fill();
            // 护颈
            ctx.fillStyle = '#666';
            ctx.fillRect(x + w*0.2, y + h*0.7, w*0.6, h*0.12);
            
        } else if (sprite === 'leather_helm') {
            // 皮帽 - 带护耳的冒险者帽子 - 更鲜艳
            // 主体
            ctx.fillStyle = '#975';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.4, w*0.3, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            // 帽檐
            ctx.fillStyle = '#864';
            ctx.fillRect(x + w*0.15, y + h*0.38, w*0.7, h*0.08);
            // 护耳
            ctx.fillStyle = '#753';
            ctx.beginPath();
            ctx.arc(x + w*0.2, y + h*0.55, w*0.12, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w*0.8, y + h*0.55, w*0.12, 0, Math.PI*2);
            ctx.fill();
            // 装饰羽毛 - 更鲜艳的红色
            ctx.fillStyle = '#c64';
            ctx.beginPath();
            ctx.ellipse(cx + w*0.15, y + h*0.25, w*0.04, h*0.12, -0.3, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#e86';
            ctx.beginPath();
            ctx.ellipse(cx + w*0.18, y + h*0.22, w*0.03, h*0.1, -0.3, 0, Math.PI*2);
            ctx.fill();
            
        } else {
            // 布帽 - 简单的头巾 - 更鲜艳
            // 主体
            ctx.fillStyle = '#ca7';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.4, w*0.28, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            // 头巾下垂部分
            ctx.fillStyle = '#b96';
            ctx.beginPath();
            ctx.moveTo(x + w*0.25, y + h*0.45);
            ctx.lineTo(x + w*0.15, y + h*0.75);
            ctx.lineTo(x + w*0.35, y + h*0.7);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.75, y + h*0.45);
            ctx.lineTo(x + w*0.85, y + h*0.75);
            ctx.lineTo(x + w*0.65, y + h*0.7);
            ctx.closePath();
            ctx.fill();
            // 装饰图案
            ctx.fillStyle = '#edc';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.32, w*0.06, 0, Math.PI*2);
            ctx.fill();
        }
    }
    // 靴子渲染 - 完整的 footwear 设计
    else if (item.type === 'boots') {
        if (sprite === 'iron_boots') {
            // 铁靴 - 重型金属战靴
            // 左靴
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.moveTo(x + w*0.15, y + h*0.25);
            ctx.lineTo(x + w*0.25, y + h*0.25);
            ctx.lineTo(x + w*0.3, y + h*0.7);
            ctx.lineTo(x + w*0.35, y + h*0.9);
            ctx.lineTo(x + w*0.1, y + h*0.9);
            ctx.lineTo(x + w*0.08, y + h*0.7);
            ctx.closePath();
            ctx.fill();
            // 左靴金属光泽
            ctx.fillStyle = '#777';
            ctx.fillRect(x + w*0.12, y + h*0.35, w*0.1, h*0.25);
            // 右靴
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.moveTo(x + w*0.55, y + h*0.25);
            ctx.lineTo(x + w*0.65, y + h*0.25);
            ctx.lineTo(x + w*0.7, y + h*0.7);
            ctx.lineTo(x + w*0.75, y + h*0.9);
            ctx.lineTo(x + w*0.5, y + h*0.9);
            ctx.lineTo(x + w*0.48, y + h*0.7);
            ctx.closePath();
            ctx.fill();
            // 右靴金属光泽
            ctx.fillStyle = '#777';
            ctx.fillRect(x + w*0.52, y + h*0.35, w*0.1, h*0.25);
            // 靴底
            ctx.fillStyle = '#333';
            ctx.fillRect(x + w*0.08, y + h*0.88, w*0.3, h*0.06);
            ctx.fillRect(x + w*0.48, y + h*0.88, w*0.3, h*0.06);
            
        } else if (sprite === 'leather_boots') {
            // 皮靴 - 带扣的冒险者长靴
            // 左靴
            ctx.fillStyle = '#753';
            ctx.beginPath();
            ctx.moveTo(x + w*0.18, y + h*0.3);
            ctx.lineTo(x + w*0.28, y + h*0.3);
            ctx.quadraticCurveTo(x + w*0.32, y + h*0.55, x + w*0.3, y + h*0.85);
            ctx.lineTo(x + w*0.12, y + h*0.85);
            ctx.quadraticCurveTo(x + w*0.1, y + h*0.55, x + w*0.18, y + h*0.3);
            ctx.closePath();
            ctx.fill();
            // 鞋带
            ctx.fillStyle = '#542';
            for(let i=0; i<3; i++) {
                ctx.fillRect(x + w*0.16, y + h*0.4 + i*h*0.12, w*0.14, h*0.03);
            }
            // 右靴
            ctx.fillStyle = '#753';
            ctx.beginPath();
            ctx.moveTo(x + w*0.58, y + h*0.3);
            ctx.lineTo(x + w*0.68, y + h*0.3);
            ctx.quadraticCurveTo(x + w*0.72, y + h*0.55, x + w*0.7, y + h*0.85);
            ctx.lineTo(x + w*0.52, y + h*0.85);
            ctx.quadraticCurveTo(x + w*0.5, y + h*0.55, x + w*0.58, y + h*0.3);
            ctx.closePath();
            ctx.fill();
            // 鞋带
            ctx.fillStyle = '#542';
            for(let i=0; i<3; i++) {
                ctx.fillRect(x + w*0.56, y + h*0.4 + i*h*0.12, w*0.14, h*0.03);
            }
            
        } else {
            // 草鞋 - 简单的草编鞋
            // 左鞋
            ctx.fillStyle = '#8a5';
            ctx.beginPath();
            ctx.ellipse(x + w*0.22, y + h*0.75, w*0.12, h*0.18, 0, 0, Math.PI*2);
            ctx.fill();
            // 草编纹理
            ctx.strokeStyle = '#694';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w*0.15, y + h*0.65);
            ctx.lineTo(x + w*0.29, y + h*0.85);
            ctx.moveTo(x + w*0.29, y + h*0.65);
            ctx.lineTo(x + w*0.15, y + h*0.85);
            ctx.stroke();
            // 右鞋
            ctx.fillStyle = '#8a5';
            ctx.beginPath();
            ctx.ellipse(x + w*0.62, y + h*0.75, w*0.12, h*0.18, 0, 0, Math.PI*2);
            ctx.fill();
            // 草编纹理
            ctx.beginPath();
            ctx.moveTo(x + w*0.55, y + h*0.65);
            ctx.lineTo(x + w*0.69, y + h*0.85);
            ctx.moveTo(x + w*0.69, y + h*0.65);
            ctx.lineTo(x + w*0.55, y + h*0.85);
            ctx.stroke();
        }
    }
    // 戒指渲染 - 精美的首饰设计
    else if (item.type === 'ring') {
        const cx = x + w * 0.5;
        const cy = y + h * 0.5;
        if (sprite === 'power_ring') {
            // 力量戒指 - 红宝石配金质花纹
            // 指环
            ctx.strokeStyle = '#d42';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.25, 0, Math.PI*2);
            ctx.stroke();
            // 戒指表面装饰
            ctx.strokeStyle = '#f64';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.22, 0, Math.PI*2);
            ctx.stroke();
            // 红宝石
            ctx.fillStyle = '#c00';
            ctx.beginPath();
            ctx.arc(cx, cy - h*0.05, w*0.15, 0, Math.PI*2);
            ctx.fill();
            // 宝石高光
            ctx.fillStyle = '#f44';
            ctx.beginPath();
            ctx.arc(cx - w*0.03, cy - h*0.07, w*0.06, 0, Math.PI*2);
            ctx.fill();
            // 爪镶
            ctx.fillStyle = '#fa4';
            for(let i=0; i<4; i++) {
                const angle = (i * Math.PI/2) - Math.PI/4;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(angle)*w*0.12, cy - h*0.05 + Math.sin(angle)*w*0.12, w*0.03, 0, Math.PI*2);
                ctx.fill();
            }
            
        } else if (sprite === 'speed_ring') {
            // 敏捷戒指 - 蓝宝石配银质闪电纹
            // 指环
            ctx.strokeStyle = '#48a';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.25, 0, Math.PI*2);
            ctx.stroke();
            // 闪电纹路
            ctx.strokeStyle = '#6cf';
            ctx.lineWidth = 2;
            for(let i=0; i<3; i++) {
                ctx.beginPath();
                ctx.arc(cx, cy, w*(0.18 + i*0.04), 0.5, 2.5);
                ctx.stroke();
            }
            // 蓝宝石
            ctx.fillStyle = '#04a';
            ctx.beginPath();
            ctx.moveTo(cx, cy - h*0.18);
            ctx.lineTo(cx + w*0.12, cy - h*0.05);
            ctx.lineTo(cx, cy + h*0.08);
            ctx.lineTo(cx - w*0.12, cy - h*0.05);
            ctx.closePath();
            ctx.fill();
            // 宝石光泽
            ctx.fillStyle = '#6af';
            ctx.beginPath();
            ctx.moveTo(cx, cy - h*0.15);
            ctx.lineTo(cx + w*0.06, cy - h*0.06);
            ctx.lineTo(cx, cy + h*0.02);
            ctx.lineTo(cx - w*0.06, cy - h*0.06);
            ctx.closePath();
            ctx.fill();
            
        } else if (sprite === 'health_ring') {
            // 生命戒指 - 绿宝石配藤蔓装饰
            // 指环
            ctx.strokeStyle = '#4a4';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.25, 0, Math.PI*2);
            ctx.stroke();
            // 藤蔓纹理
            ctx.strokeStyle = '#6c6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for(let i=0; i<8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                ctx.moveTo(cx + Math.cos(angle)*w*0.18, cy + Math.sin(angle)*w*0.18);
                ctx.quadraticCurveTo(
                    cx + Math.cos(angle + 0.3)*w*0.22, 
                    cy + Math.sin(angle + 0.3)*w*0.22,
                    cx + Math.cos(angle + 0.5)*w*0.18, 
                    cy + Math.sin(angle + 0.5)*w*0.18
                );
            }
            ctx.stroke();
            // 绿宝石（心形）
            ctx.fillStyle = '#2a2';
            ctx.beginPath();
            ctx.arc(cx - w*0.06, cy - h*0.1, w*0.08, 0, Math.PI*2);
            ctx.arc(cx + w*0.06, cy - h*0.1, w*0.08, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx - w*0.12, cy - h*0.08);
            ctx.lineTo(cx, cy + h*0.05);
            ctx.lineTo(cx + w*0.12, cy - h*0.08);
            ctx.closePath();
            ctx.fill();
            // 光泽
            ctx.fillStyle = '#6f6';
            ctx.beginPath();
            ctx.arc(cx - w*0.05, cy - h*0.1, w*0.03, 0, Math.PI*2);
            ctx.fill();
            
        } else {
            // 默认戒指
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.25, 0, Math.PI*2);
            ctx.stroke();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy - h*0.05, w*0.1, 0, Math.PI*2);
            ctx.fill();
        }
    }
    // 项链渲染 - 精美的吊坠设计
    else if (item.type === 'necklace') {
        const cx = x + w * 0.5;
        if (sprite === 'health_amulet') {
            // 生命护符 - 红心形配金链
            // 链条
            ctx.strokeStyle = '#d42';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.08);
            ctx.lineTo(cx, y + h*0.35);
            ctx.stroke();
            // 链条环
            ctx.strokeStyle = '#f64';
            ctx.lineWidth = 2;
            for(let i=0; i<5; i++) {
                ctx.beginPath();
                ctx.arc(cx, y + h*0.12 + i*h*0.05, w*0.04, 0, Math.PI*2);
                ctx.stroke();
            }
            // 心形吊坠主体
            ctx.fillStyle = '#c00';
            ctx.beginPath();
            ctx.arc(cx - w*0.08, y + h*0.45, w*0.1, 0, Math.PI*2);
            ctx.arc(cx + w*0.08, y + h*0.45, w*0.1, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx - w*0.16, y + h*0.48);
            ctx.lineTo(cx, y + h*0.72);
            ctx.lineTo(cx + w*0.16, y + h*0.48);
            ctx.closePath();
            ctx.fill();
            // 心形亮部
            ctx.fillStyle = '#f44';
            ctx.beginPath();
            ctx.arc(cx - w*0.06, y + h*0.42, w*0.04, 0, Math.PI*2);
            ctx.arc(cx + w*0.06, y + h*0.42, w*0.04, 0, Math.PI*2);
            ctx.fill();
            // 吊坠边框
            ctx.strokeStyle = '#fa4';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx - w*0.08, y + h*0.45, w*0.1, 0.5, 3.5);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx + w*0.08, y + h*0.45, w*0.1, 5.8, 2.8);
            ctx.stroke();
            
        } else if (sprite === 'magic_amulet') {
            // 魔法护符 - 蓝色水晶配银链
            // 链条
            ctx.strokeStyle = '#88a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx - w*0.15, y + h*0.08);
            ctx.quadraticCurveTo(cx, y + h*0.25, cx + w*0.15, y + h*0.08);
            ctx.stroke();
            // 链条细节
            for(let i=0; i<6; i++) {
                ctx.beginPath();
                ctx.arc(cx - w*0.12 + i*w*0.048, y + h*0.12 + i*h*0.03, w*0.02, 0, Math.PI*2);
                ctx.stroke();
            }
            // 吊坠底座
            ctx.fillStyle = '#668';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.38, w*0.18, 0, Math.PI*2);
            ctx.fill();
            // 水晶
            ctx.fillStyle = '#04a';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.22);
            ctx.lineTo(cx + w*0.12, y + h*0.38);
            ctx.lineTo(cx, y + h*0.62);
            ctx.lineTo(cx - w*0.12, y + h*0.38);
            ctx.closePath();
            ctx.fill();
            // 水晶面
            ctx.fillStyle = '#26c';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.22);
            ctx.lineTo(cx + w*0.06, y + h*0.38);
            ctx.lineTo(cx, y + h*0.62);
            ctx.lineTo(cx - w*0.06, y + h*0.38);
            ctx.closePath();
            ctx.fill();
            // 高光
            ctx.fillStyle = '#8af';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.26);
            ctx.lineTo(cx + w*0.03, y + h*0.38);
            ctx.lineTo(cx, y + h*0.45);
            ctx.lineTo(cx - w*0.03, y + h*0.38);
            ctx.closePath();
            ctx.fill();
            // 魔法符文
            ctx.strokeStyle = '#aff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, y + h*0.45, w*0.06, 0, Math.PI*2);
            ctx.stroke();
            
        } else if (sprite === 'power_necklace') {
            // 力量项链 - 紫色宝石配粗链
            // 粗链条
            ctx.strokeStyle = '#848';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(cx - w*0.18, y + h*0.1);
            ctx.quadraticCurveTo(cx, y + h*0.3, cx + w*0.18, y + h*0.1);
            ctx.stroke();
            // 链条节
            ctx.fillStyle = '#a6a';
            for(let i=0; i<4; i++) {
                ctx.fillRect(cx - w*0.15 + i*w*0.1, y + h*0.15 + i*h*0.05, w*0.08, h*0.06);
            }
            // 宝石底座
            ctx.fillStyle = '#636';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.35);
            ctx.lineTo(cx + w*0.2, y + h*0.45);
            ctx.lineTo(cx + w*0.15, y + h*0.7);
            ctx.lineTo(cx - w*0.15, y + h*0.7);
            ctx.lineTo(cx - w*0.2, y + h*0.45);
            ctx.closePath();
            ctx.fill();
            // 紫色宝石
            ctx.fillStyle = '#a0a';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.38);
            ctx.lineTo(cx + w*0.15, y + h*0.52);
            ctx.lineTo(cx, y + h*0.68);
            ctx.lineTo(cx - w*0.15, y + h*0.52);
            ctx.closePath();
            ctx.fill();
            // 宝石面
            ctx.fillStyle = '#c5c';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.42);
            ctx.lineTo(cx + w*0.08, y + h*0.52);
            ctx.lineTo(cx, y + h*0.62);
            ctx.lineTo(cx - w*0.08, y + h*0.52);
            ctx.closePath();
            ctx.fill();
            // 高光
            ctx.fillStyle = '#f8f';
            ctx.beginPath();
            ctx.ellipse(cx - w*0.02, y + h*0.48, w*0.03, h*0.04, -0.5, 0, Math.PI*2);
            ctx.fill();
            // 力量符文
            ctx.strokeStyle = '#f0f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.48);
            ctx.lineTo(cx, y + h*0.58);
            ctx.moveTo(cx - w*0.04, y + h*0.52);
            ctx.lineTo(cx + w*0.04, y + h*0.52);
            ctx.stroke();
            
        } else {
            // 默认项链
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.1);
            ctx.lineTo(cx, y + h*0.4);
            ctx.stroke();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, y + h*0.5, w*0.15, 0, Math.PI*2);
            ctx.fill();
        }
    }
    // 药水渲染 - 像素风格药水瓶
    else if (item.type === 'consumable' && (item.heal || item.mp)) {
        const cx = x + w * 0.5;
        const bottleW = w * 0.5;
        const bottleH = h * 0.6;
        const bottleX = cx - bottleW * 0.5;
        const bottleY = y + h * 0.35;
        
        // 确定药水颜色
        let liquidColor, bottleColor, capColor, glowColor;
        if (item.heal) {
            if (item.id.includes('2') || item.id.includes('super')) {
                // 超级红药水 - 更鲜艳
                liquidColor = '#ff3333';
                bottleColor = '#cc2222';
                capColor = '#ffaa00';
                glowColor = 'rgba(255, 80, 80, 0.4)';
            } else {
                // 普通红药水
                liquidColor = '#ff4444';
                bottleColor = '#cc3333';
                capColor = '#aa8855';
                glowColor = 'rgba(255, 100, 100, 0.3)';
            }
        } else if (item.mp) {
            if (item.id.includes('2') || item.id.includes('super')) {
                // 超级蓝药水
                liquidColor = '#3333ff';
                bottleColor = '#2222cc';
                capColor = '#ffaa00';
                glowColor = 'rgba(80, 80, 255, 0.4)';
            } else {
                // 普通蓝药水
                liquidColor = '#4444ff';
                bottleColor = '#3333cc';
                capColor = '#aaaacc';
                glowColor = 'rgba(100, 100, 255, 0.3)';
            }
        }
        
        // 发光效果
        if (glowColor) {
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(cx, bottleY + bottleH * 0.5, bottleW * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 瓶身（玻璃质感）
        ctx.fillStyle = 'rgba(200, 220, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(bottleX + bottleW * 0.15, bottleY);
        ctx.lineTo(bottleX + bottleW * 0.15, bottleY + bottleH * 0.25);
        ctx.lineTo(bottleX, bottleY + bottleH * 0.5);
        ctx.lineTo(bottleX + bottleW * 0.1, bottleY + bottleH);
        ctx.lineTo(bottleX + bottleW * 0.9, bottleY + bottleH);
        ctx.lineTo(bottleX + bottleW, bottleY + bottleH * 0.5);
        ctx.lineTo(bottleX + bottleW * 0.85, bottleY + bottleH * 0.25);
        ctx.lineTo(bottleX + bottleW * 0.85, bottleY);
        ctx.closePath();
        ctx.fill();
        
        // 瓶身轮廓
        ctx.strokeStyle = bottleColor || '#888';
        ctx.lineWidth = Math.max(1, size * 0.05);
        ctx.stroke();
        
        // 液体
        const liquidH = bottleH * 0.55;
        const liquidY = bottleY + bottleH - liquidH;
        ctx.fillStyle = liquidColor;
        ctx.beginPath();
        ctx.moveTo(bottleX + bottleW * 0.18, liquidY);
        ctx.lineTo(bottleX + bottleW * 0.18, bottleY + bottleH * 0.3);
        ctx.lineTo(bottleX + bottleW * 0.05, bottleY + bottleH * 0.5);
        ctx.lineTo(bottleX + bottleW * 0.13, bottleY + bottleH - 2);
        ctx.lineTo(bottleX + bottleW * 0.87, bottleY + bottleH - 2);
        ctx.lineTo(bottleX + bottleW * 0.95, bottleY + bottleH * 0.5);
        ctx.lineTo(bottleX + bottleW * 0.82, bottleY + bottleH * 0.3);
        ctx.lineTo(bottleX + bottleW * 0.82, liquidY);
        ctx.closePath();
        ctx.fill();
        
        // 液体高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.ellipse(bottleX + bottleW * 0.3, liquidY + liquidH * 0.3, bottleW * 0.08, liquidH * 0.15, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 瓶塞/瓶盖
        const capW = bottleW * 0.4;
        const capH = bottleH * 0.15;
        const capX = cx - capW * 0.5;
        const capY = bottleY - capH;
        
        ctx.fillStyle = capColor;
        ctx.beginPath();
        ctx.roundRect(capX, capY, capW, capH, 2);
        ctx.fill();
        
        // 瓶盖高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(capX + 2, capY + 2, capW * 0.3, capH * 0.4);
        
        // 气泡效果
        if (Math.random() > 0.5) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            const bubbleY = bottleY + bottleH * 0.6 + Math.random() * bottleH * 0.3;
            const bubbleX = cx - bottleW * 0.2 + Math.random() * bottleW * 0.4;
            ctx.beginPath();
            ctx.arc(bubbleX, bubbleY, Math.max(1, size * 0.03), 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 标签
        ctx.fillStyle = '#fff';
        ctx.fillRect(cx - bottleW * 0.15, bottleY + bottleH * 0.35, bottleW * 0.3, bottleH * 0.2);
        // 标签图案
        ctx.fillStyle = item.heal ? '#f44' : '#44f';
        ctx.fillRect(cx - bottleW * 0.1, bottleY + bottleH * 0.4, bottleW * 0.2, bottleH * 0.1);
    }
    else {
        ctx.fillStyle = color;
        ctx.fillRect(x + w*0.3, y + h*0.3, w*0.4, h*0.4);
    }
    
    return canvas;
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
        level: level,
        quantity: 1,
        baseId: baseItem.id
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
