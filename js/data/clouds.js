/**
 * PixelARPG - 云朵系统
 * 云朵作为特殊实体，不能被攻击，但雷电云会发射闪电
 * 云朵基于地图真实坐标移动，不跟随玩家
 */

// 云朵类型定义
window.CLOUD_TYPES = {
    white: {
        name: '白云',
        color: '#e8e8f0',
        shadowColor: '#c8c8d0',
        highlightColor: 'rgba(255,255,255,0.5)',
        strokeColor: 'rgba(100,100,120,0.15)',
        canAttack: false
    },
    dark: {
        name: '乌云',
        color: '#5a5a6a',
        shadowColor: '#3a3a4a',
        highlightColor: null,
        strokeColor: 'rgba(0,0,0,0.2)',
        canAttack: false
    },
    storm: {
        name: '雷电云',
        color: '#2a2a2a',
        shadowColor: '#1a1a1a',
        highlightColor: null,
        strokeColor: 'rgba(0,0,0,0.3)',
        canAttack: true,
        attackRange: 100,
        attackInterval: 30,
        attackCooldown: 60,
        lightningDamage: 15
    }
};

// 云朵圆圈配置 (用于绘制云朵)
window.CLOUD_CIRCLES = [
    { ox: 0, oy: 0, r: 0.5 },
    { ox: -0.35, oy: 0.1, r: 0.35 },
    { ox: 0.35, oy: 0.1, r: 0.35 },
    { ox: -0.2, oy: -0.2, r: 0.3 },
    { ox: 0.2, oy: -0.2, r: 0.3 }
];

/**
 * 创建云朵实例
 * @param {number} mapWidth - 地图宽度
 * @param {number} mapHeight - 地图高度
 * @returns {Object} 云朵对象
 */
window.createCloud = function(mapWidth, mapHeight) {
    const rand = Math.random();
    const type = rand < 0.3 ? 'storm' : (rand < 0.6 ? 'dark' : 'white');
    const size = 20 + Math.random() * 30;
    const speedX = (Math.random() * 0.15 + 0.05) * (Math.random() > 0.5 ? 1 : -1);
    
    return {
        x: Math.random() * mapWidth,
        y: Math.random() * (mapHeight * 0.3),
        size: size,
        speedX: speedX,
        speedY: (Math.random() - 0.5) * 0.1,
        type: type,
        phase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 0.5,
        wobblePhase: Math.random() * Math.PI * 2,
        circles: window.CLOUD_CIRCLES,
        lightningTimer: 0,
        isCloud: true,
        invulnerable: true
    };
};

/**
 * 初始化云朵
 * @param {number} mapWidth - 地图宽度
 * @param {number} mapHeight - 地图高度
 */
window.initClouds = function(mapWidth, mapHeight) {
    window.clouds = [];
    const mapArea = mapWidth * mapHeight;
    const cloudCount = Math.min(Math.floor(mapArea / 50000) + 3, 12);
    for (let i = 0; i < cloudCount; i++) {
        window.clouds.push(window.createCloud(mapWidth, mapHeight));
    }
};

/**
 * 更新云朵位置（基于地图坐标）
 * @param {Array} clouds - 云朵数组
 * @param {number} mapWidth - 地图宽度
 * @param {number} mapHeight - 地图高度
 * @param {number} time - 当前时间(秒)
 */
window.updateClouds = function(clouds, mapWidth, mapHeight, time) {
    if (!clouds || !clouds.length) return;
    
    clouds.forEach(cloud => {
        cloud.x += cloud.speedX;
        cloud.y += cloud.speedY + Math.sin(time * cloud.wobbleSpeed + cloud.wobblePhase) * 0.15;
        
        // 限制在地图范围内，不能跑到外面
        const minX = 0;
        const maxX = mapWidth;
        const minY = 0;
        const maxY = mapHeight * 0.4;
        
        // 如果超出边界，反弹
        if (cloud.x < minX) {
            cloud.x = minX;
            cloud.speedX = Math.abs(cloud.speedX);
        } else if (cloud.x > maxX) {
            cloud.x = maxX;
            cloud.speedX = -Math.abs(cloud.speedX);
        }
        
        if (cloud.y < minY) {
            cloud.y = minY;
            cloud.speedY = Math.abs(cloud.speedY);
        } else if (cloud.y > maxY) {
            cloud.y = maxY;
            cloud.speedY = -Math.abs(cloud.speedY);
        }
    });
};

