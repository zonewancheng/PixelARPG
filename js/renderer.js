/**
 * PixelARPG - 渲染模块
 * 处理所有游戏画面的绘制
 */

// 地面颜色
const GROUND_COLOR = '#1a3a3c';

/**
 * 绘制像素精灵 (玩家/敌人)
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} w - 宽度
 * @param {number} h - 高度
 * @param {string} color - 颜色
 * @param {string} type - 类型
 * @param {Object} player - 玩家对象
 */
function drawPixelSprite(ctx, x, y, w, h, color, type, player) {
    if (type === 'player' && window.renderPlayerSprite) {
        window.renderPlayerSprite(ctx, player, x, y, w, h);
        return;
    }
    
    const dir = player.dirX > 0 ? 1 : (player.dirX < 0 ? -1 : 1);
    ctx.fillStyle = color;
    if (type === 'player') {
        ctx.fillStyle = '#fa0';
        ctx.fillRect(x + 8, y, 8, 4);
        ctx.fillStyle = '#f80';
        ctx.fillRect(x + 4, y + 4, 16, 12);
        
        if (player.armor) {
            if (player.armor.sprite === 'dragon') {
                ctx.fillStyle = '#a55';
                ctx.fillRect(x + 4, y + 4, 16, 14);
                ctx.fillStyle = '#c77';
                ctx.fillRect(x + 6, y + 6, 12, 10);
                ctx.fillStyle = '#fdd';
                ctx.fillRect(x + 8, y + 8, 8, 3);
            } else if (player.armor.sprite === 'iron') {
                ctx.fillStyle = '#888';
                ctx.fillRect(x + 4, y + 4, 16, 14);
                ctx.fillStyle = '#aaa';
                ctx.fillRect(x + 6, y + 6, 12, 10);
                ctx.fillStyle = '#ccc';
                ctx.fillRect(x + 10, y + 8, 4, 4);
            } else {
                ctx.fillStyle = '#a85';
                ctx.fillRect(x + 4, y + 4, 16, 12);
                ctx.fillStyle = '#c97';
                ctx.fillRect(x + 6, y + 6, 12, 8);
            }
        }
        
        ctx.fillStyle = '#f80';
        ctx.fillRect(x + 8, y + 16, 8, 12);
        
        ctx.fillStyle = '#a52';
        if (dir > 0) {
            ctx.fillRect(x + 14, y + 20, 4, 8);
            ctx.fillRect(x + 10, y + 26, 4, 4);
        } else {
            ctx.fillRect(x + 6, y + 20, 4, 8);
            ctx.fillRect(x + 10, y + 26, 4, 4);
        }
        
        if (player.weapon && player.attacking === 0) {
            const wp = player.weapon.sprite;
            const handX = dir > 0 ? x + 18 : x - 6;
            const handY = y + 14;
            
            if (wp === 'fire_sword') {
                ctx.fillStyle = '#420';
                ctx.fillRect(handX + (dir > 0 ? 0 : 2), handY + 4, 6, 4);
                ctx.fillStyle = '#c74';
                ctx.fillRect(handX + (dir > 0 ? 1 : 3), handY - 8, 4, 12);
                ctx.fillStyle = '#f96';
                ctx.fillRect(handX + (dir > 0 ? 1.5 : 3.5), handY - 6, 2, 8);
                ctx.fillStyle = '#f00';
                ctx.fillRect(handX + (dir > 0 ? 2 : 4), handY - 10, 2, 3);
            } else if (wp === 'thunder_sword') {
                ctx.fillStyle = '#420';
                ctx.fillRect(handX + (dir > 0 ? 0 : 2), handY + 4, 6, 4);
                ctx.fillStyle = '#cc4';
                ctx.fillRect(handX + (dir > 0 ? 1 : 3), handY - 8, 4, 12);
                ctx.fillStyle = '#fff';
                ctx.fillRect(handX + (dir > 0 ? 1.5 : 3.5), handY - 6, 2, 8);
                ctx.fillStyle = '#0ff';
                ctx.fillRect(handX + (dir > 0 ? 0 : 4), handY - 12, 6, 2);
                ctx.fillRect(handX + (dir > 0 ? 2 : 2), handY - 14, 2, 6);
            } else {
                ctx.fillStyle = '#420';
                ctx.fillRect(handX + (dir > 0 ? 0 : 2), handY + 4, 6, 4);
                ctx.fillStyle = '#888';
                ctx.fillRect(handX + (dir > 0 ? 1 : 3), handY - 8, 4, 12);
                ctx.fillStyle = '#ccc';
                ctx.fillRect(handX + (dir > 0 ? 1.5 : 3.5), handY - 6, 2, 8);
            }
        }
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 6, y + 6, 4, 4);
        ctx.fillRect(x + 14, y + 6, 4, 4);
    } else if (type === 'slime') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 4, y + 8, 16, 12);
        ctx.fillRect(x + 2, y + 12, 20, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 6, y + 10, 4, 4);
        ctx.fillRect(x + 14, y + 10, 4, 4);
    } else if (type === 'goblin') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 6, y + 2, 12, 10);
        ctx.fillRect(x + 4, y + 10, 16, 14);
        ctx.fillRect(x + 2, y + 18, 6, 6);
        ctx.fillRect(x + 16, y + 18, 6, 6);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 7, y + 6, 3, 3);
        ctx.fillRect(x + 14, y + 6, 3, 3);
    } else if (type === 'bat') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 8, y + 8, 8, 6);
        ctx.fillRect(x + 4, y + 6, 6, 4);
        ctx.fillRect(x + 14, y + 6, 6, 4);
        ctx.fillRect(x + 2, y + 8, 4, 3);
        ctx.fillRect(x + 18, y + 8, 4, 3);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 9, y + 9, 2, 2);
        ctx.fillRect(x + 13, y + 9, 2, 2);
    } else if (type === 'spider') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 8, y + 4, 8, 8);
        ctx.fillRect(x + 6, y + 10, 12, 10);
        ctx.fillRect(x + 2, y + 8, 4, 4);
        ctx.fillRect(x + 4, y + 14, 3, 8);
        ctx.fillRect(x + 17, y + 14, 3, 8);
        ctx.fillRect(x + 18, y + 8, 4, 4);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 10, y + 6, 2, 2);
        ctx.fillRect(x + 12, y + 6, 2, 2);
    } else if (type === 'enemy') {
        ctx.fillStyle = color || '#4a4';
        ctx.fillRect(x + 4, y + 2, 16, 12);
        ctx.fillRect(x + 2, y + 10, 20, 12);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 6, y + 6, 4, 4);
        ctx.fillRect(x + 14, y + 6, 4, 4);
    } else if (type === 'skeleton') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 8, y + 2, 8, 8);
        ctx.fillRect(x + 4, y + 8, 16, 12);
        ctx.fillRect(x + 2, y + 18, 6, 6);
        ctx.fillRect(x + 16, y + 18, 6, 6);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 8, y + 5, 3, 3);
        ctx.fillRect(x + 13, y + 5, 3, 3);
    } else if (type === 'wolf') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 6, y + 6, 12, 10);
        ctx.fillRect(x + 4, y + 14, 16, 8);
        ctx.fillRect(x + 2, y + 12, 4, 4);
        ctx.fillRect(x + 18, y + 12, 4, 4);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(x + 7, y + 8, 3, 3);
        ctx.fillRect(x + 14, y + 8, 3, 3);
    } else if (type === 'snake') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 8, y + 4, 8, 4);
        ctx.fillRect(x + 6, y + 6, 12, 4);
        ctx.fillRect(x + 4, y + 8, 16, 4);
        ctx.fillRect(x + 2, y + 10, 20, 4);
        ctx.fillRect(x + 4, y + 12, 16, 4);
        ctx.fillRect(x + 6, y + 14, 12, 4);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(x + 9, y + 5, 2, 2);
        ctx.fillRect(x + 13, y + 5, 2, 2);
    } else if (type === 'scorpion') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 6, y + 10, 12, 8);
        ctx.fillRect(x + 2, y + 8, 4, 4);
        ctx.fillRect(x + 18, y + 8, 4, 4);
        ctx.fillRect(x, y + 6, 4, 4);
        ctx.fillRect(x + 20, y + 6, 4, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 8, y + 12, 3, 2);
        ctx.fillRect(x + 13, y + 12, 3, 2);
    } else if (type === 'boss_slime') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 4, y + 4, 16, 10);
        ctx.fillRect(x, y + 8, 24, 14);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 5, y + 8, 4, 4);
        ctx.fillRect(x + 15, y + 8, 4, 4);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(x + 6, y + 9, 2, 2);
        ctx.fillRect(x + 16, y + 9, 2, 2);
    } else if (type === 'boss_goblin') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 6, y + 2, 12, 10);
        ctx.fillRect(x + 2, y + 10, 20, 14);
        ctx.fillRect(x, y + 20, 6, 6);
        ctx.fillRect(x + 18, y + 20, 6, 6);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 6, y + 6, 3, 3);
        ctx.fillRect(x + 15, y + 6, 3, 3);
    } else if (type === 'boss_orc') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 6, y, 16, 12);
        ctx.fillRect(x + 2, y + 10, 20, 16);
        ctx.fillRect(x, y + 22, 8, 8);
        ctx.fillRect(x + 16, y + 22, 8, 8);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 7, y + 5, 4, 4);
        ctx.fillRect(x + 13, y + 5, 4, 4);
    } else if (type === 'boss_mage') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 8, y, 12, 10);
        ctx.fillRect(x + 4, y + 8, 20, 16);
        ctx.fillRect(x, y + 20, 24, 6);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(x + 8, y + 3, 4, 4);
        ctx.fillRect(x + 16, y + 3, 4, 4);
        ctx.fillStyle = '#0ff';
        ctx.fillRect(x + 6, y + 12, 6, 6);
        ctx.fillRect(x + 16, y + 12, 6, 6);
    } else if (type === 'boss_dragon') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 8, y + 2, 16, 12);
        ctx.fillRect(x + 2, y + 10, 8, 8);
        ctx.fillRect(x + 22, y + 10, 8, 8);
        ctx.fillRect(x, y + 14, 10, 12);
        ctx.fillRect(x + 22, y + 14, 10, 12);
        ctx.fillRect(x + 4, y + 18, 24, 14);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(x + 10, y + 4, 4, 4);
        ctx.fillRect(x + 18, y + 4, 4, 4);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 11, y + 5, 2, 2);
        ctx.fillRect(x + 19, y + 5, 2, 2);
    } else if (type === 'boss_ice') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 6, y + 2, 16, 12);
        ctx.fillRect(x + 2, y + 10, 20, 14);
        ctx.fillRect(x - 2, y + 14, 6, 8);
        ctx.fillRect(x + 24, y + 14, 6, 8);
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 8, y + 5, 4, 4);
        ctx.fillRect(x + 16, y + 5, 4, 4);
        ctx.fillStyle = '#00f';
        ctx.fillRect(x + 9, y + 6, 2, 2);
        ctx.fillRect(x + 17, y + 6, 2, 2);
    } else if (type === 'boss_demon') {
        ctx.fillStyle = color;
        ctx.fillRect(x + 8, y, 16, 10);
        ctx.fillRect(x + 2, y + 8, 20, 14);
        ctx.fillRect(x - 2, y + 18, 6, 8);
        ctx.fillRect(x + 24, y + 18, 6, 8);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(x + 8, y + 3, 5, 5);
        ctx.fillRect(x + 17, y + 3, 5, 5);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 10, y + 5, 2, 2);
        ctx.fillRect(x + 18, y + 5, 2, 2);
    } else if (type === 'boss') {
        ctx.fillStyle = '#a22';
        ctx.fillRect(x + 8, y, 32, 16);
        ctx.fillRect(x + 4, y + 8, 40, 32);
        ctx.fillRect(x, y + 16, 8, 24);
        ctx.fillRect(x + 40, y + 16, 8, 24);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(x + 12, y + 8, 8, 8);
        ctx.fillRect(x + 28, y + 8, 8, 8);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 14, y + 10, 4, 4);
        ctx.fillRect(x + 30, y + 10, 4, 4);
    }
}

