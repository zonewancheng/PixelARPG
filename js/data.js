/**
 * PixelARPG - 游戏基础配置
 * 定义游戏全局常量和配置
 */

// 瓦片大小 (像素) - 放大2倍
window.TILE = 64;

// 地图宽度 (瓦片数) - 动态计算
window.MAP_W = 15;

// 地图高度 (瓦片数) - 动态计算
window.MAP_H = 20;

// 根据画布大小自动计算地图参数
window.initMapSize = function(canvasWidth, canvasHeight) {
    const minTile = 48;
    const maxTile = 96;
    
    window.TILE = Math.max(minTile, Math.min(maxTile, 64));
    
    // 地图固定为66x66格子
    window.MAP_W = 66;
    window.MAP_H = 66;
    
    console.log(`Map: ${window.MAP_W}x${window.MAP_H}, TILE=${window.TILE}`);
};

// 游戏版本
window.GAME_VERSION = '1.6';