/**
 * 云朵雷电攻击
 * @param {Object} cloud - 云朵对象
 * @param {Object} player - 玩家对象
 * @param {Array} enemies - 敌人数组
 * @param {Array} bosses - Boss数组
 * @param {Array} projectiles - 投射物数组
 * @param {number} mapLevel - 地图等级
 */
window.cloudLightningAttack = function(cloud, player, enemies, bosses, projectiles, mapLevel) {
    if (cloud.type !== 'storm') return;
    
    const cloudType = window.CLOUD_TYPES.storm;
    const attackRange = cloudType.attackRange;
    
    let nearestTarget = null;
    let nearestDist = attackRange;
    
    if (player) {
        const dx = (player.x + player.w / 2) - cloud.x;
        const dy = (player.y + player.h / 2) - cloud.y;
        const playerDist = Math.sqrt(dx * dx + dy * dy);
        if (playerDist < nearestDist) {
            nearestDist = playerDist;
            nearestTarget = { 
                x: player.x + player.w / 2, 
                y: player.y + player.h / 2, 
                isPlayer: true 
            };
        }
    }
    
    if (enemies && enemies.length > 0) {
        enemies.forEach(e => {
            const dx = (e.x + e.w / 2) - cloud.x;
            const dy = (e.y + e.h / 2) - cloud.y;
            const eDist = Math.sqrt(dx * dx + dy * dy);
            if (eDist < nearestDist) {
                nearestDist = eDist;
                nearestTarget = { 
                    x: e.x + e.w / 2, 
                    y: e.y + e.h / 2, 
                    isPlayer: false, 
                    enemy: e 
                };
            }
        });
    }
    
    if (bosses && bosses.length > 0) {
        bosses.forEach(boss => {
            if (!boss || boss.hp <= 0) return;
            const dx = (boss.x + boss.w / 2) - cloud.x;
            const dy = (boss.y + boss.h / 2) - cloud.y;
            const bDist = Math.sqrt(dx * dx + dy * dy);
            if (bDist < nearestDist) {
                nearestDist = bDist;
                nearestTarget = { 
                    x: boss.x + boss.w / 2, 
                    y: boss.y + boss.h / 2, 
                    isPlayer: false, 
                    enemy: boss 
                };
            }
        });
    }
    
    if (nearestTarget && projectiles) {
        const dx = nearestTarget.x - cloud.x;
        const dy = nearestTarget.y - cloud.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 10;
        
        if (dist > 0) {
            const baseDamage = cloudType.lightningDamage + mapLevel * 5;
            const damage = baseDamage + Math.floor(Math.random() * 10);
            
            projectiles.push({
                x: cloud.x,
                y: cloud.y,
                vx: (dx / dist) * speed,
                vy: (dy / dist) * speed,
                damage: damage,
                color: '#ff0',
                particleColor: '#fff',
                size: 24,
                life: 60,
                isLightning: true,
                isCloudLightning: true,
                boltColor: '#ff0',
                coreColor: '#fff',
                glowColor: '#0ff'
            });
            
            if (typeof playSound === 'function') {
                playSound('lightning');
            }
        }
    }
};

/**
 * 绘制单个云朵（地图坐标转屏幕坐标）
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} cloud - 云朵对象
 * @param {number} time - 当前时间(秒)
 * @param {Object} camX - 摄像机X偏移
 * @param {Object} camY - 摄像机Y偏移
 */
