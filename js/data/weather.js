/**
 * PixelARPG - 天气与积水系统
 */

window.Weather = {
    type: 'clear',
    intensity: 0,
    raindrops: [],
    splashParticles: [],
    puddles: [],
    rainAngle: -0.25,
    
    config: {
        maxRaindrops: 200,
        maxSplashParticles: 100,
        puddleSpawnRate: 0.012,
        puddleMaxSize: 50,
        puddleMinSize: 10,
        puddleGrowRate: 0.2,
        puddleShrinkRate: 0.1
    },
    
    init: function() {
        this.initPuddles();
    },
    
    setWeather: function(type, intensity) {
        if (intensity === undefined) intensity = 1;
        this.type = type;
        this.intensity = intensity;
        
        if (type === 'rain') {
            this.initPuddles();
        }
    },
    
    clear: function() {
        this.type = 'clear';
        this.intensity = 0;
        this.raindrops = [];
        this.splashParticles = [];
    },
    
    initPuddles: function() {
        this.puddles = [];
        if (!window.MAP_W || !window.MAP_H || !window.TILE) return;
        
        const mapWidth = window.MAP_W * window.TILE;
        const mapHeight = window.MAP_H * window.TILE;
        
        const numInitialPuddles = 10 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < numInitialPuddles; i++) {
            this.puddles.push({
                x: Math.random() * mapWidth,
                y: Math.random() * mapHeight,
                size: this.config.puddleMinSize + Math.random() * 10,
                alpha: 0.1 + Math.random() * 0.08,
                shimmer: Math.random() * Math.PI * 2
            });
        }
    },
    
    update: function(player, animate, cameraX, cameraY) {
        if (animate === undefined) animate = true;
        if (cameraX === undefined) cameraX = 0;
        if (cameraY === undefined) cameraY = 0;
        this.cameraX = cameraX;
        this.cameraY = cameraY;
        this.player = player;
        
        if (!animate) {
            this.raindrops = [];
            this.splashParticles = [];
            return;
        }
        
        this.updatePuddles();
        
        if (this.type !== 'rain') {
            this.raindrops = [];
            this.splashParticles = this.splashParticles.filter(p => {
                p.life -= 0.04;
                p.alpha = p.life * 0.4;
                return p.life > 0;
            });
            return;
        }
        
        // 生成雨滴
        while (this.raindrops.length < this.config.maxRaindrops * this.intensity) {
            this.raindrops.push({
                x: Math.random() * gameWidth,
                y: Math.random() * gameHeight * 0.3 - gameHeight * 0.3,
                speed: 12 + Math.random() * 8,
                length: 25 + Math.random() * 20,
                alpha: 0.4 + Math.random() * 0.3,
                inScreen: false
            });
        }
        
        // 获取地图信息
        const TILE = window.TILE || 32;
        const map = window.map || window.gameMap;
        const MAP_W = window.MAP_W || 50;
        const MAP_H = window.MAP_H || 50;
        
        // 更新雨滴位置
        this.raindrops = this.raindrops.filter(drop => {
            drop.y += drop.speed * Math.cos(this.rainAngle);
            drop.x += drop.speed * Math.sin(this.rainAngle);
            
            // 边界检查
            if (drop.x < -20 || drop.x > gameWidth + 20 || drop.y > gameHeight + 20) {
                return false;
            }
            
            // 雨滴进入屏幕后开始检测碰撞
            if (drop.y > 0 && drop.x > 0 && drop.x < gameWidth) {
                // 1. 先检测玩家
                if (player) {
                    const px = player.x - cameraX;
                    const py = player.y - cameraY;
                    if (drop.x > px && drop.x < px + player.w &&
                        drop.y > py && drop.y < py + player.h) {
                        this.addSplash(drop.x, drop.y, 0.8);
                        return false;
                    }
                }
                
                // 2. 检测敌人
                if (window.enemies) {
                    for (let e of window.enemies) {
                        const ex = e.x - cameraX;
                        const ey = e.y - cameraY;
                        if (drop.x > ex && drop.x < ex + e.w &&
                            drop.y > ey && drop.y < ey + e.h) {
                            this.addSplash(drop.x, drop.y, 1);
                            return false;
                        }
                    }
                }
                
                // 3. 检测Boss
                if (window.bosses) {
                    for (let b of window.bosses) {
                        if (!b || b.hp <= 0) continue;
                        const bx = b.x - cameraX;
                        const by = b.y - cameraY;
                        if (drop.x > bx && drop.x < bx + b.w &&
                            drop.y > by && drop.y < by + b.h) {
                            this.addSplash(drop.x, drop.y, 1.2);
                            return false;
                        }
                    }
                }
                
                // 4. 检测掉落物
                if (window.drops) {
                    for (let d of window.drops) {
                        const dx = d.x - cameraX;
                        const dy = d.y - cameraY;
                        if (drop.x > dx - 5 && drop.x < dx + 25 &&
                            drop.y > dy - 5 && drop.y < dy + 25) {
                            this.addSplash(drop.x, drop.y, 1);
                            return false;
                        }
                    }
                }
                
                // 5. 检测地面（地图瓦片）
                const mapX = Math.floor((drop.x + cameraX) / TILE);
                const mapY = Math.floor((drop.y + cameraY) / TILE);
                
                if (map && mapY >= 0 && mapY < MAP_H && mapX >= 0 && mapX < MAP_W) {
                    const tile = map[mapY][mapX];
                    // 墙壁(1)不产生水花，其他都产生
                    if (tile !== 1) {
                        this.addSplash(drop.x, drop.y, 1.5);
                        return false;
                    }
                }
            }
            
            return true;
        });
        
        // 更新雨滴位置
        this.raindrops = this.raindrops.filter(drop => {
            drop.y += drop.speed * Math.cos(this.rainAngle);
            drop.x += drop.speed * Math.sin(this.rainAngle);
            
            // 雨滴进入屏幕后开始检测碰撞
            if (drop.y > 0 && drop.y < gameHeight && drop.x > 0 && drop.x < gameWidth) {
                drop.inScreen = true;
            }
            
            // 只有进入屏幕后才检测碰撞
            if (drop.inScreen) {
                // 将屏幕坐标转换为地图坐标
                const mapX = Math.floor((drop.x + cameraX) / TILE);
                const mapY = Math.floor((drop.y + cameraY) / TILE);
                
                // 检测碰撞
                if (map && mapY >= 0 && mapY < MAP_H && mapX >= 0 && mapX < MAP_W) {
                    const tile = map[mapY][mapX];
                    // 墙壁(1)不产生水花，其他都产生
                    if (tile !== 1) {
                        this.addSplash(drop.x, drop.y, 1.5);
                        return false;
                    }
                }
                
                // 碰到玩家
                if (player) {
                    const px = player.x - cameraX;
                    const py = player.y - cameraY;
                    if (drop.x > px && drop.x < px + player.w &&
                        drop.y > py && drop.y < py + player.h) {
                        this.addSplash(drop.x, drop.y, 0.8);
                        return false;
                    }
                }
            }
            
            // 离开屏幕后移除
            if (drop.y > gameHeight + 20 || drop.x < -30 || drop.x > gameWidth + 30) {
                return false;
            }
            
            return true;
        });
        
        // 玩家移动时产生水花
        if (player && player.isMoving) {
            if (Math.random() < 0.25) {
                const screenX = player.x + player.w / 2 - cameraX + (Math.random() - 0.5) * player.w * 0.6;
                const screenY = player.y + player.h - cameraY;
                this.addSplash(screenX, screenY, 1.3);
            }
        }
        
        // 更新水花粒子
        this.splashParticles = this.splashParticles.filter(p => {
            p.y -= p.vy;
            p.vy -= 0.3;
            p.x += p.vx;
            p.life -= 0.018;
            p.alpha = p.life * 0.55;
            p.size *= 0.965;
            return p.life > 0 && p.size > 0.2;
        });
    },
    
    updatePuddles: function() {
        if (!window.MAP_W || !window.MAP_H || !window.TILE) return;
        
        const mapWidth = window.MAP_W * window.TILE;
        const mapHeight = window.MAP_H * window.TILE;
        
        if (this.type === 'rain') {
            if (Math.random() < this.config.puddleSpawnRate * this.intensity) {
                this.puddles.push({
                    x: Math.random() * mapWidth,
                    y: Math.random() * mapHeight,
                    size: this.config.puddleMinSize * 0.3,
                    alpha: 0.06,
                    shimmer: Math.random() * Math.PI * 2
                });
            }
            
            this.puddles.forEach(puddle => {
                if (puddle.size < this.config.puddleMaxSize) {
                    puddle.size += this.config.puddleGrowRate * this.intensity;
                    puddle.alpha = Math.min(0.3, puddle.alpha + 0.0006);
                }
                puddle.shimmer += 0.02;
            });
            
            this.mergePuddles();
            
        } else {
            this.puddles = this.puddles.filter(puddle => {
                puddle.size -= this.config.puddleShrinkRate;
                puddle.alpha = Math.max(0.03, puddle.alpha - 0.0012);
                return puddle.size > 2;
            });
        }
    },
    
    mergePuddles: function() {
        const toRemove = new Set();
        
        for (let i = 0; i < this.puddles.length; i++) {
            if (toRemove.has(i)) continue;
            
            for (let j = i + 1; j < this.puddles.length; j++) {
                if (toRemove.has(j)) continue;
                
                const p1 = this.puddles[i];
                const p2 = this.puddles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < (p1.size + p2.size) * 0.45) {
                    const totalSize = p1.size + p2.size;
                    p1.x = (p1.x * p1.size + p2.x * p2.size) / totalSize;
                    p1.y = (p1.y * p1.size + p2.y * p2.size) / totalSize;
                    p1.size = Math.min(this.config.puddleMaxSize, totalSize * 0.7);
                    p1.alpha = Math.min(0.35, p1.alpha + p2.alpha * 0.35);
                    toRemove.add(j);
                }
            }
        }
        
        this.puddles = this.puddles.filter((_, index) => !toRemove.has(index));
    },
    
    addSplash: function(x, y, sizeMult) {
        if (sizeMult === undefined) sizeMult = 1;
        if (this.splashParticles.length < this.config.maxSplashParticles) {
            const count = Math.floor((4 + Math.random() * 5) * sizeMult);
            for (let i = 0; i < count; i++) {
                this.splashParticles.push({
                    x: x + (Math.random() - 0.5) * 10 * sizeMult,
                    y: y,
                    vx: (Math.random() - 0.5) * 4 * sizeMult,
                    vy: 3 + Math.random() * 5 * sizeMult,
                    size: (3 + Math.random() * 5) * sizeMult,
                    alpha: 0.95,
                    life: 1
                });
            }
        }
    },
    
    draw: function(ctx, cameraX, cameraY) {
        if (cameraX === undefined) cameraX = 0;
        if (cameraY === undefined) cameraY = 0;
        const time = Date.now() / 1000;
        
        // 绘制积水
        if (this.puddles.length > 0) {
            this.puddles.forEach(puddle => {
                const screenX = puddle.x - cameraX;
                const screenY = puddle.y - cameraY;
                
                if (screenX < -100 || screenX > gameWidth + 100 ||
                    screenY < -100 || screenY > gameHeight + 100) return;
                
                const shimmer = Math.sin(time * 2 + puddle.shimmer) * 0.012;
                
                ctx.fillStyle = `rgba(65, 125, 175, ${puddle.alpha + shimmer})`;
                ctx.beginPath();
                ctx.ellipse(screenX, screenY, puddle.size, puddle.size * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = `rgba(175, 210, 235, ${puddle.alpha * 0.5})`;
                ctx.beginPath();
                ctx.ellipse(screenX - puddle.size * 0.18, screenY - puddle.size * 0.1, 
                           puddle.size * 0.28, puddle.size * 0.12, -0.2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = `rgba(255, 255, 255, ${puddle.alpha * 0.22})`;
                ctx.beginPath();
                ctx.ellipse(screenX + puddle.size * 0.1, screenY + puddle.size * 0.06, 
                           puddle.size * 0.1, puddle.size * 0.05, 0.15, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // 绘制雨滴
        if (this.type === 'rain' && this.raindrops.length > 0) {
            ctx.strokeStyle = 'rgba(145, 190, 250, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            this.raindrops.forEach(drop => {
                const x1 = drop.x;
                const y1 = drop.y;
                const x2 = x1 + Math.sin(this.rainAngle) * drop.length;
                const y2 = y1 + Math.cos(this.rainAngle) * drop.length;
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            });
            ctx.stroke();
        }
        
        // 绘制水花
        if (this.splashParticles.length > 0) {
            ctx.fillStyle = 'rgba(200, 230, 255, 0.95)';
            this.splashParticles.forEach(p => {
                if (p.alpha > 0.05) {
                    ctx.globalAlpha = p.alpha;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.globalAlpha = 1;
        }
        
        // 雨天色调
        if (this.type === 'rain') {
            ctx.fillStyle = 'rgba(30, 45, 70, 0.1)';
            ctx.fillRect(0, 0, gameWidth, gameHeight);
        }
    }
};

window.setWeather = function(type, intensity) {
    window.Weather.setWeather(type, intensity);
};

window.toggleWeather = function() {
    if (!window.Weather) return;
    if (window.Weather.type === 'rain') {
        window.Weather.setWeather('clear', 0);
    } else {
        window.Weather.setWeather('rain', 1);
    }
};

setTimeout(() => {
    if (window.Weather) {
        window.Weather.init();
    }
}, 500);
