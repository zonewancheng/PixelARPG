/**
 * PixelARPG - 游戏基础配置
 * 定义游戏全局常量和配置
 */

// 瓦片大小 (像素) - 动态计算
window.TILE = 32;

// 地图宽度 (瓦片数) - 动态计算
window.MAP_W = 15;

// 地图高度 (瓦片数) - 动态计算
window.MAP_H = 20;

// 根据画布大小自动计算地图参数
window.initMapSize = function(canvasWidth, canvasHeight) {
    // 计算合适的瓦片大小，使地图大于屏幕以便摄像机跟随
    // 目标瓦片大小范围: 24-40像素
    const minTile = 24;
    const maxTile = 40;
    
    // 地图最小尺寸（确保比屏幕大）
    const minCols = 20;
    const minRows = 24;
    
    // 计算最佳瓦片大小
    const tileByWidth = Math.floor(canvasWidth / minCols);
    const tileByHeight = Math.floor(canvasHeight / minRows);
    
    // 取较小值确保地图能放下，同时不超过最大限制
    window.TILE = Math.max(minTile, Math.min(maxTile, Math.min(tileByWidth, tileByHeight)));
    
    // 地图尺寸（比屏幕大以支持摄像机移动）
    const extraCols = 8;
    const extraRows = 8;
    window.MAP_W = Math.ceil(canvasWidth / window.TILE) + extraCols;
    window.MAP_H = Math.ceil(canvasHeight / window.TILE) + extraRows;
    
    // 确保最小尺寸
    window.MAP_W = Math.max(minCols, window.MAP_W);
    window.MAP_H = Math.max(minRows, window.MAP_H);
    
    console.log(`Map initialized: ${window.MAP_W}x${window.MAP_H}, TILE=${window.TILE}, canvas=${canvasWidth}x${canvasHeight}, map=${window.MAP_W * window.TILE}x${window.MAP_H * window.TILE}`);
};

// 游戏版本
window.GAME_VERSION = '1.6';
