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
function getShadowDirection() {
    const now = Date.now();
    const dayProgress = (now % 86400000) / 86400000;
    const sunAngle = dayProgress * Math.PI * 2;
    const shadowX = Math.cos(sunAngle) * 8;
    const shadowY = Math.sin(sunAngle) * 4 + 6;
    return { x: shadowX, y: shadowY };
}

function drawBrickPattern(ctx, x, y, size, color, highlight) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    const brickH = size / 4;
    const brickW = size / 2;
    ctx.fillStyle = highlight;
    for (let row = 0; row < 4; row++) {
        const offset = (row % 2) * (brickW / 2);
        // 从0开始，避免砖块超出边界
        for (let col = 0; col < 2; col++) {
            const bx = x + offset + col * brickW;
            const by = y + row * brickH;
            // 确保砖块不会超出边界
            if (bx >= x && bx + brickW <= x + size) {
                ctx.fillRect(bx + 1, by + 1, brickW - 2, brickH - 2);
                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                ctx.fillRect(bx + brickW - 2, by + 1, 2, brickH - 2);
                ctx.fillRect(bx + 1, by + brickH - 2, brickW - 2, 2);
                ctx.fillStyle = highlight;
            }
        }
    }
}

function drawHillShadow(ctx, baseX, baseY, width, height, shadowDir) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(baseX + width/2 + shadowDir.x, baseY + height - 2 + shadowDir.y, width/2.5, height/4, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawTreeShadow(ctx, baseX, baseY, size, shadowDir) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(baseX + size/2 + shadowDir.x, baseY + size - 4 + shadowDir.y, size/2.2, size/5, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawFlowerShadow(ctx, baseX, baseY, shadowDir) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(baseX + 16 + shadowDir.x * 0.5, baseY + 28 + shadowDir.y * 0.5, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawTreeTrunk(ctx, x, y, w, h, color, sway) {
    ctx.fillStyle = color;
    ctx.fillRect(x + sway * 0.2, y, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x + sway * 0.2 + w - 2, y, 2, h);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(x + sway * 0.2, y, 2, h);
    ctx.fillStyle = '#3a2a20';
    ctx.fillRect(x + sway * 0.2 + 2, y + 2, w - 4, 2);
    ctx.fillRect(x + sway * 0.2 + 2, y + h/2, w - 4, 1);
}

function drawFoliageLayer(ctx, x, y, r, color, shadowColor, sway) {
    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.arc(x + sway + 2, y + 2, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + sway, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(x + sway - r*0.3, y - r*0.3, r*0.4, 0, Math.PI * 2);
    ctx.fill();
}

function drawFlowerPetal(ctx, x, y, size, color, centerColor, sway) {
    ctx.fillStyle = '#2a6a2a';
    ctx.fillRect(x + sway * 0.3 - 1, y, 2, 10);
    ctx.fillStyle = '#1a5a1a';
    ctx.fillRect(x + sway * 0.3 + 1, y + 2, 1, 6);
    const petalCount = 5;
    const angleStep = (Math.PI * 2) / petalCount;
    for (let i = 0; i < petalCount; i++) {
        const angle = i * angleStep + sway * 0.02;
        const px = x + Math.cos(angle) * size * 0.6 + sway;
        const py = y - 6 + Math.sin(angle) * size * 0.3;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(px, py, size * 0.35, size * 0.25, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(px + 1, py + 1, size * 0.25, size * 0.18, angle, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = centerColor;
    ctx.beginPath();
    ctx.arc(x + sway, y - 6, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(x + sway - 1, y - 7, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
}

function drawWallWithBricks(ctx, x, y, size, shadowDir) {
    const baseColor = '#5a5a7a';
    const highlightColor = '#6a6a8a';
    const shadowColor = '#3a3a5a';
    
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(x + shadowDir.x, y + shadowDir.y, size, size);
    
    drawBrickPattern(ctx, x, y, size, baseColor, highlightColor);
    
    ctx.fillStyle = '#4a4a6a';
    ctx.fillRect(x, y, size, 4);
    ctx.fillStyle = '#7a7a9a';
    ctx.fillRect(x, y + 1, size, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x, y + size - 3, size, 3);
}

function drawMap(ctx, map, TILE, MAP_W, MAP_H) {
    ctx.fillStyle = '#1a2a3a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const time = Date.now() / 500;
    const shadowDir = getShadowDirection();
    
    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            const tile = map[y][x];
            const baseX = x * TILE;
            const baseY = y * TILE;
            
            if (tile === 1) {
                drawWallWithBricks(ctx, baseX, baseY, TILE, shadowDir);
            } else if (tile === 4) {
                // 重新设计的小山 - 更自然的地形效果
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(baseX, baseY, TILE, TILE);
                
                const hillType = (x * 5 + y * 7) % 4;
                const hillSway = Math.sin(time * 0.3 + x * 0.2 + y * 0.1) * 1;
                
                // 小山阴影 - 根据太阳方向
                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                ctx.beginPath();
                ctx.ellipse(baseX + TILE/2 + shadowDir.x, baseY + TILE - 2 + shadowDir.y, TILE/2.2, TILE/5, 0, 0, Math.PI*2);
                ctx.fill();
                
                // 小山主体
                if (hillType === 0) {
                    // 圆润山丘
                    const grad = ctx.createLinearGradient(baseX, baseY + TILE, baseX, baseY - 4);
                    grad.addColorStop(0, '#1d4a1d');
                    grad.addColorStop(0.4, '#3a6a3a');
                    grad.addColorStop(0.8, '#5a9a5a');
                    grad.addColorStop(1, '#7aba7a');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(baseX, baseY + TILE);
                    ctx.quadraticCurveTo(baseX + TILE * 0.3, baseY + 4 + hillSway, baseX + TILE * 0.5, baseY - 4 + hillSway);
                    ctx.quadraticCurveTo(baseX + TILE * 0.7, baseY + 4 + hillSway, baseX + TILE, baseY + TILE);
                    ctx.fill();
                    
                    // 山丘侧面阴影
                    ctx.fillStyle = 'rgba(0,0,0,0.15)';
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.7, baseY + TILE);
                    ctx.quadraticCurveTo(baseX + TILE * 0.85, baseY + 8 + hillSway, baseX + TILE, baseY + TILE);
                    ctx.fill();
                    
                    // 山顶光照
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.5, baseY + 2 + hillSway * 0.5, 8, 4, 0, 0, Math.PI*2);
                    ctx.fill();
                    
                } else if (hillType === 1) {
                    // 陡峭山丘
                    const grad = ctx.createRadialGradient(baseX + TILE * 0.4, baseY + TILE * 0.4, 2, baseX + TILE * 0.5, baseY + TILE * 0.5, TILE * 0.6);
                    grad.addColorStop(0, '#6aba6a');
                    grad.addColorStop(0.5, '#4a8a4a');
                    grad.addColorStop(1, '#1d3a1d');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(baseX + 2, baseY + TILE);
                    ctx.lineTo(baseX + TILE * 0.35, baseY + 2 + hillSway);
                    ctx.lineTo(baseX + TILE * 0.65, baseY + 2 + hillSway);
                    ctx.lineTo(baseX + TILE - 2, baseY + TILE);
                    ctx.closePath();
                    ctx.fill();
                    
                    // 岩石纹理
                    ctx.fillStyle = '#5a8a5a';
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.5, baseY + 10 + hillSway, 4, 2, 0, 0, Math.PI*2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.4, baseY + 16 + hillSway, 3, 1.5, 0, 0, Math.PI*2);
                    ctx.fill();
                    
                } else if (hillType === 2) {
                    // 缓坡山丘
                    ctx.fillStyle = '#2d5a2d';
                    ctx.beginPath();
                    ctx.moveTo(baseX, baseY + TILE);
                    ctx.bezierCurveTo(baseX + TILE * 0.2, baseY + 12 + hillSway, baseX + TILE * 0.4, baseY + 6 + hillSway, baseX + TILE * 0.5, baseY + 4 + hillSway);
                    ctx.bezierCurveTo(baseX + TILE * 0.6, baseY + 6 + hillSway, baseX + TILE * 0.8, baseY + 12 + hillSway, baseX + TILE, baseY + TILE);
                    ctx.fill();
                    
                    // 渐变层
                    const grad = ctx.createLinearGradient(baseX, baseY + TILE, baseX, baseY + 8);
                    grad.addColorStop(0, '#3a6a3a');
                    grad.addColorStop(1, '#6aaa6a');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(baseX + 4, baseY + TILE);
                    ctx.bezierCurveTo(baseX + TILE * 0.25, baseY + 14 + hillSway, baseX + TILE * 0.45, baseY + 8 + hillSway, baseX + TILE * 0.5, baseY + 6 + hillSway);
                    ctx.bezierCurveTo(baseX + TILE * 0.55, baseY + 8 + hillSway, baseX + TILE * 0.75, baseY + 14 + hillSway, baseX + TILE - 4, baseY + TILE);
                    ctx.fill();
                    
                    // 草皮细节
                    ctx.fillStyle = '#8aca8a';
                    for (let i = 0; i < 5; i++) {
                        const gx = baseX + 8 + i * 5;
                        const gy = baseY + 20 + Math.sin(time + i) * 0.5;
                        ctx.beginPath();
                        ctx.ellipse(gx, gy, 2, 1, 0, 0, Math.PI*2);
                        ctx.fill();
                    }
                    
                } else {
                    // 双峰山丘
                    ctx.fillStyle = '#2d4a2d';
                    ctx.beginPath();
                    ctx.moveTo(baseX, baseY + TILE);
                    ctx.quadraticCurveTo(baseX + TILE * 0.25, baseY + 8 + hillSway, baseX + TILE * 0.35, baseY + 2 + hillSway);
                    ctx.quadraticCurveTo(baseX + TILE * 0.42, baseY + 10 + hillSway, baseX + TILE * 0.5, baseY + 6 + hillSway);
                    ctx.quadraticCurveTo(baseX + TILE * 0.58, baseY + 10 + hillSway, baseX + TILE * 0.65, baseY + 2 + hillSway);
                    ctx.quadraticCurveTo(baseX + TILE * 0.75, baseY + 8 + hillSway, baseX + TILE, baseY + TILE);
                    ctx.fill();
                    
                    // 高光
                    ctx.fillStyle = '#6aba6a';
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.35, baseY + 5 + hillSway, 4, 2, 0, 0, Math.PI*2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.65, baseY + 5 + hillSway, 4, 2, 0, 0, Math.PI*2);
                    ctx.fill();
                }
                
                // 山底草丛
                const grassOffset = Math.sin(time + x * 0.5) * 0.5;
                ctx.fillStyle = '#1d4a1d';
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(baseX + 4 + i * 8, baseY + TILE - 6 + grassOffset, 2, 4);
                }
            } else if (tile === 5) {
                const treeType = (x * 7 + y * 13) % 5;
                const sway = Math.sin(time * 1.5 + x * 0.7 + y * 0.5) * 1.5;
                
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(baseX, baseY, TILE, TILE);
                const grassOffset = Math.sin(time + x * 0.5 + y * 0.3) * 1;
                ctx.fillStyle = '#3a7a3a';
                ctx.fillRect(baseX + 4, baseY + 14 + grassOffset, 2, 8);
                ctx.fillRect(baseX + 26, baseY + 12 + grassOffset, 2, 10);
                
                drawTreeShadow(ctx, baseX, baseY, TILE, shadowDir);
                
                if (treeType === 0) {
                    drawTreeTrunk(ctx, baseX + 14, baseY + 20, 4, 12, '#4a3525', sway);
                    drawFoliageLayer(ctx, baseX + 16, baseY + 16, 11, '#2d6a2d', '#1d4a1d', sway);
                    drawFoliageLayer(ctx, baseX + 14, baseY + 18, 8, '#3d7a3d', '#2d5a2d', sway * 0.8);
                    drawFoliageLayer(ctx, baseX + 18, baseY + 17, 6, '#4d8a4d', '#3d6a3d', sway * 0.9);
                } else if (treeType === 1) {
                    drawTreeTrunk(ctx, baseX + 15, baseY + 18, 3, 14, '#4a3525', sway);
                    const sway1 = sway * 0.8;
                    ctx.fillStyle = '#1d4a1d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + 5 + sway1, baseY + 26);
                    ctx.lineTo(baseX + 16 + sway1, baseY + 2);
                    ctx.lineTo(baseX + 27 + sway1, baseY + 26);
                    ctx.fill();
                    ctx.fillStyle = '#2d5a2d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + 7 + sway1, baseY + 24);
                    ctx.lineTo(baseX + 16 + sway1, baseY + 6);
                    ctx.lineTo(baseX + 25 + sway1, baseY + 24);
                    ctx.fill();
                    ctx.fillStyle = '#3d6a3d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + 9 + sway1, baseY + 22);
                    ctx.lineTo(baseX + 16 + sway1, baseY + 10);
                    ctx.lineTo(baseX + 23 + sway1, baseY + 22);
                    ctx.fill();
                    ctx.fillStyle = '#4d8a4d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + 11 + sway1, baseY + 20);
                    ctx.lineTo(baseX + 16 + sway1, baseY + 14);
                    ctx.lineTo(baseX + 21 + sway1, baseY + 20);
                    ctx.fill();
                } else if (treeType === 2) {
                    drawTreeTrunk(ctx, baseX + 13, baseY + 18, 5, 14, '#4a3525', sway);
                    const sway2 = sway * 0.9;
                    drawFoliageLayer(ctx, baseX + 16, baseY + 14, 13, '#1d5a1d', '#0d3a0d', sway2);
                    drawFoliageLayer(ctx, baseX + 12, baseY + 16, 9, '#2d6a2d', '#1d4a1d', sway2 * 0.7);
                    drawFoliageLayer(ctx, baseX + 20, baseY + 15, 7, '#3d7a3d', '#2d5a2d', sway2 * 0.8);
                    drawFoliageLayer(ctx, baseX + 14, baseY + 10, 6, '#4d8a4d', '#3d6a3d', sway2 * 0.6);
                } else if (treeType === 3) {
                    drawTreeTrunk(ctx, baseX + 15, baseY + 16, 4, 16, '#3a2515', sway);
                    const sway3 = sway * 0.7;
                    ctx.fillStyle = '#0d3a0d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + 3 + sway3, baseY + 28);
                    ctx.lineTo(baseX + 16 + sway3, baseY);
                    ctx.lineTo(baseX + 29 + sway3, baseY + 28);
                    ctx.fill();
                    ctx.fillStyle = '#1d4a1d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + 5 + sway3, baseY + 26);
                    ctx.lineTo(baseX + 16 + sway3, baseY + 4);
                    ctx.lineTo(baseX + 27 + sway3, baseY + 26);
                    ctx.fill();
                    ctx.fillStyle = '#2d5a2d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + 7 + sway3, baseY + 24);
                    ctx.lineTo(baseX + 16 + sway3, baseY + 8);
                    ctx.lineTo(baseX + 25 + sway3, baseY + 24);
                    ctx.fill();
                } else {
                    drawTreeTrunk(ctx, baseX + 14, baseY + 20, 5, 12, '#4a3525', sway);
                    const sway4 = sway * 1.1;
                    drawFoliageLayer(ctx, baseX + 16, baseY + 16, 10, '#1d5a1d', '#0d3a0d', sway4);
                    drawFoliageLayer(ctx, baseX + 12, baseY + 18, 7, '#2d6a2d', '#1d4a1d', sway4 * 0.6);
                    drawFoliageLayer(ctx, baseX + 20, baseY + 17, 5, '#3d7a3d', '#2d5a2d', sway4 * 0.7);
                    drawFoliageLayer(ctx, baseX + 16, baseY + 12, 6, '#4d8a4d', '#3d6a3d', sway4 * 0.5);
                }
            } else if (tile === 6) {
                const flowerType = (x * 11 + y * 17) % 6;
                const flowerSway = Math.sin(time * 2 + x * 0.5 + y * 0.3) * 2;
                
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(baseX, baseY, TILE, TILE);
                
                drawFlowerShadow(ctx, baseX, baseY, shadowDir);
                
                if (flowerType === 0) {
                    drawFlowerPetal(ctx, baseX + 16, baseY + 20, 5, '#ff6b6b', '#ffd93d', flowerSway);
                } else if (flowerType === 1) {
                    drawFlowerPetal(ctx, baseX + 16, baseY + 20, 5, '#ff6bff', '#ffd93d', flowerSway);
                } else if (flowerType === 2) {
                    drawFlowerPetal(ctx, baseX + 16, baseY + 20, 6, '#ffd93d', '#ff8c42', flowerSway);
                } else if (flowerType === 3) {
                    drawFlowerPetal(ctx, baseX + 16, baseY + 20, 5, '#4ecdc4', '#ffd93d', flowerSway);
                } else if (flowerType === 4) {
                    drawFlowerPetal(ctx, baseX + 16, baseY + 20, 4, '#95e1d3', '#ffd93d', flowerSway);
                } else {
                    drawFlowerPetal(ctx, baseX + 16, baseY + 20, 5, '#a8e6cf', '#ff8b94', flowerSway);
                }
            } else if (tile === 2) {
                // 重新设计的草丛 - 多层草丛带动态阴影
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(baseX, baseY, TILE, TILE);
                
                // 草丛阴影
                ctx.fillStyle = 'rgba(0,0,0,0.15)';
                ctx.beginPath();
                ctx.ellipse(baseX + TILE/2 + shadowDir.x * 0.5, baseY + TILE - 2 + shadowDir.y * 0.5, TILE/2.5, TILE/6, 0, 0, Math.PI*2);
                ctx.fill();
                
                const grassType = (x * 3 + y * 5) % 4;
                const grassSway = Math.sin(time * 1.2 + x * 0.4 + y * 0.6) * 1.5;
                
                // 草丛底座
                ctx.fillStyle = '#2d5a2d';
                ctx.beginPath();
                ctx.ellipse(baseX + TILE/2, baseY + TILE - 4, TILE/2.2, TILE/5, 0, 0, Math.PI*2);
                ctx.fill();
                
                // 绘制多层草叶
                const drawGrassBlade = (gx, gy, gw, gh, angle, color) => {
                    ctx.fillStyle = color;
                    ctx.save();
                    ctx.translate(gx, gy + gh);
                    ctx.rotate(angle + grassSway * 0.02);
                    ctx.beginPath();
                    ctx.moveTo(-gw/2, 0);
                    ctx.quadraticCurveTo(0, -gh/2, 0, -gh);
                    ctx.quadraticCurveTo(0, -gh/2, gw/2, 0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                };
                
                if (grassType === 0) {
                    // 三叶草型
                    drawGrassBlade(baseX + 8, baseY + 16, 4, 12, -0.3, '#4a8a4a');
                    drawGrassBlade(baseX + 16, baseY + 18, 4, 14, 0, '#3d7a3d');
                    drawGrassBlade(baseX + 24, baseY + 16, 4, 10, 0.3, '#4a8a4a');
                    drawGrassBlade(baseX + 12, baseY + 20, 3, 8, -0.5, '#5a9a5a');
                    drawGrassBlade(baseX + 20, baseY + 19, 3, 9, 0.4, '#5a9a5a');
                } else if (grassType === 1) {
                    // 茂密型
                    for (let i = 0; i < 7; i++) {
                        const gx = baseX + 6 + (i % 4) * 7 + Math.sin(time + i) * 0.5;
                        const gy = baseY + 14 + Math.floor(i / 4) * 6;
                        const gh = 10 + Math.sin(time * 0.8 + i * 0.5) * 3;
                        const angle = (i % 2 === 0 ? -0.2 : 0.2) + grassSway * 0.015;
                        drawGrassBlade(gx, gy, 3, gh, angle, i % 3 === 0 ? '#5a9a5a' : '#4a8a4a');
                    }
                } else if (grassType === 2) {
                    // 芦苇型
                    for (let i = 0; i < 5; i++) {
                        const gx = baseX + 10 + i * 3;
                        const gy = baseY + 16 + i * 2;
                        const gh = 14 + i;
                        drawGrassBlade(gx, gy, 2, gh, (i - 2) * 0.15 + grassSway * 0.02, i % 2 === 0 ? '#6aaa6a' : '#4a8a4a');
                    }
                } else {
                    // 扇形
                    drawGrassBlade(baseX + 10, baseY + 18, 3, 12, -0.6, '#4a8a4a');
                    drawGrassBlade(baseX + 14, baseY + 20, 3, 10, -0.3, '#5a9a5a');
                    drawGrassBlade(baseX + 18, baseY + 20, 3, 10, 0, '#6aaa6a');
                    drawGrassBlade(baseX + 22, baseY + 18, 3, 12, 0.3, '#5a9a5a');
                    drawGrassBlade(baseX + 26, baseY + 16, 3, 14, 0.6, '#4a8a4a');
                }
                
                // 草叶高光
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.beginPath();
                ctx.ellipse(baseX + TILE/2, baseY + TILE - 8, 4, 2, 0, 0, Math.PI*2);
                ctx.fill();
            } else if (tile === 3) {
                // 重新设计的水域 - 波光粼粼效果
                // 基础水色渐变
                const waterGrad = ctx.createLinearGradient(baseX, baseY, baseX, baseY + TILE);
                waterGrad.addColorStop(0, '#1a3a5a');
                waterGrad.addColorStop(0.5, '#2a4a6a');
                waterGrad.addColorStop(1, '#1a3a5a');
                ctx.fillStyle = waterGrad;
                ctx.fillRect(baseX, baseY, TILE, TILE);
                
                // 多层波纹动画
                const waveTime = Date.now() / 800;
                const waveColors = ['#3a6a9a', '#4a7aaa', '#5a8aba'];
                
                for (let i = 0; i < 3; i++) {
                    const waveY = baseY + 8 + i * 9;
                    const waveOffset = Math.sin(waveTime + x * 0.5 + y * 0.3 + i) * 4;
                    const waveWidth = 10 + Math.sin(waveTime * 0.7 + i) * 3;
                    const waveX = baseX + 6 + waveOffset + i * 3;
                    
                    ctx.fillStyle = waveColors[i];
                    ctx.globalAlpha = 0.6 + Math.sin(waveTime * 2 + i) * 0.3;
                    
                    // 波浪形状
                    ctx.beginPath();
                    ctx.moveTo(waveX, waveY);
                    ctx.quadraticCurveTo(waveX + waveWidth/2, waveY - 2, waveX + waveWidth, waveY);
                    ctx.quadraticCurveTo(waveX + waveWidth/2, waveY + 2, waveX, waveY);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                
                // 高光反射
                const shineTime = Date.now() / 1200;
                const shineOffset = Math.sin(shineTime + x * 0.3 + y * 0.2) * 8;
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.beginPath();
                ctx.ellipse(baseX + TILE/2 + shineOffset, baseY + TILE/2, 6, 3, 0, 0, Math.PI*2);
                ctx.fill();
                
                // 小水花
                const splashTime = Date.now() / 600;
                const splashX = baseX + 10 + Math.sin(splashTime + x) * 6;
                const splashY = baseY + 20 + Math.cos(splashTime * 0.8 + y) * 4;
                ctx.fillStyle = 'rgba(200,230,255,0.3)';
                ctx.beginPath();
                ctx.arc(splashX, splashY, 2, 0, Math.PI*2);
                ctx.fill();
                
            } else if (tile === 7) {
                // 新石头堆类型
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(baseX, baseY, TILE, TILE);
                window.drawStonePile(ctx, baseX, baseY, TILE, shadowDir, x, y);
            } else {
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(baseX, baseY, TILE, TILE);
                if ((x + y) % 5 === 0) {
                    ctx.fillStyle = '#3a7a3a';
                    ctx.fillRect(baseX + 10, baseY + 12, 4, 4);
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
        
        // 使用像素渲染装备图标
        if (window.renderEquipmentIcon && ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'].includes(d.item.type)) {
            const itemCanvas = window.renderEquipmentIcon(d.item, 20);
            ctx.drawImage(itemCanvas, d.x - 10, d.y + 4, 20, 20);
        } else {
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(d.item.icon || '?', d.x, d.y + 16);
        }
        
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
            // 雷电 - 与图标一致的锯齿状闪电
            ctx.save();
            
            // 发光效果
            ctx.shadowColor = p.glowColor || '#0ff';
            ctx.shadowBlur = 15;
            
            // 主闪电
            ctx.strokeStyle = p.boltColor || '#ff0';
            ctx.lineWidth = 4;
            ctx.lineJoin = 'miter';
            ctx.beginPath();
            ctx.moveTo(p.x - p.vx * 0.3, p.y - p.vy * 0.3);
            ctx.lineTo(p.x + Math.sin(Date.now() / 50) * 3, p.y - 5);
            ctx.lineTo(p.x - Math.sin(Date.now() / 50 + 1) * 3, p.y + 3);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            
            // 核心闪电
            ctx.strokeStyle = p.coreColor || '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p.x - p.vx * 0.2, p.y - p.vy * 0.2);
            ctx.lineTo(p.x, p.y - 3);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            
            // 分支闪电
            ctx.strokeStyle = 'rgba(255,255,0,0.6)';
            ctx.lineWidth = 1;
            const branches = 3;
            for (let i = 0; i < branches; i++) {
                const angle = (Date.now() / 30) + i * Math.PI * 2 / branches;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + Math.cos(angle) * 8, p.y + Math.sin(angle) * 8);
                ctx.stroke();
            }
            
            ctx.restore();
            
        } else if (p.isTornado) {
            // 龙卷 - 与图标一致的螺旋旋风
            const time = Date.now() / 100;
            
            for (let i = 0; i < 6; i++) {
                const y = p.y - size * 0.8 + i * size * 0.35;
                const rx = size * (0.3 + i * 0.1);
                const rotation = time + i * 0.8;
                
                ctx.save();
                ctx.translate(p.x, y);
                ctx.rotate(rotation);
                
                ctx.fillStyle = i % 2 === 0 ? (p.midColor || '#aaa') : (p.coreColor || '#ccc');
                ctx.globalAlpha = 0.7 + i * 0.05;
                ctx.beginPath();
                ctx.ellipse(0, 0, rx, size * 0.15, 0, 0, Math.PI*2);
                ctx.fill();
                
                ctx.restore();
            }
            
            ctx.globalAlpha = 1;
            
            // debris 碎片
            ctx.fillStyle = p.debrisColor || '#666';
            for (let i = 0; i < 5; i++) {
                const angle = time * 3 + i * Math.PI * 2 / 5;
                const dist = size * (0.4 + Math.sin(time + i) * 0.2);
                const dx = p.x + Math.cos(angle) * dist;
                const dy = p.y + Math.sin(angle) * dist * 0.3;
                ctx.beginPath();
                ctx.arc(dx, dy, size * 0.08, 0, Math.PI*2);
                ctx.fill();
            }
            
        } else if (p.isIce) {
            // 冰霜 - 与图标一致的六边形雪花
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(Date.now() / 200);
            
            // 发光效果
            ctx.shadowColor = p.glowColor || '#cef';
            ctx.shadowBlur = 10;
            
            // 六边形雪花臂
            ctx.fillStyle = p.edgeColor || '#0cf';
            for (let i = 0; i < 6; i++) {
                ctx.save();
                ctx.rotate(i * Math.PI / 3);
                
                ctx.beginPath();
                ctx.moveTo(0, -size * 0.1);
                ctx.lineTo(size * 0.15, -size * 0.5);
                ctx.lineTo(size * 0.08, -size * 0.55);
                ctx.lineTo(0, -size * 0.15);
                ctx.lineTo(-size * 0.08, -size * 0.55);
                ctx.lineTo(-size * 0.15, -size * 0.5);
                ctx.closePath();
                ctx.fill();
                
                ctx.restore();
            }
            
            // 中心水晶
            ctx.fillStyle = p.crystalColor || '#8ef';
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = i * Math.PI / 3;
                const r = size * 0.25;
                ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
            ctx.closePath();
            ctx.fill();
            
            // 核心
            ctx.fillStyle = p.coreColor || '#fff';
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.12, 0, Math.PI*2);
            ctx.fill();
            
            ctx.restore();
            
        } else if (p.isVine) {
            // 藤蔓 - 与图标一致的带叶藤蔓
            ctx.save();
            
            const time = Date.now() / 150;
            
            // 主藤蔓茎
            ctx.strokeStyle = p.stemColor || '#2a1';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(p.x - p.vx * 0.3, p.y - p.vy * 0.3);
            ctx.quadraticCurveTo(
                p.x + Math.sin(time) * 3, 
                p.y + Math.cos(time) * 3,
                p.x, p.y
            );
            ctx.stroke();
            
            // 藤蔓叶子
            ctx.fillStyle = p.leafColor || '#4f4';
            const leaves = 4;
            for (let i = 0; i < leaves; i++) {
                const angle = time + i * Math.PI * 2 / leaves;
                const dist = size * (0.3 + i * 0.15);
                const lx = p.x + Math.cos(angle) * dist;
                const ly = p.y + Math.sin(angle) * dist * 0.5;
                
                ctx.save();
                ctx.translate(lx, ly);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.ellipse(0, 0, size * 0.25, size * 0.12, 0, 0, Math.PI*2);
                ctx.fill();
                ctx.restore();
            }
            
            // 小叶子装饰
            ctx.fillStyle = p.thornColor || '#8f8';
            ctx.beginPath();
            ctx.ellipse(p.x - size * 0.1, p.y + size * 0.1, size * 0.1, size * 0.06, Math.PI/2, 0, Math.PI*2);
            ctx.fill();
            
            ctx.restore();
        } else if (p.isFire) {
            // 火球 - 与图标一致的多层火焰效果
            const time = Date.now() / 100;
            
            // 外发光
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 1.5);
            gradient.addColorStop(0, p.coreColor || '#ff0');
            gradient.addColorStop(0.3, p.innerColor || '#f80');
            gradient.addColorStop(0.6, p.outerColor || '#f00');
            gradient.addColorStop(1, 'rgba(255,0,0,0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // 内核
            ctx.fillStyle = p.innerColor || '#f80';
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // 核心
            ctx.fillStyle = p.coreColor || '#ff0';
            ctx.beginPath();
            ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            // 高光
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p.x - size * 0.2, p.y - size * 0.2, size * 0.25, 0, Math.PI * 2);
            ctx.fill();
            
            // 火焰粒子拖尾
            ctx.fillStyle = p.glowColor || '#f40';
            ctx.globalAlpha = 0.7;
            for (let i = 0; i < 4; i++) {
                const angle = time + i * Math.PI / 2;
                const dist = size * (0.8 + i * 0.3);
                const px = p.x - p.vx * (i + 1) * 0.3 + Math.cos(angle) * 3;
                const py = p.y - p.vy * (i + 1) * 0.3 + Math.sin(angle) * 3;
                ctx.beginPath();
                ctx.arc(px, py, size * (0.4 - i * 0.08), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            
        } else {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// ===== 敌人绘制 =====

/**
 * 绘制敌人
 * 遍历敌人数组，绘制每个敌人
 */
function drawCharacterShadow(ctx, x, y, w, h, shadowDir) {
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(x + w/2 + shadowDir.x, y + h - 4 + shadowDir.y, w/2.5, h/5, 0, 0, Math.PI*2);
    ctx.fill();
}

function drawEnemies(ctx, enemies, drawPixelSpriteFn) {
    const time = Date.now();
    const shadowDir = getShadowDirection();
    enemies.forEach((e, i) => {
        const breathe = Math.sin(time / 400 + i) * 1;
        
        drawCharacterShadow(ctx, e.x, e.y + breathe, e.w, e.h, shadowDir);
        
        if (window.renderEnemyIcon && window.getEnemyByType) {
            const enemyType = window.getEnemyByType(e.type);
            if (enemyType) {
                try {
                    const iconCanvas = window.renderEnemyIcon(enemyType, e.w);
                    if (iconCanvas && iconCanvas.tagName === 'CANVAS') {
                        ctx.drawImage(iconCanvas, e.x, e.y + breathe, e.w, e.h);
                    } else {
                        throw new Error('Invalid canvas');
                    }
                } catch (err) {
                    const color = e.color || '#4a4';
                    drawPixelSpriteFn(ctx, e.x, e.y + breathe, e.w, e.h, color, e.render || e.type, window.player);
                }
            } else {
                const color = e.color || '#4a4';
                drawPixelSpriteFn(ctx, e.x, e.y + breathe, e.w, e.h, color, e.render || e.type, window.player);
            }
        } else {
            const color = e.color || '#4a4';
            drawPixelSpriteFn(ctx, e.x, e.y + breathe, e.w, e.h, color, e.render || e.type, window.player);
        }
        
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
    const time = Date.now();
    const breathe = Math.sin(time / 400 + 100) * 2;
    const shadowDir = getShadowDirection();
    
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(boss.x + boss.w/2 + shadowDir.x, boss.y + boss.h - 6 + breathe + shadowDir.y, boss.w/2.2, boss.h/4, 0, 0, Math.PI*2);
    ctx.fill();
    
    if (window.renderEnemyIcon) {
        try {
            const bossType = { 
                render: boss.render, 
                color: boss.color || '#a22',
                type: 'boss'
            };
            const iconCanvas = window.renderEnemyIcon(bossType, boss.w);
            if (iconCanvas && iconCanvas.tagName === 'CANVAS') {
                ctx.drawImage(iconCanvas, boss.x, boss.y + breathe, boss.w, boss.h);
            } else {
                throw new Error('Invalid canvas');
            }
        } catch (err) {
            drawPixelSpriteFn(ctx, boss.x, boss.y + breathe, boss.w, boss.h, boss.color || '#a22', boss.render || 'boss', window.player);
        }
    } else {
        drawPixelSpriteFn(ctx, boss.x, boss.y + breathe, boss.w, boss.h, boss.color || '#a22', boss.render || 'boss', window.player);
    }
    
    const hpPercent = Math.min(1, Math.max(0, boss.hp / boss.maxHp));
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
    const shadowDir = getShadowDirection();
    
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(player.x + player.w/2 + shadowDir.x, player.y + player.h - 4 + breathe + shadowDir.y, player.w/2.5, player.h/5, 0, 0, Math.PI*2);
    ctx.fill();
    
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
    const shadowDir = getShadowDirection();
    
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
        
        const baseX = cloud.x + Math.sin(time * cloud.wobbleSpeed * 0.7 + cloud.wobblePhase) * 3;
        const baseY = cloud.y;
        const size = cloud.size;
        
        // 云朵主体
        if (cloud.type === 'storm') {
            ctx.fillStyle = '#2a2a2a';
        } else if (cloud.type === 'dark') {
            ctx.fillStyle = '#5a5a6a';
        } else {
            ctx.fillStyle = '#e8e8f0';
        }
        
        // 绘制云朵阴影 - 在云朵底部形成阴影效果
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        cloud.circles.forEach((c, i) => {
            if (c.oy > 0) { // 只在云朵下半部分画阴影
                ctx.beginPath();
                ctx.arc(baseX + c.ox * size + shadowDir.x * 0.3, 
                       baseY + c.oy * size + 4 + shadowDir.y * 0.3, 
                       c.r * size * breathe * 0.9, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // 绘制云朵本体 - 分层渲染增加立体感
        cloud.circles.forEach((c, i) => {
            // 底层阴影
            ctx.fillStyle = cloud.type === 'storm' ? '#1a1a1a' : 
                          cloud.type === 'dark' ? '#3a3a4a' : '#c8c8d0';
            ctx.beginPath();
            ctx.arc(baseX + c.ox * size + 2, baseY + c.oy * size + 2, c.r * size * breathe * 0.95, 0, Math.PI * 2);
            ctx.fill();
        });
        
        cloud.circles.forEach((c, i) => {
            // 主体
            ctx.fillStyle = cloud.type === 'storm' ? '#2a2a2a' : 
                          cloud.type === 'dark' ? '#5a5a6a' : '#e8e8f0';
            ctx.beginPath();
            ctx.arc(baseX + c.ox * size, baseY + c.oy * size, c.r * size * breathe, 0, Math.PI * 2);
            ctx.fill();
            
            // 高光（只在白云上）
            if (cloud.type === 'white') {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.beginPath();
                ctx.arc(baseX + c.ox * size - c.r * size * 0.3, baseY + c.oy * size - c.r * size * 0.3, 
                       c.r * size * breathe * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // 雷电云逻辑
        if (cloud.type === 'storm') {
            if (!cloud.lightningTimer) cloud.lightningTimer = 0;
            cloud.lightningTimer++;
            if (cloud.lightningTimer > 120) {
                cloud.lightningTimer = 0;
            }
            
            // 雷电伤害
            if (cloud.lightningTimer >= 60 && cloud.lightningTimer % 25 === 0) {
                const cloudCenterX = cloud.x;
                const cloudCenterY = cloud.y + cloud.size * 0.5;
                
                const playerCenterX = player.x + player.w / 2;
                const playerCenterY = player.y + player.h / 2;
                const dx = playerCenterX - cloudCenterX;
                const dy = playerCenterY - cloudCenterY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // 对玩家造成伤害
                if (dist < 60 && player.invulnerable <= 0) {
                    const dmg = Math.max(1, 25 + Math.floor(Math.random() * 15) - player.def);
                    player.hp -= dmg;
                    player.invulnerable = 20;
                    damageFlash = 8;
                    spawnParticles(playerCenterX, playerCenterY, '#ff0', 8);
                    spawnDamageNumber(playerCenterX, playerCenterY, dmg);
                    
                    if (player.hp <= 0) {
                        gameState = 'gameover';
                    }
                }
                
                // 对怪物造成伤害 - 通过自定义事件通知游戏逻辑
                if (window.triggerCloudDamage) {
                    window.triggerCloudDamage(cloudCenterX, cloudCenterY);
                }
            }
            
            // 显示闪电图标
            ctx.font = `${Math.floor(size * 0.55)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (cloud.lightningTimer >= 60 && cloud.lightningTimer <= 90) {
                ctx.fillText('⚡', baseX, baseY);
            }
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
