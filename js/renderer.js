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
    const TILE = window.TILE || 32;
    ctx.beginPath();
    ctx.ellipse(baseX + TILE * 0.5 + shadowDir.x * 0.5, baseY + TILE * 0.88 + shadowDir.y * 0.5, TILE * 0.19, TILE * 0.09, 0, 0, Math.PI * 2);
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

function drawWallWithBricks(ctx, x, y, size) {
    const baseColor = '#5a5a7a';
    const highlightColor = '#6a6a8a';
    const shadowColor = '#3a3a5a';
    
    drawBrickPattern(ctx, x, y, size, baseColor, highlightColor);
    
    ctx.fillStyle = '#4a4a6a';
    ctx.fillRect(x, y, size, 4);
    ctx.fillStyle = '#7a7a9a';
    ctx.fillRect(x, y + 1, size, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x, y + size - 3, size, 3);
}

function drawMap(ctx, map, TILE, MAP_W, MAP_H) {
    // 确保地图数据有效
    if (!map || !map.length || !map[0] || MAP_W <= 0 || MAP_H <= 0 || TILE <= 0) {
        return;
    }
    
    // 使用逻辑尺寸绘制背景
    const logicalWidth = MAP_W * TILE;
    const logicalHeight = MAP_H * TILE;
    
    // 绘制背景（使用逻辑尺寸）
    ctx.fillStyle = '#1a2a3a';
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);
    
    const time = Date.now() / 500;
    const shadowDir = getShadowDirection();
    
    for (let y = 0; y < MAP_H; y++) {
        if (!map[y]) continue;
        for (let x = 0; x < MAP_W; x++) {
            const tile = map[y][x];
            const baseX = x * TILE;
            const baseY = y * TILE;
            
            if (tile === 1) {
                drawWallWithBricks(ctx, baseX, baseY, TILE);
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
                    const grad = ctx.createLinearGradient(baseX, baseY + TILE, baseX, baseY - TILE * 0.12);
                    grad.addColorStop(0, '#1d4a1d');
                    grad.addColorStop(0.4, '#3a6a3a');
                    grad.addColorStop(0.8, '#5a9a5a');
                    grad.addColorStop(1, '#7aba7a');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(baseX, baseY + TILE);
                    ctx.quadraticCurveTo(baseX + TILE * 0.3, baseY + TILE * 0.12 + hillSway, baseX + TILE * 0.5, baseY - TILE * 0.12 + hillSway);
                    ctx.quadraticCurveTo(baseX + TILE * 0.7, baseY + TILE * 0.12 + hillSway, baseX + TILE, baseY + TILE);
                    ctx.fill();
                    
                    // 山丘侧面阴影
                    ctx.fillStyle = 'rgba(0,0,0,0.15)';
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.7, baseY + TILE);
                    ctx.quadraticCurveTo(baseX + TILE * 0.85, baseY + TILE * 0.25 + hillSway, baseX + TILE, baseY + TILE);
                    ctx.fill();
                    
                    // 山顶光照
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.5, baseY + TILE * 0.06 + hillSway * 0.5, TILE * 0.25, TILE * 0.12, 0, 0, Math.PI*2);
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
                    ctx.ellipse(baseX + TILE * 0.5, baseY + TILE * 0.31 + hillSway, TILE * 0.125, TILE * 0.06, 0, 0, Math.PI*2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(baseX + TILE * 0.4, baseY + TILE * 0.5 + hillSway, TILE * 0.09, TILE * 0.05, 0, 0, Math.PI*2);
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
                        const gx = baseX + TILE * 0.25 + i * TILE * 0.16;
                        const gy = baseY + TILE * 0.62 + Math.sin(time + i) * 0.5;
                        ctx.beginPath();
                        ctx.ellipse(gx, gy, TILE * 0.06, TILE * 0.03, 0, 0, Math.PI*2);
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
                    ctx.fillRect(baseX + TILE * 0.12 + i * TILE * 0.25, baseY + TILE - TILE * 0.19 + grassOffset, TILE * 0.06, TILE * 0.12);
                }
            } else if (tile === 5) {
                const treeType = (x * 7 + y * 13) % 7;
                const sway = Math.sin(time * 1.5 + x * 0.7 + y * 0.5) * (TILE / 24);
                
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(baseX, baseY, TILE, TILE);
                
                // 根据TILE大小动态计算偏移量
                const treeScale = TILE / 32;
                const trunkX = baseX + TILE * 0.45;
                const trunkY = baseY + TILE * 0.6;
                const foliageX = baseX + TILE * 0.5;
                const foliageY = baseY + TILE * 0.45;
                const foliageSize = TILE * 0.4;
                
                drawTreeShadow(ctx, baseX, baseY, TILE, shadowDir);
                
                if (treeType === 0) {
                    // 圆形树冠树
                    drawTreeTrunk(ctx, trunkX - 2 * treeScale, trunkY, 4 * treeScale, 12 * treeScale, '#4a3525', sway);
                    drawFoliageLayer(ctx, foliageX, foliageY, 11 * treeScale, '#2d6a2d', '#1d4a1d', sway);
                    drawFoliageLayer(ctx, foliageX - 2 * treeScale, foliageY + 2 * treeScale, 8 * treeScale, '#3d7a3d', '#2d5a2d', sway * 0.8);
                    drawFoliageLayer(ctx, foliageX + 2 * treeScale, foliageY + 1 * treeScale, 6 * treeScale, '#4d8a4d', '#3d6a3d', sway * 0.9);
                } else if (treeType === 1) {
                    // 三角形松树
                    const sway1 = sway * 0.8;
                    const treeScale = TILE / 32;
                    ctx.fillStyle = '#1d4a1d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.15 + sway1, baseY + TILE);
                    ctx.lineTo(baseX + TILE * 0.5 + sway1, baseY + TILE * 0.1);
                    ctx.lineTo(baseX + TILE * 0.85 + sway1, baseY + TILE);
                    ctx.fill();
                    ctx.fillStyle = '#2d5a2d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.2 + sway1, baseY + TILE * 0.95);
                    ctx.lineTo(baseX + TILE * 0.5 + sway1, baseY + TILE * 0.2);
                    ctx.lineTo(baseX + TILE * 0.8 + sway1, baseY + TILE * 0.95);
                    ctx.fill();
                    ctx.fillStyle = '#3d6a3d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.28 + sway1, baseY + TILE * 0.85);
                    ctx.lineTo(baseX + TILE * 0.5 + sway1, baseY + TILE * 0.35);
                    ctx.lineTo(baseX + TILE * 0.72 + sway1, baseY + TILE * 0.85);
                    ctx.fill();
                    ctx.fillStyle = '#4d8a4d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.35 + sway1, baseY + TILE * 0.75);
                    ctx.lineTo(baseX + TILE * 0.5 + sway1, baseY + TILE * 0.5);
                    ctx.lineTo(baseX + TILE * 0.65 + sway1, baseY + TILE * 0.75);
                    ctx.fill();
                } else if (treeType === 2) {
                    // 多层圆形树
                    const treeScale = TILE / 32;
                    drawTreeTrunk(ctx, baseX + TILE * 0.4, baseY + TILE * 0.55, 5 * treeScale, 14 * treeScale, '#4a3525', sway);
                    const sway2 = sway * 0.9;
                    drawFoliageLayer(ctx, baseX + TILE * 0.5, baseY + TILE * 0.4, 13 * treeScale, '#1d5a1d', '#0d3a0d', sway2);
                    drawFoliageLayer(ctx, baseX + TILE * 0.35, baseY + TILE * 0.45, 9 * treeScale, '#2d6a2d', '#1d4a1d', sway2 * 0.7);
                    drawFoliageLayer(ctx, baseX + TILE * 0.6, baseY + TILE * 0.42, 7 * treeScale, '#3d7a3d', '#2d5a2d', sway2 * 0.8);
                    drawFoliageLayer(ctx, baseX + TILE * 0.42, baseY + TILE * 0.25, 6 * treeScale, '#4d8a4d', '#3d6a3d', sway2 * 0.6);
                } else if (treeType === 3) {
                    // 尖顶树
                    const treeScale = TILE / 32;
                    drawTreeTrunk(ctx, baseX + TILE * 0.45, baseY + TILE * 0.45, 4 * treeScale, 16 * treeScale, '#3a2515', sway);
                    const sway3 = sway * 0.7;
                    ctx.fillStyle = '#0d3a0d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.1 + sway3, baseY + TILE);
                    ctx.lineTo(baseX + TILE * 0.5 + sway3, baseY);
                    ctx.lineTo(baseX + TILE * 0.9 + sway3, baseY + TILE);
                    ctx.fill();
                    ctx.fillStyle = '#1d4a1d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.15 + sway3, baseY + TILE * 0.95);
                    ctx.lineTo(baseX + TILE * 0.5 + sway3, baseY + TILE * 0.1);
                    ctx.lineTo(baseX + TILE * 0.85 + sway3, baseY + TILE * 0.95);
                    ctx.fill();
                    ctx.fillStyle = '#2d5a2d';
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.2 + sway3, baseY + TILE * 0.9);
                    ctx.lineTo(baseX + TILE * 0.5 + sway3, baseY + TILE * 0.2);
                    ctx.lineTo(baseX + TILE * 0.8 + sway3, baseY + TILE * 0.9);
                    ctx.fill();
                } else if (treeType === 4) {
                    // 三角形枫叶树
                    const treeScale = TILE / 32;
                    const trunkX = baseX + TILE * 0.48;
                    const trunkY = baseY + TILE * 0.7;
                    drawTreeTrunk(ctx, trunkX, trunkY, 4 * treeScale, 12 * treeScale, '#5a3a25', sway);
                    const sway4 = sway * 0.8;
                    
                    // 枫叶树冠 - 红色/橙色渐变三角形
                    const grad = ctx.createLinearGradient(baseX + TILE * 0.5, baseY + TILE * 0.1, baseX + TILE * 0.5, baseY + TILE * 0.7);
                    grad.addColorStop(0, '#f64');
                    grad.addColorStop(0.5, '#d42');
                    grad.addColorStop(1, '#a31');
                    
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.5 + sway4, baseY + TILE * 0.1);
                    ctx.lineTo(baseX + TILE * 0.15 + sway4 * 0.5, baseY + TILE * 0.7);
                    ctx.lineTo(baseX + TILE * 0.85 + sway4 * 0.5, baseY + TILE * 0.7);
                    ctx.closePath();
                    ctx.fill();
                    
                    // 枫叶高光
                    ctx.fillStyle = 'rgba(255,200,100,0.3)';
                    ctx.beginPath();
                    ctx.moveTo(baseX + TILE * 0.5 + sway4, baseY + TILE * 0.2);
                    ctx.lineTo(baseX + TILE * 0.3 + sway4 * 0.5, baseY + TILE * 0.55);
                    ctx.lineTo(baseX + TILE * 0.7 + sway4 * 0.5, baseY + TILE * 0.55);
                    ctx.closePath();
                    ctx.fill();
                } else if (treeType === 5) {
                    // 柳树 - 下垂枝条
                    const treeScale = TILE / 32;
                    drawTreeTrunk(ctx, baseX + TILE * 0.48, baseY + TILE * 0.5, 5 * treeScale, 18 * treeScale, '#4a3525', sway);
                    const sway5 = sway * 0.6;
                    
                    // 下垂的柳条
                    for (let i = 0; i < 7; i++) {
                        const startX = baseX + TILE * 0.2 + i * TILE * 0.1;
                        const startY = baseY + TILE * 0.35;
                        const length = 8 + i * 2;
                        ctx.strokeStyle = i % 2 === 0 ? '#3d7a3d' : '#4d9a4d';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(startX + sway5, startY);
                        ctx.quadraticCurveTo(startX + sway5 * 1.5, startY + length * 0.5, startX + sway5 * 2, startY + length);
                        ctx.stroke();
                    }
                } else {
                    // 阔叶树
                    const treeScale = TILE / 32;
                    drawTreeTrunk(ctx, baseX + TILE * 0.42, baseY + TILE * 0.6, 5 * treeScale, 12 * treeScale, '#4a3525', sway);
                    const sway6 = sway * 1.1;
                    drawFoliageLayer(ctx, baseX + TILE * 0.48, baseY + TILE * 0.45, 10 * treeScale, '#1d5a1d', '#0d3a0d', sway6);
                    drawFoliageLayer(ctx, baseX + TILE * 0.35, baseY + TILE * 0.5, 7 * treeScale, '#2d6a2d', '#1d4a1d', sway6 * 0.6);
                    drawFoliageLayer(ctx, baseX + TILE * 0.58, baseY + TILE * 0.47, 5 * treeScale, '#3d7a3d', '#2d5a2d', sway6 * 0.7);
                    drawFoliageLayer(ctx, baseX + TILE * 0.48, baseY + TILE * 0.32, 6 * treeScale, '#4d8a4d', '#3d6a3d', sway6 * 0.5);
                }
            } else if (tile === 6) {
                const flowerType = (x * 11 + y * 17) % 6;
                const flowerSway = Math.sin(time * 2 + x * 0.5 + y * 0.3) * (TILE / 16);
                
                ctx.fillStyle = GROUND_COLOR;
                ctx.fillRect(baseX, baseY, TILE, TILE);
                
                drawFlowerShadow(ctx, baseX, baseY, shadowDir);
                
                // 使用TILE相对位置
                const flowerX = baseX + TILE * 0.5;
                const flowerY = baseY + TILE * 0.65;
                const flowerSize = TILE * 0.16;
                
                if (flowerType === 0) {
                    drawFlowerPetal(ctx, flowerX, flowerY, flowerSize, '#ff6b6b', '#ffd93d', flowerSway);
                } else if (flowerType === 1) {
                    drawFlowerPetal(ctx, flowerX, flowerY, flowerSize, '#ff6bff', '#ffd93d', flowerSway);
                } else if (flowerType === 2) {
                    drawFlowerPetal(ctx, flowerX, flowerY, flowerSize * 1.2, '#ffd93d', '#ff8c42', flowerSway);
                } else if (flowerType === 3) {
                    drawFlowerPetal(ctx, flowerX, flowerY, flowerSize, '#4ecdc4', '#ffd93d', flowerSway);
                } else if (flowerType === 4) {
                    drawFlowerPetal(ctx, flowerX, flowerY, flowerSize * 0.8, '#95e1d3', '#ffd93d', flowerSway);
                } else {
                    drawFlowerPetal(ctx, flowerX, flowerY, flowerSize, '#a8e6cf', '#ff8b94', flowerSway);
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
                const grassSway = Math.sin(time * 1.2 + x * 0.4 + y * 0.6) * (TILE / 24);
                
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
                
                // 使用TILE相对位置
                if (grassType === 0) {
                    // 三叶草型
                    drawGrassBlade(baseX + TILE * 0.25, baseY + TILE * 0.5, TILE * 0.125, TILE * 0.375, -0.3, '#4a8a4a');
                    drawGrassBlade(baseX + TILE * 0.5, baseY + TILE * 0.56, TILE * 0.125, TILE * 0.44, 0, '#3d7a3d');
                    drawGrassBlade(baseX + TILE * 0.75, baseY + TILE * 0.5, TILE * 0.125, TILE * 0.31, 0.3, '#4a8a4a');
                    drawGrassBlade(baseX + TILE * 0.38, baseY + TILE * 0.62, TILE * 0.09, TILE * 0.25, -0.5, '#5a9a5a');
                    drawGrassBlade(baseX + TILE * 0.62, baseY + TILE * 0.6, TILE * 0.09, TILE * 0.28, 0.4, '#5a9a5a');
                } else if (grassType === 1) {
                    // 茂密型
                    for (let i = 0; i < 7; i++) {
                        const gx = baseX + TILE * 0.19 + (i % 4) * TILE * 0.22 + Math.sin(time + i) * 0.5;
                        const gy = baseY + TILE * 0.44 + Math.floor(i / 4) * TILE * 0.19;
                        const gh = TILE * 0.31 + Math.sin(time * 0.8 + i * 0.5) * 3;
                        const angle = (i % 2 === 0 ? -0.2 : 0.2) + grassSway * 0.015;
                        drawGrassBlade(gx, gy, TILE * 0.09, gh, angle, i % 3 === 0 ? '#5a9a5a' : '#4a8a4a');
                    }
                } else if (grassType === 2) {
                    // 芦苇型
                    for (let i = 0; i < 5; i++) {
                        const gx = baseX + TILE * 0.31 + i * TILE * 0.09;
                        const gy = baseY + TILE * 0.5 + i * TILE * 0.06;
                        const gh = TILE * 0.44 + i * TILE * 0.03;
                        drawGrassBlade(gx, gy, TILE * 0.06, gh, (i - 2) * 0.15 + grassSway * 0.02, i % 2 === 0 ? '#6aaa6a' : '#4a8a4a');
                    }
                } else {
                    // 扇形
                    drawGrassBlade(baseX + TILE * 0.31, baseY + TILE * 0.56, TILE * 0.09, TILE * 0.375, -0.6, '#4a8a4a');
                    drawGrassBlade(baseX + TILE * 0.44, baseY + TILE * 0.62, TILE * 0.09, TILE * 0.31, -0.3, '#5a9a5a');
                    drawGrassBlade(baseX + TILE * 0.56, baseY + TILE * 0.62, TILE * 0.09, TILE * 0.31, 0, '#6aaa6a');
                    drawGrassBlade(baseX + TILE * 0.69, baseY + TILE * 0.56, TILE * 0.09, TILE * 0.375, 0.3, '#5a9a5a');
                    drawGrassBlade(baseX + TILE * 0.81, baseY + TILE * 0.5, TILE * 0.09, TILE * 0.44, 0.6, '#4a8a4a');
                }
                
                // 草叶高光
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.beginPath();
                ctx.ellipse(baseX + TILE/2, baseY + TILE * 0.75, TILE * 0.125, TILE * 0.06, 0, 0, Math.PI*2);
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
                const splashX = baseX + TILE * 0.31 + Math.sin(splashTime + x) * TILE * 0.19;
                const splashY = baseY + TILE * 0.62 + Math.cos(splashTime * 0.8 + y) * TILE * 0.12;
                ctx.fillStyle = 'rgba(200,230,255,0.3)';
                ctx.beginPath();
                ctx.arc(splashX, splashY, TILE * 0.06, 0, Math.PI*2);
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
                    ctx.fillRect(baseX + TILE * 0.31, baseY + TILE * 0.38, TILE * 0.125, TILE * 0.125);
                }
            }
        }
    }
}

