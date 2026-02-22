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
    // 计算合适的瓦片大小，使地图填满画布
    const minTile = 48;  // 放大2倍（原24）
    const maxTile = 96;  // 放大2倍（原48）
    
    // 计算最佳瓦片大小（填满屏幕）
    // 根据屏幕高度动态调整行数
    const rows = Math.max(20, Math.floor(canvasHeight / 28));
    const cols = Math.floor(canvasWidth / 20);
    
    const tileByWidth = Math.floor(canvasWidth / cols);
    const tileByHeight = Math.floor(canvasHeight / rows);
    
    // 取较小值确保填满屏幕
    window.TILE = Math.max(minTile, Math.min(maxTile, Math.min(tileByWidth, tileByHeight)));
    
    // 地图尺寸正好填满屏幕
    window.MAP_W = Math.ceil(canvasWidth / window.TILE);
    window.MAP_H = Math.ceil(canvasHeight / window.TILE);
    
    console.log(`Map: ${window.MAP_W}x${window.MAP_H}, TILE=${window.TILE}, rows=${rows}`);
};

// 游戏版本
window.GAME_VERSION = '1.6';
