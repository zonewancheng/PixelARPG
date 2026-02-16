function drawPixelSprite(ctx, x, y, w, h, color, type, player) {
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
            } else if (tile === 2) {
                ctx.fillStyle = '#1a3a1a';
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                const grassOffset = Math.sin(time + x * 0.5 + y * 0.3) * 1;
                ctx.fillStyle = '#2a5a2a';
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
                ctx.fillStyle = '#1a3a2a';
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                if ((x + y) % 5 === 0) {
                    ctx.fillStyle = '#2a4a2a';
                    ctx.fillRect(x * TILE + 10, y * TILE + 12, 4, 4);
                }
            }
        }
    }
}

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

function drawEnemies(ctx, enemies, drawPixelSpriteFn) {
    const time = Date.now();
    enemies.forEach((e, i) => {
        const breathe = Math.sin(time / 400 + i) * 1;
        const color = e.color || '#4a4';
        drawPixelSpriteFn(ctx, e.x, e.y + breathe, e.w, e.h, color, e.type, window.player);
        
        const hpPercent = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = '#300';
        ctx.fillRect(e.x, e.y - 8, e.w, 4);
        ctx.fillStyle = '#f00';
        ctx.fillRect(e.x, e.y - 8, e.w * hpPercent, 4);
    });
}

function drawBoss(ctx, boss, drawPixelSpriteFn) {
    if (!boss) return;
    drawPixelSpriteFn(ctx, boss.x, boss.y, boss.w, boss.h, boss.color || '#a22', 'boss', window.player);
    const hpPercent = Math.max(0, boss.hp / boss.maxHp);
    ctx.fillStyle = '#300';
    ctx.fillRect(boss.x, boss.y - 16, boss.w, 8);
    ctx.fillStyle = '#f00';
    ctx.fillRect(boss.x, boss.y - 16, boss.w * hpPercent, 8);
}

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

function drawParticles(ctx, particles) {
    particles.forEach(p => {
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1;
}

function drawPlayer(ctx, player, drawPixelSpriteFn, invulnerable) {
    if (invulnerable && invulnerable % 4 < 2) return;
    const breathe = Math.sin(Date.now() / 300) * 1;
    drawPixelSpriteFn(ctx, player.x, player.y + breathe, player.w, player.h, '#fa0', 'player', player);
}
