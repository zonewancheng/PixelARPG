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
    // 计算合适的瓦片大小，使地图尽量填满画布
    // 目标瓦片大小范围: 24-40像素
    const minTile = 24;
    const maxTile = 40;
    
    // 先按最小尺寸计算需要多少瓦片
    const minCols = 12;
    const minRows = 16;
    
    // 计算最佳瓦片大小
    const tileByWidth = Math.floor(canvasWidth / minCols);
    const tileByHeight = Math.floor(canvasHeight / minRows);
    
    // 取较小值确保地图能放下，同时不超过最大限制
    window.TILE = Math.max(minTile, Math.min(maxTile, Math.min(tileByWidth, tileByHeight)));
    
    // 根据瓦片大小计算地图填满屏幕所需瓦片数
    window.MAP_W = Math.ceil(canvasWidth / window.TILE);
    window.MAP_H = Math.ceil(canvasHeight / window.TILE);
    
    // 确保最小尺寸
    window.MAP_W = Math.max(minCols, window.MAP_W);
    window.MAP_H = Math.max(minRows, window.MAP_H);
    
    console.log(`Map initialized: ${window.MAP_W}x${window.MAP_H}, TILE=${window.TILE}, canvas=${canvasWidth}x${canvasHeight}`);
};

// 游戏版本
window.GAME_VERSION = '1.6';