// ===== 掉落物绘制 =====

/**
 * 绘制掉落物品
 * 显示物品图标和发光效果
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} drops
 * @param {boolean} animate - 是否播放动画
 */
function drawDrops(ctx, drops, animate = true) {
    const time = animate ? Date.now() / 200 : 0;
    const bounce = animate ? Math.sin(time + (drops[0]?.x || 0) * 0.1) * 2 : 0;
    const glowSize = animate ? 18 + Math.sin(Date.now() / 150) * 3 : 18;
    
    drops.forEach(d => {
        if (!d.item) return;
        const drawY = d.y + (animate ? Math.sin(time + d.x * 0.1) * 2 : 0);
        
        const qualityColor = d.item.color || '#fff';
        
        // 药水特殊效果
        if (d.item.type === 'consumable') {
            drawConsumableDrop(ctx, d, drawY, glowSize, time);
            return;
        }
        
        // 金币特殊效果
        if (d.item.type === 'treasure' && d.item.id === 'gold') {
            // 使用道具图标
            if (window.renderConsumableIcon) {
                const iconUrl = window.renderConsumableIcon(d.item, 24);
                if (iconUrl) {
                    const img = new Image();
                    img.src = iconUrl;
                    ctx.drawImage(img, d.x - 12, drawY + 2, 24, 24);
                }
            } else {
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(d.item.icon || '💰', d.x, drawY + 16);
            }
            // 显示金币数量
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffd700';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            const goldValue = d.item.value || 10;
            ctx.strokeText(goldValue, d.x, drawY - 6);
            ctx.fillText(goldValue, d.x, drawY - 6);
            return;
        }
        
        // 装备类道具 - 只显示图标，无边框
        if (window.renderEquipmentIcon && ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'].includes(d.item.type)) {
            const itemCanvas = window.renderEquipmentIcon(d.item, 20);
            ctx.drawImage(itemCanvas, d.x - 10, drawY + 4, 20, 20);
            // 显示装备名称
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeText(d.item.name || '', d.x, drawY - 8);
            ctx.fillText(d.item.name || '', d.x, drawY - 8);
        } else {
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(d.item.icon || '?', d.x, drawY + 16);
        }
        ctx.textAlign = 'left';
    });
}

