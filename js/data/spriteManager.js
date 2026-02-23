/**
 * PixelARPG - 精灵图系统
 * 支持4/8方向角色动画
 */

window.SpriteManager = {
    // 精灵图缓存
    cache: {},
    
    // 方向映射：8方向到4方向的映射
    directionMap: {
        0: 'right',   // 右
        1: 'right',   // 右下 -> 右
        2: 'down',    // 下
        3: 'left',    // 左下 -> 左
        4: 'left',    // 左
        5: 'left',    // 左上 -> 左
        6: 'up',      // 上
        7: 'right'    // 右上 -> 右
    },
    
    // 动画帧数配置
    animFrames: {
        idle: 4,
        walk: 4,
        attack: 4
    },
    
    // 动画速度（帧/秒）
    animSpeed: {
        idle: 4,
        walk: 8,
        attack: 12
    },
    
    /**
     * 获取方向名称
     * @param {number} dirX 
     * @param {number} dirY 
     * @returns {string} 方向名称
     */
    getDirection: function(dirX, dirY) {
        if (dirX === undefined || dirX === null) dirX = 1;
        if (dirY === undefined || dirY === null) dirY = 0;
        
        const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        dirX /= len;
        dirY /= len;
        
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
    
    /**
     * 获取当前动画帧
     * @param {string} animType - 动画类型 (idle/walk/attack)
     * @param {number} time - 时间戳
     * @returns {number} 帧索引
     */
    getFrame: function(animType, time) {
        const frames = this.animFrames[animType] || 4;
        const speed = this.animSpeed[animType] || 8;
        return Math.floor((time / 1000) * speed) % frames;
    },
    
    /**
     * 生成角色精灵图（Canvas绘制）
     * @param {Object} config - 角色配置
     * @returns {Object} 包含所有方向和动画的精灵图
     */
    generateCharacterSprite: function(config) {
        const sprite = {
            name: config.name || 'character',
            frames: {}
        };
        
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
                    
                    // 绘制角色帧
                    this.drawCharacterFrame(ctx, config, dir, anim, f, frameSize);
                    
                    sprite.frames[dir][anim].push(canvas);
                }
            });
        });
        
        return sprite;
    },
    
    /**
     * 绘制角色单帧
     */
    drawCharacterFrame: function(ctx, config, direction, animType, frame, size) {
        const cx = size / 2;
        const time = frame * 0.1;
        
        // 动画偏移
        let offsetY = 0;
        let legOffset = 0;
        let armOffset = 0;
        
        if (animType === 'walk') {
            offsetY = Math.sin(time * Math.PI * 2) * 2;
            legOffset = Math.sin(time * Math.PI * 2) * 4;
            armOffset = Math.sin(time * Math.PI * 2 + Math.PI) * 3;
        } else if (animType === 'attack') {
            armOffset = Math.sin(time * Math.PI) * 8;
        } else {
            // idle - 轻微呼吸
            offsetY = Math.sin(time * Math.PI) * 1;
        }
        
        const skinColor = config.skinColor || '#ffe4d0';
        const hairColor = config.hairColor || '#f4c542';
        const clothesColor = config.clothesColor || '#4a9eff';
        const eyeColor = config.eyeColor || '#40d0b0';
        
        // 阴影
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, size * 0.9, size * 0.2, size * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 根据方向绘制
        const isSide = (direction === 'left' || direction === 'right');
        const isUp = (direction === 'up');
        const flipX = (direction === 'left');
        
        if (flipX) {
            ctx.save();
            ctx.translate(size, 0);
            ctx.scale(-1, 1);
        }
        
        // 腿（所有方向都显示）
        ctx.fillStyle = clothesColor;
        if (isUp) {
            // 向上时腿在身体下方，只能看到裤腿底部
            ctx.fillRect(cx - 8 - legOffset * 0.5, size * 0.62 + offsetY, 6, size * 0.2);
            ctx.fillRect(cx + 2 + legOffset * 0.5, size * 0.62 + offsetY, 6, size * 0.2);
        } else {
            // 左腿
            ctx.fillRect(cx - 10 - legOffset, size * 0.6 + offsetY, 8, size * 0.25);
            // 右腿
            ctx.fillRect(cx + 2 + legOffset, size * 0.6 + offsetY, 8, size * 0.25);
        }
        
        // 身体
        ctx.fillStyle = clothesColor;
        ctx.beginPath();
        ctx.roundRect(cx - 14, size * 0.35 + offsetY, 28, size * 0.28, 4);
        ctx.fill();
        
        // 手臂（所有方向都显示）
        ctx.fillStyle = skinColor;
        if (isUp) {
            // 向上时手臂在身体两侧，只能看到部分
            ctx.fillRect(cx - 16 + armOffset * 0.5, size * 0.42 + offsetY, 5, 16);
            ctx.fillRect(cx + 11 - armOffset * 0.5, size * 0.42 + offsetY, 5, 16);
        } else {
            // 左手臂
            ctx.fillRect(cx - 18 + armOffset, size * 0.38 + offsetY, 6, 20);
            // 右手臂
            ctx.fillRect(cx + 12 - armOffset, size * 0.38 + offsetY, 6, 20);
        }
        
        // 头部
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(cx, size * 0.25 + offsetY, size * 0.18, 0, Math.PI * 2);
        ctx.fill();
        
        // 头发
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        if (isUp) {
            // 背面 - 全头发
            ctx.arc(cx, size * 0.23 + offsetY, size * 0.2, 0, Math.PI * 2);
        } else {
            // 正面/侧面 - 刘海
            ctx.arc(cx, size * 0.2 + offsetY, size * 0.2, Math.PI, 0);
            ctx.fill();
            // 侧发
            ctx.fillRect(cx - size * 0.18, size * 0.2 + offsetY, 6, 15);
            ctx.fillRect(cx + size * 0.12, size * 0.2 + offsetY, 6, 15);
        }
        ctx.fill();
        
        // 眼睛（不在up方向）
        if (!isUp) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(cx - 6, size * 0.27 + offsetY, 4, 0, Math.PI * 2);
            ctx.arc(cx + 6, size * 0.27 + offsetY, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = eyeColor;
            ctx.beginPath();
            ctx.arc(cx - 6 + (isSide ? 1 : 0), size * 0.27 + offsetY, 2, 0, Math.PI * 2);
            if (!isSide) {
                ctx.arc(cx + 6, size * 0.27 + offsetY, 2, 0, Math.PI * 2);
            }
            ctx.fill();
        }
        
        if (flipX) {
            ctx.restore();
        }
    },
    
    /**
     * 渲染角色精灵
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} sprite - 精灵图对象
     * @param {Object} player - 玩家对象
     * @param {number} x - 绘制X坐标
     * @param {number} y - 绘制Y坐标
     * @param {number} w - 宽度
     * @param {number} h - 高度
     */
    render: function(ctx, sprite, player, x, y, w, h) {
        if (!sprite || !sprite.frames) return;
        
        // 获取方向
        const direction = this.getDirection(player.dirX, player.dirY);
        
        // 获取动画类型
        let animType = 'idle';
        if (player.attacking > 0) {
            animType = 'attack';
        } else if (player.isMoving) {
            animType = 'walk';
        }
        
        // 获取帧
        const time = Date.now();
        const frameIndex = this.getFrame(animType, time);
        
        // 获取精灵帧
        const dirFrames = sprite.frames[direction];
        if (!dirFrames) return;
        
        const animFrames = dirFrames[animType] || dirFrames['idle'];
        if (!animFrames || animFrames.length === 0) return;
        
        const frame = animFrames[frameIndex % animFrames.length];
        if (!frame) return;
        
        // 绘制
        ctx.drawImage(frame, x, y, w, h);
    }
};

// 预生成默认角色精灵
window.SpriteManager.defaultHero = null;
window.SpriteManager.generateDefaultHero = function() {
    if (window.SpriteManager.defaultHero) return window.SpriteManager.defaultHero;
    
    window.SpriteManager.defaultHero = window.SpriteManager.generateCharacterSprite({
        name: 'hero',
        skinColor: '#ffe4d0',
        hairColor: '#f4c542',
        clothesColor: '#4a9eff',
        eyeColor: '#40d0b0',
        size: 64
    });
    
    return window.SpriteManager.defaultHero;
};

// 页面加载后预生成
setTimeout(() => {
    window.SpriteManager.generateDefaultHero();
}, 1000);
