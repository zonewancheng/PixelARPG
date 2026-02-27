/**
 * PixelARPG - 天气系统
 * 支持：雨天、积水效果
 */

window.Weather = {
    // 天气类型: 'clear', 'rain'
    type: 'clear',
    intensity: 0,
    raindrops: [],
    puddles: [],
    splashParticles: [],
    
    // 配置
    config: {
        maxRaindrops: 200,
        maxPuddles: 30,
        maxSplashParticles: 50,
        rainSpeed: 15,
        puddleChance: 0.15
    },
    
    init: function() {
        this.generatePuddles();
    },
    
    setWeather: function(type, intensity = 1) {
        this.type = type;
        this.intensity = intensity;
        
        if (type === 'rain') {
            this.generatePuddles();
        }
    },
    
    clear: function() {
        this.type = 'clear';
        this.intensity = 0;
        this.raindrops = [];
        this.puddles = [];
        this.splashParticles = [];
    },
    
    generatePuddles: function() {
        this.puddles = [];
        if (!window.MAP_W || !window.MAP_H || !window.TILE) return;
        
        const mapWidth = window.MAP_W * window.TILE;
        const mapHeight = window.MAP_H * window.TILE;
        
        const numPuddles = Math.floor(this.config.maxPuddles * this.intensity);
        
        for (let i = 0; i < numPuddles; i++) {
            this.puddles.push({
                x: Math.random() * mapWidth,
                y: Math.random() * mapHeight,
                size: 20 + Math.random() * 40,
                alpha: 0.1 + Math.random() * 0.2,
                shimmer: Math.random() * Math.PI * 2
            });
        }
    },
    
    update: function(player, animate = true, cameraX = 0, cameraY = 0) {
        if (!animate || this.type !== 'rain') {
            this.raindrops = [];
            this.splashParticles = [];
            return;
        }
        
        const time = Date.now() / 1000;
        
        // 更新雨滴（在屏幕空间）
        while (this.raindrops.length < this.config.maxRaindrops * this.intensity) {
            this.raindrops.push({
                x: Math.random() * (gameWidth + 200) - 100,
                y: Math.random() * -50,
                speed: this.config.rainSpeed + Math.random() * 10,
                length: 15 + Math.random() * 20,
                alpha: 0.3 + Math.random() * 0.4,
                hasSplashed: false
            });
        }
        
        // 更新雨滴位置并检测碰撞
        const rainAngle = -0.3;
        const groundY = gameHeight - 50; // 地面位置（近似）
        
        this.raindrops = this.raindrops.filter(drop => {
            const oldX = drop.x;
            const oldY = drop.y;
            
            drop.y += drop.speed * Math.cos(rainAngle);
            drop.x += drop.speed * Math.sin(rainAngle);
            
            // 检测是否碰到地面
            if (!drop.hasSplashed && drop.y > groundY) {
                drop.hasSplashed = true;
                this.addScreenSplash(drop.x, groundY + 30, 1);
                return false;
            }
            
            // 检测是否碰到玩家
            if (player && !drop.hasSplashed) {
                const px = player.x - cameraX;
                const py = player.y - cameraY;
                if (drop.x > px && drop.x < px + player.w &&
                    drop.y > py && drop.y < py + player.h) {
                    drop.hasSplashed = true;
                    this.addScreenSplash(drop.x, drop.y, 0.5);
                    return false;
                }
            }
            
            return drop.y < gameHeight + 50 && drop.x > -100 && drop.x < gameWidth + 100;
        });
        
        // 玩家移动时踩水效果
        if (player && player.isMoving) {
            if (Math.random() < 0.4) {
                const splashX = player.x - cameraX + player.w / 2 + (Math.random() - 0.5) * player.w;
                const splashY = player.y - cameraY + player.h;
                this.addScreenSplash(splashX, splashY, 1.5);
            }
        }
        
        // 更新水花粒子
        this.splashParticles = this.splashParticles.filter(p => {
            p.y -= p.vy;
            p.vy -= 0.15; // 重力
            p.x += p.vx;
            p.life -= 0.03;
            p.alpha = p.life * 0.6;
            return p.life > 0;
        });
    },
    
    addScreenSplash: function(x, y, sizeMult = 1) {
        if (this.splashParticles.length < this.config.maxSplashParticles * 2) {
            const count = Math.floor((2 + Math.random() * 4) * sizeMult);
            for (let i = 0; i < count; i++) {
                this.splashParticles.push({
                    x: x + (Math.random() - 0.5) * 15 * sizeMult,
                    y: y,
                    vx: (Math.random() - 0.5) * 4 * sizeMult,
                    vy: 1 + Math.random() * 3 * sizeMult,
                    size: (2 + Math.random() * 3) * sizeMult,
                    alpha: 0.8,
                    life: 1
                });
            }
        }
    },
    
    draw: function(ctx, cameraX, cameraY) {
        if (this.type !== 'rain') return;
        
        const time = Date.now() / 1000;
        
        // 绘制积水（在地图空间，需要camera offset）
        this.puddles.forEach(puddle => {
            const screenX = puddle.x - cameraX;
            const screenY = puddle.y - cameraY;
            
            // 屏幕外的积水不绘制
            if (screenX < -50 || screenX > gameWidth + 50 ||
                screenY < -50 || screenY > gameHeight + 50) return;
            
            // 积水反光
            const shimmer = Math.sin(time * 2 + puddle.shimmer) * 0.03;
            
            ctx.fillStyle = `rgba(100, 150, 200, ${puddle.alpha + shimmer})`;
            ctx.beginPath();
            ctx.ellipse(screenX, screenY, puddle.size, puddle.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 反光高光
            ctx.fillStyle = `rgba(200, 230, 255, ${puddle.alpha * 0.5})`;
            ctx.beginPath();
            ctx.ellipse(screenX - puddle.size * 0.2, screenY - puddle.size * 0.15, 
                       puddle.size * 0.3, puddle.size * 0.15, -0.3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // 绘制水花（在屏幕空间）
        ctx.fillStyle = 'rgba(200, 230, 255, 0.8)';
        this.splashParticles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // 绘制雨滴（在屏幕空间，有角度）
        const rainAngle = -0.3; // 雨滴倾斜角度
        ctx.strokeStyle = 'rgba(150, 200, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        this.raindrops.forEach(drop => {
            const x1 = drop.x;
            const y1 = drop.y;
            const x2 = drop.x + Math.sin(rainAngle) * drop.length;
            const y2 = drop.y + Math.cos(rainAngle) * drop.length;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        });
        ctx.stroke();
        
        // 雨天整体色调（屏幕偏蓝）
        ctx.fillStyle = 'rgba(50, 80, 120, 0.1)';
        ctx.fillRect(0, 0, gameWidth, gameHeight);
    },
    
    // 检测玩家是否踩到积水
    checkPuddleSplash: function(player) {
        if (this.type !== 'rain' || !player || !player.isMoving) return;
        
        const px = player.x + player.w / 2;
        const py = player.y + player.h;
        
        this.puddles.forEach(puddle => {
            const dx = px - puddle.x;
            const dy = py - puddle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < puddle.size && Math.random() < 0.1) {
                this.addSplash(puddle.x, puddle.y);
            }
        });
    }
};

// 天气控制（可在控制台测试）
window.setWeather = function(type, intensity) {
    window.Weather.setWeather(type, intensity);
    console.log('天气已设置为:', type, '强度:', intensity);
};

// 随机天气
window.randomWeather = function() {
    const weathers = ['clear', 'rain'];
    const weather = weathers[Math.floor(Math.random() * weathers.length)];
    const intensity = 0.5 + Math.random() * 0.5;
    window.Weather.setWeather(weather, intensity);
    console.log('随机天气:', weather, '强度:', intensity.toFixed(2));
};

// 开启随机天气变化（每30-60秒变化一次）
window.startWeatherCycle = function() {
    const cycleWeather = () => {
        window.randomWeather();
        setTimeout(cycleWeather, 30000 + Math.random() * 30000);
    };
    setTimeout(cycleWeather, 10000);
    console.log('天气循环已开启');
};

// 页面加载后初始化
setTimeout(() => {
    if (window.Weather) {
        window.Weather.init();
        // 可选：开启随机天气
        // window.startWeatherCycle();
    }
}, 500);
