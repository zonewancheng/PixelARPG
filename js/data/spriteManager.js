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
     * 绘制角色单帧 - 支持Boss特色皮肤
     */
    drawCharacterFrame: function(ctx, config, direction, animType, frame, size) {
        const cx = size / 2;
        const time = frame * 0.1;
        const now = Date.now() / 500;
        
        // 获取皮肤特征
        const features = config.features || {};
        const bodyType = features.bodyType || 'normal';
        
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
        
        // 根据身体类型调整动画
        if (bodyType === 'gelatinous') {
            // 史莱姆：果冻般的晃动
            offsetY += Math.sin(now * 3) * 2;
        }
        
        const skinColor = config.skinColor || '#ffe4d0';
        const hairColor = config.hairColor || '#f4c542';
        const clothesColor = config.clothesColor || '#4a9eff';
        const clothesDark = config.clothesDark || '#2070cc';
        const eyeColor = config.eyeColor || '#40d0b0';
        
        // 阴影
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, size * 0.9, size * 0.2, size * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 根据方向绘制
        const isSide = (direction === 'left' || direction === 'right');
        const isUp = (direction === 'up');
        const isLeft = (direction === 'left');
        
        // ===== 绘制背部特征（向上移动时显示）=====
        if (isUp) {
            // 背部翅膀
            if (features.hasWings) {
                this.drawBackWings(ctx, features.aura, cx, size * 0.45, size, offsetY, now);
            }
            // 背部王冠/角
            if (features.hasCrown || features.hasHorns) {
                ctx.fillStyle = features.hasCrown ? '#ffd700' : (bodyType === 'demonic' ? '#2a1a3a' : '#888');
                if (features.hasHorns) {
                    // 恶魔角在背部
                    ctx.beginPath();
                    ctx.moveTo(cx - 6, size * 0.15 + offsetY);
                    ctx.lineTo(cx - 10, size * 0.05 + offsetY);
                    ctx.lineTo(cx - 2, size * 0.12 + offsetY);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(cx + 6, size * 0.15 + offsetY);
                    ctx.lineTo(cx + 10, size * 0.05 + offsetY);
                    ctx.lineTo(cx + 2, size * 0.12 + offsetY);
                    ctx.fill();
                }
                if (features.hasCrown) {
                    ctx.fillStyle = '#ffd700';
                    ctx.beginPath();
                    ctx.moveTo(cx - 10, size * 0.12 + offsetY);
                    ctx.lineTo(cx - 8, size * 0.05 + offsetY);
                    ctx.lineTo(cx - 4, size * 0.1 + offsetY);
                    ctx.lineTo(cx, size * 0.02 + offsetY);
                    ctx.lineTo(cx + 4, size * 0.1 + offsetY);
                    ctx.lineTo(cx + 8, size * 0.05 + offsetY);
                    ctx.lineTo(cx + 10, size * 0.12 + offsetY);
                    ctx.closePath();
                    ctx.fill();
                }
            }
            // 背部光环
            if (features.aura) {
                this.drawBackAura(ctx, features.aura, cx, size * 0.5, size, offsetY, now);
            }
        }
        
        // ===== 腿部绘制（根据身体类型）=====
        if (bodyType === 'gelatinous') {
            // 史莱姆：半透明胶质腿
            ctx.fillStyle = skinColor + 'aa';
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.ellipse(cx - 6 + legOffset * 0.5, size * 0.7, 10, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + 6 - legOffset * 0.5, size * 0.7, 10, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        } else if (bodyType === 'muscular') {
            // 兽人：粗壮腿部
            ctx.fillStyle = skinColor;
            ctx.fillRect(cx - 12 - legOffset, size * 0.58 + offsetY, 10, size * 0.28);
            ctx.fillRect(cx + 2 + legOffset, size * 0.58 + offsetY, 10, size * 0.28);
        } else if (bodyType === 'bony') {
            // 白骨：纤细骨骼腿
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(cx - 8 - legOffset * 0.5, size * 0.6 + offsetY, 4, size * 0.25);
            ctx.fillRect(cx + 4 + legOffset * 0.5, size * 0.6 + offsetY, 4, size * 0.25);
        } else {
            // 普通腿部
            ctx.fillStyle = clothesDark;
            if (isUp) {
                ctx.fillRect(cx - 8 - legOffset * 0.5, size * 0.62 + offsetY, 6, size * 0.2);
                ctx.fillRect(cx + 2 + legOffset * 0.5, size * 0.62 + offsetY, 6, size * 0.2);
            } else if (isSide) {
                // 侧面：单腿
                ctx.fillRect(cx + (isLeft ? -6 : -2), size * 0.6 + offsetY, 8, size * 0.25);
            } else {
                ctx.fillRect(cx - 10 - legOffset, size * 0.6 + offsetY, 8, size * 0.25);
                ctx.fillRect(cx + 2 + legOffset, size * 0.6 + offsetY, 8, size * 0.25);
            }
        }
        
        // ===== 身体绘制 =====
        if (bodyType === 'gelatinous') {
            // 史莱姆：胶质身体
            ctx.fillStyle = skinColor + 'cc';
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.ellipse(cx, size * 0.45 + offsetY, 16, 18, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        } else if (bodyType === 'scaled') {
            // 龙：鳞片身体
            ctx.fillStyle = clothesColor;
            ctx.beginPath();
            ctx.roundRect(cx - 14, size * 0.35 + offsetY, 28, size * 0.28, 4);
            ctx.fill();
            // 鳞片纹理
            ctx.fillStyle = clothesDark;
            if (!isSide) {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        ctx.beginPath();
                        ctx.arc(cx - 8 + i * 8, size * 0.4 + j * 8 + offsetY, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        } else if (bodyType === 'demonic') {
            // 恶魔：暗黑身体
            ctx.fillStyle = clothesColor;
            if (isSide) {
                ctx.beginPath();
                ctx.roundRect(cx - 8, size * 0.35 + offsetY, 16, size * 0.28, 4);
            } else {
                ctx.beginPath();
                ctx.roundRect(cx - 14, size * 0.35 + offsetY, 28, size * 0.28, 4);
            }
            ctx.fill();
            // 恶魔纹理
            ctx.strokeStyle = '#8800ff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - 10, size * 0.4 + offsetY);
            ctx.lineTo(cx, size * 0.55 + offsetY);
            ctx.lineTo(cx + 10, size * 0.4 + offsetY);
            ctx.stroke();
        } else if (bodyType === 'bony') {
            // 白骨：可见肋骨
            ctx.fillStyle = '#2a2a2a';
            ctx.beginPath();
            ctx.roundRect(cx - 14, size * 0.35 + offsetY, 28, size * 0.28, 4);
            ctx.fill();
            // 肋骨
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(cx, size * 0.42 + offsetY, 4 + i * 3, 0, Math.PI, false);
                ctx.stroke();
            }
        } else {
            // 普通身体
            ctx.fillStyle = clothesColor;
            if (isSide) {
                ctx.beginPath();
                ctx.roundRect(cx - 8, size * 0.35 + offsetY, 16, size * 0.28, 4);
            } else {
                ctx.beginPath();
                ctx.roundRect(cx - 14, size * 0.35 + offsetY, 28, size * 0.28, 4);
            }
            ctx.fill();
        }
        
        // ===== 手臂绘制 =====
        if (bodyType === 'gelatinous') {
            // 史莱姆：胶质手臂
            ctx.fillStyle = skinColor + 'aa';
            ctx.globalAlpha = 0.7;
            // 侧面视角：远端手臂在身后
            if (isSide) {
                ctx.beginPath();
                ctx.ellipse(cx + (isLeft ? -14 : 14) + armOffset * 0.5, size * 0.42 + offsetY, 6, 10, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.ellipse(cx - 18 + armOffset, size * 0.42 + offsetY, 6, 10, 0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(cx + 18 - armOffset, size * 0.42 + offsetY, 6, 10, -0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        } else if (bodyType === 'muscular') {
            // 兽人：粗壮手臂
            if (isSide) {
                ctx.fillStyle = skinColor;
                ctx.fillRect(cx + (isLeft ? -16 : 8), size * 0.36 + offsetY, 8, 22);
            } else {
                ctx.fillRect(cx - 20 + armOffset, size * 0.36 + offsetY, 8, 22);
                ctx.fillRect(cx + 12 - armOffset, size * 0.36 + offsetY, 8, 22);
            }
        } else {
            // 普通手臂
            ctx.fillStyle = skinColor;
            if (isUp) {
                ctx.fillRect(cx - 16 + armOffset * 0.5, size * 0.42 + offsetY, 5, 16);
                ctx.fillRect(cx + 11 - armOffset * 0.5, size * 0.42 + offsetY, 5, 16);
            } else if (isSide) {
                // 侧面：近端手臂向前，远端在身后
                ctx.fillRect(cx + (isLeft ? -14 : 6), size * 0.38 + offsetY, 6, 20);
            } else {
                ctx.fillRect(cx - 18 + armOffset, size * 0.38 + offsetY, 6, 20);
                ctx.fillRect(cx + 12 - armOffset, size * 0.38 + offsetY, 6, 20);
            }
        }
        
        // ===== 头部绘制 =====
        if (bodyType === 'gelatinous') {
            // 史莱姆：水滴头
            ctx.fillStyle = skinColor + 'dd';
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.ellipse(cx, size * 0.22 + offsetY, 14, 16, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        } else if (bodyType === 'pointed_ears') {
            // 哥布林：尖耳朵
            // 左耳朵
            ctx.fillStyle = skinColor;
            ctx.beginPath();
            ctx.moveTo(cx - 12, size * 0.2 + offsetY);
            ctx.lineTo(cx - 20, size * 0.1 + offsetY);
            ctx.lineTo(cx - 14, size * 0.28 + offsetY);
            ctx.fill();
            // 右耳朵
            ctx.beginPath();
            ctx.moveTo(cx + 12, size * 0.2 + offsetY);
            ctx.lineTo(cx + 20, size * 0.1 + offsetY);
            ctx.lineTo(cx + 14, size * 0.28 + offsetY);
            ctx.fill();
            // 头
            ctx.beginPath();
            ctx.arc(cx, size * 0.25 + offsetY, size * 0.18, 0, Math.PI * 2);
            ctx.fill();
        } else if (bodyType === 'hooded') {
            // 法师：兜帽头
            ctx.fillStyle = clothesColor;
            ctx.beginPath();
            ctx.arc(cx, size * 0.22 + offsetY, size * 0.2, 0, Math.PI * 2);
            ctx.fill();
            // 兜帽内部
            ctx.fillStyle = '#1a1a2a';
            ctx.beginPath();
            ctx.arc(cx, size * 0.22 + offsetY, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
        } else if (bodyType === 'bony') {
            // 白骨：瘦骨头脸
            ctx.fillStyle = '#f5f5f5';
            ctx.beginPath();
            ctx.ellipse(cx, size * 0.25 + offsetY, 12, 14, 0, 0, Math.PI * 2);
            ctx.fill();
            // 眼窝
            ctx.fillStyle = '#1a1a1a';
            ctx.beginPath();
            ctx.ellipse(cx - 5, size * 0.24 + offsetY, 4, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + 5, size * 0.24 + offsetY, 4, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 普通头
            ctx.fillStyle = skinColor;
            ctx.beginPath();
            ctx.arc(cx, size * 0.25 + offsetY, size * 0.18, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // ===== 头发绘制 =====
        const hairStyle = features.hairStyle || 'short';
        ctx.fillStyle = hairColor;
        
        if (hairStyle === 'spiky') {
            // 龙：尖刺发型
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.moveTo(cx + i * 6, size * 0.15 + offsetY);
                ctx.lineTo(cx + i * 6 - 3, size * 0.02 + offsetY);
                ctx.lineTo(cx + i * 6 + 3, size * 0.15 + offsetY);
                ctx.fill();
            }
        } else if (hairStyle === 'horned') {
            // 恶魔：恶魔角+头发
            // 角
            ctx.fillStyle = '#2a1a3a';
            ctx.beginPath();
            ctx.moveTo(cx - 8, size * 0.12 + offsetY);
            ctx.lineTo(cx - 12, size * 0.02 + offsetY);
            ctx.lineTo(cx - 4, size * 0.1 + offsetY);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx + 8, size * 0.12 + offsetY);
            ctx.lineTo(cx + 12, size * 0.02 + offsetY);
            ctx.lineTo(cx + 4, size * 0.1 + offsetY);
            ctx.fill();
            // 头发
            ctx.fillStyle = hairColor;
            ctx.beginPath();
            ctx.arc(cx, size * 0.18 + offsetY, size * 0.16, Math.PI, Math.PI * 2);
            ctx.fill();
        } else if (hairStyle === 'flowing') {
            // 冰魔：飘逸长发
            ctx.beginPath();
            ctx.moveTo(cx - 10, size * 0.15 + offsetY);
            ctx.quadraticCurveTo(cx - 20, size * 0.3 + offsetY, cx - 18, size * 0.5 + offsetY + Math.sin(now) * 3);
            ctx.lineTo(cx - 12, size * 0.5 + offsetY);
            ctx.quadraticCurveTo(cx - 10, size * 0.3 + offsetY, cx - 8, size * 0.15 + offsetY);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx + 10, size * 0.15 + offsetY);
            ctx.quadraticCurveTo(cx + 20, size * 0.3 + offsetY, cx + 18, size * 0.5 + offsetY + Math.sin(now + 1) * 3);
            ctx.lineTo(cx + 12, size * 0.5 + offsetY);
            ctx.quadraticCurveTo(cx + 10, size * 0.3 + offsetY, cx + 8, size * 0.15 + offsetY);
            ctx.fill();
        } else if (hairStyle === 'long') {
            // 法师：长发
            ctx.beginPath();
            ctx.arc(cx, size * 0.18 + offsetY, size * 0.18, Math.PI, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(cx - size * 0.18, size * 0.18 + offsetY, 8, 20);
            ctx.fillRect(cx + size * 0.1, size * 0.18 + offsetY, 8, 20);
        } else if (hairStyle === 'wavy') {
            // 白骨：波浪卷发
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.ellipse(cx + i * 8, size * 0.15 + offsetY, 6, 10, i * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (hairStyle === 'messy') {
            // 哥布林：凌乱头发
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.arc(cx + i * 5, size * 0.14 + offsetY + Math.random() * 2, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // 普通短发
            ctx.beginPath();
            if (isUp) {
                ctx.arc(cx, size * 0.23 + offsetY, size * 0.2, 0, Math.PI * 2);
            } else {
                ctx.arc(cx, size * 0.2 + offsetY, size * 0.2, Math.PI, 0);
            }
            ctx.fill();
        }
        
        // ===== 眼睛绘制 =====
        if (!isUp && bodyType !== 'bony') {
            const eyeHighlight = config.eyeHighlight || '#fff';
            const eyeY = bodyType === 'hooded' ? size * 0.24 : size * 0.27;
            
            // 瞳孔
            ctx.fillStyle = eyeColor;
            ctx.beginPath();
            if (isSide) {
                // 侧面：只显示一只眼睛
                const eyeX = isLeft ? cx - 3 : cx + 3;
                if (bodyType === 'demonic') {
                    ctx.ellipse(eyeX, eyeY + offsetY, 2, 4, 0, 0, Math.PI * 2);
                } else {
                    ctx.arc(eyeX, eyeY + offsetY, 3, 0, Math.PI * 2);
                }
            } else {
                // 正面/背面
                if (bodyType === 'demonic') {
                    ctx.ellipse(cx - 5, eyeY + offsetY, 2, 4, 0, 0, Math.PI * 2);
                    ctx.ellipse(cx + 5, eyeY + offsetY, 2, 4, 0, 0, Math.PI * 2);
                } else {
                    ctx.arc(cx - 5, eyeY + offsetY, 3, 0, Math.PI * 2);
                    ctx.arc(cx + 5, eyeY + offsetY, 3, 0, Math.PI * 2);
                }
            }
            ctx.fill();
            
            // 高光
            ctx.fillStyle = eyeHighlight;
            ctx.beginPath();
            if (isSide) {
                const eyeX = isLeft ? cx - 4 : cx + 2;
                ctx.arc(eyeX, eyeY - 1 + offsetY, 1.5, 0, Math.PI * 2);
            } else {
                ctx.arc(cx - 4, eyeY - 1 + offsetY, 1.5, 0, Math.PI * 2);
                ctx.arc(cx + 6, eyeY - 1 + offsetY, 1.5, 0, Math.PI * 2);
            }
            ctx.fill();
        }
        
        // ===== 王冠绘制 =====
        if (features.hasCrown || features.hasTiara) {
            ctx.fillStyle = '#ffd700';
            const crownY = size * 0.08 + offsetY;
            ctx.beginPath();
            ctx.moveTo(cx - 12, crownY + 8);
            ctx.lineTo(cx - 10, crownY);
            ctx.lineTo(cx - 5, crownY + 5);
            ctx.lineTo(cx, crownY - 3);
            ctx.lineTo(cx + 5, crownY + 5);
            ctx.lineTo(cx + 10, crownY);
            ctx.lineTo(cx + 12, crownY + 8);
            ctx.closePath();
            ctx.fill();
            
            // 宝石
            ctx.fillStyle = bodyType === 'bony' ? '#ff00ff' : '#ff4444';
            ctx.beginPath();
            ctx.arc(cx, crownY + 2, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // ===== 獠牙绘制 =====
        if (bodyType === 'muscular' || bodyType === 'pointed_ears') {
            ctx.fillStyle = '#f5f5f5';
            // 左獠牙
            ctx.beginPath();
            ctx.moveTo(cx - 6, size * 0.35 + offsetY);
            ctx.lineTo(cx - 8, size * 0.42 + offsetY);
            ctx.lineTo(cx - 4, size * 0.35 + offsetY);
            ctx.fill();
            // 右獠牙
            ctx.beginPath();
            ctx.moveTo(cx + 6, size * 0.35 + offsetY);
            ctx.lineTo(cx + 8, size * 0.42 + offsetY);
            ctx.lineTo(cx + 4, size * 0.35 + offsetY);
            ctx.fill();
        }
    },
    
    /**
     * 绘制光环
     */
    drawAura: function(ctx, auraType, cx, cy, size, offsetY, time) {
        const colors = {
            'water': 'rgba(100, 200, 255, 0.3)',
            'magic': 'rgba(150, 50, 200, 0.3)',
            'ghost': 'rgba(200, 150, 255, 0.3)',
            'fire': 'rgba(255, 100, 50, 0.4)',
            'ice': 'rgba(150, 220, 255, 0.4)',
            'darkness': 'rgba(100, 0, 150, 0.4)',
            'rage': 'rgba(255, 50, 0, 0.3)'
        };
        
        const color = colors[auraType] || 'rgba(255, 255, 255, 0.2)';
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy + offsetY, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 动态粒子
        ctx.fillStyle = color.replace('0.3', '0.6').replace('0.4', '0.7');
        for (let i = 0; i < 4; i++) {
            const angle = time + i * Math.PI / 2;
            const dist = size * 0.3 + Math.sin(time * 2 + i) * 5;
            const px = cx + Math.cos(angle) * dist;
            const py = cy + offsetY + Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    /**
     * 绘制翅膀
     */
    drawWings: function(ctx, auraType, cx, cy, size, offsetY, time) {
        const wingColors = {
            'fire': '#ff4422',
            'darkness': '#6600aa',
            'default': '#888888'
        };
        
        const wingColor = wingColors[auraType] || wingColors.default;
        const wingSpan = size * 0.4;
        
        ctx.fillStyle = wingColor;
        ctx.globalAlpha = 0.7;
        
        // 左翼
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy - 10 + offsetY);
        ctx.quadraticCurveTo(cx - wingSpan, cy - 20 + Math.sin(time) * 5 + offsetY, cx - wingSpan * 0.8, cy + 10 + offsetY);
        ctx.quadraticCurveTo(cx - wingSpan * 0.5, cy + offsetY, cx - 10, cy - 10 + offsetY);
        ctx.fill();
        
        // 右翼
        ctx.beginPath();
        ctx.moveTo(cx + 10, cy - 10 + offsetY);
        ctx.quadraticCurveTo(cx + wingSpan, cy - 20 + Math.sin(time + 1) * 5 + offsetY, cx + wingSpan * 0.8, cy + 10 + offsetY);
        ctx.quadraticCurveTo(cx + wingSpan * 0.5, cy + offsetY, cx + 10, cy - 10 + offsetY);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    },
    
    /**
     * 绘制背部翅膀（向上移动时显示）
     */
    drawBackWings: function(ctx, auraType, cx, cy, size, offsetY, time) {
        const wingColors = {
            'fire': '#ff4422',
            'darkness': '#6600aa',
            'default': '#aaaaaa'
        };
        
        const wingColor = wingColors[auraType] || wingColors.default;
        const wingSpan = size * 0.35;
        
        ctx.fillStyle = wingColor;
        ctx.globalAlpha = 0.6;
        
        // 左翼（向后）
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy - 15 + offsetY);
        ctx.quadraticCurveTo(cx - wingSpan * 0.7, cy - 25 + Math.sin(time) * 3 + offsetY, cx - wingSpan * 0.5, cy - 5 + offsetY);
        ctx.quadraticCurveTo(cx - wingSpan * 0.3, cy - 10 + offsetY, cx - 8, cy - 15 + offsetY);
        ctx.fill();
        
        // 右翼（向后）
        ctx.beginPath();
        ctx.moveTo(cx + 8, cy - 15 + offsetY);
        ctx.quadraticCurveTo(cx + wingSpan * 0.7, cy - 25 + Math.sin(time + 1) * 3 + offsetY, cx + wingSpan * 0.5, cy - 5 + offsetY);
        ctx.quadraticCurveTo(cx + wingSpan * 0.3, cy - 10 + offsetY, cx + 8, cy - 15 + offsetY);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    },
    
    /**
     * 绘制背部光环（向上移动时显示）
     */
    drawBackAura: function(ctx, auraType, cx, cy, size, offsetY, time) {
        const colors = {
            'water': 'rgba(100, 200, 255, 0.25)',
            'magic': 'rgba(150, 50, 200, 0.25)',
            'ghost': 'rgba(200, 150, 255, 0.25)',
            'fire': 'rgba(255, 100, 50, 0.3)',
            'ice': 'rgba(150, 220, 255, 0.3)',
            'darkness': 'rgba(100, 0, 150, 0.3)',
            'rage': 'rgba(255, 50, 0, 0.25)'
        };
        
        const color = colors[auraType] || 'rgba(255, 255, 255, 0.15)';
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx, cy - 5 + offsetY, size * 0.4, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
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
    // 使用当前皮肤配置
    const skin = window.PlayerSkins ? window.PlayerSkins.getCurrentSkin() : {
        skinColor: '#ffe4d0',
        hairColor: '#f4c542',
        clothesColor: '#4a9eff',
        eyeColor: '#40d0b0',
        features: {}
    };
    
    // 如果已有精灵且皮肤未变，直接返回
    if (window.SpriteManager.defaultHero && 
        window.SpriteManager.defaultHero.skinId === window.PlayerSkins?.current) {
        return window.SpriteManager.defaultHero;
    }
    
    // 传递完整皮肤配置，包括features
    window.SpriteManager.defaultHero = window.SpriteManager.generateCharacterSprite({
        name: skin.name || 'hero',
        skinColor: skin.skinColor || '#ffe4d0',
        skinShadow: skin.skinShadow || '#f5c4a8',
        skinHighlight: skin.skinHighlight || '#fff0e8',
        hairColor: skin.hairColor || '#f4c542',
        hairHighlight: skin.hairHighlight || '#ffe066',
        hairShadow: skin.hairShadow || '#d4a012',
        eyeColor: skin.eyeColor || '#40d0b0',
        eyeHighlight: skin.eyeHighlight || '#60ffe0',
        clothesColor: skin.clothesColor || '#4a9eff',
        clothesDark: skin.clothesDark || '#2070cc',
        clothesLight: skin.clothesLight || '#7ac0ff',
        clothesAccent: skin.clothesAccent || '#ffd700',
        features: skin.features || {},
        size: 64
    });
    
    // 记录皮肤ID
    window.SpriteManager.defaultHero.skinId = window.PlayerSkins?.current || 'hero';
    
    return window.SpriteManager.defaultHero;
};

// 皮肤切换时重新生成精灵
window.addEventListener('skinChanged', () => {
    window.SpriteManager.defaultHero = null;
    window.SpriteManager.generateDefaultHero();
});

// 页面加载后预生成
setTimeout(() => {
    window.SpriteManager.generateDefaultHero();
}, 1000);
