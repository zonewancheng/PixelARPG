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
    FLOWER: 6    // 花
};

// 瓦片颜色
window.TILE_COLORS = {
    ground: '#1a3a3c',
    wall: '#2a2a3a',
    grass: '#3a7a3a',
    water: '#2a4a6a',
    hill: '#4a8a4a',
    tree: '#2d5a2d',
    flower: '#8a4a8a'
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
        6: window.TILE_COLORS.flower
    };
    return colors[tileType] || window.TILE_COLORS.ground;
};