window.drawSingleCloud = function(ctx, cloud, time, camX, camY) {
    // 将地图坐标转换为屏幕坐标
    const screenX = cloud.x - camX;
    const screenY = cloud.y - camY;
    
    const breathe = Math.sin(time * 0.3 + cloud.phase) * 0.08 + 1;
    
    const baseX = screenX + Math.sin(time * cloud.wobbleSpeed * 0.7 + cloud.wobblePhase) * 3;
    const baseY = screenY;
    const size = cloud.size;
    
    const cloudType = window.CLOUD_TYPES[cloud.type] || window.CLOUD_TYPES.white;
    
    // 绘制云朵阴影
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    cloud.circles.forEach(c => {
        if (c.oy > 0) {
            ctx.beginPath();
            ctx.arc(baseX + c.ox * size + 1.5, 
                   baseY + c.oy * size + 4, 
                   c.r * size * breathe * 0.9, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // 绘制云朵底层阴影
    cloud.circles.forEach(c => {
        ctx.fillStyle = cloudType.shadowColor;
        ctx.beginPath();
        ctx.arc(baseX + c.ox * size + 2, baseY + c.oy * size + 2, c.r * size * breathe * 0.95, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 绘制云朵主体
    cloud.circles.forEach(c => {
        ctx.fillStyle = cloudType.color;
        ctx.beginPath();
        ctx.arc(baseX + c.ox * size, baseY + c.oy * size, c.r * size * breathe, 0, Math.PI * 2);
        ctx.fill();
        
        if (cloudType.highlightColor && cloud.type === 'white') {
            ctx.fillStyle = cloudType.highlightColor;
            ctx.beginPath();
            ctx.arc(baseX + c.ox * size - c.r * size * 0.3, baseY + c.oy * size - c.r * size * 0.3, 
                   c.r * size * breathe * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // 绘制底部阴影线
    ctx.strokeStyle = cloudType.strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(baseX - size * 0.6, baseY + size * 0.3);
    ctx.quadraticCurveTo(baseX, baseY + size * 0.5, baseX + size * 0.6, baseY + size * 0.3);
    ctx.stroke();
    
    if (cloud.type === 'storm') {
        ctx.font = `${Math.floor(size * 0.55)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (cloud.lightningTimer >= 60 && cloud.lightningTimer <= 90) {
            ctx.fillText('\u26A1', baseX, baseY);
        }
    }
};

/**
 * 绘制所有云朵并处理攻击
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} clouds - 云朵数组
 * @param {Object} player - 玩家对象
 * @param {Array} enemies - 敌人数组
 * @param {Array} bosses - Boss数组
 * @param {Array} projectiles - 投射物数组
 * @param {number} camX - 摄像机X偏移
 * @param {number} camY - 摄像机Y偏移
 * @param {number} mapLevel - 地图等级
 * @param {boolean} animate - 是否播放动画
 */
window.drawClouds = function(ctx, clouds, player, enemies, bosses, projectiles, camX, camY, mapLevel, animate = true) {
    if (!clouds || !clouds.length) return;
    
    // 获取地图尺寸
    const mapWidth = (window.MAP_W || 66) * (window.TILE || 64);
    const mapHeight = (window.MAP_H || 66) * (window.TILE || 64);
    
    const time = animate ? Date.now() / 1000 : 0;
    
    if (animate) {
        window.updateClouds(clouds, mapWidth, mapHeight, time);
    }
    
    clouds.forEach(cloud => {
        window.drawSingleCloud(ctx, cloud, time, camX, camY);
        
        if (animate && cloud.type === 'storm') {
            if (!cloud.lightningTimer) cloud.lightningTimer = 0;
            cloud.lightningTimer++;
            
            if (cloud.lightningTimer > 120) {
                cloud.lightningTimer = 0;
            }
            
            const cloudTypeConfig = window.CLOUD_TYPES.storm;
            if (cloud.lightningTimer >= cloudTypeConfig.attackCooldown && 
                cloud.lightningTimer % cloudTypeConfig.attackInterval === 0) {
                window.cloudLightningAttack(cloud, player, enemies, bosses, projectiles, mapLevel);
            }
        }
    });
};
