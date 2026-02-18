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
    // 留出边缘空间
    const margin = 16;
    const availableWidth = canvasWidth - margin * 2;
    const availableHeight = canvasHeight - margin * 2;
    
    // 计算合适的瓦片大小，确保地图填满屏幕
    // 目标: 15列 x 20行是最小配置，根据屏幕调整
    const tileW = Math.floor(availableWidth / 15);
    const tileH = Math.floor(availableHeight / 20);
    
    // 取较大值确保角色不会太小
    window.TILE = Math.max(28, Math.min(40, Math.max(tileW, tileH)));
    
    // 根据瓦片大小计算地图尺寸
    window.MAP_W = Math.floor(canvasWidth / window.TILE);
    window.MAP_H = Math.floor(canvasHeight / window.TILE);
    
    // 确保最小尺寸
    window.MAP_W = Math.max(12, window.MAP_W);
    window.MAP_H = Math.max(16, window.MAP_H);
    
    console.log(`Map initialized: ${window.MAP_W}x${window.MAP_H}, TILE=${window.TILE}`);
};

// 游戏版本
window.GAME_VERSION = '1.6';
