/**
 * 角色渲染系统 - 同一角色的四方向视图
 * 核心原则：同一角色，不同角度
 */

window.SpriteManager = {
    cache: {},
    
    directionMap: {
        0: 'right', 1: 'right', 2: 'down',
        3: 'left', 4: 'left', 5: 'left',
        6: 'up', 7: 'right'
    },
    
    animFrames: { idle: 4, walk: 4, attack: 4 },
    animSpeed: { idle: 4, walk: 8, attack: 12 },
    
    getDirection: function(dirX, dirY) {
        if (dirX === undefined || dirX === null) dirX = 1;
        if (dirY === undefined || dirY === null) dirY = 0;
        const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        dirX /= len; dirY /= len;
        
        let dir = 0;
        if (dirX > 0.5) dir = 0;
        else if (dirX < -0.5) dir = 4;
        else if (dirY > 0.5) dir = 2;
        else if (dirY < -0.5) dir = 6;
        else if (dirX > 0 && dirY > 0) dir = 1;
        else if (dirX < 0 && dirY > 0) dir = 3;
        else if (dirX < 0 && dirY < 0) dir = 5;
        else if (dirX > 0 && dirY < 0) dir = 7;
        
        return this.directionMap[dir];
    },
    
    getFrame: function(animType, time) {
        const frames = this.animFrames[animType] || 4;
        const speed = this.animSpeed[animType] || 8;
        return Math.floor((time / 1000) * speed) % frames;
    },
    
    generateCharacterSprite: function(config) {
        const sprite = { name: config.name || 'character', frames: {} };
        const directions = ['down', 'left', 'right', 'up'];
        const animTypes = ['idle', 'walk', 'attack'];
        const frameCount = 4;
        const frameSize = config.size || 64;
        
        directions.forEach(dir => {
            sprite.frames[dir] = {};
            animTypes.forEach(anim => {
                sprite.frames[dir][anim] = [];
                for (let f = 0; f < frameCount; f++) {
                    const canvas = document.createElement('canvas');
                    canvas.width = frameSize;
                    canvas.height = frameSize;
                    const ctx = canvas.getContext('2d');
                    this.drawCharacterFrame(ctx, config, dir, anim, f, frameSize);
                    sprite.frames[dir][anim].push(canvas);
                }
            });
        });
        return sprite;
    },
    
    /**
     * 主渲染函数 - 统一的角色渲染
     */
    drawCharacterFrame: function(ctx, config, direction, animType, frame, size) {
        const cx = size / 2;
        const time = frame * 0.1;
        const now = Date.now() / 500;
        
        // 动画偏移
        let offsetY = 0, legOffset = 0, armOffset = 0;
        
        if (animType === 'walk') {
            offsetY = Math.sin(time * Math.PI * 2) * 2;
            legOffset = Math.sin(time * Math.PI * 2) * 4;
            armOffset = Math.sin(time * Math.PI * 2 + Math.PI) * 3;
        } else if (animType === 'attack') {
            armOffset = Math.sin(time * Math.PI) * 8;
        } else {
            offsetY = Math.sin(time * Math.PI) * 1;
        }
        
        // 使用统一样式
        const skinColor = config.skinColor || '#ffe4d0';
        const skinShadow = config.skinShadow || '#e8c4a8';
        const hairColor = config.hairColor || '#f4c542';
        const hairShadow = config.hairShadow || '#d4a012';
        const clothesColor = config.clothesColor || '#4a9eff';
        const clothesDark = config.clothesDark || '#2070cc';
        const clothesLight = config.clothesLight || '#7ac0ff';
        const eyeColor = config.eyeColor || '#40d0b0';
        const eyeHighlight = config.eyeHighlight || '#80ffe0';
        const features = config.features || {};
        
        // 渲染
        if (direction === 'down') {
            this.renderDownView(ctx, config, cx, size, offsetY, legOffset, armOffset, now, skinColor, skinShadow, hairColor, hairShadow, clothesColor, clothesDark, eyeColor, eyeHighlight, features);
        } else if (direction === 'up') {
            this.renderUpView(ctx, config, cx, size, offsetY, legOffset, now, skinColor, hairColor, hairShadow, clothesColor, clothesDark, features);
        } else {
            const isLeft = (direction === 'left');
            this.renderSideView(ctx, config, cx, size, offsetY, legOffset, armOffset, now, isLeft, skinColor, skinShadow, hairColor, hairShadow, clothesColor, clothesDark, eyeColor, eyeHighlight, features);
        }
    },
    
    /**
     * 正面朝下 - 经典正面视图
     */
    renderDownView: function(ctx, config, cx, size, offsetY, legOffset, armOffset, now, skinColor, skinShadow, hairColor, hairShadow, clothesColor, clothesDark, eyeColor, eyeHighlight, features) {
        const bodyType = features.bodyType || 'normal';
        
        // 阴影
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, size * 0.9, size * 0.2, size * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 腿部（两腿）
        ctx.fillStyle = clothesDark;
        ctx.fillRect(cx - 10 + legOffset, size * 0.6 + offsetY, 8, size * 0.28);
        ctx.fillRect(cx + 2 - legOffset, size * 0.6 + offsetY, 8, size * 0.28);
        
        // 身体
        ctx.fillStyle = clothesColor;
        ctx.beginPath();
        ctx.roundRect(cx - 14, size * 0.38 + offsetY, 28, size * 0.26, 3);
        ctx.fill();
        
        // 手臂（两臂）
        ctx.fillStyle = skinColor;
        ctx.fillRect(cx - 20 + armOffset, size * 0.4 + offsetY, 5, 20);
        ctx.fillRect(cx + 15 - armOffset, size * 0.4 + offsetY, 5, 20);
        
        // 头部
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(cx, size * 0.26 + offsetY, size * 0.17, 0, Math.PI * 2);
        ctx.fill();
        
        // 头发（正面）
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        ctx.arc(cx, size * 0.2 + offsetY, size * 0.18, Math.PI, 0);
        ctx.fill();
        
        // 刘海
        ctx.fillStyle = hairShadow;
        ctx.fillRect(cx - 8, size * 0.18 + offsetY, 4, 6);
        ctx.fillRect(cx + 4, size * 0.18 + offsetY, 4, 6);
        
        // 眼睛（双眼）
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx - 5, size * 0.27 + offsetY, 3, 0, Math.PI * 2);
        ctx.arc(cx + 5, size * 0.27 + offsetY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(cx - 5, size * 0.27 + offsetY, 2, 0, Math.PI * 2);
        ctx.arc(cx + 5, size * 0.27 + offsetY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = eyeHighlight;
        ctx.beginPath();
        ctx.arc(cx - 4, size * 0.26 + offsetY, 1, 0, Math.PI * 2);
        ctx.arc(cx + 6, size * 0.26 + offsetY, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // 嘴巴
        ctx.fillStyle = skinShadow;
        ctx.beginPath();
        ctx.arc(cx, size * 0.33 + offsetY, 2, 0, Math.PI);
        ctx.fill();
        
        // 王冠/头饰（正面）
        if (features.hasCrown || features.hasTiara) {
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(cx - 12, size * 0.12 + offsetY);
            ctx.lineTo(cx - 8, size * 0.06 + offsetY);
            ctx.lineTo(cx - 4, size * 0.1 + offsetY);
            ctx.lineTo(cx, size * 0.03 + offsetY);
            ctx.lineTo(cx + 4, size * 0.1 + offsetY);
            ctx.lineTo(cx + 8, size * 0.06 + offsetY);
            ctx.lineTo(cx + 12, size * 0.12 + offsetY);
            ctx.closePath();
            ctx.fill();
        }
        
        // 光环
        if (features.aura) {
            this.drawAura(ctx, features.aura, cx, size * 0.5, size, offsetY, now);
        }
        
        // 翅膀（正面）
        if (features.hasWings) {
            this.drawWings(ctx, features.aura, cx, size * 0.45, size, offsetY, now);
        }
    },
    
    /**
     * 背面朝上 - 显示背部特征
     */
    renderUpView: function(ctx, config, cx, size, offsetY, legOffset, now, skinColor, hairColor, hairShadow, clothesColor, clothesDark, features) {
        // 阴影
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, size * 0.9, size * 0.2, size * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 腿部
        ctx.fillStyle = clothesDark;
        ctx.fillRect(cx - 10 + legOffset * 0.5, size * 0.6 + offsetY, 8, size * 0.28);
        ctx.fillRect(cx + 2 - legOffset * 0.5, size * 0.6 + offsetY, 8, size * 0.28);
        
        // 身体
        ctx.fillStyle = clothesColor;
        ctx.beginPath();
        ctx.roundRect(cx - 14, size * 0.38 + offsetY, 28, size * 0.26, 3);
        ctx.fill();
        
        // 手臂（在背后）
        ctx.fillStyle = skinColor;
        ctx.fillRect(cx - 20 + legOffset * 0.3, size * 0.4 + offsetY, 5, 18);
        ctx.fillRect(cx + 15 - legOffset * 0.3, size * 0.4 + offsetY, 5, 18);
        
        // 头部
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(cx, size * 0.26 + offsetY, size * 0.17, 0, Math.PI * 2);
        ctx.fill();
        
        // 头发（后面）
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        ctx.arc(cx, size * 0.3 + offsetY, size * 0.17, 0, Math.PI);
        ctx.fill();
        
        // 背部翅膀
        if (features.hasWings) {
            this.drawBackWings(ctx, features.aura, cx, size * 0.45, size, offsetY, now);
        }
        
        // 背部头饰
        if (features.hasCrown || features.hasTiara) {
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(cx - 10, size * 0.1 + offsetY);
            ctx.lineTo(cx, size * 0.03 + offsetY);
            ctx.lineTo(cx + 10, size * 0.1 + offsetY);
            ctx.lineTo(cx + 6, size * 0.13 + offsetY);
            ctx.lineTo(cx, size * 0.06 + offsetY);
            ctx.lineTo(cx - 6, size * 0.13 + offsetY);
            ctx.closePath();
            ctx.fill();
        }
        
        // 背部光环
        if (features.aura) {
            this.drawBackAura(ctx, features.aura, cx, size * 0.5, size, offsetY, now);
        }
    },
    
    /**
     * 侧面视图 - 简化版，避免眼睛跑出去
     */
    renderSideView: function(ctx, config, cx, size, offsetY, legOffset, armOffset, now, isLeft, skinColor, skinShadow, hairColor, hairShadow, clothesColor, clothesDark, eyeColor, eyeHighlight, features) {
        const dir = isLeft ? -1 : 1;
        
        // 阴影
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx + dir * 2, size * 0.9, size * 0.2, size * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 腿部
        ctx.fillStyle = clothesDark;
        ctx.fillRect(cx + dir * -4 + legOffset * 0.5, size * 0.6 + offsetY, 7, size * 0.26);
        ctx.fillRect(cx + dir * 2 + legOffset * 0.5, size * 0.6 + offsetY, 7, size * 0.26);
        
        // 身体
        ctx.fillStyle = clothesColor;
        ctx.beginPath();
        ctx.roundRect(cx - 12, size * 0.38 + offsetY, 24, size * 0.26, 3);
        ctx.fill();
        
        // 手臂
        ctx.fillStyle = skinColor;
        ctx.fillRect(cx + dir * -14 + armOffset * 0.3, size * 0.4 + offsetY, 4, 16);
        ctx.fillRect(cx + dir * 10 - armOffset * 0.3, size * 0.4 + offsetY, 4, 18);
        
        // 头部 - 简化圆形
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(cx, size * 0.26 + offsetY, size * 0.18, 0, Math.PI * 2);
        ctx.fill();
        
        // 头发
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        ctx.arc(cx, size * 0.2 + offsetY, size * 0.16, Math.PI, 0);
        ctx.fill();
        
        // 眼睛 - 简单点
        const eyeY = size * 0.26 + offsetY;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx + dir * 6, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(cx + dir * 6, eyeY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 高光
        ctx.fillStyle = eyeHighlight;
        ctx.beginPath();
        ctx.arc(cx + dir * 6.5, eyeY - 0.5, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // 嘴巴
        ctx.fillStyle = skinShadow;
        ctx.beginPath();
        ctx.arc(cx + dir * 4, size * 0.33 + offsetY, 2, 0, Math.PI);
        ctx.fill();
        
        // 头饰
        if (features.hasCrown || features.hasTiara) {
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(cx + dir * -8, size * 0.1 + offsetY);
            ctx.lineTo(cx, size * 0.04 + offsetY);
            ctx.lineTo(cx + dir * 8, size * 0.1 + offsetY);
            ctx.lineTo(cx + dir * 4, size * 0.13 + offsetY);
            ctx.lineTo(cx, size * 0.07 + offsetY);
            ctx.lineTo(cx + dir * -4, size * 0.13 + offsetY);
            ctx.closePath();
            ctx.fill();
        }
    },
    
    drawAura: function(ctx, auraType, cx, cy, size, offsetY, time) {
        const colors = {
            'water': 'rgba(100, 200, 255, 0.2)', 'magic': 'rgba(150, 50, 200, 0.2)',
            'ghost': 'rgba(200, 150, 255, 0.2)', 'fire': 'rgba(255, 100, 50, 0.25)',
            'ice': 'rgba(150, 220, 255, 0.25)', 'darkness': 'rgba(80, 0, 120, 0.25)',
            'rage': 'rgba(255, 50, 0, 0.2)'
        };
        const color = colors[auraType] || 'rgba(255, 255, 255, 0.15)';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy + offsetY, size * 0.45, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawWings: function(ctx, auraType, cx, cy, size, offsetY, time) {
        const wingColors = { 'fire': '#ff6644', 'darkness': '#8844ff', 'default': '#aaaaaa' };
        const wingColor = wingColors[auraType] || wingColors.default;
        ctx.fillStyle = wingColor;
        ctx.globalAlpha = 0.5;
        
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy - 10 + offsetY);
        ctx.quadraticCurveTo(cx - size * 0.35, cy - 15 + Math.sin(time) * 4 + offsetY, cx - size * 0.25, cy + 8 + offsetY);
        ctx.quadraticCurveTo(cx - size * 0.15, cy + offsetY, cx - 10, cy - 10 + offsetY);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(cx + 10, cy - 10 + offsetY);
        ctx.quadraticCurveTo(cx + size * 0.35, cy - 15 + Math.sin(time + 1) * 4 + offsetY, cx + size * 0.25, cy + 8 + offsetY);
        ctx.quadraticCurveTo(cx + size * 0.15, cy + offsetY, cx + 10, cy - 10 + offsetY);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    },
    
    drawBackWings: function(ctx, auraType, cx, cy, size, offsetY, time) {
        const wingColors = { 'fire': '#ff6644', 'darkness': '#8844ff', 'default': '#aaaaaa' };
        const wingColor = wingColors[auraType] || wingColors.default;
        ctx.fillStyle = wingColor;
        ctx.globalAlpha = 0.45;
        
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy - 12 + offsetY);
        ctx.quadraticCurveTo(cx - size * 0.3, cy - 20 + Math.sin(time) * 3 + offsetY, cx - size * 0.2, cy - 2 + offsetY);
        ctx.quadraticCurveTo(cx - size * 0.1, cy - 8 + offsetY, cx - 8, cy - 12 + offsetY);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(cx + 8, cy - 12 + offsetY);
        ctx.quadraticCurveTo(cx + size * 0.3, cy - 20 + Math.sin(time + 1) * 3 + offsetY, cx + size * 0.2, cy - 2 + offsetY);
        ctx.quadraticCurveTo(cx + size * 0.1, cy - 8 + offsetY, cx + 8, cy - 12 + offsetY);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    },
    
    drawBackAura: function(ctx, auraType, cx, cy, size, offsetY, time) {
        const colors = {
            'water': 'rgba(100, 200, 255, 0.15)', 'magic': 'rgba(150, 50, 200, 0.15)',
            'ghost': 'rgba(200, 150, 255, 0.15)', 'fire': 'rgba(255, 100, 50, 0.2)',
            'ice': 'rgba(150, 220, 255, 0.2)', 'darkness': 'rgba(80, 0, 120, 0.2)',
            'rage': 'rgba(255, 50, 0, 0.15)'
        };
        const color = colors[auraType] || 'rgba(255, 255, 255, 0.1)';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx, cy - 8 + offsetY, size * 0.35, size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawSideAura: function(ctx, auraType, cx, cy, size, offsetY, time, isLeft) {
        const colors = {
            'water': 'rgba(100, 200, 255, 0.12)', 'magic': 'rgba(150, 50, 200, 0.12)',
            'ghost': 'rgba(200, 150, 255, 0.12)', 'fire': 'rgba(255, 100, 50, 0.15)',
            'ice': 'rgba(150, 220, 255, 0.15)', 'darkness': 'rgba(80, 0, 120, 0.15)',
            'rage': 'rgba(255, 50, 0, 0.12)'
        };
        const color = colors[auraType] || 'rgba(255, 255, 255, 0.08)';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx + (isLeft ? -8 : 8), cy + offsetY, size * 0.25, size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawSideWings: function(ctx, auraType, cx, cy, size, offsetY, time, isLeft) {
        const wingColors = { 'fire': '#ff6644', 'darkness': '#8844ff', 'default': '#aaaaaa' };
        const wingColor = wingColors[auraType] || wingColors.default;
        ctx.fillStyle = wingColor;
        ctx.globalAlpha = 0.35;
        const dir = isLeft ? -1 : 1;
        
        ctx.beginPath();
        ctx.moveTo(cx + dir * 6, cy - 8 + offsetY);
        ctx.quadraticCurveTo(cx + dir * size * 0.2, cy - 12 + Math.sin(time) * 3 + offsetY, cx + dir * size * 0.15, cy + 4 + offsetY);
        ctx.quadraticCurveTo(cx + dir * size * 0.08, cy + offsetY, cx + dir * 6, cy - 8 + offsetY);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    },
    
    render: function(ctx, sprite, player, x, y, w, h) {
        if (!sprite || !sprite.frames) return;
        const direction = this.getDirection(player.dirX, player.dirY);
        let animType = 'idle';
        if (player.attacking > 0) animType = 'attack';
        else if (player.isMoving) animType = 'walk';
        
        const time = Date.now();
        const frameIndex = this.getFrame(animType, time);
        const dirFrames = sprite.frames[direction];
        if (!dirFrames) return;
        const animFrames = dirFrames[animType] || dirFrames['idle'];
        if (!animFrames || animFrames.length === 0) return;
        const frame = animFrames[frameIndex % animFrames.length];
        if (!frame) return;
        ctx.drawImage(frame, x, y, w, h);
    }
};

window.SpriteManager.defaultHero = null;
window.SpriteManager.generateDefaultHero = function() {
    const skin = window.PlayerSkins ? window.PlayerSkins.getCurrentSkin() : {
        skinColor: '#ffe4d0', skinShadow: '#e8c4a8', hairColor: '#f4c542', clothesColor: '#4a9eff',
        eyeColor: '#40d0b0', features: {}
    };
    if (window.SpriteManager.defaultHero && window.SpriteManager.defaultHero.skinId === window.PlayerSkins?.current) {
        return window.SpriteManager.defaultHero;
    }
    window.SpriteManager.defaultHero = window.SpriteManager.generateCharacterSprite({
        name: skin.name || 'hero',
        skinColor: skin.skinColor || '#ffe4d0',
        skinShadow: skin.skinShadow || '#e8c4a8',
        hairColor: skin.hairColor || '#f4c542',
        hairShadow: skin.hairShadow || '#d4a012',
        eyeColor: skin.eyeColor || '#40d0b0',
        eyeHighlight: skin.eyeHighlight || '#80ffe0',
        clothesColor: skin.clothesColor || '#4a9eff',
        clothesDark: skin.clothesDark || '#2070cc',
        clothesLight: skin.clothesLight || '#7ac0ff',
        features: skin.features || {},
        size: 64
    });
    window.SpriteManager.defaultHero.skinId = window.PlayerSkins?.current || 'hero';
    return window.SpriteManager.defaultHero;
};

window.addEventListener('skinChanged', () => {
    window.SpriteManager.defaultHero = null;
    window.SpriteManager.generateDefaultHero();
});

setTimeout(() => { window.SpriteManager.generateDefaultHero(); }, 1000);
