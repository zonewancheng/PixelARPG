/**
 * PixelARPG - 世界环境数据模块
 * 定义地图瓦片、云朵、天气等环境数据
 */

// 地图瓦片类型
window.TILE_TYPES = {
    GROUND: 0,   // 地面
    WALL: 1,     // 墙壁
    GRASS: 2,    // 草丛
    WATER: 3,    // 水
    HILL: 4,     // 小山
    TREE: 5,     // 树
    FLOWER: 6,   // 花
    STONE: 7     // 石头堆
};

// 瓦片颜色
window.TILE_COLORS = {
    ground: '#1a3a3c',
    wall: '#2a2a3a',
    grass: '#3a7a3a',
    water: '#2a4a6a',
    hill: '#4a8a4a',
    tree: '#2d5a2d',
    flower: '#8a4a8a',
    stone: '#5a5a6a'
};

// 树木类型 (5种不同的树)
window.TREE_TYPES = [
    { name: 'round', trunkColor: '#5a4030', foliageColors: ['#2d5a2d', '#3d6a3d'] },
    { name: 'triangle', trunkColor: '#5a4030', foliageColors: ['#3a7a3a', '#3a6a3a'] },
    { name: 'big', trunkColor: '#5a4030', foliageColors: ['#2e5e2e', '#4a7a4a'] },
    { name: 'pine', trunkColor: '#4a3525', foliageColors: ['#285028'] },
    { name: 'palm', trunkColor: '#5a4030', foliageColors: ['#2c5c2c'] }
];

// 小山类型
window.HILL_TYPES = [
    { name: 'small', baseColor: '#3a6a3a', highlightColor: '#5a9a5a' },
    { name: 'medium', baseColor: '#2d6a2d', highlightColor: '#4d8a4d' },
    { name: 'large', baseColor: '#3a7a3a', highlightColor: '#4a8a4a' }
];

// 石头堆类型
window.STONE_TYPES = [
    { name: 'stacked', colors: ['#6a6a7a', '#5a5a6a', '#4a4a5a'], shape: 'stack' },
    { name: 'scattered', colors: ['#6a6a7a', '#5a5a6a', '#7a7a8a', '#5a5a6a', '#6a6a7a'], shape: 'scatter' },
    { name: 'boulder', colors: ['#5a5a6a', '#7a7a8a'], shape: 'single' }
];