/**
 * 绘制药水类掉落物
 */
function drawConsumableDrop(ctx, d, drawY, glowSize, time) {
    const item = d.item;
    const id = item.id || '';
    
    // 根据药水类型设置颜色和效果
    let potionColor, glowColor, liquidColor, bubbleColor;
    
    if (id.includes('potion2') || id.includes('super')) {
        // 超级药水 - 金色/橙色
        potionColor = '#ffaa44';
        glowColor = 'rgba(255, 170, 68, 0.8)';
        liquidColor = '#ffcc88';
        bubbleColor = '#ffeeaa';
    } else if (id.includes('potion') || item.heal) {
        // 生命药水 - 红色
        potionColor = '#ff4444';
        glowColor = 'rgba(255, 68, 68, 0.8)';
        liquidColor = '#ff8888';
        bubbleColor = '#ffaaaa';
    } else if (id.includes('mpotion2')) {
        // 超级魔法药水 - 深蓝色
        potionColor = '#4444ff';
        glowColor = 'rgba(68, 68, 255, 0.8)';
        liquidColor = '#8888ff';
        bubbleColor = '#aaaaff';
    } else if (id.includes('mpotion') || item.mp) {
        // 魔法药水 - 青色
        potionColor = '#44ffff';
        glowColor = 'rgba(68, 255, 255, 0.8)';
        liquidColor = '#88ffff';
        bubbleColor = '#aaffff';
    } else {
        // 默认
        potionColor = '#aaaaaa';
        glowColor = 'rgba(170, 170, 170, 0.8)';
        liquidColor = '#cccccc';
        bubbleColor = '#eeeeee';
    }
    
    // 发光效果
    const pulseGlow = glowSize + Math.sin(time * 2) * 3;
    const gradient = ctx.createRadialGradient(d.x, drawY + 8, 0, d.x, drawY + 8, pulseGlow);
    gradient.addColorStop(0, glowColor);
    gradient.addColorStop(0.5, glowColor.replace('0.8)', '0.3)'));
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(d.x, drawY + 8, pulseGlow, 0, Math.PI * 2);
    ctx.fill();
    
    // 药水瓶主体
    const bottleX = d.x - 8;
    const bottleY = drawY + 2;
    const bottleW = 16;
    const bottleH = 20;
    
    // 瓶身阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(bottleX + 2, bottleY + 2, bottleW, bottleH);
    
    // 瓶身液体
    const liquidLevel = 0.7 + Math.sin(time * 3) * 0.1;
    ctx.fillStyle = potionColor;
    ctx.beginPath();
    ctx.roundRect(bottleX, bottleY + bottleH * (1 - liquidLevel), bottleW, bottleH * liquidLevel, 4);
    ctx.fill();
    
    // 液体高光
    ctx.fillStyle = liquidColor;
    ctx.beginPath();
    ctx.roundRect(bottleX + 2, bottleY + bottleH * (1 - liquidLevel) + 2, bottleW - 4, (bottleH * liquidLevel) / 2, 2);
    ctx.fill();
    
    // 气泡效果
    for (let i = 0; i < 3; i++) {
        const bubbleY = bottleY + bottleH - 4 - ((time * 2 + i * 2) % 10);
        const bubbleX = bottleX + 4 + i * 4;
        const bubbleSize = 2 + Math.sin(time * 4 + i) * 0.5;
        ctx.fillStyle = bubbleColor;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // 瓶口
    ctx.fillStyle = '#888888';
    ctx.fillRect(bottleX + 4, bottleY - 2, bottleW - 8, 3);
    
    // 瓶塞
    ctx.fillStyle = '#654321';
    ctx.fillRect(bottleX + 5, bottleY - 4, bottleW - 10, 3);
    
    // 瓶身边框
    ctx.strokeStyle = potionColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(bottleX, bottleY, bottleW, bottleH);
    
    // 高光反射
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(bottleX + 3, bottleY + 4, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
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
                    const color = e.color || '#5f5';
                    drawPixelSpriteFn(ctx, e.x, e.y + breathe, e.w, e.h, color, e.render || e.type, window.player);
                }
            } else {
                const color = e.color || '#5f5';
                drawPixelSpriteFn(ctx, e.x, e.y + breathe, e.w, e.h, color, e.render || e.type, window.player);
            }
        } else {
            const color = e.color || '#5f5';
            drawPixelSpriteFn(ctx, e.x, e.y + breathe, e.w, e.h, color, e.render || e.type, window.player);
        }
        
        // 敌人名称显示
        if (e.name) {
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeText(e.name, e.x + e.w / 2, e.y - 14);
            ctx.fillText(e.name, e.x + e.w / 2, e.y - 14);
        }
        
        const hpPercent = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = '#522';
        ctx.fillRect(e.x - 1, e.y - 8, e.w + 2, 5);
        ctx.fillStyle = '#f55';
        ctx.fillRect(e.x, e.y - 8, e.w * hpPercent, 4);
    });
}