// ===== 地图绘制 =====

/**
 * 绘制地图
 * 遍历地图数组，绘制不同类型的瓦片
 */
function drawMap(ctx, map, TILE, MAP_W, MAP_H) {
    ctx.fillStyle = '#1a2a3a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const time = Date.now() / 500;
    
    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            const tile = map[y][x];
            
            if (tile === 1) {
                ctx.fillStyle = '#4a4a6a';
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                ctx.fillStyle = '#3a3a5a';
                ctx.fillRect(x * TILE, y * TILE, TILE, 4);
            } else if (tile === 4) {
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                const grassOffset = Math.sin(time + x * 0.5 + y * 0.3) * 1;
                ctx.fillStyle = '#3a7a3a';
                ctx.fillRect(x * TILE + 6, y * TILE + 12 + grassOffset, 2, 8);
                ctx.fillRect(x * TILE + 14, y * TILE + 10 + grassOffset, 2, 10);
                ctx.fillRect(x * TILE + 24, y * TILE + 14 + grassOffset, 2, 6);
                const hillType = (x * 5 + y * 7) % 4;
                const hillOffset = Math.sin(time * 0.3 + x * 0.2 + y * 0.1) * 1.5;
                const baseX = x * TILE;
                const baseY = y * TILE;
                if (hillType === 0) {
                    const grad = ctx.createLinearGradient(baseX, baseY + TILE, baseX, baseY);
                    grad.addColorStop(0, '#3a7a3a');
                    grad.addColorStop(0.5, '#4a8a4a');
                    grad.addColorStop(1, '#5a9a5a');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(baseX, baseY + TILE);
                    ctx.quadraticCurveTo(baseX + TILE * 0.5, baseY - 2 + hillOffset, baseX + TILE, baseY + TILE);
                    ctx.fill();
                    ctx.fillStyle = '#6aaa6a';
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.5, baseY + 6 + hillOffset * 0.5, 8, 4, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#7dba7d';
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.4, baseY + 4 + hillOffset * 0.3, 4, 2, 0, 0, Math.PI * 2);
                    ctx.fill();
                } else if (hillType === 1) {
                    const grad = ctx.createRadialGradient(baseX + TILE * 0.3, baseY + TILE * 0.7, 2, baseX + TILE * 0.5, baseY + TILE * 0.5, TILE * 0.7);
                    grad.addColorStop(0, '#5a9a5a');
                    grad.addColorStop(1, '#3a6a3a');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(baseX + 2, baseY + TILE);
                    ctx.quadraticCurveTo(baseX + TILE * 0.6, baseY - 4 + hillOffset, baseX + TILE - 2, baseY + TILE);
                    ctx.fill();
                    ctx.fillStyle = '#68a868';
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.55, baseY + 8 + hillOffset * 0.4, 6, 3, 0.3, 0, Math.PI * 2);
                    ctx.fill();
                } else if (hillType === 2) {
                    const grad = ctx.createLinearGradient(baseX, baseY + TILE, baseX, baseY + 4);
                    grad.addColorStop(0, '#2d6a2d');
                    grad.addColorStop(1, '#4d8a4d');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(baseX + 4, baseY + TILE);
                    ctx.quadraticCurveTo(baseX + TILE * 0.4, baseY + hillOffset, baseX + TILE - 4, baseY + TILE);
                    ctx.fill();
                    ctx.fillStyle = '#7dba7d';
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.35, baseY + 5 + hillOffset * 0.5, 5, 3, -0.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#5a9a5a';
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.6, baseY + 3 + hillOffset * 0.3, 4, 2, 0.2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillStyle = '#3a7a3a';
                    ctx.beginPath();
                    ctx.moveTo(baseX + 6, baseY + TILE);
                    ctx.quadraticCurveTo(baseX + TILE * 0.5, baseY - 6 + hillOffset, baseX + TILE - 6, baseY + TILE);
                    ctx.fill();
                    const grad2 = ctx.createLinearGradient(baseX, baseY + TILE, baseX, baseY);
                    grad2.addColorStop(0, '#4a8a4a');
                    grad2.addColorStop(1, '#6aaa6a');
                    ctx.fillStyle = grad2;
                    ctx.beginPath();
                    ctx.moveTo(baseX + 10, baseY + TILE);
                    ctx.quadraticCurveTo(baseX + TILE * 0.5, baseY - 2 + hillOffset, baseX + TILE - 10, baseY + TILE);
                    ctx.fill();
                }
            } else if (tile === 5) {
                const treeType = (x * 7 + y * 13) % 5;
                const sway = Math.sin(time * 1.5 + x * 0.7 + y * 0.5) * 1.5;
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                const grassOffset = Math.sin(time + x * 0.5 + y * 0.3) * 1;
                ctx.fillStyle = '#3a7a3a';
                ctx.fillRect(x * TILE + 4, y * TILE + 14 + grassOffset, 2, 8);
                ctx.fillRect(x * TILE + 26, y * TILE + 12 + grassOffset, 2, 10);
                if (treeType === 0) {
                    ctx.fillStyle = '#5a4030';
                    ctx.fillRect(x * TILE + 14 + sway * 0.3, y * TILE + 22, 4, 10);
                    ctx.fillStyle = '#2d5a2d';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 16 + sway, y * TILE + 14, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#3d6a3d';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 14 + sway * 0.8, y * TILE + 16, 7, 0, Math.PI * 2);
                    ctx.fill();
                } else if (treeType === 1) {
                    ctx.fillStyle = '#5a4030';
                    ctx.fillRect(x * TILE + 15 + sway * 0.2, y * TILE + 20, 3, 12);
                    const sway1 = sway * 0.8;
                    ctx.fillStyle = '#3a7a3a';
                    ctx.beginPath();
                    ctx.moveTo(x * TILE + 6 + sway1, y * TILE + 24);
                    ctx.lineTo(x * TILE + 16 + sway1, y * TILE + 4);
                    ctx.lineTo(x * TILE + 26 + sway1, y * TILE + 24);
                    ctx.fill();
                    ctx.fillStyle = '#3a6a3a';
                    ctx.beginPath();
                    ctx.moveTo(x * TILE + 8 + sway1, y * TILE + 20);
                    ctx.lineTo(x * TILE + 16 + sway1, y * TILE + 8);
                    ctx.lineTo(x * TILE + 24 + sway1, y * TILE + 20);
                    ctx.fill();
                } else if (treeType === 2) {
                    ctx.fillStyle = '#5a4030';
                    ctx.fillRect(x * TILE + 13 + sway * 0.25, y * TILE + 20, 5, 12);
                    const sway2 = sway * 0.9;
                    ctx.fillStyle = '#2e5e2e';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 16 + sway2, y * TILE + 12, 11, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#4a7a4a';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 13 + sway2 * 0.7, y * TILE + 14, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x * TILE + 20 + sway2 * 0.7, y * TILE + 13, 5, 0, Math.PI * 2);
                    ctx.fill();
                } else if (treeType === 3) {
                    ctx.fillStyle = '#4a3525';
                    ctx.fillRect(x * TILE + 15 + sway * 0.3, y * TILE + 18, 4, 14);
                    const sway3 = sway * 0.7;
                    ctx.fillStyle = '#285028';
                    ctx.beginPath();
                    ctx.moveTo(x * TILE + 4 + sway3, y * TILE + 24);
                    ctx.lineTo(x * TILE + 16 + sway3, y * TILE + 2);
                    ctx.lineTo(x * TILE + 28 + sway3, y * TILE + 24);
                    ctx.fill();
                } else {
                    ctx.fillStyle = '#5a4030';
                    ctx.fillRect(x * TILE + 14 + sway * 0.35, y * TILE + 22, 5, 10);
                    const sway4 = sway * 1.1;
                    ctx.fillStyle = '#2c5c2c';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 16 + sway4, y * TILE + 14, 9, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#3c6c3c';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 12 + sway4 * 0.6, y * TILE + 16, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x * TILE + 20 + sway4 * 0.6, y * TILE + 15, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (tile === 6) {
                const flowerType = (x * 11 + y * 17) % 6;
                const flowerSway = Math.sin(time * 2 + x * 0.5 + y * 0.3) * 2;
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                if (flowerType === 0) {
                    ctx.fillStyle = '#3a7a3a';
                    ctx.fillRect(x * TILE + 15 + flowerSway * 0.3, y * TILE + 20, 2, 10);
                    ctx.fillStyle = '#f88';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 16 + flowerSway, y * TILE + 16, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ff0';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 16 + flowerSway, y * TILE + 16, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (flowerType === 1) {
                    ctx.fillStyle = '#3a7a3a';
                    ctx.fillRect(x * TILE + 15 + flowerSway * 0.3, y * TILE + 20, 2, 10);
                    ctx.fillStyle = '#f8f';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 16 + flowerSway, y * TILE + 16, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ff0';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 16 + flowerSway, y * TILE + 16, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (flowerType === 2) {
                    ctx.fillStyle = '#3a7a3a';
                    ctx.fillRect(x * TILE + 15 + flowerSway * 0.3, y * TILE + 20, 2, 10);
                    ctx.fillStyle = '#ff8';
                } else if (flowerType === 3) {
                    ctx.fillStyle = '#3a7a3a';
                    ctx.fillRect(x * TILE + 15 + flowerSway * 0.3, y * TILE + 20, 2, 10);
                    ctx.fillStyle = '#8ff';
                } else if (flowerType === 4) {
                    ctx.fillStyle = '#3a7a3a';
                    ctx.fillRect(x * TILE + 15 + flowerSway * 0.3, y * TILE + 20, 2, 10);
                    ctx.fillStyle = '#8f8';
                } else {
                    ctx.fillStyle = '#3a7a3a';
                    ctx.fillRect(x * TILE + 15 + flowerSway * 0.3, y * TILE + 20, 2, 10);
                    ctx.fillStyle = '#8cf';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 16 + flowerSway, y * TILE + 16, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(x * TILE + 16 + flowerSway, y * TILE + 16, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (tile === 2) {
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                const grassOffset = Math.sin(time + x * 0.5 + y * 0.3) * 1;
                ctx.fillStyle = '#3a7a3a';
                ctx.fillRect(x * TILE + 6, y * TILE + 10 + grassOffset, 3, 12);
                ctx.fillRect(x * TILE + 14, y * TILE + 8 + grassOffset, 3, 14);
                ctx.fillRect(x * TILE + 24, y * TILE + 12 + grassOffset, 3, 10);
            } else if (tile === 3) {
                ctx.fillStyle = '#2a3a5a';
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                const waveOffset = Math.sin(time + x + y * 0.5) * 2;
                ctx.fillStyle = '#4a6a8a';
                ctx.fillRect(x * TILE + 4 + waveOffset, y * TILE + 8, 8, 2);
                ctx.fillRect(x * TILE + 16 - waveOffset, y * TILE + 16, 10, 2);
                ctx.fillRect(x * TILE + 8, y * TILE + 24, 6, 2);
            } else {
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                if ((x + y) % 5 === 0) {
                    ctx.fillStyle = '#3a7a3a';
                    ctx.fillRect(x * TILE + 10, y * TILE + 12, 4, 4);
                }
            }
        }
    }
}

// ===== 掉落物绘制 =====

/**
 * 绘制掉落物品
 * 显示物品图标和发光效果
 */
function drawDrops(ctx, drops) {
    drops.forEach(d => {
        if (!d.item) return;
        const glowSize = 18 + Math.sin(Date.now() / 150) * 3;
        const qualityColor = d.item.color || '#fff';
        
        const gradient = ctx.createRadialGradient(d.x, d.y + 8, 0, d.x, d.y + 8, glowSize);
        if (d.item.type === 'treasure') {
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        } else if (d.item.quality) {
            const rgb = hexToRgb(qualityColor);
            gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`);
            gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        } else {
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(d.x, d.y + 8, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(d.item.icon || '?', d.x, d.y + 16);
        ctx.strokeStyle = qualityColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(d.x - 10, d.y + 2, 20, 20);
        ctx.textAlign = 'left';
    });
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
}

// ===== 投射物绘制 =====

/**
 * 绘制投射物 (技能)
 * 火球、雷电、冰霜等
 */
function drawProjectiles(ctx, projectiles) {
    projectiles.forEach(p => {
        const color = p.color || '#fff';
        const size = p.size || 12;
        const particleColor = p.particleColor || '#fff';
        
        if (p.isLightning) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.isTornado) {
            ctx.fillStyle = color;
            ctx.beginPath();
            const time = Date.now() / 50;
            for (let i = 0; i < 3; i++) {
                const offset = Math.sin(time + i) * 8;
                ctx.arc(p.x + offset, p.y + i * 5 - 5, size - i * 2, 0, Math.PI * 2);
            }
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.isIce) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - size);
            ctx.lineTo(p.x + size, p.y + size);
            ctx.lineTo(p.x - size, p.y + size);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgba(200,240,255,0.7)';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - size/2);
            ctx.lineTo(p.x + size/2, p.y + size/2);
            ctx.lineTo(p.x - size/2, p.y + size/2);
            ctx.closePath();
            ctx.fill();
        } else if (p.isVine) {
            ctx.fillStyle = color;
            ctx.beginPath();
            const time = Date.now() / 100;
            for (let i = 0; i < 4; i++) {
                const angle = time + i * Math.PI / 2;
                const ox = Math.cos(angle) * 5;
                const oy = Math.sin(angle) * 5;
                ctx.arc(p.x + ox, p.y + oy, 4, 0, Math.PI * 2);
            }
            ctx.fill();
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.isFire) {
            const time = Date.now() / 50;
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(p.x - p.vx * 2, p.y, size * 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size * 0.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p.x - size * 0.2, p.y - size * 0.2, size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = 0.6;
            for (let i = 0; i < 3; i++) {
                const ox = Math.sin(time + i * 2) * 3;
                const oy = -size - i * 4;
                ctx.beginPath();
                ctx.moveTo(p.x + ox - 3, p.y + oy);
                ctx.lineTo(p.x + ox, p.y + oy - 8 - i * 2);
                ctx.lineTo(p.x + ox + 3, p.y + oy);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        } else {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = color + '66';
            ctx.beginPath();
            ctx.arc(p.x - p.vx * 2, p.y, size + 4, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// ===== 敌人绘制 =====

/**
 * 绘制敌人
 * 遍历敌人数组，绘制每个敌人
 */
function drawEnemies(ctx, enemies, drawPixelSpriteFn) {
    const time = Date.now();
    enemies.forEach((e, i) => {
        const breathe = Math.sin(time / 400 + i) * 1;
        const color = e.color || '#4a4';
        drawPixelSpriteFn(ctx, e.x, e.y + breathe, e.w, e.h, color, e.render || e.type, window.player);
        
        const hpPercent = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = '#300';
        ctx.fillRect(e.x, e.y - 8, e.w, 4);
        ctx.fillStyle = '#f00';
        ctx.fillRect(e.x, e.y - 8, e.w * hpPercent, 4);
    });
}

// ===== Boss 绘制 =====

/**
 * 绘制 Boss
 * 特殊外观和血条
 */
function drawBoss(ctx, boss, drawPixelSpriteFn) {
    if (!boss) return;
    drawPixelSpriteFn(ctx, boss.x, boss.y, boss.w, boss.h, boss.color || '#a22', boss.render || 'boss', window.player);
    const hpPercent = Math.max(0, boss.hp / boss.maxHp);
    ctx.fillStyle = '#300';
    ctx.fillRect(boss.x, boss.y - 16, boss.w, 8);
    ctx.fillStyle = '#f00';
    ctx.fillRect(boss.x, boss.y - 16, boss.w * hpPercent, 8);
}

// ===== 玩家攻击绘制 =====

/**
 * 绘制玩家攻击效果
 * 挥刀弧线
 */
function drawPlayerAttack(ctx, player) {
    if (player.attacking <= 0) return;
    const attackProgress = 1 - (player.attacking / 20);
    const dirX = player.dirX;
    const dirY = player.dirY;
    
    const baseX = player.x + player.w/2;
    const baseY = player.y + player.h/2;
    
    let slashColor = '#fff';
    let slashSize = 1;
    if (player.weapon) {
        if (player.weapon.sprite === 'fire_sword') { slashColor = '#f84'; slashSize = 1.5; }
        else if (player.weapon.sprite === 'thunder_sword') { slashColor = '#ff0'; slashSize = 1.3; }
        else { slashColor = '#ccc'; }
    }
    
    let attackAngle = 0;
    if (dirX > 0) attackAngle = 0;
    else if (dirX < 0) attackAngle = Math.PI;
    else if (dirY < 0) attackAngle = -Math.PI/2;
    else if (dirY > 0) attackAngle = Math.PI/2;
    
    const swingAngle = attackAngle + (attackProgress - 0.5) * Math.PI * 0.8;
    
    ctx.save();
    ctx.translate(baseX, baseY);
    
    ctx.strokeStyle = slashColor;
    ctx.lineWidth = 3 * slashSize;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, 35, attackAngle - 0.4, swingAngle);
    ctx.stroke();
    
    ctx.strokeStyle = slashColor;
    ctx.lineWidth = 6 * slashSize;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, 40, attackAngle - 0.4, swingAngle);
    ctx.stroke();
    
    const sparkX = Math.cos(swingAngle) * 38;
    const sparkY = Math.sin(swingAngle) * 38;
    
    if (player.weapon) {
        const wp = player.weapon.sprite;
        const weaponAngle = swingAngle - (dirX > 0 || (dirX === 0 && dirY >= 0) ? 0 : Math.PI);
        const wx = Math.cos(weaponAngle) * 30;
        const wy = Math.sin(weaponAngle) * 30;
        
        ctx.fillStyle = '#420';
        ctx.fillRect(wx - 3, wy - 3, 6, 6);
        
        if (wp === 'fire_sword') {
            ctx.fillStyle = '#c74';
            ctx.fillRect(wx - 2, wy - 10, 4, 14);
            ctx.fillStyle = '#f96';
            ctx.fillRect(wx - 1, wy - 8, 2, 10);
        } else if (wp === 'thunder_sword') {
            ctx.fillStyle = '#cc4';
            ctx.fillRect(wx - 2, wy - 10, 4, 14);
            ctx.fillStyle = '#fff';
            ctx.fillRect(wx - 1, wy - 8, 2, 10);
        } else {
            ctx.fillStyle = '#888';
            ctx.fillRect(wx - 2, wy - 10, 4, 14);
            ctx.fillStyle = '#ccc';
            ctx.fillRect(wx - 1, wy - 8, 2, 10);
        }
    }
    
    ctx.restore();
}

// ===== 粒子效果绘制 =====

/**
 * 绘制粒子效果
 * 血液、火花等
 */
function drawParticles(ctx, particles) {
    particles.forEach(p => {
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1;
}

// ===== 玩家绘制 =====

/**
 * 绘制玩家角色
 * 带呼吸动画和无敌闪烁
 */
function drawPlayer(ctx, player, drawPixelSpriteFn, invulnerable) {
    if (invulnerable && invulnerable % 4 < 2) return;
    const breathe = Math.sin(Date.now() / 300) * 1;
    drawPixelSpriteFn(ctx, player.x, player.y + breathe, player.w, player.h, '#fa0', 'player', player);
}

// ===== 云朵获取 =====

/**
 * 获取云朵数据
 */
function getClouds() {
    return window.clouds || clouds;
}

// ===== 云朵绘制 =====

/**
 * 绘制云朵和天气效果
 * 包括白云、乌云、闪电云
 */
function drawClouds(ctx, canvasWidth, canvasHeight, player) {
    const cloudData = getClouds();
    if (!cloudData || !cloudData.length) return;
    
    const time = Date.now() / 1000;
    cloudData.forEach(cloud => {
        cloud.x += cloud.speedX;
        cloud.y += cloud.speedY + Math.sin(time * cloud.wobbleSpeed + cloud.wobblePhase) * 0.15;
        
        if ((cloud.speedX > 0 && cloud.x > canvasWidth + cloud.size * 2) ||
            (cloud.speedX < 0 && cloud.x < -cloud.size * 2)) {
            cloud.x = cloud.speedX > 0 ? -cloud.size * 2 : canvasWidth + cloud.size * 2;
            cloud.y = 10 + Math.random() * (canvasHeight - 20);
            const rand = Math.random();
            if (rand < 0.15) cloud.type = 'storm';
            else if (rand < 0.45) cloud.type = 'dark';
            else cloud.type = 'white';
            cloud.lightningTimer = 0;
        }
        if (cloud.y < 5) cloud.y = 5;
        if (cloud.y > canvasHeight - 5) cloud.y = canvasHeight - 5;
        
        const breathe = Math.sin(time * 0.3 + cloud.phase) * 0.08 + 1;
        
        if (cloud.type === 'storm') {
            ctx.fillStyle = '#2a2a2a';
        } else if (cloud.type === 'dark') {
            ctx.fillStyle = '#5a5a6a';
        } else {
            ctx.fillStyle = '#e8e8f0';
        }
        
        const baseX = cloud.x + Math.sin(time * cloud.wobbleSpeed * 0.7 + cloud.wobblePhase) * 3;
        const baseY = cloud.y;
        const size = cloud.size;
        
        cloud.circles.forEach(c => {
            ctx.beginPath();
            ctx.arc(baseX + c.ox * size, baseY + c.oy * size, c.r * size * breathe, 0, Math.PI * 2);
            ctx.fill();
        });
        
        if (cloud.type === 'storm') {
            if (!cloud.lightningTimer) cloud.lightningTimer = 0;
            cloud.lightningTimer++;
            if (cloud.lightningTimer > 120) {
                cloud.lightningTimer = 0;
            }
            ctx.font = `${Math.floor(size * 0.55)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚡', baseX, baseY);
        }
    });
}

// ===== 伤害数字绘制 =====

/**
 * 绘制伤害数字
 * 红色伤害数字、绿色回复数字
 */
function drawDamageNumbers(ctx, damageNumbers) {
    damageNumbers.forEach(d => {
        const alpha = Math.min(1, d.life / 15);
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = d.isHeal ? '#4f4' : '#f44';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        const text = d.isHeal ? '+' + d.value : '-' + d.value;
        ctx.strokeText(text, d.x, d.y);
        ctx.fillText(text, d.x, d.y);
    });
    ctx.globalAlpha = 1;
}

// 导出 drawPixelSprite 函数供 game.js 使用
window.drawPixelSprite = drawPixelSprite;
