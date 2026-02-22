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
    
    // 获取当前皮肤配置
    const skin = window.PlayerSkins?.getCurrentSkin() || {
        skinColor: '#ffe4d0',
        skinShadow: '#f5c4a8',
        skinHighlight: '#fff0e8',
        hairColor: '#f4c542',
        hairHighlight: '#ffe066',
        hairShadow: '#d4a012',
        eyeColor: '#40d0b0',
        eyeHighlight: '#60ffe0',
        clothesColor: '#4a9eff',
        clothesDark: '#2070cc',
        clothesLight: '#7ac0ff',
        clothesAccent: '#ffd700'
    };
    
    const skinColor = skin.skinColor;
    const skinShadow = skin.skinShadow;
    const skinHighlight = skin.skinHighlight;
    const hairColor = skin.hairColor;
    const hairHighlight = skin.hairHighlight;
    const hairShadow = skin.hairShadow;
    const eyeColor = skin.eyeColor;
    const eyeHighlight = skin.eyeHighlight;
    const clothesColor = skin.clothesColor;
    const clothesDark = skin.clothesDark;
    const clothesLight = skin.clothesLight;
    const clothesAccent = skin.clothesAccent;
    
    // 获取皮肤特征
    const features = skin.features || {};
    
    // ========== 计算武器位置（用于层级判断）==========
    let weaponBehind = false;
    let weaponX, weaponY, weaponCanvas, weaponSize = 66;
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
    
    // ========== 根据皮肤类型渲染不同角色 ==========
    const currentSkinId = window.PlayerSkins?.current || 'hero';
    
    if (currentSkinId === 'bride') {
        // ========== 新娘形象 - 精细商用级别渲染 ==========
        
        // 高级动画参数
        const time2 = time * 2;
        const time3 = time * 3;
        const hairWave1 = Math.sin(time * 1.2) * 2.5;
        const hairWave2 = Math.sin(time * 1.5 + 0.5) * 2;
        const hairWave3 = Math.sin(time * 0.9 + 1) * 3;
        const legKick = player.attacking > 0 ? Math.sin((20 - player.attacking) / 20 * Math.PI) * 0.7 : 0;
        const dressSway1 = Math.sin(time * 0.8) * 2;
        const dressSway2 = Math.sin(time * 1.1 + 0.3) * 1.5;
        const veilFloat1 = Math.sin(time * 0.6) * 3;
        const veilFloat2 = Math.sin(time * 0.9 + 0.5) * 2;
        const breathe2 = Math.sin(time * 2.5) * 1.2;
        const blinkPhase = Math.floor(time * 0.3) % 10;
        const isBlinking = blinkPhase === 0;
        
        // 粒子效果 - 闪光
        const sparkleCount = 5;
        for (let i = 0; i < sparkleCount; i++) {
            const sparkTime = (time * 2 + i * 1.3) % 3;
            if (sparkTime < 1) {
                const sparkX = x + w * (0.2 + Math.sin(i * 2.1) * 0.3);
                const sparkY = y + h * (0.1 + Math.cos(i * 1.7) * 0.4);
                const sparkAlpha = Math.sin(sparkTime * Math.PI) * 0.6;
                const sparkSize = 2 + Math.sin(sparkTime * Math.PI * 2) * 1.5;
                ctx.fillStyle = `rgba(255, 255, 255, ${sparkAlpha})`;
                ctx.beginPath();
                ctx.arc(sparkX + hairWave1 * 0.3, sparkY, sparkSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // ========== 头纱（多层飘动）==========
        if (features.hasVeil) {
            // 头纱底层 - 最远层
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.beginPath();
            ctx.moveTo(x + w*0.28, y + h*0.08);
            ctx.bezierCurveTo(
                x + w*0.05 - hairWave3, y + h*0.25 + veilFloat1,
                x + w*0.02, y + h*0.45 + veilFloat2,
                x + w*0.12, y + h*0.65
            );
            ctx.lineTo(x + w*0.22, y + h*0.65);
            ctx.bezierCurveTo(
                x + w*0.18, y + h*0.45,
                x + w*0.22, y + h*0.25 + hairWave2,
                x + w*0.36, y + h*0.12
            );
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x + w*0.72, y + h*0.08);
            ctx.bezierCurveTo(
                x + w*0.95 + hairWave3, y + h*0.25 + veilFloat1,
                x + w*0.98, y + h*0.45 + veilFloat2,
                x + w*0.88, y + h*0.65
            );
            ctx.lineTo(x + w*0.78, y + h*0.65);
            ctx.bezierCurveTo(
                x + w*0.82, y + h*0.45,
                x + w*0.78, y + h*0.25 - hairWave2,
                x + w*0.64, y + h*0.12
            );
            ctx.closePath();
            ctx.fill();
            
            // 头纱中层
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.moveTo(x + w*0.30, y + h*0.1);
            ctx.bezierCurveTo(
                x + w*0.1 - hairWave2, y + h*0.28 + veilFloat2,
                x + w*0.08, y + h*0.48,
                x + w*0.16, y + h*0.6
            );
            ctx.lineTo(x + w*0.26, y + h*0.6);
            ctx.bezierCurveTo(
                x + w*0.22, y + h*0.45,
                x + w*0.25, y + h*0.28 + hairWave1,
                x + w*0.38, y + h*0.14
            );
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x + w*0.70, y + h*0.1);
            ctx.bezierCurveTo(
                x + w*0.9 + hairWave2, y + h*0.28 + veilFloat2,
                x + w*0.92, y + h*0.48,
                x + w*0.84, y + h*0.6
            );
            ctx.lineTo(x + w*0.74, y + h*0.6);
            ctx.bezierCurveTo(
                x + w*0.78, y + h*0.45,
                x + w*0.75, y + h*0.28 - hairWave1,
                x + w*0.62, y + h*0.14
            );
            ctx.closePath();
            ctx.fill();
        }
        
        // ========== 长卷发（多层级精细渲染）==========
        if (features.hairStyle === 'wavy') {
            // 头发最底层阴影
            ctx.fillStyle = '#3d1f0d';
            // 左侧长发底层
            ctx.beginPath();
            ctx.moveTo(x + w*0.22, y + h*0.12);
            ctx.bezierCurveTo(
                x + w*0.08 + hairWave3*0.5, y + h*0.22,
                x + w*0.05 - hairWave2, y + h*0.38 + breathe,
                x + w*0.12 - hairWave1, y + h*0.52 + breathe
            );
            ctx.lineTo(x + w*0.22 - hairWave2*0.5, y + h*0.52 + breathe);
            ctx.bezierCurveTo(
                x + w*0.18 + hairWave2*0.5, y + h*0.38,
                x + w*0.2, y + h*0.22,
                x + w*0.32, y + h*0.15
            );
            ctx.closePath();
            ctx.fill();
            // 右侧长发底层
            ctx.beginPath();
            ctx.moveTo(x + w*0.78, y + h*0.12);
            ctx.bezierCurveTo(
                x + w*0.92 - hairWave3*0.5, y + h*0.22,
                x + w*0.95 + hairWave2, y + h*0.38 + breathe,
                x + w*0.88 + hairWave1, y + h*0.52 + breathe
            );
            ctx.lineTo(x + w*0.78 + hairWave2*0.5, y + h*0.52 + breathe);
            ctx.bezierCurveTo(
                x + w*0.82 - hairWave2*0.5, y + h*0.38,
                x + w*0.8, y + h*0.22,
                x + w*0.68, y + h*0.15
            );
            ctx.closePath();
            ctx.fill();
            
            // 头发中层 - 主色
            ctx.fillStyle = hairColor;
            // 左侧
            ctx.beginPath();
            ctx.moveTo(x + w*0.24, y + h*0.13);
            ctx.bezierCurveTo(
                x + w*0.1 + hairWave2*0.3, y + h*0.23,
                x + w*0.08 - hairWave1, y + h*0.36 + breathe,
                x + w*0.14 - hairWave2, y + h*0.5 + breathe
            );
            ctx.lineTo(x + w*0.24 - hairWave1*0.5, y + h*0.5 + breathe);
            ctx.bezierCurveTo(
                x + w*0.2 + hairWave1*0.5, y + h*0.36,
                x + w*0.22, y + h*0.23,
                x + w*0.34, y + h*0.16
            );
            ctx.closePath();
            ctx.fill();
            // 右侧
            ctx.beginPath();
            ctx.moveTo(x + w*0.76, y + h*0.13);
            ctx.bezierCurveTo(
                x + w*0.9 - hairWave2*0.3, y + h*0.23,
                x + w*0.92 + hairWave1, y + h*0.36 + breathe,
                x + w*0.86 + hairWave2, y + h*0.5 + breathe
            );
            ctx.lineTo(x + w*0.76 + hairWave1*0.5, y + h*0.5 + breathe);
            ctx.bezierCurveTo(
                x + w*0.8 - hairWave1*0.5, y + h*0.36,
                x + w*0.78, y + h*0.23,
                x + w*0.66, y + h*0.16
            );
            ctx.closePath();
            ctx.fill();
            
            // 头发高光层
            ctx.fillStyle = hairHighlight;
            // 左侧高光
            ctx.beginPath();
            ctx.ellipse(x + w*0.2, y + h*0.28, w*0.04, h*0.08, -0.3 + hairWave1*0.02, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x + w*0.18, y + h*0.4, w*0.025, h*0.05, -0.2 + hairWave2*0.02, 0, Math.PI * 2);
            ctx.fill();
            // 右侧高光
            ctx.beginPath();
            ctx.ellipse(x + w*0.8, y + h*0.28, w*0.04, h*0.08, 0.3 - hairWave1*0.02, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x + w*0.82, y + h*0.4, w*0.025, h*0.05, 0.2 - hairWave2*0.02, 0, Math.PI * 2);
            ctx.fill();
            
            // 发丝细节线条
            ctx.strokeStyle = 'rgba(93, 58, 26, 0.3)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(x + w*(0.2 + i*0.03), y + h*0.2);
                ctx.bezierCurveTo(
                    x + w*(0.15 + i*0.02) + hairWave1, y + h*0.3,
                    x + w*(0.14 + i*0.02) - hairWave2, y + h*0.4,
                    x + w*(0.16 + i*0.02) - hairWave3, y + h*0.5
                );
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + w*(0.8 - i*0.03), y + h*0.2);
                ctx.bezierCurveTo(
                    x + w*(0.85 - i*0.02) - hairWave1, y + h*0.3,
                    x + w*(0.86 - i*0.02) + hairWave2, y + h*0.4,
                    x + w*(0.84 - i*0.02) + hairWave3, y + h*0.5
                );
                ctx.stroke();
            }
        }
        
        // ========== 脸部 ==========
        ctx.fillStyle = skinColor;
        ctx.strokeStyle = skinShadow;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(cx, y + h*0.18, w*0.18, h*0.14, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        
        // 脸部高光
        ctx.fillStyle = skinHighlight;
        ctx.beginPath();
        ctx.ellipse(cx - 2, y + h*0.14, w*0.05, h*0.03, -0.3, 0, Math.PI*2);
        ctx.fill();
        
        // ========== 花冠头饰 ==========
        if (features.hasTiara) {
            ctx.fillStyle = skin.tiaraColor || '#FFD700';
            // 头冠基底
            ctx.beginPath();
            ctx.moveTo(x + w*0.3, y + h*0.08);
            ctx.lineTo(x + w*0.35, y + h*0.02);
            ctx.lineTo(x + w*0.42, y + h*0.06);
            ctx.lineTo(x + w*0.5, y);
            ctx.lineTo(x + w*0.58, y + h*0.06);
            ctx.lineTo(x + w*0.65, y + h*0.02);
            ctx.lineTo(x + w*0.7, y + h*0.08);
            ctx.closePath();
            ctx.fill();
            // 头冠花朵装饰
            ctx.fillStyle = skin.tiaraGem || '#FF69B4';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(x + w*(0.38 + i*0.12), y + h*0.04, w*0.02, 0, Math.PI*2);
                ctx.fill();
            }
        }
        
        // ========== 刘海（波浪状）==========
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        ctx.moveTo(x + w*0.2, y + h*0.08);
        ctx.quadraticCurveTo(x + w*0.3, y + h*0.14, x + w*0.38, y + h*0.1);
        ctx.quadraticCurveTo(x + w*0.45, y + h*0.15, x + w*0.5, y + h*0.1);
        ctx.quadraticCurveTo(x + w*0.55, y + h*0.15, x + w*0.62, y + h*0.1);
        ctx.quadraticCurveTo(x + w*0.7, y + h*0.14, x + w*0.8, y + h*0.08);
        ctx.lineTo(x + w*0.75, y + h*0.02);
        ctx.quadraticCurveTo(cx, y - h*0.02, x + w*0.25, y + h*0.02);
        ctx.closePath();
        ctx.fill();
        
        // ========== 紫色眼睛（精致动漫风格）==========
        const eyeY = y + h*0.2;
        const leftEyeX = x + w*0.38;
        const rightEyeX = x + w*0.62;
        
        // 眼睛阴影（深度）
        ctx.fillStyle = 'rgba(100, 50, 100, 0.15)';
        ctx.beginPath();
        ctx.ellipse(leftEyeX, eyeY + 2, w*0.06, h*0.04, 0, 0, Math.PI*2);
        ctx.ellipse(rightEyeX, eyeY + 2, w*0.06, h*0.04, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 眼白（带轻微渐变）
        const whiteGrad = ctx.createLinearGradient(leftEyeX - 5, eyeY - 5, leftEyeX + 5, eyeY + 5);
        whiteGrad.addColorStop(0, '#ffffff');
        whiteGrad.addColorStop(1, '#f8f0ff');
        ctx.fillStyle = whiteGrad;
        ctx.beginPath();
        ctx.ellipse(leftEyeX, eyeY, w*0.055, h*0.06, 0, 0, Math.PI*2);
        ctx.ellipse(rightEyeX, eyeY, w*0.055, h*0.06, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 紫色眼珠（多层渐变）
        ctx.shadowColor = '#9932CC';
        ctx.shadowBlur = 6;
        const eyeGrad = ctx.createRadialGradient(leftEyeX + (dir > 0 ? 1 : -1), eyeY - 1, 0, leftEyeX + (dir > 0 ? 1 : -1), eyeY, w*0.04);
        eyeGrad.addColorStop(0, '#E8B0FF');
        eyeGrad.addColorStop(0.3, eyeHighlight);
        eyeGrad.addColorStop(0.6, eyeColor);
        eyeGrad.addColorStop(0.85, '#6B238E');
        eyeGrad.addColorStop(1, '#4B0082');
        ctx.fillStyle = eyeGrad;
        ctx.beginPath();
        ctx.arc(leftEyeX + (dir > 0 ? 1 : -1), eyeY, w*0.038, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rightEyeX + (dir > 0 ? 1 : -1), eyeY, w*0.038, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 瞳孔
        ctx.fillStyle = '#2a0a3a';
        ctx.beginPath();
        ctx.arc(leftEyeX + (dir > 0 ? 1 : -1), eyeY + 1, w*0.015, 0, Math.PI*2);
        ctx.arc(rightEyeX + (dir > 0 ? 1 : -1), eyeY + 1, w*0.015, 0, Math.PI*2);
        ctx.fill();
        
        // 眼睛主高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.ellipse(leftEyeX + 2, eyeY - 2, w*0.018, h*0.02, 0.3, 0, Math.PI*2);
        ctx.ellipse(rightEyeX + 2, eyeY - 2, w*0.018, h*0.02, 0.3, 0, Math.PI*2);
        ctx.fill();
        
        // 眼睛次高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(leftEyeX - 1, eyeY + 2, w*0.008, 0, Math.PI*2);
        ctx.arc(rightEyeX - 1, eyeY + 2, w*0.008, 0, Math.PI*2);
        ctx.fill();
        
        // 睫毛（上）
        ctx.strokeStyle = '#3d1f0d';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        for (let i = -2; i <= 2; i++) {
            const lashX1 = leftEyeX + i * 2.2;
            const lashX2 = rightEyeX + i * 2.2;
            const lashLen = 3 + Math.abs(i) * 0.5;
            const lashAng = -0.4 - Math.abs(i) * 0.15;
            ctx.beginPath();
            ctx.moveTo(lashX1, eyeY - 4);
            ctx.lineTo(lashX1 + Math.sin(lashAng) * lashLen, eyeY - 4 - Math.cos(lashAng) * lashLen);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(lashX2, eyeY - 4);
            ctx.lineTo(lashX2 + Math.sin(lashAng) * lashLen, eyeY - 4 - Math.cos(lashAng) * lashLen);
            ctx.stroke();
        }
        
        // 眼线
        ctx.strokeStyle = '#2a1a1a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, w*0.055, -Math.PI*0.7, Math.PI*0.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY, w*0.055, -Math.PI*0.7, Math.PI*0.2);
        ctx.stroke();
        
        // 眉毛（精致）
        ctx.strokeStyle = hairShadow;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(leftEyeX - 5, eyeY - 7);
        ctx.quadraticCurveTo(leftEyeX, eyeY - 9, leftEyeX + 4, eyeY - 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(rightEyeX - 4, eyeY - 6);
        ctx.quadraticCurveTo(rightEyeX, eyeY - 9, rightEyeX + 5, eyeY - 7);
        ctx.stroke();
        
        // 嘴巴（精致唇形）
        const lipGrad = ctx.createLinearGradient(cx - 4, y + h*0.255, cx + 4, y + h*0.275);
        lipGrad.addColorStop(0, '#FFB0C0');
        lipGrad.addColorStop(0.5, '#FF8DA0');
        lipGrad.addColorStop(1, '#E87088');
        ctx.fillStyle = lipGrad;
        ctx.beginPath();
        ctx.moveTo(cx - 4, y + h*0.265);
        ctx.quadraticCurveTo(cx - 2, y + h*0.255, cx, y + h*0.26);
        ctx.quadraticCurveTo(cx + 2, y + h*0.255, cx + 4, y + h*0.265);
        ctx.quadraticCurveTo(cx + 3, y + h*0.275, cx, y + h*0.278);
        ctx.quadraticCurveTo(cx - 3, y + h*0.275, cx - 4, y + h*0.265);
        ctx.fill();
        // 嘴唇高光
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.ellipse(cx - 1.5, y + h*0.263, 1.5, 0.8, -0.2, 0, Math.PI*2);
        ctx.fill();
        
        // 腮红（渐变）
        const blushGrad = ctx.createRadialGradient(leftEyeX - 4, eyeY + 5, 0, leftEyeX - 4, eyeY + 5, 5);
        blushGrad.addColorStop(0, 'rgba(255, 150, 160, 0.35)');
        blushGrad.addColorStop(1, 'rgba(255, 150, 160, 0)');
        ctx.fillStyle = blushGrad;
        ctx.beginPath();
        ctx.ellipse(leftEyeX - 4, eyeY + 5, 4, 2.5, -0.2, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(rightEyeX + 4, eyeY + 5, 4, 2.5, 0.2, 0, Math.PI*2);
        ctx.fill();
        
        // ========== 白色婚纱身体 ==========
        // 脖子
        const neckGrad = ctx.createLinearGradient(cx - 4, y + h*0.3, cx + 4, y + h*0.34);
        neckGrad.addColorStop(0, skinHighlight);
        neckGrad.addColorStop(1, skinColor);
        ctx.fillStyle = neckGrad;
        ctx.beginPath();
        ctx.ellipse(cx, y + h*0.32, 4, 3, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 白色蕾丝紧身胸衣（带渐变）
        const corsetGrad = ctx.createLinearGradient(cx - 12, y + h*0.34, cx + 12, y + h*0.5);
        corsetGrad.addColorStop(0, '#FFFFFF');
        corsetGrad.addColorStop(0.3, '#FFFAFA');
        corsetGrad.addColorStop(0.7, '#F8F8FF');
        corsetGrad.addColorStop(1, '#F0F0F0');
        ctx.fillStyle = corsetGrad;
        ctx.strokeStyle = '#E8E8E8';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx - 10, y + h*0.34);
        ctx.bezierCurveTo(cx - 12, y + h*0.38, cx - 13, y + h*0.44, cx - 12, y + h*0.5 + breathe*0.3);
        ctx.lineTo(cx + 12, y + h*0.5 + breathe*0.3);
        ctx.bezierCurveTo(cx + 13, y + h*0.44, cx + 12, y + h*0.38, cx + 10, y + h*0.34);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 胸衣蕾丝纹理（精致花纹）
        ctx.strokeStyle = 'rgba(255, 182, 193, 0.6)';
        ctx.lineWidth = 0.8;
        for (let row = 0; row < 4; row++) {
            const rowY = y + h*(0.36 + row*0.035);
            ctx.beginPath();
            for (let i = -4; i <= 4; i++) {
                const px = cx + i * 2.2;
                const py = rowY + Math.sin(time * 2 + i * 0.5) * 0.3;
                if (i === -4) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
        
        // 胸衣珠饰
        ctx.fillStyle = 'rgba(255, 215, 223, 0.8)';
        for (let i = -3; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(cx + i * 2.5, y + h*0.38, 0.8, 0, Math.PI*2);
            ctx.fill();
        }
        
        // 胸衣中心宝石
        const gemGrad = ctx.createRadialGradient(cx, y + h*0.42, 0, cx, y + h*0.42, 3);
        gemGrad.addColorStop(0, '#FFFFFF');
        gemGrad.addColorStop(0.3, '#FFE4E8');
        gemGrad.addColorStop(1, '#FFB6C1');
        ctx.fillStyle = gemGrad;
        ctx.beginPath();
        ctx.arc(cx, y + h*0.42, 2.5, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#FFD0D8';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // ========== 白色长手套（精致蕾丝）==========
        if (features.hasGloves) {
            // 左手臂和手套
            const gloveGradL = ctx.createLinearGradient(x + w*0.1, y + h*0.38, x + w*0.2, y + h*0.6);
            gloveGradL.addColorStop(0, '#FFFFFF');
            gloveGradL.addColorStop(0.5, '#FFFAFA');
            gloveGradL.addColorStop(1, '#F5F5F5');
            ctx.fillStyle = gloveGradL;
            ctx.strokeStyle = '#E0E0E0';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.ellipse(x + w*0.15, y + h*0.48, w*0.045, h*0.15, -0.15, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            // 手套蕾丝花边
            ctx.strokeStyle = 'rgba(255, 182, 193, 0.5)';
            ctx.lineWidth = 0.6;
            for (let i = 0; i < 5; i++) {
                const laceY = y + h*(0.52 + i*0.015);
                ctx.beginPath();
                ctx.arc(x + w*0.15 + Math.sin(time * 2 + i) * 1, laceY, w*0.025, 0.2, Math.PI - 0.2);
                ctx.stroke();
            }
            
            // 右手臂和手套
            const gloveGradR = ctx.createLinearGradient(x + w*0.8, y + h*0.38, x + w*0.9, y + h*0.6);
            gloveGradR.addColorStop(0, '#FFFFFF');
            gloveGradR.addColorStop(0.5, '#FFFAFA');
            gloveGradR.addColorStop(1, '#F5F5F5');
            ctx.fillStyle = gloveGradR;
            ctx.strokeStyle = '#E0E0E0';
            ctx.beginPath();
            ctx.ellipse(x + w*0.85, y + h*0.48, w*0.045, h*0.15, 0.15, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            // 手套蕾丝花边
            ctx.strokeStyle = 'rgba(255, 182, 193, 0.5)';
            for (let i = 0; i < 5; i++) {
                const laceY = y + h*(0.52 + i*0.015);
                ctx.beginPath();
                ctx.arc(x + w*0.85 - Math.sin(time * 2 + i) * 1, laceY, w*0.025, 0.2 + Math.PI, Math.PI * 1.8);
                ctx.stroke();
            }
        }
        
        // ========== 婚纱裙摆（高开叉 + 褶皱 + 渐变）==========
        
        // 高开叉婚纱 - 左侧裙摆
        const skirtGradL = ctx.createLinearGradient(cx - 18, y + h*0.5, cx - 8, y + h*0.95);
        skirtGradL.addColorStop(0, '#FFFFFF');
        skirtGradL.addColorStop(0.3, '#FFFAFA');
        skirtGradL.addColorStop(0.6, '#F8F8FF');
        skirtGradL.addColorStop(1, '#F0F0F0');
        ctx.fillStyle = skirtGradL;
        ctx.strokeStyle = '#E8E8E8';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(cx - 12, y + h*0.52 + breathe*0.2);
        ctx.bezierCurveTo(
            cx - 20 + dressSway1, y + h*0.6,
            cx - 22 + dressSway2, y + h*0.75,
            cx - 16, y + h*0.95
        );
        ctx.lineTo(cx - 4, y + h*0.95);
        ctx.bezierCurveTo(
            cx - 6, y + h*0.75,
            cx - 6 + dressSway1*0.5, y + h*0.6,
            cx - 8, y + h*0.55 + breathe*0.2
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 高开叉婚纱 - 右侧裙摆
        const skirtGradR = ctx.createLinearGradient(cx + 8, y + h*0.5, cx + 18, y + h*0.95);
        skirtGradR.addColorStop(0, '#FFFFFF');
        skirtGradR.addColorStop(0.3, '#FFFAFA');
        skirtGradR.addColorStop(0.6, '#F8F8FF');
        skirtGradR.addColorStop(1, '#F0F0F0');
        ctx.fillStyle = skirtGradR;
        ctx.beginPath();
        ctx.moveTo(cx + 12, y + h*0.52 + breathe*0.2);
        ctx.bezierCurveTo(
            cx + 20 - dressSway1, y + h*0.6,
            cx + 22 - dressSway2, y + h*0.75,
            cx + 16, y + h*0.95
        );
        ctx.lineTo(cx + 4, y + h*0.95);
        ctx.bezierCurveTo(
            cx + 6, y + h*0.75,
            cx + 6 - dressSway1*0.5, y + h*0.6,
            cx + 8, y + h*0.55 + breathe*0.2
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 裙摆褶皱装饰（精致花纹）
        ctx.strokeStyle = 'rgba(255, 182, 193, 0.4)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 4; i++) {
            const foldY = y + h*(0.58 + i*0.08);
            ctx.beginPath();
            ctx.moveTo(cx - 16 + i*1.5, foldY);
            ctx.quadraticCurveTo(cx - 10, foldY + 2 + Math.sin(time + i) * 0.5, cx - 5, foldY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx + 16 - i*1.5, foldY);
            ctx.quadraticCurveTo(cx + 10, foldY + 2 + Math.sin(time + i) * 0.5, cx + 5, foldY);
            ctx.stroke();
        }
        
        // 裙摆蕾丝边缘
        ctx.strokeStyle = 'rgba(255, 182, 193, 0.6)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let i = 0; i <= 8; i++) {
            const t = i / 8;
            const baseX = cx - 16 + t * 12;
            const baseY = y + h*0.95;
            const waveY = Math.sin(time * 2 + i * 0.5) * 1;
            if (i === 0) ctx.moveTo(baseX, baseY + waveY);
            else ctx.lineTo(baseX, baseY + waveY);
        }
        ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i <= 8; i++) {
            const t = i / 8;
            const baseX = cx + 4 + t * 12;
            const baseY = y + h*0.95;
            const waveY = Math.sin(time * 2 + i * 0.5) * 1;
            if (i === 0) ctx.moveTo(baseX, baseY + waveY);
            else ctx.lineTo(baseX, baseY + waveY);
        }
        ctx.stroke();
        
        // ========== 腿部（高开叉露出大腿和臀部曲线）==========
        
        // 高开叉露出的臀部/大腿上部区域
        const hipGrad = ctx.createRadialGradient(cx, y + h*0.58, 0, cx, y + h*0.62, w*0.12);
        hipGrad.addColorStop(0, skinHighlight);
        hipGrad.addColorStop(0.5, skinColor);
        hipGrad.addColorStop(1, skinShadow);
        ctx.fillStyle = hipGrad;
        ctx.beginPath();
        ctx.ellipse(cx, y + h*0.58, w*0.08, h*0.06, 0, 0, Math.PI*2);
        ctx.fill();
        
        // 大腿内侧阴影
        ctx.fillStyle = 'rgba(245, 200, 180, 0.3)';
        ctx.beginPath();
        ctx.ellipse(cx - 3, y + h*0.6, w*0.03, h*0.04, 0.2, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 3, y + h*0.6, w*0.03, h*0.04, -0.2, 0, Math.PI*2);
        ctx.fill();
        
        // 左腿
        const legGradL = ctx.createLinearGradient(x + w*0.31, y + h*0.65, x + w*0.39, y + h*0.9);
        legGradL.addColorStop(0, skinHighlight);
        legGradL.addColorStop(0.4, skinColor);
        legGradL.addColorStop(1, skinShadow);
        ctx.fillStyle = legGradL;
        ctx.strokeStyle = skinShadow;
        ctx.lineWidth = 0.5;
        ctx.save();
        ctx.translate(x + w*0.35, y + h*0.65);
        ctx.rotate(-0.05 + breathe*0.01);
        ctx.beginPath();
        ctx.ellipse(0, h*0.14, w*0.045, h*0.14, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        // 腿部高光
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.ellipse(-1, h*0.1, w*0.015, h*0.06, -0.1, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        
        // 右腿（动态高踢腿）
        const legGradR = ctx.createLinearGradient(x + w*0.61, y + h*0.65, x + w*0.69, y + h*0.9);
        legGradR.addColorStop(0, skinHighlight);
        legGradR.addColorStop(0.4, skinColor);
        legGradR.addColorStop(1, skinShadow);
        ctx.fillStyle = legGradR;
        ctx.save();
        ctx.translate(x + w*0.65, y + h*0.65);
        const kickAngle = -0.1 + legKick;
        ctx.rotate(kickAngle);
        ctx.beginPath();
        ctx.ellipse(0, h*0.14, w*0.045, h*0.14, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = skinShadow;
        ctx.stroke();
        // 腿部高光
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.ellipse(-1, h*0.1, w*0.015, h*0.06, -0.1, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        
        // ========== 白色高跟鞋（精致）==========
        if (features.hasHighHeels) {
            // 左鞋
            ctx.save();
            ctx.translate(x + w*0.35, y + h*0.88);
            // 鞋体渐变
            const shoeGradL = ctx.createLinearGradient(-4, -2, 4, 6);
            shoeGradL.addColorStop(0, '#FFFFFF');
            shoeGradL.addColorStop(0.5, '#F8F8FF');
            shoeGradL.addColorStop(1, '#E8E8E8');
            ctx.fillStyle = shoeGradL;
            ctx.strokeStyle = '#D0D0D0';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(-4, -1);
            ctx.lineTo(4, -1);
            ctx.lineTo(5, 4);
            ctx.quadraticCurveTo(3, 6, -3, 6);
            ctx.lineTo(-5, 4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // 鞋跟
            ctx.fillStyle = '#E0E0E0';
            ctx.fillRect(-1.5, 6, 3, 5);
            ctx.strokeStyle = '#C0C0C0';
            ctx.strokeRect(-1.5, 6, 3, 5);
            // 鞋面装饰
            ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
            ctx.beginPath();
            ctx.arc(0, 1, 1.5, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
            
            // 右鞋（跟随踢腿）
            ctx.save();
            ctx.translate(x + w*0.65, y + h*0.88);
            ctx.rotate(legKick * 0.5);
            // 鞋体渐变
            const shoeGradR = ctx.createLinearGradient(-4, -2, 4, 6);
            shoeGradR.addColorStop(0, '#FFFFFF');
            shoeGradR.addColorStop(0.5, '#F8F8FF');
            shoeGradR.addColorStop(1, '#E8E8E8');
            ctx.fillStyle = shoeGradR;
            ctx.strokeStyle = '#D0D0D0';
            ctx.beginPath();
            ctx.moveTo(-4, -1);
            ctx.lineTo(4, -1);
            ctx.lineTo(5, 4);
            ctx.quadraticCurveTo(3, 6, -3, 6);
            ctx.lineTo(-5, 4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // 鞋跟
            ctx.fillStyle = '#E0E0E0';
            ctx.fillRect(-1.5, 6, 3, 5);
            ctx.strokeStyle = '#C0C0C0';
            ctx.strokeRect(-1.5, 6, 3, 5);
            // 鞋面装饰
            ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
            ctx.beginPath();
            ctx.arc(0, 1, 1.5, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
        
        // ========== 花瓣粒子效果 ==========
        const petalCount = 4;
        const petalColors = ['rgba(255, 182, 193, 0.7)', 'rgba(255, 228, 225, 0.6)', 'rgba(255, 240, 245, 0.5)'];
        for (let i = 0; i < petalCount; i++) {
            const petalTime = (time * 0.5 + i * 2.5) % 4;
            const petalX = x + w * (0.15 + (i % 2) * 0.7 + Math.sin(time + i) * 0.15);
            const petalY = y + h * (0.2 + petalTime * 0.2);
            const petalAlpha = Math.max(0, 1 - petalTime / 4);
            const petalRot = time * 2 + i * 1.2;
            const petalSize = 2.5 + Math.sin(time * 3 + i) * 0.5;
            
            ctx.save();
            ctx.translate(petalX, petalY);
            ctx.rotate(petalRot);
            ctx.fillStyle = petalColors[i % petalColors.length];
            ctx.globalAlpha = petalAlpha * 0.8;
            ctx.beginPath();
            ctx.ellipse(0, 0, petalSize, petalSize * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        ctx.globalAlpha = 1;
        
        // ========== 飘动的头纱前层（多层精致）==========
        if (features.hasVeil) {
            // 头纱前层渐变
            const veilGrad = ctx.createLinearGradient(x + w*0.35, y + h*0.08, x + w*0.65, y + h*0.18);
            veilGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
            veilGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
            veilGrad.addColorStop(1, 'rgba(255, 255, 255, 0.45)');
            ctx.fillStyle = veilGrad;
            ctx.beginPath();
            ctx.moveTo(x + w*0.35, y + h*0.1);
            ctx.quadraticCurveTo(x + w*0.5, y + h*0.06 + veilFloat1, x + w*0.65, y + h*0.1);
            ctx.lineTo(x + w*0.62, y + h*0.18);
            ctx.quadraticCurveTo(x + w*0.5, y + h*0.14 + veilFloat1, x + w*0.38, y + h*0.18);
            ctx.closePath();
            ctx.fill();
            
            // 头纱闪亮点
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            for (let i = 0; i < 3; i++) {
                const sparkleX = x + w*(0.42 + i*0.08);
                const sparkleY = y + h*(0.1 + Math.sin(time * 2 + i) * 0.02);
                const sparkleSize = 0.8 + Math.sin(time * 3 + i * 0.7) * 0.3;
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
    } else {
        // ========== 默认勇者形象 ==========
        
        // ========== 头部（精致动漫风格）==========
        
        // 头发 - 后层（带阴影）
        ctx.fillStyle = hairShadow;
        ctx.beginPath();
        ctx.arc(cx, y + h*0.16, w*0.21, Math.PI, 0);
        ctx.lineTo(x + w*0.87, y + h*0.26);
        ctx.lineTo(x + w*0.13, y + h*0.26);
        ctx.closePath();
        ctx.fill();
    
    // 脸部基础（带轮廓）
    ctx.fillStyle = skinColor;
    ctx.strokeStyle = skinShadow;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, y + h*0.18, w*0.18, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    
    // 脸部高光
    ctx.fillStyle = skinHighlight;
    ctx.beginPath();
    ctx.ellipse(cx - 3, y + h*0.14, w*0.06, h*0.04, -0.3, 0, Math.PI*2);
    ctx.fill();
    
    // 头发 - 后层主体
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.arc(cx, y + h*0.15, w*0.2, Math.PI, 0);
    ctx.lineTo(x + w*0.85, y + h*0.25);
    ctx.lineTo(x + w*0.15, y + h*0.25);
    ctx.closePath();
    ctx.fill();
    
    // 头发 - 前刘海（更飘逸的设计）
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.moveTo(x + w*0.18, y + h*0.06);
    ctx.quadraticCurveTo(x + w*0.28, y + h*0.14, x + w*0.35, y + h*0.1);
    ctx.quadraticCurveTo(x + w*0.45, y + h*0.16, x + w*0.5, y + h*0.1);
    ctx.quadraticCurveTo(x + w*0.55, y + h*0.16, x + w*0.65, y + h*0.1);
    ctx.quadraticCurveTo(x + w*0.72, y + h*0.14, x + w*0.82, y + h*0.06);
    ctx.lineTo(x + w*0.78, y - h*0.01);
    ctx.quadraticCurveTo(cx, y - h*0.04, x + w*0.22, y - h*0.01);
    ctx.closePath();
    ctx.fill();
    
    // 头发高光（更明亮）
    ctx.fillStyle = hairHighlight;
    ctx.beginPath();
    ctx.ellipse(x + w*0.32, y + h*0.06, w*0.05, h*0.035, -0.4, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w*0.58, y + h*0.08, w*0.04, h*0.025, 0.3, 0, Math.PI*2);
    ctx.fill();
    
    // 眼睛 - 精致动漫风格
    const eyeY = y + h*0.2;
    const leftEyeX = x + w*0.38;
    const rightEyeX = x + w*0.62;
    
    // 眼白
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, w*0.055, h*0.065, 0, 0, Math.PI*2);
    ctx.ellipse(rightEyeX, eyeY, w*0.055, h*0.065, 0, 0, Math.PI*2);
    ctx.fill();
    
    // 眼珠（明亮的青绿色，带渐变效果）
    const eyeGrad = ctx.createRadialGradient(
        leftEyeX + (dir > 0 ? 1 : -1), eyeY, 0,
        leftEyeX + (dir > 0 ? 1 : -1), eyeY, w*0.04
    );
    eyeGrad.addColorStop(0, eyeHighlight);
    eyeGrad.addColorStop(0.7, eyeColor);
    eyeGrad.addColorStop(1, '#208878');
    
    ctx.fillStyle = eyeGrad;
    ctx.beginPath();
    ctx.arc(leftEyeX + (dir > 0 ? 1 : -1), eyeY, w*0.038, 0, Math.PI*2);
    ctx.arc(rightEyeX + (dir > 0 ? 1 : -1), eyeY, w*0.038, 0, Math.PI*2);
    ctx.fill();
    
    // 眼睛高光（更明亮）
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(leftEyeX + (dir > 0 ? 2 : 0), eyeY - 1.5, w*0.018, 0, Math.PI*2);
    ctx.arc(rightEyeX + (dir > 0 ? 2 : 0), eyeY - 1.5, w*0.018, 0, Math.PI*2);
    ctx.fill();
    // 小高光点
    ctx.beginPath();
    ctx.arc(leftEyeX + (dir > 0 ? -1 : 3), eyeY + 1, w*0.008, 0, Math.PI*2);
    ctx.arc(rightEyeX + (dir > 0 ? -1 : 3), eyeY + 1, w*0.008, 0, Math.PI*2);
    ctx.fill();
    
    // 眉毛（更自然）
    ctx.strokeStyle = hairShadow;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(leftEyeX - 4, eyeY - 7);
    ctx.quadraticCurveTo(leftEyeX, eyeY - 8, leftEyeX + 3, eyeY - 6);
    ctx.moveTo(rightEyeX - 3, eyeY - 6);
    ctx.quadraticCurveTo(rightEyeX, eyeY - 8, rightEyeX + 4, eyeY - 7);
    ctx.stroke();
    
    // 鼻子（小巧精致）
    ctx.fillStyle = skinShadow;
    ctx.beginPath();
    ctx.ellipse(cx, y + h*0.24, 1.5, 1, 0, 0, Math.PI*2);
    ctx.fill();
    
    // 嘴巴（可爱微笑）
    ctx.fillStyle = '#ffb5b5';
    ctx.beginPath();
    ctx.arc(cx, y + h*0.27, 2.5, 0.1, Math.PI - 0.1);
    ctx.fill();
    // 嘴巴高光
    ctx.fillStyle = '#ffd0d0';
    ctx.beginPath();
    ctx.ellipse(cx - 1, y + h*0.265, 1, 0.5, 0, 0, Math.PI*2);
    ctx.fill();
    
    // 腮红
    ctx.fillStyle = 'rgba(255, 150, 150, 0.3)';
    ctx.beginPath();
    ctx.ellipse(leftEyeX - 4, eyeY + 4, 3, 2, 0, 0, Math.PI*2);
    ctx.ellipse(rightEyeX + 4, eyeY + 4, 3, 2, 0, 0, Math.PI*2);
    ctx.fill();
    
    // 耳朵（带轮廓）
    ctx.fillStyle = skinColor;
    ctx.strokeStyle = skinShadow;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(x + w*0.22, y + h*0.2, w*0.03, h*0.05, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x + w*0.78, y + h*0.2, w*0.03, h*0.05, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    
    // ========== 身体（鲜艳配色）==========
    
    // 脖子
    ctx.fillStyle = skinColor;
    ctx.fillRect(cx - 3, y + h*0.3, 6, h*0.05);
    
    // 衣服高领（金色装饰）
    ctx.fillStyle = clothesAccent;
    ctx.beginPath();
    ctx.moveTo(cx - 9, y + h*0.33);
    ctx.lineTo(cx + 9, y + h*0.33);
    ctx.lineTo(cx + 8, y + h*0.36);
    ctx.lineTo(cx - 8, y + h*0.36);
    ctx.closePath();
    ctx.fill();
    
    // 基础衣服（披风领口）
    ctx.fillStyle = clothesColor;
    ctx.strokeStyle = clothesDark;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 8, y + h*0.36);
    ctx.lineTo(cx + 8, y + h*0.36);
    ctx.lineTo(cx + 12, y + h*0.48);
    ctx.lineTo(cx - 12, y + h*0.48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 衣服装饰线条（金色）
    ctx.fillStyle = clothesAccent;
    ctx.fillRect(cx - 2, y + h*0.37, 4, h*0.08);
    
    // 身体主体（鲜艳蓝色披风）
    ctx.fillStyle = clothesColor;
    ctx.strokeStyle = clothesDark;
    ctx.beginPath();
    ctx.moveTo(cx - 12, y + h*0.48 + breathe * 0.3);
    ctx.lineTo(cx + 12, y + h*0.48 + breathe * 0.3);
    ctx.lineTo(cx + 14, y + h*0.72 + breathe * 0.2);
    ctx.lineTo(cx - 14, y + h*0.72 + breathe * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 衣服高光
    ctx.fillStyle = clothesLight;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - 6, y + h*0.5 + breathe * 0.3);
    ctx.lineTo(cx + 6, y + h*0.5 + breathe * 0.3);
    ctx.lineTo(cx + 8, y + h*0.65 + breathe * 0.2);
    ctx.lineTo(cx - 8, y + h*0.65 + breathe * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // 衣服阴影/褶皱
    ctx.fillStyle = clothesDark;
    ctx.beginPath();
    ctx.moveTo(cx - 10, y + h*0.52 + breathe * 0.3);
    ctx.lineTo(cx - 8, y + h*0.68 + breathe * 0.2);
    ctx.lineTo(cx - 12, y + h*0.7 + breathe * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 10, y + h*0.52 + breathe * 0.3);
    ctx.lineTo(cx + 8, y + h*0.68 + breathe * 0.2);
    ctx.lineTo(cx + 12, y + h*0.7 + breathe * 0.2);
    ctx.closePath();
    ctx.fill();
    
    // 腰带（精致的皮带）
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(cx - 13, y + h*0.7 + breathe * 0.2, 26, h*0.04);
    // 腰带扣（金色）
    ctx.fillStyle = clothesAccent;
    ctx.beginPath();
    ctx.arc(cx, y + h*0.72 + breathe * 0.2, 3, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#b8860b';
    ctx.beginPath();
    ctx.arc(cx, y + h*0.72 + breathe * 0.2, 1.5, 0, Math.PI*2);
    ctx.fill();
    
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
    
    // ========== 手臂（更精致）==========
    
    // 左臂
    ctx.fillStyle = skinColor;
    ctx.strokeStyle = skinShadow;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(x + w*0.14, y + h*0.52, w*0.045, h*0.12, -0.2, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    
    // 右臂
    ctx.beginPath();
    ctx.ellipse(x + w*0.86, y + h*0.52, w*0.045, h*0.12, 0.2, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    
    // 手套/护腕（蓝色配金色装饰）
    ctx.fillStyle = clothesColor;
    ctx.fillRect(x + w*0.09, y + h*0.6, w*0.1, h*0.06);
    ctx.fillRect(x + w*0.81, y + h*0.6, w*0.1, h*0.06);
    // 金色装饰
    ctx.fillStyle = clothesAccent;
    ctx.fillRect(x + w*0.11, y + h*0.62, w*0.06, h*0.02);
    ctx.fillRect(x + w*0.83, y + h*0.62, w*0.06, h*0.02);
    
    // ========== 腿部（精致配色）==========
    
    // 判断是否在移动
    const isMoving = (dir !== 0) || (keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight'] || keys['w'] || keys['s'] || keys['a'] || keys['d']);
    
    // 腿部摆动动画 - 更明显的旋转摆动
    let leftLegAngle = 0;
    let rightLegAngle = 0;
    if (isMoving) {
        const legSwing = Math.sin(time * 12) * 0.2;
        leftLegAngle = legSwing;
        rightLegAngle = -legSwing;
    }
    
    // 裤子颜色 - 深蓝色
    const pantsColor = '#2a4a7a';
    const pantsLight = '#3a5a8a';
    const pantsDark = '#1a3a5a';
    
    // 裤子 - 左腿（带旋转动画）
    ctx.fillStyle = pantsColor;
    ctx.strokeStyle = pantsDark;
    ctx.lineWidth = 0.5;
    ctx.save();
    ctx.translate(x + w*0.34, y + h*0.82);
    ctx.rotate(leftLegAngle);
    ctx.fillRect(-w*0.1, -h*0.1, w*0.2, h*0.2);
    ctx.strokeRect(-w*0.1, -h*0.1, w*0.2, h*0.2);
    ctx.restore();
    
    // 裤子 - 右腿（带旋转动画）
    ctx.save();
    ctx.translate(x + w*0.66, y + h*0.82);
    ctx.rotate(rightLegAngle);
    ctx.fillRect(-w*0.1, -h*0.1, w*0.2, h*0.2);
    ctx.strokeRect(-w*0.1, -h*0.1, w*0.2, h*0.2);
    ctx.restore();
    
    // 腿部高光
    ctx.fillStyle = pantsLight;
    ctx.save();
    ctx.translate(x + w*0.34, y + h*0.82);
    ctx.rotate(leftLegAngle);
    ctx.fillRect(-w*0.07, -h*0.08, w*0.05, h*0.16);
    ctx.restore();
    
    ctx.save();
    ctx.translate(x + w*0.66, y + h*0.82);
    ctx.rotate(rightLegAngle);
    ctx.fillRect(-w*0.07, -h*0.08, w*0.05, h*0.16);
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
        // 默认靴子 - 棕色皮靴配金色装饰
        ctx.fillStyle = '#8b5a2b';
        ctx.strokeStyle = '#5a3a1b';
        ctx.lineWidth = 0.5;
        ctx.save();
        ctx.translate(x + w*0.34, y + h*0.88);
        ctx.rotate(leftLegAngle);
        ctx.fillRect(-w*0.12, -h*0.05, w*0.24, h*0.1);
        ctx.strokeRect(-w*0.12, -h*0.05, w*0.24, h*0.1);
        // 金色装饰
        ctx.fillStyle = clothesAccent;
        ctx.fillRect(-w*0.04, -h*0.03, w*0.08, h*0.02);
        ctx.restore();
        
        ctx.fillStyle = '#8b5a2b';
        ctx.strokeStyle = '#5a3a1b';
        ctx.save();
        ctx.translate(x + w*0.66, y + h*0.88);
        ctx.rotate(rightLegAngle);
        ctx.fillRect(-w*0.12, -h*0.05, w*0.24, h*0.1);
        ctx.strokeRect(-w*0.12, -h*0.05, w*0.24, h*0.1);
        ctx.fillStyle = clothesAccent;
        ctx.fillRect(-w*0.04, -h*0.03, w*0.08, h*0.02);
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
    
    } // 结束 else (hero skin)
    
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

        // 获取玩家朝向角度
        const player = window.player;
        let dirX = player?.dirX ?? 1;
        let dirY = player?.dirY ?? 0;
        let baseAngle = Math.atan2(dirY, dirX);

        // 如果正在攻击，武器跟随月牙动画挥舞
        if (isAttacking && attackProgress > 0) {
            // 月牙从 attackAngle - attackArc/2 扫到 attackAngle + attackArc/2
            const attackArc = Math.PI * 2 / 3; // 120度
            const swingAngle = baseAngle - attackArc/2 + attackProgress * attackArc;
            ctx.rotate(swingAngle);
        } else {
            if(baseAngle >= Math.PI/2 && baseAngle <= Math.PI) {
                ctx.rotate(baseAngle + Math.PI/2);
            }
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

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
            // 龙鳞甲 - 鲜艳的红色龙鳞
            // 主体护甲
            ctx.fillStyle = '#e63946';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.12);
            ctx.lineTo(x + w*0.88, y + h*0.28);
            ctx.lineTo(x + w*0.82, y + h*0.78);
            ctx.lineTo(cx, y + h*0.88);
            ctx.lineTo(x + w*0.18, y + h*0.78);
            ctx.lineTo(x + w*0.12, y + h*0.28);
            ctx.closePath();
            ctx.fill();
            // 龙鳞高光
            ctx.fillStyle = '#ff6b6b';
            for(let row=0; row<3; row++) {
                for(let col=0; col<3-row; col++) {
                    ctx.beginPath();
                    ctx.arc(cx + (col-1+row*0.5)*w*0.2, y + h*0.32 + row*h*0.15, w*0.09, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            // 龙鳞阴影
            ctx.fillStyle = '#b22222';
            for(let row=0; row<2; row++) {
                for(let col=0; col<2-row; col++) {
                    ctx.beginPath();
                    ctx.arc(cx + (col-0.5+row*0.5)*w*0.2, y + h*0.42 + row*h*0.18, w*0.06, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            // 肩部尖刺
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(x + w*0.12, y + h*0.28);
            ctx.lineTo(x + w*0.02, y + h*0.15);
            ctx.lineTo(x + w*0.18, y + h*0.22);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.88, y + h*0.28);
            ctx.lineTo(x + w*0.98, y + h*0.15);
            ctx.lineTo(x + w*0.82, y + h*0.22);
            ctx.fill();
            // 中央红宝石发光
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.42, w*0.12, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#ff4444';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.42, w*0.08, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#ff8888';
            ctx.beginPath();
            ctx.arc(cx - 2, y + h*0.40, w*0.03, 0, Math.PI*2);
            ctx.fill();
            
        } else if (sprite === 'iron') {
            // 铁甲 - 鲜明金属蓝银色
            // 胸甲主体
            const armorGrad = ctx.createLinearGradient(x, y, x + w, y + h);
            armorGrad.addColorStop(0, '#5a6e8c');
            armorGrad.addColorStop(0.5, '#8fa4bf');
            armorGrad.addColorStop(1, '#4a5e7c');
            ctx.fillStyle = armorGrad;
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.12);
            ctx.lineTo(x + w*0.82, y + h*0.24);
            ctx.lineTo(x + w*0.78, y + h*0.82);
            ctx.lineTo(cx, y + h*0.9);
            ctx.lineTo(x + w*0.22, y + h*0.82);
            ctx.lineTo(x + w*0.18, y + h*0.24);
            ctx.closePath();
            ctx.fill();
            // 金属高光
            ctx.fillStyle = '#c8d8e8';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.15);
            ctx.lineTo(x + w*0.68, y + h*0.26);
            ctx.lineTo(x + w*0.65, y + h*0.52);
            ctx.lineTo(cx, y + h*0.58);
            ctx.lineTo(x + w*0.35, y + h*0.52);
            ctx.lineTo(x + w*0.32, y + h*0.26);
            ctx.closePath();
            ctx.fill();
            // 金色铆钉装饰
            ctx.fillStyle = '#ffd700';
            for(let i=0; i<3; i++) {
                ctx.beginPath();
                ctx.arc(cx, y + h*0.32 + i*h*0.15, w*0.05, 0, Math.PI*2);
                ctx.fill();
            }
            // 肩甲
            ctx.fillStyle = '#6a7e9c';
            ctx.fillRect(x + w*0.08, y + h*0.2, w*0.18, h*0.28);
            ctx.fillRect(x + w*0.74, y + h*0.2, w*0.18, h*0.28);
            // 肩甲高光
            ctx.fillStyle = '#9ab0c8';
            ctx.fillRect(x + w*0.1, y + h*0.22, w*0.08, h*0.24);
            ctx.fillRect(x + w*0.82, y + h*0.22, w*0.08, h*0.24);
            
        } else if (sprite === 'leather') {
            // 皮甲 - 鲜艳的棕色皮革
            // 主体
            ctx.fillStyle = '#c9863e';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.15);
            ctx.lineTo(x + w*0.78, y + h*0.26);
            ctx.lineTo(x + w*0.74, y + h*0.82);
            ctx.lineTo(cx, y + h*0.88);
            ctx.lineTo(x + w*0.26, y + h*0.82);
            ctx.lineTo(x + w*0.22, y + h*0.26);
            ctx.closePath();
            ctx.fill();
            // 高光
            ctx.fillStyle = '#e8a84d';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.18);
            ctx.lineTo(x + w*0.68, y + h*0.28);
            ctx.lineTo(x + w*0.65, y + h*0.55);
            ctx.lineTo(cx, y + h*0.6);
            ctx.lineTo(x + w*0.35, y + h*0.55);
            ctx.lineTo(x + w*0.32, y + h*0.28);
            ctx.closePath();
            ctx.fill();
            // 金色缝线
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w*0.28, y + h*0.32);
            ctx.lineTo(x + w*0.3, y + h*0.78);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w*0.72, y + h*0.32);
            ctx.lineTo(x + w*0.7, y + h*0.78);
            ctx.stroke();
            // 皮带扣
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(cx - w*0.1, y + h*0.38, w*0.2, h*0.1);
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.43, w*0.06, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#b8860b';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.43, w*0.03, 0, Math.PI*2);
            ctx.fill();
            // 肩部护垫
            ctx.fillStyle = '#a0522d';
            ctx.beginPath();
            ctx.arc(x + w*0.18, y + h*0.32, w*0.12, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w*0.82, y + h*0.32, w*0.12, 0, Math.PI*2);
            ctx.fill();
            
        } else {
            // 布衣 - 鲜艳的法师长袍
            // 袍子主体渐变
            const robeGrad = ctx.createLinearGradient(x, y, x + w, y + h);
            robeGrad.addColorStop(0, '#6a4c93');
            robeGrad.addColorStop(0.5, '#9b72cf');
            robeGrad.addColorStop(1, '#5a3c83');
            ctx.fillStyle = robeGrad;
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.12);
            ctx.lineTo(x + w*0.72, y + h*0.24);
            ctx.lineTo(x + w*0.78, y + h*0.88);
            ctx.lineTo(cx, y + h*0.92);
            ctx.lineTo(x + w*0.22, y + h*0.88);
            ctx.lineTo(x + w*0.28, y + h*0.24);
            ctx.closePath();
            ctx.fill();
            // 衣领金色
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.12);
            ctx.lineTo(x + w*0.62, y + h*0.2);
            ctx.lineTo(cx, y + h*0.35);
            ctx.lineTo(x + w*0.38, y + h*0.2);
            ctx.closePath();
            ctx.fill();
            // 高光
            ctx.fillStyle = '#b794d8';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.15);
            ctx.lineTo(x + w*0.62, y + h*0.26);
            ctx.lineTo(x + w*0.6, y + h*0.55);
            ctx.lineTo(cx, y + h*0.6);
            ctx.lineTo(x + w*0.4, y + h*0.55);
            ctx.lineTo(x + w*0.38, y + h*0.26);
            ctx.closePath();
            ctx.fill();
            // 腰带
            ctx.fillStyle = '#4a3660';
            ctx.fillRect(x + w*0.25, y + h*0.52, w*0.5, h*0.08);
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.56, w*0.07, 0, Math.PI*2);
            ctx.fill();
        }
    }
    // 头盔渲染 - 完整的头部装备
    else if (item.type === 'helmet') {
        const cx = x + w * 0.5;
        if (sprite === 'iron_helm') {
            // 铁头盔 - 鲜艳的蓝银骑士头盔
            // 头盔主体渐变
            const helmGrad = ctx.createRadialGradient(cx, y + h*0.4, 0, cx, y + h*0.4, w*0.4);
            helmGrad.addColorStop(0, '#a8c0d8');
            helmGrad.addColorStop(0.7, '#6a82a2');
            helmGrad.addColorStop(1, '#4a62a2');
            ctx.fillStyle = helmGrad;
            ctx.beginPath();
            ctx.arc(cx, y + h*0.42, w*0.38, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            // 面甲
            ctx.fillStyle = '#5a72a2';
            ctx.fillRect(x + w*0.22, y + h*0.42, w*0.56, h*0.28);
            // 观察缝发光效果
            ctx.fillStyle = '#001';
            ctx.fillRect(x + w*0.28, y + h*0.48, w*0.18, h*0.06);
            ctx.fillRect(x + w*0.54, y + h*0.48, w*0.18, h*0.06);
            ctx.fillStyle = '#4af';
            ctx.fillRect(x + w*0.3, y + h*0.49, w*0.14, h*0.04);
            ctx.fillRect(x + w*0.56, y + h*0.49, w*0.14, h*0.04);
            // 金色顶部装饰
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.05);
            ctx.lineTo(cx - w*0.1, y + h*0.15);
            ctx.lineTo(cx + w*0.1, y + h*0.15);
            ctx.closePath();
            ctx.fill();
            // 护颈
            ctx.fillStyle = '#4a62a2';
            ctx.fillRect(x + w*0.18, y + h*0.68, w*0.64, h*0.14);
            // 金色装饰线
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(x + w*0.2, y + h*0.68, w*0.6, h*0.02);
            
        } else if (sprite === 'leather_helm') {
            // 皮帽 - 鲜艳的冒险者帽子
            // 主体
            ctx.fillStyle = '#c9863e';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.38, w*0.32, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            // 高光
            ctx.fillStyle = '#e8a84d';
            ctx.beginPath();
            ctx.arc(cx - w*0.08, y + h*0.32, w*0.12, 0, Math.PI*2);
            ctx.fill();
            // 帽檐
            ctx.fillStyle = '#a0522d';
            ctx.fillRect(x + w*0.12, y + h*0.36, w*0.76, h*0.1);
            // 金色帽檐装饰
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(x + w*0.12, y + h*0.36, w*0.76, h*0.02);
            // 护耳
            ctx.fillStyle = '#8b4513';
            ctx.beginPath();
            ctx.arc(x + w*0.18, y + h*0.52, w*0.14, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w*0.82, y + h*0.52, w*0.14, 0, Math.PI*2);
            ctx.fill();
            // 装饰羽毛 - 鲜艳的红色
            ctx.fillStyle = '#e63946';
            ctx.beginPath();
            ctx.ellipse(cx + w*0.15, y + h*0.22, w*0.05, h*0.14, -0.3, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.ellipse(cx + w*0.18, y + h*0.18, w*0.035, h*0.1, -0.3, 0, Math.PI*2);
            ctx.fill();
            
        } else {
            // 布帽 - 鲜艳的法师头巾
            // 主体渐变
            const hoodGrad = ctx.createLinearGradient(x, y, x + w, y + h);
            hoodGrad.addColorStop(0, '#6a4c93');
            hoodGrad.addColorStop(0.5, '#9b72cf');
            hoodGrad.addColorStop(1, '#5a3c83');
            ctx.fillStyle = hoodGrad;
            ctx.beginPath();
            ctx.arc(cx, y + h*0.38, w*0.3, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            // 头巾下垂部分
            ctx.fillStyle = '#7a5ca3';
            ctx.beginPath();
            ctx.moveTo(x + w*0.22, y + h*0.42);
            ctx.lineTo(x + w*0.12, y + h*0.78);
            ctx.lineTo(x + w*0.38, y + h*0.72);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w*0.78, y + h*0.42);
            ctx.lineTo(x + w*0.88, y + h*0.78);
            ctx.lineTo(x + w*0.62, y + h*0.72);
            ctx.closePath();
            ctx.fill();
            // 金色装饰图案
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.3, w*0.08, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#b8860b';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.3, w*0.04, 0, Math.PI*2);
            ctx.fill();
        }
    }
    // 靴子渲染 - 完整的 footwear 设计
    else if (item.type === 'boots') {
        if (sprite === 'iron_boots') {
            // 铁靴 - 鲜艳的蓝银战靴
            // 左靴主体渐变
            const bootGradL = ctx.createLinearGradient(x + w*0.1, y, x + w*0.35, y);
            bootGradL.addColorStop(0, '#4a62a2');
            bootGradL.addColorStop(0.5, '#6a82a2');
            bootGradL.addColorStop(1, '#5a72a2');
            ctx.fillStyle = bootGradL;
            ctx.beginPath();
            ctx.moveTo(x + w*0.12, y + h*0.22);
            ctx.lineTo(x + w*0.28, y + h*0.22);
            ctx.lineTo(x + w*0.32, y + h*0.68);
            ctx.lineTo(x + w*0.38, y + h*0.88);
            ctx.lineTo(x + w*0.08, y + h*0.88);
            ctx.lineTo(x + w*0.06, y + h*0.68);
            ctx.closePath();
            ctx.fill();
            // 左靴金属高光
            ctx.fillStyle = '#a8c0d8';
            ctx.fillRect(x + w*0.1, y + h*0.32, w*0.12, h*0.28);
            // 金色装饰
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(x + w*0.12, y + h*0.35, w*0.08, h*0.02);
            ctx.fillRect(x + w*0.12, y + h*0.5, w*0.08, h*0.02);
            
            // 右靴主体渐变
            const bootGradR = ctx.createLinearGradient(x + w*0.5, y, x + w*0.75, y);
            bootGradR.addColorStop(0, '#5a72a2');
            bootGradR.addColorStop(0.5, '#6a82a2');
            bootGradR.addColorStop(1, '#4a62a2');
            ctx.fillStyle = bootGradR;
            ctx.beginPath();
            ctx.moveTo(x + w*0.52, y + h*0.22);
            ctx.lineTo(x + w*0.68, y + h*0.22);
            ctx.lineTo(x + w*0.72, y + h*0.68);
            ctx.lineTo(x + w*0.78, y + h*0.88);
            ctx.lineTo(x + w*0.48, y + h*0.88);
            ctx.lineTo(x + w*0.46, y + h*0.68);
            ctx.closePath();
            ctx.fill();
            // 右靴金属高光
            ctx.fillStyle = '#a8c0d8';
            ctx.fillRect(x + w*0.56, y + h*0.32, w*0.12, h*0.28);
            // 金色装饰
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(x + w*0.58, y + h*0.35, w*0.08, h*0.02);
            ctx.fillRect(x + w*0.58, y + h*0.5, w*0.08, h*0.02);
            // 靴底
            ctx.fillStyle = '#2a3a5a';
            ctx.fillRect(x + w*0.06, y + h*0.86, w*0.34, h*0.08);
            ctx.fillRect(x + w*0.46, y + h*0.86, w*0.34, h*0.08);
            
        } else if (sprite === 'leather_boots') {
            // 皮靴 - 鲜艳的冒险者长靴
            // 左靴
            ctx.fillStyle = '#c9863e';
            ctx.beginPath();
            ctx.moveTo(x + w*0.15, y + h*0.28);
            ctx.lineTo(x + w*0.32, y + h*0.28);
            ctx.quadraticCurveTo(x + w*0.35, y + h*0.55, x + w*0.32, y + h*0.82);
            ctx.lineTo(x + w*0.1, y + h*0.82);
            ctx.quadraticCurveTo(x + w*0.08, y + h*0.55, x + w*0.15, y + h*0.28);
            ctx.closePath();
            ctx.fill();
            // 高光
            ctx.fillStyle = '#e8a84d';
            ctx.beginPath();
            ctx.moveTo(x + w*0.18, y + h*0.32);
            ctx.lineTo(x + w*0.28, y + h*0.32);
            ctx.quadraticCurveTo(x + w*0.3, y + h*0.5, x + w*0.28, y + h*0.7);
            ctx.lineTo(x + w*0.18, y + h*0.7);
            ctx.closePath();
            ctx.fill();
            // 金色鞋带扣
            ctx.fillStyle = '#ffd700';
            for(let i=0; i<3; i++) {
                ctx.fillRect(x + w*0.14, y + h*0.38 + i*h*0.12, w*0.16, h*0.04);
            }
            
            // 右靴
            ctx.fillStyle = '#c9863e';
            ctx.beginPath();
            ctx.moveTo(x + w*0.58, y + h*0.28);
            ctx.lineTo(x + w*0.75, y + h*0.28);
            ctx.quadraticCurveTo(x + w*0.78, y + h*0.55, x + w*0.75, y + h*0.82);
            ctx.lineTo(x + w*0.53, y + h*0.82);
            ctx.quadraticCurveTo(x + w*0.5, y + h*0.55, x + w*0.58, y + h*0.28);
            ctx.closePath();
            ctx.fill();
            // 高光
            ctx.fillStyle = '#e8a84d';
            ctx.beginPath();
            ctx.moveTo(x + w*0.6, y + h*0.32);
            ctx.lineTo(x + w*0.7, y + h*0.32);
            ctx.quadraticCurveTo(x + w*0.72, y + h*0.5, x + w*0.7, y + h*0.7);
            ctx.lineTo(x + w*0.6, y + h*0.7);
            ctx.closePath();
            ctx.fill();
            // 金色鞋带扣
            ctx.fillStyle = '#ffd700';
            for(let i=0; i<3; i++) {
                ctx.fillRect(x + w*0.56, y + h*0.38 + i*h*0.12, w*0.16, h*0.04);
            }
            
        } else {
            // 草鞋 - 鲜艳的绿色草编鞋
            // 左鞋
            ctx.fillStyle = '#7cb342';
            ctx.beginPath();
            ctx.ellipse(x + w*0.22, y + h*0.72, w*0.14, h*0.22, 0, 0, Math.PI*2);
            ctx.fill();
            // 草编纹理
            ctx.strokeStyle = '#558b2f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w*0.12, y + h*0.6);
            ctx.lineTo(x + w*0.32, y + h*0.85);
            ctx.moveTo(x + w*0.32, y + h*0.6);
            ctx.lineTo(x + w*0.12, y + h*0.85);
            ctx.stroke();
            // 右鞋
            ctx.fillStyle = '#7cb342';
            ctx.beginPath();
            ctx.ellipse(x + w*0.62, y + h*0.72, w*0.14, h*0.22, 0, 0, Math.PI*2);
            ctx.fill();
            // 草编纹理
            ctx.beginPath();
            ctx.moveTo(x + w*0.52, y + h*0.6);
            ctx.lineTo(x + w*0.72, y + h*0.85);
            ctx.moveTo(x + w*0.72, y + h*0.6);
            ctx.lineTo(x + w*0.52, y + h*0.85);
            ctx.stroke();
        }
    }
    // 戒指渲染 - 精美的首饰设计
    else if (item.type === 'ring') {
        const cx = x + w * 0.5;
        const cy = y + h * 0.5;
        if (sprite === 'power_ring') {
            // 力量戒指 - 鲜艳红宝石配金色
            // 金色指环
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.26, 0, Math.PI*2);
            ctx.stroke();
            // 戒指表面装饰
            ctx.strokeStyle = '#ffec8b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.22, 0, Math.PI*2);
            ctx.stroke();
            // 红宝石发光
            ctx.fillStyle = '#ff4444';
            ctx.beginPath();
            ctx.arc(cx, cy - h*0.02, w*0.18, 0, Math.PI*2);
            ctx.fill();
            // 红宝石主体
            ctx.fillStyle = '#e63946';
            ctx.beginPath();
            ctx.arc(cx, cy - h*0.02, w*0.14, 0, Math.PI*2);
            ctx.fill();
            // 宝石高光
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(cx - w*0.04, cy - h*0.05, w*0.05, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#ffaaaa';
            ctx.beginPath();
            ctx.arc(cx - w*0.02, cy - h*0.04, w*0.02, 0, Math.PI*2);
            ctx.fill();
            // 金色爪镶
            ctx.fillStyle = '#ffd700';
            for(let i=0; i<4; i++) {
                const angle = (i * Math.PI/2) - Math.PI/4;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(angle)*w*0.12, cy - h*0.02 + Math.sin(angle)*w*0.12, w*0.04, 0, Math.PI*2);
                ctx.fill();
            }
            
        } else if (sprite === 'speed_ring') {
            // 敏捷戒指 - 鲜艳蓝宝石配银色闪电
            // 银色指环
            ctx.strokeStyle = '#c0c0c0';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.26, 0, Math.PI*2);
            ctx.stroke();
            // 高光环
            ctx.strokeStyle = '#e8e8e8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.22, 0, Math.PI*2);
            ctx.stroke();
            // 蓝宝石发光
            ctx.fillStyle = '#4fc3f7';
            ctx.beginPath();
            ctx.moveTo(cx, cy - h*0.2);
            ctx.lineTo(cx + w*0.14, cy - h*0.04);
            ctx.lineTo(cx, cy + h*0.1);
            ctx.lineTo(cx - w*0.14, cy - h*0.04);
            ctx.closePath();
            ctx.fill();
            // 蓝宝石主体
            ctx.fillStyle = '#29b6f6';
            ctx.beginPath();
            ctx.moveTo(cx, cy - h*0.16);
            ctx.lineTo(cx + w*0.1, cy - h*0.02);
            ctx.lineTo(cx, cy + h*0.06);
            ctx.lineTo(cx - w*0.1, cy - h*0.02);
            ctx.closePath();
            ctx.fill();
            // 宝石光泽
            ctx.fillStyle = '#81d4fa';
            ctx.beginPath();
            ctx.moveTo(cx, cy - h*0.12);
            ctx.lineTo(cx + w*0.05, cy - h*0.02);
            ctx.lineTo(cx, cy + h*0.02);
            ctx.lineTo(cx - w*0.05, cy - h*0.02);
            ctx.closePath();
            ctx.fill();
            // 银色爪镶
            ctx.fillStyle = '#e0e0e0';
            for(let i=0; i<4; i++) {
                const angle = (i * Math.PI/2) - Math.PI/4;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(angle)*w*0.11, cy + Math.sin(angle)*w*0.11, w*0.03, 0, Math.PI*2);
                ctx.fill();
            }
            
        } else if (sprite === 'health_ring') {
            // 生命戒指 - 鲜艳绿宝石配金色藤蔓
            // 金色指环
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.26, 0, Math.PI*2);
            ctx.stroke();
            // 藤蔓纹理
            ctx.strokeStyle = '#50c878';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for(let i=0; i<6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                ctx.moveTo(cx + Math.cos(angle)*w*0.18, cy + Math.sin(angle)*w*0.18);
                ctx.quadraticCurveTo(
                    cx + Math.cos(angle + 0.3)*w*0.24, 
                    cy + Math.sin(angle + 0.3)*w*0.24,
                    cx + Math.cos(angle + 0.5)*w*0.18, 
                    cy + Math.sin(angle + 0.5)*w*0.18
                );
            }
            ctx.stroke();
            // 绿宝石发光
            ctx.fillStyle = '#66bb6a';
            ctx.beginPath();
            ctx.arc(cx - w*0.06, cy - h*0.08, w*0.1, 0, Math.PI*2);
            ctx.arc(cx + w*0.06, cy - h*0.08, w*0.1, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx - w*0.14, cy - h*0.06);
            ctx.lineTo(cx, cy + h*0.08);
            ctx.lineTo(cx + w*0.14, cy - h*0.06);
            ctx.closePath();
            ctx.fill();
            // 绿宝石主体
            ctx.fillStyle = '#43a047';
            ctx.beginPath();
            ctx.arc(cx - w*0.04, cy - h*0.06, w*0.07, 0, Math.PI*2);
            ctx.arc(cx + w*0.04, cy - h*0.06, w*0.07, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx - w*0.1, cy - h*0.04);
            ctx.lineTo(cx, cy + h*0.04);
            ctx.lineTo(cx + w*0.1, cy - h*0.04);
            ctx.closePath();
            ctx.fill();
            // 光泽
            ctx.fillStyle = '#a5d6a7';
            ctx.beginPath();
            ctx.arc(cx - w*0.04, cy - h*0.08, w*0.03, 0, Math.PI*2);
            ctx.fill();
            
        } else {
            // 默认戒指 - 金色基础款
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(cx, cy, w*0.26, 0, Math.PI*2);
            ctx.stroke();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy - h*0.02, w*0.12, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(cx - w*0.03, cy - h*0.04, w*0.04, 0, Math.PI*2);
            ctx.fill();
        }
    }
    // 项链渲染 - 精美的吊坠设计
    else if (item.type === 'necklace') {
        const cx = x + w * 0.5;
        if (sprite === 'health_amulet') {
            // 生命护符 - 鲜艳红心配金链
            // 金色链条
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx - w*0.18, y + h*0.08);
            ctx.quadraticCurveTo(cx, y + h*0.28, cx + w*0.18, y + h*0.08);
            ctx.stroke();
            // 链条环
            ctx.strokeStyle = '#ffec8b';
            ctx.lineWidth = 2;
            for(let i=0; i<5; i++) {
                ctx.beginPath();
                ctx.arc(cx - w*0.14 + i*w*0.07, y + h*0.12 + i*h*0.03, w*0.03, 0, Math.PI*2);
                ctx.stroke();
            }
            // 心形发光
            ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.55, w*0.22, 0, Math.PI*2);
            ctx.fill();
            // 心形吊坠主体
            ctx.fillStyle = '#e63946';
            ctx.beginPath();
            ctx.arc(cx - w*0.1, y + h*0.48, w*0.12, 0, Math.PI*2);
            ctx.arc(cx + w*0.1, y + h*0.48, w*0.12, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx - w*0.18, y + h*0.52);
            ctx.lineTo(cx, y + h*0.78);
            ctx.lineTo(cx + w*0.18, y + h*0.52);
            ctx.closePath();
            ctx.fill();
            // 心形亮部
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(cx - w*0.07, y + h*0.44, w*0.05, 0, Math.PI*2);
            ctx.arc(cx + w*0.07, y + h*0.44, w*0.05, 0, Math.PI*2);
            ctx.fill();
            // 金色吊坠边框
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx - w*0.1, y + h*0.48, w*0.12, 0.5, 3.5);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx + w*0.1, y + h*0.48, w*0.12, 5.8, 2.8);
            ctx.stroke();
            
        } else if (sprite === 'magic_amulet') {
            // 魔法护符 - 鲜艳蓝水晶配银链
            // 银色链条
            ctx.strokeStyle = '#c0c0c0';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx - w*0.18, y + h*0.08);
            ctx.quadraticCurveTo(cx, y + h*0.28, cx + w*0.18, y + h*0.08);
            ctx.stroke();
            // 链条细节
            ctx.strokeStyle = '#e8e8e8';
            for(let i=0; i<6; i++) {
                ctx.beginPath();
                ctx.arc(cx - w*0.14 + i*w*0.055, y + h*0.12 + i*h*0.025, w*0.025, 0, Math.PI*2);
                ctx.stroke();
            }
            // 吊坠底座
            ctx.fillStyle = '#90a4ae';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.4, w*0.2, 0, Math.PI*2);
            ctx.fill();
            // 水晶发光
            ctx.fillStyle = 'rgba(79, 195, 247, 0.3)';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.45, w*0.18, 0, Math.PI*2);
            ctx.fill();
            // 水晶
            ctx.fillStyle = '#29b6f6';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.22);
            ctx.lineTo(cx + w*0.14, y + h*0.4);
            ctx.lineTo(cx, y + h*0.68);
            ctx.lineTo(cx - w*0.14, y + h*0.4);
            ctx.closePath();
            ctx.fill();
            // 水晶面
            ctx.fillStyle = '#4fc3f7';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.26);
            ctx.lineTo(cx + w*0.07, y + h*0.4);
            ctx.lineTo(cx, y + h*0.6);
            ctx.lineTo(cx - w*0.07, y + h*0.4);
            ctx.closePath();
            ctx.fill();
            // 高光
            ctx.fillStyle = '#81d4fa';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.3);
            ctx.lineTo(cx + w*0.04, y + h*0.4);
            ctx.lineTo(cx, y + h*0.48);
            ctx.lineTo(cx - w*0.04, y + h*0.4);
            ctx.closePath();
            ctx.fill();
            // 魔法符文
            ctx.strokeStyle = '#e1f5fe';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx, y + h*0.48, w*0.07, 0, Math.PI*2);
            ctx.stroke();
            
        } else if (sprite === 'power_necklace') {
            // 力量项链 - 鲜艳紫宝石配金链
            // 金色粗链条
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(cx - w*0.2, y + h*0.1);
            ctx.quadraticCurveTo(cx, y + h*0.32, cx + w*0.2, y + h*0.1);
            ctx.stroke();
            // 链条节
            ctx.fillStyle = '#ffec8b';
            for(let i=0; i<4; i++) {
                ctx.beginPath();
                ctx.arc(cx - w*0.14 + i*w*0.095, y + h*0.18 + i*h*0.04, w*0.05, 0, Math.PI*2);
                ctx.fill();
            }
            // 宝石底座
            ctx.fillStyle = '#8e24aa';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.35);
            ctx.lineTo(cx + w*0.22, y + h*0.48);
            ctx.lineTo(cx + w*0.18, y + h*0.72);
            ctx.lineTo(cx - w*0.18, y + h*0.72);
            ctx.lineTo(cx - w*0.22, y + h*0.48);
            ctx.closePath();
            ctx.fill();
            // 紫色宝石发光
            ctx.fillStyle = 'rgba(171, 71, 188, 0.3)';
            ctx.beginPath();
            ctx.arc(cx, y + h*0.55, w*0.2, 0, Math.PI*2);
            ctx.fill();
            // 紫色宝石
            ctx.fillStyle = '#ab47bc';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.38);
            ctx.lineTo(cx + w*0.16, y + h*0.55);
            ctx.lineTo(cx, y + h*0.72);
            ctx.lineTo(cx - w*0.16, y + h*0.55);
            ctx.closePath();
            ctx.fill();
            // 宝石面
            ctx.fillStyle = '#ce93d8';
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.42);
            ctx.lineTo(cx + w*0.09, y + h*0.55);
            ctx.lineTo(cx, y + h*0.66);
            ctx.lineTo(cx - w*0.09, y + h*0.55);
            ctx.closePath();
            ctx.fill();
            // 高光
            ctx.fillStyle = '#e1bee7';
            ctx.beginPath();
            ctx.ellipse(cx - w*0.03, y + h*0.5, w*0.04, h*0.05, -0.5, 0, Math.PI*2);
            ctx.fill();
            // 力量符文
            ctx.strokeStyle = '#ea80fc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, y + h*0.5);
            ctx.lineTo(cx, y + h*0.62);
            ctx.moveTo(cx - w*0.05, y + h*0.55);
            ctx.lineTo(cx + w*0.05, y + h*0.55);
            ctx.stroke();
            
        } else {
            // 默认项链 - 金色基础款
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx - w*0.15, y + h*0.1);
            ctx.quadraticCurveTo(cx, y + h*0.25, cx + w*0.15, y + h*0.1);
            ctx.stroke();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, y + h*0.52, w*0.16, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(cx - w*0.04, y + h*0.48, w*0.05, 0, Math.PI*2);
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