// ===== Boss 绘制 =====

/**
 * 绘制 Boss
 * 特殊外观和血条
 */
// 技能图标Image缓存
const skillIconCache = {};

function getSkillIconImage(skill, size) {
    const cacheKey = `${skill.id}_${size}`;
    if (!skillIconCache[cacheKey] && window.renderSkillIcon) {
        try {
            const iconUrl = window.renderSkillIcon(skill, size);
            if (iconUrl) {
                const img = new Image();
                img.src = iconUrl;
                skillIconCache[cacheKey] = img;
            }
        } catch(e) {
            console.error('Failed to create skill icon:', e);
        }
    }
    return skillIconCache[cacheKey];
}

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
                color: boss.color || '#e55',
                type: 'boss'
            };
            const iconCanvas = window.renderEnemyIcon(bossType, boss.w);
            if (iconCanvas && iconCanvas.tagName === 'CANVAS') {
                ctx.drawImage(iconCanvas, boss.x, boss.y + breathe, boss.w, boss.h);
            } else {
                throw new Error('Invalid canvas');
            }
        } catch (err) {
            drawPixelSpriteFn(ctx, boss.x, boss.y + breathe, boss.w, boss.h, boss.color || '#e55', boss.render || 'boss', window.player);
        }
    } else {
        drawPixelSpriteFn(ctx, boss.x, boss.y + breathe, boss.w, boss.h, boss.color || '#e55', boss.render || 'boss', window.player);
    }
    
    const hpPercent = Math.min(1, Math.max(0, boss.hp / boss.maxHp));
    ctx.fillStyle = '#522';
    ctx.fillRect(boss.x - 1, boss.y - 18, boss.w + 2, 10);
    ctx.fillStyle = '#f55';
    ctx.fillRect(boss.x, boss.y - 18, boss.w * hpPercent, 8);
    
    // 显示Boss技能图标（在名字上方）
    if (boss.skills && boss.skills.length > 0) {
        const iconSize = 16;
        const iconGap = 4;
        const totalWidth = boss.skills.length * iconSize + (boss.skills.length - 1) * iconGap;
        const startX = boss.x + boss.w / 2 - totalWidth / 2;
        const iconY = boss.y - 55; // 在名字上方
        
        boss.skills.forEach((skill, i) => {
            const iconX = startX + i * (iconSize + iconGap);
            
            // 绘制技能图标背景
            ctx.fillStyle = 'rgba(30, 40, 60, 0.9)';
            ctx.fillRect(iconX - 2, iconY - 2, iconSize + 4, iconSize + 4);
            ctx.strokeStyle = 'rgba(100, 120, 160, 0.5)';
            ctx.lineWidth = 1;
            ctx.strokeRect(iconX - 2, iconY - 2, iconSize + 4, iconSize + 4);
            
            // 使用缓存的技能图标
            const img = getSkillIconImage(skill, iconSize);
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.drawImage(img, iconX, iconY, iconSize, iconSize);
            } else {
                // 如果图标还没加载完成，先显示emoji
                ctx.font = `${iconSize - 2}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#fff';
                ctx.fillText(skill.icon || '?', iconX + iconSize/2, iconY + iconSize/2);
            }
        });
        
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    }
    
    // Boss名称显示
    if (boss.name) {
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(boss.name, boss.x + boss.w / 2, boss.y - 24);
        ctx.fillText(boss.name, boss.x + boss.w / 2, boss.y - 24);
    }
}

// ===== 玩家攻击绘制 =====

/**
 * 绘制玩家攻击效果
 * 月牙形状的斩击效果，刃向外，凹处对着角色
 */
function drawPlayerAttack(ctx, player) {
    if (player.attacking <= 0) return;
    const attackProgress = 1 - (player.attacking / 20);
    const dirX = player.dirX;
    const dirY = player.dirY;
    
    const baseX = player.x + player.w/2;
    const baseY = player.y + player.h/2;
    
    // 根据武器颜色设置效果参数
    let slashColor = '#fff';
    let slashGlow = 'rgba(255, 255, 255, 0.5)';
    
    if (player.weapon && player.weapon.color) {
        slashColor = player.weapon.color;
        slashGlow = player.weapon.color + '80';
    }
    
    // 计算攻击方向角度（角色朝向）
    let attackAngle = 0;
    if (dirX > 0) attackAngle = 0;
    else if (dirX < 0) attackAngle = Math.PI;
    else if (dirY < 0) attackAngle = -Math.PI/2;
    else if (dirY > 0) attackAngle = Math.PI/2;
    
    // 挥砍进度对应的角度
    const swingOffset = (attackProgress - 0.5) * Math.PI * 0.7;
    const currentAngle = attackAngle + swingOffset;
    
    ctx.save();
    ctx.translate(baseX, baseY);
    
    // 月牙斩击效果 - 从内向外扩散的月牙
    // 凹处对着角色(中心)，刃向外
    const crescentRadius = 28 + attackProgress * 15; // 逐渐扩大
    const crescentThickness = 8 * (1 - attackProgress * 0.3); // 逐渐变细
    
    // 外层发光（刃向外）
    ctx.shadowColor = slashColor;
    ctx.shadowBlur = 15;
    ctx.fillStyle = slashGlow;
    ctx.globalAlpha = 0.5 * (1 - attackProgress * 0.4);
    
    ctx.beginPath();
    // 外弧（刃向外）
    ctx.arc(0, 0, crescentRadius + crescentThickness, currentAngle - 0.6, currentAngle + 0.6);
    // 内弧（凹处向内）
    ctx.arc(0, 0, crescentRadius - crescentThickness * 0.5, currentAngle + 0.5, currentAngle - 0.5, true);
    ctx.closePath();
    ctx.fill();
    
    // 主月牙（刃部更亮）
    ctx.shadowBlur = 8;
    ctx.fillStyle = slashColor;
    ctx.globalAlpha = 0.9 * (1 - attackProgress * 0.3);
    
    ctx.beginPath();
    ctx.arc(0, 0, crescentRadius + crescentThickness * 0.5, currentAngle - 0.5, currentAngle + 0.5);
    ctx.arc(0, 0, crescentRadius - crescentThickness * 0.8, currentAngle + 0.4, currentAngle - 0.4, true);
    ctx.closePath();
    ctx.fill();
    
    // 内层亮边（刃的边缘更亮）
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.7 * (1 - attackProgress * 0.5);
    
    ctx.beginPath();
    ctx.arc(0, 0, crescentRadius + crescentThickness * 0.3, currentAngle - 0.3, currentAngle + 0.3);
    ctx.arc(0, 0, crescentRadius - crescentThickness * 0.5, currentAngle + 0.25, currentAngle - 0.25, true);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // 攻击轨迹残影
    const trailCount = 3;
    for (let i = 1; i <= trailCount; i++) {
        const trailProgress = attackProgress - i * 0.1;
        if (trailProgress > 0) {
            const trailAngle = attackAngle + (trailProgress - 0.5) * Math.PI * 0.7;
            const trailRadius = 25 + trailProgress * 10;
            
            ctx.fillStyle = slashColor;
            ctx.globalAlpha = 0.3 * (1 - i * 0.25) * trailProgress;
            
            ctx.beginPath();
            ctx.arc(0, 0, trailRadius + 4, trailAngle - 0.4, trailAngle + 0.4);
            ctx.arc(0, 0, trailRadius - 3, trailAngle + 0.3, trailAngle - 0.3, true);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    // 攻击终点的火花粒子
    const endX = Math.cos(currentAngle) * (crescentRadius + 10);
    const endY = Math.sin(currentAngle) * (crescentRadius + 10);
    
    if (attackProgress > 0.5) {
        ctx.globalAlpha = (attackProgress - 0.5) * 1.5;
        for (let i = 0; i < 8; i++) {
            const angle = currentAngle + (Math.random() - 0.5) * 1.2;
            const dist = Math.random() * 12;
            ctx.fillStyle = i % 2 === 0 ? '#fff' : slashColor;
            ctx.beginPath();
            ctx.arc(endX + Math.cos(angle) * dist, endY + Math.sin(angle) * dist, 1 + Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.restore();
}

// ===== 敌人攻击效果绘制 =====

/**
 * 绘制敌人攻击效果
 * 爪击、咬击等攻击动画
 */
function drawEnemyAttack(ctx, enemy) {
    if (!enemy.isAttacking || enemy.attackProgress <= 0) return;
    
    const progress = enemy.attackProgress;
    const baseX = enemy.x + enemy.w/2;
    const baseY = enemy.y + enemy.h/2;
    
    // 计算攻击方向（朝向玩家）
    const player = window.player;
    const dx = (player.x + player.w/2) - baseX;
    const dy = (player.y + player.h/2) - baseY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const dirX = dist > 0 ? dx/dist : 1;
    const dirY = dist > 0 ? dy/dist : 0;
    
    // 根据怪物类型选择攻击效果
    const attackType = enemy.attackType || 'claw';
    const enemyType = enemy.type;
    
    ctx.save();
    ctx.translate(baseX, baseY);
    
    // 计算攻击角度
    let attackAngle = 0;
    if (Math.abs(dirX) > Math.abs(dirY)) {
        attackAngle = dirX > 0 ? 0 : Math.PI;
    } else {
        attackAngle = dirY > 0 ? Math.PI/2 : -Math.PI/2;
    }
    
    ctx.rotate(attackAngle);
    
    // 每个敌人独特的攻击效果
    switch(enemyType) {
        case 'slime':
            // 史莱姆：粘液飞溅 + 弹跳撞击
            drawSlimeAttack(ctx, progress);
            break;
            
        case 'goblin':
            // 哥布林：匕首刺击 + 偷窃动作
            drawGoblinAttack(ctx, progress);
            break;
            
        case 'bat':
            // 蝙蝠：声波攻击 + 俯冲
            drawBatAttack(ctx, progress);
            break;
            
        case 'spider':
            // 蜘蛛：毒液喷射 + 蛛网
            drawSpiderAttack(ctx, progress);
            break;
            
        case 'skeleton':
            // 骷髅：骨剑斩击 + 骨头碎片
            drawSkeletonAttack(ctx, progress);
            break;
            
        case 'wolf':
            // 狼：凶猛撕咬 + 血爪
            drawWolfAttack(ctx, progress);
            break;
            
        case 'snake':
            // 蛇：毒牙突刺 + 毒液轨迹
            drawSnakeAttack(ctx, progress);
            break;
            
        case 'scorpion':
            // 蝎子：尾刺突刺 + 毒液注射
            drawScorpionAttack(ctx, progress);
            break;
            
        default:
            // 默认爪击
            drawDefaultClawAttack(ctx, progress);
    }
    
    ctx.restore();
}

// 史莱姆攻击：粘液飞溅
function drawSlimeAttack(ctx, progress) {
    const alpha = Math.sin(progress * Math.PI);
    
    // 弹跳轨迹
    ctx.fillStyle = `rgba(100, 200, 100, ${alpha})`;
    ctx.beginPath();
    ctx.arc(0, -10 * Math.sin(progress * Math.PI), 8 + progress * 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 粘液飞溅
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI - Math.PI / 2;
        const dist = 15 + progress * 20 + Math.sin(progress * Math.PI * 2 + i) * 5;
        const size = 4 - i * 0.5;
        ctx.fillStyle = `rgba(150, 255, 150, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 哥布林攻击：匕首刺击
function drawGoblinAttack(ctx, progress) {
    const alpha = Math.sin(progress * Math.PI);
    
    // 匕首轨迹
    ctx.strokeStyle = `rgba(180, 180, 200, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // 快速刺击
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(25 + progress * 15, -5 + Math.sin(progress * Math.PI) * 3);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(10, 5);
    ctx.lineTo(25 + progress * 15, 5 + Math.sin(progress * Math.PI) * 3);
    ctx.stroke();
    
    // 匕首闪光
    if (progress > 0.6) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(30, -8);
        ctx.lineTo(35, 0);
        ctx.lineTo(30, 8);
        ctx.fill();
    }
}

// 蝙蝠攻击：声波
function drawBatAttack(ctx, progress) {
    const alpha = Math.sin(progress * Math.PI);
    
    // 声波扩散
    for (let i = 0; i < 3; i++) {
        const waveProgress = progress + i * 0.2;
        if (waveProgress <= 1) {
            const radius = 10 + waveProgress * 25;
            const waveAlpha = alpha * (1 - waveProgress);
            
            ctx.strokeStyle = `rgba(150, 150, 200, ${waveAlpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, radius, -Math.PI/3, Math.PI/3);
            ctx.stroke();
        }
    }
    
    // 俯冲轨迹
    ctx.strokeStyle = `rgba(100, 100, 150, ${alpha * 0.5})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(-15, -20);
    ctx.quadraticCurveTo(0, -10 + progress * 10, 20, 0);
    ctx.stroke();
    ctx.setLineDash([]);
}

// 蜘蛛攻击：毒液 + 蛛网
function drawSpiderAttack(ctx, progress) {
    const alpha = Math.sin(progress * Math.PI);
    
    // 毒液喷射
    ctx.fillStyle = `rgba(100, 255, 100, ${alpha * 0.8})`;
    for (let i = 0; i < 5; i++) {
        const spread = (i - 2) * 0.3;
        const dist = 15 + progress * 20;
        const size = 4 - Math.abs(i - 2);
        ctx.beginPath();
        ctx.arc(dist, spread * 8, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 蛛网丝线
    ctx.strokeStyle = `rgba(200, 200, 220, ${alpha * 0.6})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI / 2 - Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(25 + progress * 15, Math.sin(angle) * 10);
        ctx.stroke();
    }
}

// 骷髅攻击：骨剑斩击
function drawSkeletonAttack(ctx, progress) {
    const alpha = Math.sin(progress * Math.PI);
    
    // 骨剑轨迹
    ctx.strokeStyle = `rgba(220, 220, 200, ${alpha})`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    // 斩击弧线
    ctx.beginPath();
    ctx.moveTo(10, -15);
    ctx.quadraticCurveTo(25 + progress * 15, -5, 30 + progress * 15, 10);
    ctx.stroke();
    
    // 骨头碎片
    if (progress > 0.5) {
        ctx.fillStyle = `rgba(240, 240, 220, ${alpha})`;
        for (let i = 0; i < 4; i++) {
            const bx = 25 + progress * 15 + Math.cos(i * 1.5) * 8;
            const by = Math.sin(i * 1.5) * 8;
            ctx.fillRect(bx - 2, by - 2, 4, 4);
        }
    }
}

// 狼攻击：凶猛撕咬
function drawWolfAttack(ctx, progress) {
    const alpha = Math.sin(progress * Math.PI);
    
    // 血爪
    ctx.strokeStyle = `rgba(200, 50, 50, ${alpha})`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    // 四道爪痕
    for (let i = 0; i < 4; i++) {
        const offset = (i - 1.5) * 6;
        ctx.beginPath();
        ctx.moveTo(12, offset - 3);
        ctx.quadraticCurveTo(25 + progress * 12, offset, 35 + progress * 15, offset + 8);
        ctx.stroke();
    }
    
    // 牙齿咬痕
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(20, -12);
    ctx.lineTo(25 + progress * 5, -8);
    ctx.lineTo(22, -5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(20, 12);
    ctx.lineTo(25 + progress * 5, 8);
    ctx.lineTo(22, 5);
    ctx.fill();
    
    // 血腥效果
    if (progress > 0.7) {
        ctx.fillStyle = `rgba(180, 0, 0, ${alpha * 0.8})`;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(35 + Math.random() * 10, (Math.random() - 0.5) * 20, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// 蛇攻击：毒牙突刺
function drawSnakeAttack(ctx, progress) {
    const alpha = Math.sin(progress * Math.PI);
    
    // 快速突刺
    ctx.strokeStyle = `rgba(100, 200, 100, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // 蛇形轨迹
    ctx.beginPath();
    ctx.moveTo(10, 0);
    for (let i = 0; i <= 5; i++) {
        const t = i / 5;
        const x = 10 + t * (20 + progress * 15);
        const y = Math.sin(t * Math.PI * 2 + progress * Math.PI) * 5;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // 毒牙
    ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(30 + progress * 15, -3);
    ctx.lineTo(35 + progress * 15, 0);
    ctx.lineTo(30 + progress * 15, 3);
    ctx.fill();
    
    // 毒液滴落
    if (progress > 0.6) {
        ctx.fillStyle = `rgba(150, 255, 100, ${alpha})`;
        ctx.beginPath();
        ctx.arc(32 + progress * 15, 5 + (progress - 0.6) * 10, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 蝎子攻击：尾刺突刺
function drawScorpionAttack(ctx, progress) {
    const alpha = Math.sin(progress * Math.PI);
    
    // 尾刺轨迹
    ctx.strokeStyle = `rgba(150, 100, 50, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // 弯曲的尾刺
    ctx.beginPath();
    ctx.moveTo(5, 10);
    ctx.quadraticCurveTo(15, 0, 20 + progress * 20, -5 + Math.sin(progress * Math.PI) * 3);
    ctx.stroke();
    
    // 刺尖
    const tipX = 20 + progress * 20;
    const tipY = -5 + Math.sin(progress * Math.PI) * 3;
    
    ctx.fillStyle = `rgba(50, 50, 50, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(tipX - 3, tipY - 3);
    ctx.lineTo(tipX + 5, tipY);
    ctx.lineTo(tipX - 3, tipY + 3);
    ctx.fill();
    
    // 毒液注射效果
    if (progress > 0.8) {
        ctx.fillStyle = `rgba(200, 50, 200, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(tipX + 3, tipY, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 默认爪击
function drawDefaultClawAttack(ctx, progress) {
    const alpha = Math.sin(progress * Math.PI);
    
    ctx.strokeStyle = `rgba(255, 100, 100, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    for (let i = 0; i < 3; i++) {
        const offset = (i - 1) * 8;
        ctx.beginPath();
        ctx.moveTo(15, offset);
        ctx.quadraticCurveTo(25 + progress * 10, offset + 3, 35 + progress * 15, offset + 10);
        ctx.stroke();
    }
}

/**
 * 绘制所有敌人的攻击效果
 */
function drawEnemiesAttack(ctx, enemies) {
    enemies.forEach(enemy => {
        if (enemy.isAttacking && enemy.attackProgress > 0) {
            drawEnemyAttack(ctx, enemy);
        }
    });
}

// ===== 粒子效果绘制 =====

/**
 * 绘制粒子效果
 * 血液、火花、药水效果等
 */
function drawParticles(ctx, particles) {
    particles.forEach(p => {
        const alpha = p.life / (p.maxLife || 30);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        
        if (p.type === 'potion') {
            // 药水粒子 - 圆形发光
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size || 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        } else if (p.type === 'potion_glow') {
            // 药水光点 - 小圆形
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size || 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'potion_ring') {
            // 药水光环 - 扩散的圆环
            const ringProgress = 1 - alpha;
            const ringSize = (p.size || 20) * (1 + ringProgress * 2);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 3 * alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, ringSize, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // 默认粒子 - 矩形
            ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        }
    });
    ctx.globalAlpha = 1;
}

// ===== 玩家绘制 =====

/**
 * 绘制玩家角色
 * 带呼吸动画和无敌闪烁
 */
function drawPlayer(ctx, player, drawPixelSpriteFn, invulnerable) {
    // 无敌期间不闪烁，持续显示
    const isInvincible = invulnerable && invulnerable > 0;
    // 只在5秒无敌时显示光罩（300帧），不显示受伤后的短暂无敌
    const showShield = invulnerable && invulnerable >= 60;
    if (!isInvincible && invulnerable && invulnerable % 4 < 2) return;
    
    const breathe = Math.sin(Date.now() / 300) * 1;
    const shadowDir = getShadowDirection();
    
    // 绘制无敌光罩 - 只在5秒无敌时显示
    if (showShield) {
        const centerX = player.x + player.w / 2;
        const centerY = player.y + player.h / 2;
        const shieldRadius = Math.max(player.w, player.h) * 0.8;
        const flashAlpha = 0.25 + Math.sin(Date.now() / 100) * 0.15;
        
        // 金色光罩（升级时）或蓝色光罩（其他无敌）
        const isLevelUp = player.levelUpShield && player.levelUpShield > 0;
        const baseColor = isLevelUp ? '255, 215, 0' : '100, 200, 255';
        
        const shieldGrad = ctx.createRadialGradient(centerX, centerY, shieldRadius * 0.5, centerX, centerY, shieldRadius);
        shieldGrad.addColorStop(0, `rgba(${baseColor}, 0)`);
        shieldGrad.addColorStop(0.7, `rgba(${baseColor}, ${flashAlpha})`);
        shieldGrad.addColorStop(1, `rgba(${baseColor}, 0)`);
        
        ctx.fillStyle = shieldGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制光罩边缘
        const edgeColor = isLevelUp ? '255, 220, 100' : '150, 220, 255';
        ctx.strokeStyle = `rgba(${edgeColor}, ${0.4 + Math.sin(Date.now() / 150) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 显示无敌文字
        const textY = player.y - 28 + breathe;
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'center';
        const textAlpha = 0.8 + Math.sin(Date.now() / 100) * 0.2;
        ctx.fillStyle = isLevelUp ? `rgba(255, 255, 200, ${textAlpha})` : `rgba(255, 255, 100, ${textAlpha})`;
        ctx.shadowColor = isLevelUp ? '#fa0' : '#ff0';
        ctx.shadowBlur = 4;
        ctx.fillText('无敌', centerX, textY);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
    }
    
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(player.x + player.w/2 + shadowDir.x, player.y + player.h - 4 + breathe + shadowDir.y, player.w/2.5, player.h/5, 0, 0, Math.PI*2);
    ctx.fill();
    
    drawPixelSpriteFn(ctx, player.x, player.y + breathe, player.w, player.h, '#ff6', 'player', player);
    
    // 玩家标识 - 朝下的发光三角形，与头顶有更多距离，带闪烁效果
    const markerY = player.y - 18 + breathe;
    const centerX = player.x + player.w / 2;
    
    // 计算闪烁效果（使用正弦波）
    const flashTime = Date.now() / 300;
    const flashAlpha = 0.5 + Math.sin(flashTime) * 0.5; // 0到1之间闪烁
    const shadowBlur = 8 + Math.sin(flashTime * 2) * 6; // 8到14之间变化
    
        // 发光效果 - 动态闪烁，改为高饱和度粉紫色
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = shadowBlur;
    ctx.fillStyle = `rgba(255, 20, 147, ${0.85 + flashAlpha * 0.15})`;
    ctx.beginPath();
    ctx.moveTo(centerX, markerY + 8);  // 朝下
    ctx.lineTo(centerX - 6, markerY - 2);
    ctx.lineTo(centerX + 6, markerY - 2);
    ctx.closePath();
    ctx.fill();
    
    // 内部高光 - 反向闪烁，更亮
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + (1 - flashAlpha) * 0.3})`;
    ctx.beginPath();
    ctx.moveTo(centerX, markerY + 5);
    ctx.lineTo(centerX - 3, markerY - 1);
    ctx.lineTo(centerX + 3, markerY - 1);
    ctx.closePath();
    ctx.fill();
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
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {Object} player
 * @param {boolean} animate - 是否播放动画
 */
function drawClouds(ctx, canvasWidth, canvasHeight, player, animate = true) {
    const cloudData = getClouds();
    if (!cloudData || !cloudData.length) return;
    
    const time = animate ? Date.now() / 1000 : 0;
    const shadowDir = getShadowDirection();
    
    if (animate) {
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
        });
    }
    
    cloudData.forEach(cloud => {
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
        
        // 绘制底部阴影线
        ctx.strokeStyle = cloud.type === 'storm' ? 'rgba(0,0,0,0.3)' : 
                         cloud.type === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(100,100,120,0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(baseX - size * 0.6, baseY + size * 0.3);
        ctx.quadraticCurveTo(baseX, baseY + size * 0.5, baseX + size * 0.6, baseY + size * 0.3);
        ctx.stroke();
        
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
                    
                    // 雷电伤害音效
                    if (typeof playSound === 'function') {
                        playSound('lightning');
                    }
                    
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