// 石头堆渲染函数
window.drawStonePile = function(ctx, x, y, size, shadowDir, seedX, seedY) {
    const cx = x + size/2;
    const cy = y + size/2;

    // 石头堆阴影
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(cx + shadowDir.x, y + size - 3 + shadowDir.y, size/2.2, size/5, 0, 0, Math.PI*2);
    ctx.fill();

    // 使用种子确定石头类型
    const stoneTypeIndex = (seedX * 7 + seedY * 13) % 3;
    const stoneType = window.STONE_TYPES[stoneTypeIndex];

    if (stoneType.shape === 'stack') {
        // 三层石头堆
        // 底层大石
        ctx.fillStyle = stoneType.colors[0];
        ctx.beginPath();
        ctx.ellipse(cx, cy + 6, 10, 7, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#7a7a8a';
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy + 4, 7, 5, 0, 0, Math.PI*2);
        ctx.fill();

        // 中层中石
        ctx.fillStyle = stoneType.colors[1];
        ctx.beginPath();
        ctx.ellipse(cx + 2, cy - 2, 7, 5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#6a6a7a';
        ctx.beginPath();
        ctx.ellipse(cx + 1, cy - 3, 5, 3, 0, 0, Math.PI*2);
        ctx.fill();

        // 顶层小石
        ctx.fillStyle = stoneType.colors[2];
        ctx.beginPath();
        ctx.ellipse(cx - 1, cy - 8, 5, 4, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#5a5a6a';
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy - 9, 3, 2, 0, 0, Math.PI*2);
        ctx.fill();

    } else if (stoneType.shape === 'scatter') {
        // 散乱石头
        const positions = [[-6, 4, 5], [4, 6, 4], [0, -2, 6], [-3, -8, 4], [6, -4, 3]];

        positions.forEach((pos, i) => {
            ctx.fillStyle = stoneType.colors[i % stoneType.colors.length];
            ctx.beginPath();
            ctx.ellipse(cx + pos[0], cy + pos[1], pos[2], pos[2]*0.7, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#8a8a9a';
            ctx.beginPath();
            ctx.ellipse(cx + pos[0] - 1, cy + pos[1] - 1, pos[2]*0.5, pos[2]*0.35, 0, 0, Math.PI*2);
            ctx.fill();
        });

    } else {
        // 巨石
        ctx.fillStyle = stoneType.colors[0];
        ctx.beginPath();
        ctx.ellipse(cx, cy + 2, 12, 9, 0, 0, Math.PI*2);
        ctx.fill();

        // 裂缝
        ctx.strokeStyle = '#3a3a4a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 4, cy - 2);
        ctx.lineTo(cx - 2, cy + 2);
        ctx.lineTo(cx + 1, cy + 1);
        ctx.stroke();

        ctx.fillStyle = stoneType.colors[1];
        ctx.beginPath();
        ctx.ellipse(cx - 3, cy - 1, 6, 4, 0, 0, Math.PI*2);
        ctx.fill();
    }

    // 石头高光细节
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.ellipse(cx - 3, cy - 6, 3, 2, 0, 0, Math.PI*2);
    ctx.fill();
};

// 花朵颜色
window.FLOWER_COLORS = ['#f44', '#f84', '#f64', '#f48', '#8f8', '#48f', '#f4f', '#fff'];

// 云朵类型
window.CLOUD_TYPES = ['white', 'dark', 'storm'];

// 云朵颜色
window.CLOUD_COLORS = {
    white: '#e8e8f0',
    dark: '#5a5a6a',
    storm: '#2a2a2a'
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
 * @param {number} canvasWidth - 画布宽度
 * @param {number} canvasHeight - 画布高度
 * @returns {Object} 云朵对象
 */
window.createCloud = function(canvasWidth, canvasHeight) {
    const types = ['white', 'dark', 'storm'];
    const rand = Math.random();
    const type = rand < 0.3 ? 'storm' : (rand < 0.6 ? 'dark' : 'white');
    const size = 20 + Math.random() * 30;
    const speedX = (Math.random() * 0.15 + 0.05) * (Math.random() > 0.5 ? 1 : -1);
    
    return {
        x: Math.random() * canvasWidth,
        y: 10 + Math.random() * (canvasHeight * 0.3),
        size: size,
        speedX: speedX,
        speedY: (Math.random() - 0.5) * 0.1,
        type: type,
        phase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 0.5,
        wobblePhase: Math.random() * Math.PI * 2,
        circles: window.CLOUD_CIRCLES,
        lightningTimer: 0
    };
};

/**
 * 初始化云朵
 * @param {number} canvasWidth - 画布宽度
 * @param {number} canvasHeight - 画布高度
 */
window.initClouds = function(canvasWidth, canvasHeight) {
    window.clouds = [];
    const cloudCount = 5;
    for (let i = 0; i < cloudCount; i++) {
        window.clouds.push(window.createCloud(canvasWidth, canvasHeight));
    }
};

/**
 * 获取瓦片颜色
 * @param {number} tileType - 瓦片类型
 * @returns {string} 颜色值
 */
window.getTileColor = function(tileType) {
    const colors = {
        0: window.TILE_COLORS.ground,
        1: window.TILE_COLORS.wall,
        2: window.TILE_COLORS.grass,
        3: window.TILE_COLORS.water,
        4: window.TILE_COLORS.hill,
        5: window.TILE_COLORS.tree,
        6: window.TILE_COLORS.flower,
        7: window.TILE_COLORS.stone
    };
    return colors[tileType] || window.TILE_COLORS.ground;
};
