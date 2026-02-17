let canvas, ctx;
let map = [];
let mapLevel = 1;
let enemies = [];
let drops = [];
let particles = [];
let projectiles = [];
let damageNumbers = [];
let gameState = 'playing';
let inventoryOpen = false;
let characterOpen = false;
let shopOpen = false;
let bestiaryOpen = false;
let bestiaryTab = 'monster';
let discoveredEnemies = {};
let discoveredSkills = {};
let discoveredItems = {};
let message = '';
let messageTimer = 0;
let damageFlash = 0;
let keys = {};

const DB_NAME = 'PixelHeroDB';
const DB_VERSION = 1;
const STORE_NAME = 'save';

let db = null;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (e) => {
            const database = e.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

function saveToDB(data) {
    return new Promise((resolve, reject) => {
        if (!db) {
            openDB().then(() => saveToDB(data).then(resolve).catch(reject));
            return;
        }
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.put({ id: 'gameSave', data: data });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function loadFromDB() {
    return new Promise((resolve, reject) => {
        if (!db) {
            openDB().then(() => loadFromDB().then(resolve).catch(reject));
            return;
        }
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get('gameSave');
        request.onsuccess = () => resolve(request.result ? request.result.data : null);
        request.onerror = () => reject(request.error);
    });
}
let levelTransitioning = false;
let shopItems = [];
let currentLanguage = 'zh';

function initGame() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    initClouds(canvas.width, canvas.height);
    
    window.boss = null;
    window.player = createPlayer();
    window.playerSkills = window.skills.slice(0, 7);
    window.skillCooldowns = {};
    window.skills.forEach(s => window.skillCooldowns[s.id] = 0);
    
    generateMap();
    spawnEnemies();
    setupInput();
    setupUI();
    
    openDB().then(() => {
        loadGame();
    }).catch(e => {
        console.error('Failed to open database:', e);
        loadGame();
    });
    
    requestAnimationFrame(gameLoop);
}

function createPlayer() {
    const createItemWithUid = (item) => {
        if (!item) return null;
        return { ...item, uid: Date.now() + Math.random() };
    };
    
    const getItemByType = (type) => {
        const items = window.items.filter(i => i.type === type);
        return items[0] || null;
    };
    
    const weapon = createItemWithUid(getItemByType('weapon'));
    const armor = createItemWithUid(getItemByType('armor'));
    const helmet = createItemWithUid(getItemByType('helmet'));
    const boots = createItemWithUid(getItemByType('boots'));
    const ring = createItemWithUid(getItemByType('ring'));
    const necklace = createItemWithUid(getItemByType('necklace'));
    
    const equipList = [weapon, armor, helmet, boots, ring, necklace];
    
    let totalAtk = 10;
    let totalDef = 5;
    let totalMaxHp = 100;
    let totalMaxMp = 150;
    let totalHpRegen = 0;
    let totalMpRegen = 0;
    let totalAtkPercent = 0;
    let totalDefPercent = 0;
    
    equipList.forEach(eq => {
        if (eq) {
            totalAtk += eq.atk || 0;
            totalDef += eq.def || 0;
            totalMaxHp += eq.maxHp || 0;
            totalMaxMp += eq.maxMp || 0;
            totalHpRegen += eq.hpRegen || 0;
            totalMpRegen += eq.mpRegen || 0;
            totalAtkPercent += eq.atkPercent || 0;
            totalDefPercent += eq.defPercent || 0;
        }
    });
    
    totalAtk = Math.floor(totalAtk * (1 + totalAtkPercent / 100));
    totalDef = Math.floor(totalDef * (1 + totalDefPercent / 100));
    
    const p = {
        x: 7 * window.TILE,
        y: 15 * window.TILE,
        w: 24, h: 28,
        vx: 0, vy: 0,
        hp: totalMaxHp, maxHp: totalMaxHp,
        mp: totalMaxMp, maxMp: totalMaxMp,
        atk: totalAtk, def: totalDef,
        hpRegen: totalHpRegen, mpRegen: totalMpRegen,
        level: 1, exp: 0, gold: 0,
        weapon: weapon,
        armor: armor,
        helmet: helmet,
        boots: boots,
        ring: ring,
        necklace: necklace,
        inventory: [
            createItemWithUid(window.items[21]), 
            createItemWithUid(window.items[21]), 
            createItemWithUid(window.items[22]), 
            createItemWithUid(window.items[23]), 
            createItemWithUid(window.items[24])
        ],
        attacking: 0,
        dirX: 1, dirY: 0,
        invulnerable: 0,
        regenTimer: 0
    };
    return p;
}

function generateMap() {
    map = [];
    for (let y = 0; y < window.MAP_H; y++) {
        map[y] = [];
        for (let x = 0; x < window.MAP_W; x++) {
            if (x === 0 || x === window.MAP_W - 1 || y === 0 || y === window.MAP_H - 1) {
                map[y][x] = 1;
            } else {
                const rand = Math.random();
                if (rand < 0.02 + mapLevel * 0.003) {
                    if (x > 3 && x < window.MAP_W - 4 && y > 3 && y < window.MAP_H - 8) {
                        map[y][x] = 4;
                    } else {
                        map[y][x] = 1;
                    }
                } else if (rand < 0.04 + mapLevel * 0.005) {
                    if (x > 2 && x < window.MAP_W - 3 && y > 2 && y < window.MAP_H - 7) {
                        map[y][x] = 5;
                    } else {
                        map[y][x] = 1;
                    }
                } else if (rand < 0.06 + mapLevel * 0.005) {
                    map[y][x] = 6;
                } else if (rand < 0.10 + mapLevel * 0.01) {
                    map[y][x] = 2;
                } else if (rand < 0.14 + mapLevel * 0.01) {
                    map[y][x] = 3;
                } else {
                    map[y][x] = 0;
                }
            }
        }
    }
    map[15][7] = 0;
    map[15][8] = 0;
}

function spawnEnemies() {
    enemies = [];
    const count = Math.min(3 + Math.floor(mapLevel * 0.5), 8);
    const moveModes = ['patrol_h', 'patrol_v', 'circle', 'idle', 'wander'];
    for (let i = 0; i < count; i++) {
        let ex, ey;
        do {
            ex = Math.floor(Math.random() * (window.MAP_W - 2)) + 1;
            ey = Math.floor(Math.random() * (window.MAP_H - 6)) + 1;
        } while (map[ey][ex] === 1 || Math.abs(ex - window.player.x/window.TILE) < 3);
        
        const et = window.enemyTypes[Math.floor(Math.random() * window.enemyTypes.length)];
        const mode = moveModes[Math.floor(Math.random() * moveModes.length)];
        
        enemies.push({
            x: ex * window.TILE + 4,
            y: ey * window.TILE + 4,
            w: 24, h: 24,
            hp: et.hp + mapLevel * 5,
            maxHp: et.hp + mapLevel * 5,
            atk: et.atk + mapLevel * 2,
            def: et.def + Math.floor(mapLevel * 0.5),
            type: et.type,
            vx: 0, vy: 0,
            attackCooldown: 0,
            aggro: 30,
            exp: et.exp + mapLevel * 2,
            gold: et.gold + mapLevel,
            name: et.name,
            color: et.color,
            moveMode: mode,
            spawnX: ex * window.TILE + 4,
            spawnY: ey * window.TILE + 4,
            angle: Math.random() * Math.PI * 2,
            wanderDir: Math.random() * Math.PI * 2,
            wanderTimer: 0
        });
    }
    
    if (mapLevel % 3 === 0) {
        spawnBoss();
    }
}

function spawnBoss() {
    const idx = Math.min(mapLevel - 1, window.bossTypes.length - 1);
    const b = window.bossTypes[idx];
    
    window.boss = {
        x: 7 * window.TILE,
        y: 3 * window.TILE,
        w: b.size, h: b.size,
        hp: b.hp + mapLevel * 20,
        maxHp: b.hp + mapLevel * 20,
        atk: b.atk + mapLevel * 3,
        def: b.def + Math.floor(mapLevel * 2),
        type: 'boss',
        vx: 0, vy: 0,
        attackCooldown: 0,
        aggro: 60,
        exp: b.exp + mapLevel * 10,
        gold: b.gold + mapLevel * 20,
        name: b.name,
        color: b.color
    };
    showMessage(`BOSS APPEARED: ${b.name}!`, 180);
    playSound('boss');
}

function spawnDrop(x, y, isBoss = false) {
    const rand = Math.random();
    let item;
    const level = mapLevel + (isBoss ? 3 : 0);
    const equipTypes = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
    
    if (rand < 0.2) {
        item = window.items.find(i => i.id === 'potion');
    } else if (rand < 0.28) {
        item = window.items.find(i => i.id === 'potion2');
    } else if (rand < 0.34) {
        item = window.items.find(i => i.id === 'mpotion');
    } else if (rand < 0.4) {
        item = window.items.find(i => i.id === 'mpotion2');
    } else if (rand < 0.45) {
        item = window.items.find(i => i.id === 'gold');
    } else {
        const type = equipTypes[Math.floor(Math.random() * equipTypes.length)];
        item = window.generateRandomItem(type, level);
    }
    drops.push({ x: x + 10, y: y + 10, item: item, life: 1800 });
    
    const extraDrops = isBoss ? 5 : 2;
    for (let i = 0; i < extraDrops; i++) {
        const rand2 = Math.random();
        let item2;
        const equipTypes = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
        
        if (rand2 < 0.2) {
            item2 = window.items.find(i => i.id === 'potion');
        } else if (rand2 < 0.3) {
            item2 = window.items.find(i => i.id === 'potion2');
        } else if (rand2 < 0.38) {
            item2 = window.items.find(i => i.id === 'mpotion');
        } else if (rand2 < 0.45) {
            item2 = window.items.find(i => i.id === 'mpotion2');
        } else if (rand2 < 0.5) {
            item2 = window.items.find(i => i.id === 'gold');
        } else if (rand2 < 0.6) {
            item2 = window.generateItemByQuality('uncommon', 'weapon', level);
        } else if (rand2 < 0.7) {
            item2 = window.generateItemByQuality('rare', 'armor', level);
        } else if (rand2 < 0.8) {
            item2 = window.generateItemByQuality('epic', 'helmet', level);
        } else {
            const type = equipTypes[Math.floor(Math.random() * equipTypes.length)];
            item2 = window.generateItemByQuality('legendary', type, level);
        }
        drops.push({ x: x + 10 + (Math.random() - 0.5) * 40, y: y + 10 + (Math.random() - 0.5) * 40, item: item2, life: 1800 });
    }
}

function spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
            color: color
        });
    }
}

function spawnDamageNumber(x, y, value, isHeal = false) {
    damageNumbers.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y,
        value: value,
        isHeal: isHeal,
        life: 45,
        vy: -1.5
    });
}

function showMessage(msg, duration = 60) {
    message = msg;
    messageTimer = duration;
    
    const msgEl = document.getElementById('messages');
    if (msgEl) {
        msgEl.textContent = msg;
        msgEl.style.display = 'block';
        setTimeout(() => {
            msgEl.style.display = 'none';
        }, duration * 16.67);
    }
}

function gameLoop() {
    if (gameState === 'playing' && !inventoryOpen && !characterOpen && !shopOpen) {
        update();
    }
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    const player = window.player;
    
    if (player.attacking > 0) player.attacking--;
    if (player.invulnerable > 0) player.invulnerable--;
    
    if (player.hpRegen > 0 || player.mpRegen > 0) {
        if (!player.regenTimer) player.regenTimer = 0;
        player.regenTimer++;
        if (player.regenTimer >= 60) {
            player.regenTimer = 0;
            if (player.hp < player.maxHp) {
                const healAmount = player.hpRegen;
                player.hp = Math.min(player.maxHp, player.hp + healAmount);
                spawnDamageNumber(player.x + player.w/2, player.y - 10, healAmount, true);
            }
            if (player.mp < player.maxMp) {
                const mpAmount = player.mpRegen;
                player.mp = Math.min(player.maxMp, player.mp + mpAmount);
            }
        }
    }
    
    Object.keys(window.skillCooldowns).forEach(key => {
        if (window.skillCooldowns[key] > 0) window.skillCooldowns[key]--;
    });
    
    enemies.forEach(e => {
        if (!e.slowed) e.slowed = 0;
        if (!e.frozen) e.frozen = 0;
        if (!e.aggro) e.aggro = 0;
        if (!e.angle) e.angle = 0;
        if (!e.wanderTimer) e.wanderTimer = 0;
        if (e.attackCooldown > 0) e.attackCooldown--;
        if (e.slowed > 0) e.slowed--;
        if (e.frozen > 0) e.frozen--;
        if (e.aggro > 0) e.aggro--;
        
        let speed = 0.8;
        if (e.slowed > 0) speed *= 0.5;
        if (e.frozen > 0) speed = 0;
        
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        const detectRange = 150;
        const chaseRange = 200;
        
        if ((dist < chaseRange && dist > 0) && (e.aggro > 0 || dist < detectRange)) {
            if (e.frozen <= 0) {
                const chaseSpeed = e.aggro > 0 ? speed * 1.2 : speed * 0.8;
                e.x += (dx / dist) * chaseSpeed;
                e.y += (dy / dist) * chaseSpeed;
            }
        } else {
            const patrolRange = 80;
            switch(e.moveMode) {
                case 'patrol_h':
                    if (!e.patrolDir) e.patrolDir = Math.random() > 0.5 ? 1 : -1;
                    e.x += e.patrolDir * speed * 0.3;
                    if (Math.abs(e.x - e.spawnX) > patrolRange || e.x < window.TILE || e.x > (window.MAP_W - 1) * window.TILE) {
                        e.patrolDir *= -1;
                        e.x = Math.max(window.TILE, Math.min((window.MAP_W - 1) * window.TILE, e.x));
                    }
                    break;
                case 'patrol_v':
                    if (!e.patrolDir) e.patrolDir = Math.random() > 0.5 ? 1 : -1;
                    e.y += e.patrolDir * speed * 0.3;
                    if (Math.abs(e.y - e.spawnY) > patrolRange || e.y < window.TILE || e.y > (window.MAP_H - 1) * window.TILE) {
                        e.patrolDir *= -1;
                        e.y = Math.max(window.TILE, Math.min((window.MAP_H - 1) * window.TILE, e.y));
                    }
                    break;
                case 'circle':
                    if (!e.circleDir) e.circleDir = 1;
                    e.angle += 0.02 * e.circleDir;
                    const radius = 35;
                    const targetX = e.spawnX + Math.cos(e.angle) * radius;
                    const targetY = e.spawnY + Math.sin(e.angle) * radius;
                    e.x += (targetX - e.x) * 0.03;
                    e.y += (targetY - e.y) * 0.03;
                    if (e.angle > Math.PI * 2 || e.angle < 0) {
                        e.circleDir *= -1;
                    }
                    break;
                case 'wander':
                    e.wanderTimer--;
                    if (e.wanderTimer <= 0) {
                        e.wanderDir = Math.random() * Math.PI * 2;
                        e.wanderTimer = 60 + Math.random() * 90;
                    }
                    e.x += Math.cos(e.wanderDir) * speed * 0.2;
                    e.y += Math.sin(e.wanderDir) * speed * 0.2;
                    if (Math.abs(e.x - e.spawnX) > patrolRange || Math.abs(e.y - e.spawnY) > patrolRange) {
                        const angleToSpawn = Math.atan2(e.spawnY - e.y, e.spawnX - e.x);
                        e.x += Math.cos(angleToSpawn) * speed * 0.3;
                        e.y += Math.sin(angleToSpawn) * speed * 0.3;
                    }
                    if (e.x < window.TILE || e.x > (window.MAP_W - 1) * window.TILE || 
                        e.y < window.TILE || e.y > (window.MAP_H - 1) * window.TILE) {
                        e.x = e.spawnX;
                        e.y = e.spawnY;
                    }
                    break;
                case 'idle':
                default:
                    break;
            }
            
            const tileX = Math.floor((e.x + e.w/2) / window.TILE);
            const tileY = Math.floor((e.y + e.h/2) / window.TILE);
            if (map[tileY] && (map[tileY][tileX] === 1 || map[tileY][tileX] === 4 || map[tileY][tileX] === 5)) {
                e.x = e.spawnX;
                e.y = e.spawnY;
            }
            e.x = Math.max(window.TILE, Math.min((window.MAP_W - 1) * window.TILE - 10, e.x));
            e.y = Math.max(window.TILE, Math.min((window.MAP_H - 1) * window.TILE - 10, e.y));
        }
        
        if (dist < 30 && e.attackCooldown <= 0 && player.invulnerable <= 0 && e.frozen <= 0) {
            const dmg = Math.max(1, e.atk - player.def + Math.floor(Math.random() * 3));
            player.hp -= dmg;
            spawnDamageNumber(player.x + player.w/2, player.y, dmg);
            player.invulnerable = 30;
            damageFlash = 10;
            spawnParticles(player.x + player.w/2, player.y + player.h/2, '#f00', 5);
            if (player.hp <= 0) {
                gameState = 'gameover';
                showMessage('GAME OVER - Tap to restart', 300);
            }
            e.attackCooldown = 60;
        }
    });
    
    if (window.boss) {
        if (window.boss.attackCooldown > 0) window.boss.attackCooldown--;
        if (!window.boss.aggro) window.boss.aggro = 0;
        if (window.boss.aggro > 0) window.boss.aggro--;
        
        const dx = player.x - window.boss.x;
        const dy = player.y - window.boss.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 250 && dist > 50) {
            const chaseSpeed = window.boss.aggro > 0 ? 1.5 : 1;
            window.boss.x += (dx / dist) * chaseSpeed;
            window.boss.y += (dy / dist) * chaseSpeed;
        }
        
        window.boss.x = Math.max(window.TILE, Math.min((window.MAP_W - 1) * window.TILE - window.boss.w, window.boss.x));
        window.boss.y = Math.max(window.TILE, Math.min((window.MAP_H - 1) * window.TILE - window.boss.h, window.boss.y));
        
        const bossTileX = Math.floor((window.boss.x + window.boss.w/2) / window.TILE);
        const bossTileY = Math.floor((window.boss.y + window.boss.h/2) / window.TILE);
        if (map[bossTileY] && (map[bossTileY][bossTileX] === 1 || map[bossTileY][bossTileX] === 4 || map[bossTileY][bossTileX] === 5)) {
            window.boss.x = 7 * window.TILE;
            window.boss.y = 3 * window.TILE;
        }
        
        if (dist < 40 && window.boss.attackCooldown <= 0 && player.invulnerable <= 0) {
            const dmg = Math.max(1, window.boss.atk - player.def + Math.floor(Math.random() * 5));
            player.hp -= dmg;
            spawnDamageNumber(player.x + player.w/2, player.y, dmg);
            player.invulnerable = 20;
            damageFlash = 15;
            spawnParticles(player.x + player.w/2, player.y + player.h/2, '#f00', 10);
            showMessage(`BOSS ATTACK! -${dmg} HP`);
            if (player.hp <= 0) {
                gameState = 'gameover';
                showMessage('GAME OVER - Tap to restart', 300);
            }
            window.boss.attackCooldown = 45;
        }
    }
    
    drops = drops.filter(d => {
        d.life--;
        
        const dx = player.x + player.w/2 - d.x;
        const dy = player.y + player.h/2 - d.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 100 && d.life < 1600) {
            d.x += dx * 0.15;
            d.y += dy * 0.15;
        }
        
        if (dist < 20) {
            if (d.item.type === 'treasure') {
                player.gold += d.item.value;
                showMessage(`+${d.item.value} Gold!`);
            } else if (d.item.type === 'consumable') {
                if (d.item.heal) {
                    player.hp = Math.min(player.maxHp, player.hp + d.item.heal);
                    showMessage(`+${d.item.heal} HP!`);
                }
                if (d.item.mp) {
                    player.mp = Math.min(player.maxMp, player.mp + d.item.mp);
                    showMessage(`+${d.item.mp} MP!`);
                }
            } else {
                player.inventory.push(d.item);
                if (!discoveredItems[d.item.id]) {
                    discoveredItems[d.item.id] = { count: 0 };
                }
                discoveredItems[d.item.id].count++;
                showMessage(`Got ${d.item.name}!`);
            }
            return false;
        }
        
        if (d.life < 600 && d.life % 30 === 0) {
            d.y += Math.sin(Date.now() / 200 + d.x) * 0.3;
        }
        
        return d.life > 0;
    });
    
    enemies = enemies.filter(e => e.hp > 0);
    
    if (enemies.length === 0 && !window.boss && gameState === 'playing' && !levelTransitioning) {
        levelTransitioning = true;
        showMessage(`Level ${mapLevel} cleared! Next level...`, 180);
        setTimeout(() => {
            mapLevel++;
            generateMap();
            spawnEnemies();
            player.x = 7 * window.TILE;
            player.y = 15 * window.TILE;
            levelTransitioning = false;
        }, 1500);
    }
    
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        return p.life > 0;
    });
    
    damageNumbers = damageNumbers.filter(d => {
        d.y += d.vy;
        d.life--;
        return d.life > 0;
    });
    
    projectiles = projectiles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        
        let hit = false;
        enemies.forEach(e => {
            const dx = p.x - (e.x + e.w/2);
            const dy = p.y - (e.y + e.h/2);
            if (Math.sqrt(dx*dx + dy*dy) < 20) {
                e.hp -= p.damage;
                spawnDamageNumber(e.x + e.w/2, e.y, p.damage);
                e.aggro = 120;
                spawnParticles(e.x + e.w/2, e.y + e.h/2, '#f84', 5);
                hit = true;
                if (e.hp <= 0) {
                    discoverEnemy(e.type, e.name);
                }
            }
        });
        
        if (window.boss) {
            const dx = p.x - (window.boss.x + window.boss.w/2);
            const dy = p.y - (window.boss.y + window.boss.h/2);
            if (Math.sqrt(dx*dx + dy*dy) < 30) {
                window.boss.hp -= p.damage;
                spawnDamageNumber(window.boss.x + window.boss.w/2, window.boss.y, p.damage);
                window.boss.aggro = 120;
                spawnParticles(window.boss.x + window.boss.w/2, window.boss.y + window.boss.h/2, '#f84', 10);
                hit = true;
                if (window.boss.hp <= 0) {
                    discoverEnemy(window.boss.type, window.boss.name);
                    player.exp += window.boss.exp;
                    player.gold += window.boss.gold;
                    spawnDrop(window.boss.x, window.boss.y, true);
                    showMessage(`BOSS DEFEATED! +${window.boss.exp} EXP!`);
                    mapLevel++;
                    levelTransitioning = true;
                    setTimeout(() => {
                        generateMap();
                        spawnEnemies();
                        player.x = 7 * window.TILE;
                        player.y = 15 * window.TILE;
                        levelTransitioning = false;
                    }, 2000);
                    window.boss = null;
                }
            }
        }
        
        return p.life > 0 && !hit;
    });
    
    if (player.exp >= player.level * 50) {
        player.level++;
        player.maxHp += 30;
        player.hp = player.maxHp;
        player.maxMp += 15;
        player.mp = player.maxMp;
        player.atk += 5;
        player.def += 3;
        player.hpRegen += 0.5;
        player.mpRegen += 0.3;
        player.invulnerable = 60;
        showMessage(`LEVEL UP! Now level ${player.level}! (+HP +MP +ATK +DEF)`);
        playSound('levelup');
    }
    
    updateUI();
}

function render() {
    const player = window.player;
    
    if (damageFlash > 0) {
        ctx.fillStyle = `rgba(255, 0, 0, ${damageFlash / 30})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        damageFlash--;
    }
    
    drawMap(ctx, map, window.TILE, window.MAP_W, window.MAP_H);
    drawDrops(ctx, drops);
    drawProjectiles(ctx, projectiles);
    drawEnemies(ctx, enemies, drawPixelSprite);
    drawBoss(ctx, window.boss, drawPixelSprite);
    drawPlayer(ctx, player, drawPixelSprite, player.invulnerable);
    drawPlayerAttack(ctx, player);
    drawClouds(ctx, canvas.width, canvas.height, player);
    handleCloudLightning();
    drawParticles(ctx, particles);
    drawDamageNumbers(ctx, damageNumbers);
    
    if (message) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(80, 40, 320, 40);
        ctx.fillStyle = '#fff';
        ctx.font = '18px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(message, 240, 68);
        ctx.textAlign = 'left';
        if (messageTimer > 0) messageTimer--;
        else message = '';
    }
    
    if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f00';
        ctx.font = '36px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 240, 300);
        ctx.fillStyle = '#fff';
        ctx.font = '18px Courier New';
        ctx.fillText('Tap to restart', 240, 340);
        ctx.textAlign = 'left';
    }
}

function updateUI() {
    const player = window.player;
    const expNeeded = player.level * 50;
    
    document.getElementById('level').textContent = player.level;
    document.getElementById('gold').textContent = player.gold;
    
    const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    const mpPercent = Math.max(0, Math.min(100, (player.mp / player.maxMp) * 100));
    
    document.getElementById('hp-bar').style.width = `${hpPercent}%`;
    document.getElementById('mp-bar').style.width = `${mpPercent}%`;
    
    const eqCountEl = document.getElementById('eq-count');
    if (eqCountEl) {
        eqCountEl.textContent = '';
    }
    
    window.playerSkills.forEach((skill, i) => {
        const slot = document.querySelector(`#skills .skill-slot:nth-child(${i + 1})`);
        if (slot) {
            const cd = window.skillCooldowns[skill.id];
            const cooldownEl = slot.querySelector('.cooldown');
            if (cooldownEl) {
                cooldownEl.style.height = `${(cd / skill.cd) * 100}%`;
            }
        }
    });
}

function setupInput() {
    document.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (gameState === 'gameover') {
            restartGame();
            return;
        }
        if (e.key === ' ' || e.key === 'z') attack();
        if (e.key >= '1' && e.key <= '7') useSkill(parseInt(e.key) - 1);
    });
    
    document.addEventListener('keyup', e => {
        keys[e.key] = false;
    });
    
    setInterval(() => {
        if (gameState !== 'playing') return;
        const player = window.player;
        let dx = 0, dy = 0;
        
        if (keys['ArrowUp'] || keys['w']) dy = -1;
        if (keys['ArrowDown'] || keys['s']) dy = 1;
        if (keys['ArrowLeft'] || keys['a']) dx = -1;
        if (keys['ArrowRight'] || keys['d']) dx = 1;
        
        if (dx !== 0 || dy !== 0) {
            player.dirX = dx;
            player.dirY = dy;
            
            const nx = player.x + dx * 3;
            const ny = player.y + dy * 3;
            
            const tx = Math.floor((nx + 10) / window.TILE);
            const ty = Math.floor((ny + 10) / window.TILE);
            
            const tile = map[ty] ? map[ty][tx] : 1;
            if (tile !== 1 && tile !== 4 && tile !== 5) {
                player.x = nx;
                player.y = ny;
            }
        }
    }, 1000/60);
}

function attack() {
    const player = window.player;
    if (player.attacking > 0) return;
    
    player.attacking = 20;
    
    const px = player.x + player.w/2;
    const py = player.y + player.h/2;
    const range = 50;
    const dirX = player.dirX;
    const dirY = player.dirY;
    
    function isTargetInDirection(targetX, targetY) {
        const dx = targetX - px;
        const dy = targetY - py;
        if (dirX !== 0 && Math.abs(dy) < 50) {
            return (dirX > 0 && dx > -10) || (dirX < 0 && dx < 10);
        }
        if (dirY !== 0 && Math.abs(dx) < 50) {
            return (dirY > 0 && dy > -10) || (dirY < 0 && dy < 10);
        }
        return true;
    }
    
    enemies.forEach(e => {
        const dx = (e.x + e.w/2) - px;
        const dy = (e.y + e.h/2) - py;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < range && isTargetInDirection(e.x + e.w/2, e.y + e.h/2)) {
            const dmg = Math.max(1, player.atk - e.def + Math.floor(Math.random() * 5));
            e.hp -= dmg;
            spawnDamageNumber(e.x + e.w/2, e.y, dmg);
            e.vx = dirX * 5;
            e.vy = dirY * 5;
            spawnParticles(e.x + e.w/2, e.y + e.h/2, '#f44', 5);
            if (e.hp <= 0) {
                discoverEnemy(e.type, e.name);
                player.exp += e.exp;
                player.gold += e.gold;
                spawnDrop(e.x, e.y);
                showMessage(`Defeated ${e.name}! +${e.exp} EXP`);
            }
        }
    });
    
    if (window.boss) {
        const dx = (window.boss.x + window.boss.w/2) - px;
        const dy = (window.boss.y + window.boss.h/2) - py;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < range + 20 && isTargetInDirection(window.boss.x + window.boss.w/2, window.boss.y + window.boss.h/2)) {
            const dmg = Math.max(1, player.atk - window.boss.def + Math.floor(Math.random() * 10));
            window.boss.hp -= dmg;
            window.boss.vx = dirX * 8;
            window.boss.vy = dirY * 8;
            spawnParticles(window.boss.x + window.boss.w/2, window.boss.y + window.boss.h/2, '#f44', 10);
            if (window.boss.hp <= 0) {
                discoverEnemy(window.boss.type, window.boss.name);
                player.exp += window.boss.exp;
                player.gold += window.boss.gold;
                spawnDrop(window.boss.x, window.boss.y, true);
                showMessage(`BOSS DEFEATED! +${window.boss.exp} EXP!`);
                mapLevel++;
                levelTransitioning = true;
                setTimeout(() => {
                    generateMap();
                    spawnEnemies();
                    player.x = 7 * window.TILE;
                    player.y = 15 * window.TILE;
                    levelTransitioning = false;
                }, 2000);
                window.boss = null;
            }
        }
    }
    
    playSound('attack');
}

function useSkill(index) {
    const skill = window.playerSkills[index];
    if (!skill) return;
    
    const player = window.player;
    if (player.mp < skill.mp) {
        showMessage('Not enough MP!');
        return;
    }
    if (window.skillCooldowns[skill.id] > 0) {
        showMessage('Skill on cooldown!');
        return;
    }
    
    player.mp -= skill.mp;
    window.skillCooldowns[skill.id] = skill.cd;
    
    const baseX = player.x + player.w/2;
    const baseY = player.y + player.h/2;
    const dirX = player.dirX;
    const dirY = player.dirY;
    
    function isTargetInDirection(targetX, targetY) {
        const dx = targetX - baseX;
        const dy = targetY - baseY;
        if (dirX !== 0 && Math.abs(dy) < 50) {
            return (dirX > 0 && dx > -10) || (dirX < 0 && dx < 10);
        }
        if (dirY !== 0 && Math.abs(dx) < 50) {
            return (dirY > 0 && dy > -10) || (dirY < 0 && dy < 10);
        }
        return true;
    }
    
    if (skill.type === 'single') {
        player.attacking = 20;
        const range = skill.range;
        enemies.forEach(e => {
            const dx = (e.x + e.w/2) - baseX;
            const dy = (e.y + e.h/2) - baseY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < range && isTargetInDirection(e.x + e.w/2, e.y + e.h/2)) {
                const dmg = Math.floor(player.atk * skill.damage);
                e.hp -= dmg;
                spawnParticles(e.x + e.w/2, e.y + e.h/2, '#ff0', 10);
                showMessage(`${skill.name} hit! -${dmg}`);
            }
        });
        if (window.boss) {
            const dx = (window.boss.x + window.boss.w/2) - baseX;
            const dy = (window.boss.y + window.boss.h/2) - baseY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < range && isTargetInDirection(window.boss.x + window.boss.w/2, window.boss.y + window.boss.h/2)) {
                const dmg = Math.floor(player.atk * skill.damage);
                window.boss.hp -= dmg;
                showMessage(`${skill.name} hit boss! -${dmg}`);
            }
        }
    } else if (skill.type === 'projectile') {
        let vx = 0, vy = 0;
        const speed = skill.speed || 6;
        if (dirX !== 0) vx = dirX * speed;
        else if (dirY !== 0) vy = dirY * speed;
        else vx = speed;
        projectiles.push({
            x: baseX, y: baseY,
            vx: vx, vy: vy,
            damage: player.atk * skill.damage,
            color: skill.projectileColor || '#fff',
            particleColor: skill.particleColor || '#fff',
            size: skill.size || 12,
            life: 60,
            isLightning: skill.isLightning || false,
            isTornado: skill.isTornado || false,
            isIce: skill.isIce || false,
            isVine: skill.isVine || false,
            isFire: skill.id === 'fireball' ? true : false
        });
        
        if (!discoveredSkills[skill.id]) {
            discoveredSkills[skill.id] = { count: 0 };
        }
        discoveredSkills[skill.id].count++;
    }
    
    playSound('skill');
}

function setupUI() {
    const skillsContainer = document.getElementById('skills');
    skillsContainer.innerHTML = '';
    
    window.playerSkills.forEach((skill, i) => {
        const slot = document.createElement('div');
        slot.className = 'skill-slot';
        slot.innerHTML = `
            <span class="hotkey">${i + 1}</span>
            ${skill.icon}
            <div class="cooldown"></div>
        `;
        slot.addEventListener('click', () => useSkill(i));
        skillsContainer.appendChild(slot);
    });
    
    canvas.addEventListener('click', () => {
        if (gameState === 'gameover') {
            restartGame();
        } else {
            attack();
        }
    });
    
    const upBtn = document.getElementById('up');
    const downBtn = document.getElementById('down');
    const leftBtn = document.getElementById('left');
    const rightBtn = document.getElementById('right');
    const attackBtn = document.getElementById('attack');
    
    if (upBtn) {
        upBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowUp'] = true; });
        upBtn.addEventListener('touchend', (e) => { e.preventDefault(); keys['ArrowUp'] = false; });
        upBtn.addEventListener('mousedown', (e) => { keys['ArrowUp'] = true; });
        upBtn.addEventListener('mouseup', (e) => { keys['ArrowUp'] = false; });
    }
    if (downBtn) {
        downBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowDown'] = true; });
        downBtn.addEventListener('touchend', (e) => { e.preventDefault(); keys['ArrowDown'] = false; });
        downBtn.addEventListener('mousedown', (e) => { keys['ArrowDown'] = true; });
        downBtn.addEventListener('mouseup', (e) => { keys['ArrowDown'] = false; });
    }
    if (leftBtn) {
        leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowLeft'] = true; });
        leftBtn.addEventListener('touchend', (e) => { e.preventDefault(); keys['ArrowLeft'] = false; });
        leftBtn.addEventListener('mousedown', (e) => { keys['ArrowLeft'] = true; });
        leftBtn.addEventListener('mouseup', (e) => { keys['ArrowLeft'] = false; });
    }
    if (rightBtn) {
        rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowRight'] = true; });
        rightBtn.addEventListener('touchend', (e) => { e.preventDefault(); keys['ArrowRight'] = false; });
        rightBtn.addEventListener('mousedown', (e) => { keys['ArrowRight'] = true; });
        rightBtn.addEventListener('mouseup', (e) => { keys['ArrowRight'] = false; });
    }
    if (attackBtn) {
        attackBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            attack();
        });
    }
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            saveGame();
        });
    }
    
    const invBtn = document.getElementById('inventoryBtn');
    if (invBtn) {
        invBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (characterOpen) {
                closeCharacterPanel();
                openInventory();
            } else if (inventoryOpen) {
                closeInventory();
            } else {
                openInventory();
            }
        });
    }
    
    const charBtn = document.getElementById('characterBtn');
    if (charBtn) {
        charBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (inventoryOpen) {
                closeInventory();
                openCharacterPanel();
            } else if (characterOpen) {
                closeCharacterPanel();
            } else {
                openCharacterPanel();
            }
        });
    }
    
    const playerInfo = document.getElementById('player-info');
    if (playerInfo) {
        playerInfo.addEventListener('click', (e) => {
            if (e.target.id === 'characterBtn') return;
            e.stopPropagation();
            if (inventoryOpen || characterOpen) {
                closeInventory();
                closeCharacterPanel();
            } else {
                openCharacterPanel();
            }
        });
    }
    
    const charCloseBtn = document.getElementById('character-close');
    if (charCloseBtn) {
        charCloseBtn.addEventListener('click', closeCharacterPanel);
    }
    
    const shopBtn = document.getElementById('shopBtn');
    if (shopBtn) {
        shopBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (characterOpen) {
                closeCharacterPanel();
                openShop();
            } else if (shopOpen) {
                closeShop();
            } else {
                openShop();
            }
        });
    }
    
    const shopCloseBtn = document.getElementById('shop-close');
    if (shopCloseBtn) {
        shopCloseBtn.addEventListener('click', closeShop);
    }
    
    const shopRefreshBtn = document.getElementById('shop-refresh');
    if (shopRefreshBtn) {
        shopRefreshBtn.addEventListener('click', refreshShop);
    }
    
    const langBtn = document.getElementById('languageToggle');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
            langBtn.textContent = currentLanguage === 'zh' ? '中' : 'EN';
        });
    }
    
    const bestiaryBtn = document.getElementById('bestiaryBtn');
    if (bestiaryBtn) {
        bestiaryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (characterOpen) {
                closeCharacterPanel();
                openBestiary();
            } else if (shopOpen) {
                closeShop();
                openBestiary();
            } else if (bestiaryOpen) {
                closeBestiary();
            } else {
                openBestiary();
            }
        });
    }
    
    const bestiaryCloseBtn = document.getElementById('bestiary-close');
    if (bestiaryCloseBtn) {
        bestiaryCloseBtn.addEventListener('click', closeBestiary);
    }
    
    const bestiaryTabMonster = document.getElementById('bestiary-tab-monster');
    if (bestiaryTabMonster) {
        bestiaryTabMonster.addEventListener('click', () => {
            bestiaryTab = 'monster';
            updateBestiaryTabs();
            renderBestiary();
        });
    }
    
    const bestiaryTabSkill = document.getElementById('bestiary-tab-skill');
    if (bestiaryTabSkill) {
        bestiaryTabSkill.addEventListener('click', () => {
            bestiaryTab = 'skill';
            updateBestiaryTabs();
            renderBestiary();
        });
    }
    
    const bestiaryTabEquip = document.getElementById('bestiary-tab-equip');
    if (bestiaryTabEquip) {
        bestiaryTabEquip.addEventListener('click', () => {
            bestiaryTab = 'equip';
            updateBestiaryTabs();
            renderBestiary();
        });
    }
    
    const controlsBtn = document.getElementById('controlsBtn');
    if (controlsBtn) {
        controlsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('controls').classList.toggle('show');
        });
    }
}

function restartGame() {
    window.player = createPlayer();
    window.playerSkills = window.skills.slice(0, 7);
    window.skillCooldowns = {};
    window.skills.forEach(s => window.skillCooldowns[s.id] = 0);
    mapLevel = 1;
    enemies = [];
    drops = [];
    particles = [];
    projectiles = [];
    window.boss = null;
    gameState = 'playing';
    damageFlash = 0;
    message = '';
    inventoryOpen = false;
    levelTransitioning = false;
    document.getElementById('inventory').classList.remove('show');
    generateMap();
    spawnEnemies();
    updateUI();
}

function saveGame() {
    let itemUidCounter = 1;
    const getUid = () => itemUidCounter++;
    
    const assignUids = (item) => {
        if (!item) return null;
        if (!item.uid) item.uid = getUid();
        return item;
    };
    
    assignUids(window.player.weapon);
    assignUids(window.player.armor);
    assignUids(window.player.helmet);
    assignUids(window.player.boots);
    assignUids(window.player.ring);
    assignUids(window.player.necklace);
    window.player.inventory.forEach(i => assignUids(i));
    
    const saveItemWithQuality = (item) => {
        if (!item) return null;
        return {
            uid: item.uid,
            id: item.id,
            name: item.name,
            type: item.type,
            icon: item.icon,
            sprite: item.sprite || '',
            quality: item.quality || 'common',
            qualityName: item.qualityName || '普通',
            color: item.color || '#fff',
            atk: item.atk || 0,
            def: item.def || 0,
            maxHp: item.maxHp || 0,
            maxMp: item.maxMp || 0,
            heal: item.heal || 0,
            mp: item.mp || 0,
            level: item.level || 1,
            qualityBonus: item.qualityBonus || 1,
            hpRegen: item.hpRegen || 0,
            mpRegen: item.mpRegen || 0,
            atkPercent: item.atkPercent || 0,
            defPercent: item.defPercent || 0
        };
    };
    
    const data = {
        player: {
            level: window.player.level,
            exp: window.player.exp,
            gold: window.player.gold,
            hp: window.player.hp,
            maxHp: window.player.maxHp,
            mp: window.player.mp,
            maxMp: window.player.maxMp,
            weapon: saveItemWithQuality(window.player.weapon),
            armor: saveItemWithQuality(window.player.armor),
            helmet: saveItemWithQuality(window.player.helmet),
            boots: saveItemWithQuality(window.player.boots),
            ring: saveItemWithQuality(window.player.ring),
            necklace: saveItemWithQuality(window.player.necklace),
            inventory: window.player.inventory.map(i => saveItemWithQuality(i))
        },
        mapLevel: mapLevel
    };
    saveToDB(data).then(() => {
        showMessage('Game saved!', 60);
    }).catch(e => {
        console.error('Save error:', e);
        showMessage('Save failed!', 60);
    });
}

async function loadGame() {
    try {
        const saved = await loadFromDB();
        if (saved) {
            const data = saved;
            if (data.player) {
                const p = window.player;
                p.level = data.player.level || 1;
                p.exp = data.player.exp || 0;
                p.gold = data.player.gold || 0;
                p.hp = data.player.hp || p.maxHp;
                p.maxHp = data.player.maxHp || 100;
                p.mp = data.player.mp || p.maxMp;
                p.maxMp = data.player.maxMp || 150;
                
                const loadItem = (savedItem) => {
                    if (!savedItem) return null;
                    if (savedItem.id && savedItem.name && savedItem.icon) {
                        if (!savedItem.uid) {
                            savedItem.uid = Date.now() + Math.random();
                        }
                        return savedItem;
                    }
                    const baseItem = window.baseItems?.find(i => i.id === savedItem.id);
                    if (!baseItem) return null;
                    return { ...baseItem, color: '#fff', quality: 'common', qualityName: '普通', uid: Date.now() + Math.random() };
                };
                
                p.weapon = loadItem(data.player.weapon);
                p.armor = loadItem(data.player.armor);
                p.helmet = loadItem(data.player.helmet);
                p.boots = loadItem(data.player.boots);
                p.ring = loadItem(data.player.ring);
                p.necklace = loadItem(data.player.necklace);
                p.inventory = (data.player.inventory || []).map(i => loadItem(i)).filter(i => i);
                
                p.atk = 10 + (p.weapon?.atk || 0) + (p.ring?.atk || 0) + (p.necklace?.atk || 0);
                p.def = 5 + (p.armor?.def || 0) + (p.helmet?.def || 0) + (p.boots?.def || 0) + (p.ring?.def || 0);
                p.maxHp = 100 + (p.ring?.maxHp || 0) + (p.necklace?.maxHp || 0);
                p.maxMp = 50 + (p.necklace?.maxMp || 0);
            }
            if (data.mapLevel) {
                mapLevel = data.mapLevel;
                generateMap();
                spawnEnemies();
            }
            showMessage('Game loaded!', 60);
            updateUI();
        }
    } catch (e) {
        console.error('Failed to load save:', e);
    }
}

function playSound(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'attack') {
            oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'levelup') {
            oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
            oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'skill') {
            oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
        } else if (type === 'boss') {
            oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        }
    } catch (e) {
        console.log('Audio not available');
    }
}

function openInventory() {
    inventoryOpen = true;
    const inv = document.getElementById('inventory');
    const player = window.player;
    
    inv.innerHTML = `
        <div id="inventory-title">
            <span>背包 (${player.inventory.length})</span>
            <button id="inventory-close">✕</button>
        </div>
        <div id="inventory-grid"></div>
        <div id="inventory-equipment">
            <div>武器 <span id="inv-weapon"></span></div>
            <div>衣服 <span id="inv-armor"></span></div>
            <div>帽子 <span id="inv-helmet"></span></div>
            <div>鞋子 <span id="inv-boots"></span></div>
            <div>戒指 <span id="inv-ring"></span></div>
            <div>项链 <span id="inv-necklace"></span></div>
        </div>
        <div style="text-align:center;color:#aaa;font-size:12px;margin-bottom:5px;">一键出售未穿戴装备</div>
        <div id="inventory-quick-sell">
            <button class="quick-sell-btn" data-quality="common" style="border-color:#fff" title="出售白色装备">白</button>
            <button class="quick-sell-btn" data-quality="uncommon" style="border-color:#4f4" title="出售绿色装备">绿</button>
            <button class="quick-sell-btn" data-quality="rare" style="border-color:#44f" title="出售蓝色装备">蓝</button>
            <button class="quick-sell-btn" data-quality="epic" style="border-color:#a4f" title="出售紫色装备">紫</button>
            <button class="quick-sell-btn" data-quality="legendary" style="border-color:#fa4" title="出售金色装备">金</button>
        </div>
        <div id="inventory-actions">
            <button id="inventory-sell">出售</button>
        </div>
    `;
    
    const grid = document.getElementById('inventory-grid');
    
    const ensureUid = (item) => {
        if (item && !item.uid) {
            item.uid = Date.now() + Math.random();
        }
    };
    ensureUid(player.weapon);
    ensureUid(player.armor);
    ensureUid(player.helmet);
    ensureUid(player.boots);
    ensureUid(player.ring);
    ensureUid(player.necklace);
    player.inventory.forEach(ensureUid);
    
    for (let i = 0; i < player.inventory.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        if (player.inventory[i]) {
            const item = player.inventory[i];
            const itemUid = item.uid;
            const isEquipped = (player.weapon && player.weapon.uid === itemUid) ||
                              (player.armor && player.armor.uid === itemUid) ||
                              (player.helmet && player.helmet.uid === itemUid) ||
                              (player.boots && player.boots.uid === itemUid) ||
                              (player.ring && player.ring.uid === itemUid) ||
                              (player.necklace && player.necklace.uid === itemUid);
            
            let slotContent = item.icon || '?';
            
            if (isEquipped) {
                slot.classList.add('equipped');
                slotContent += '<span class="eq-badge">E</span>';
            }
            
            let stats = '';
            if (item.atk) stats += ` ATK:${item.atk}`;
            if (item.atkPercent) stats += ` ATK%+${item.atkPercent}%`;
            if (item.def) stats += ` DEF:${item.def}`;
            if (item.defPercent) stats += ` DEF%+${item.defPercent}%`;
            if (item.maxHp) stats += ` HP+${item.maxHp}`;
            if (item.maxMp) stats += ` MP+${item.maxMp}`;
            if (item.hpRegen) stats += ` HP回${item.hpRegen}/s`;
            if (item.mpRegen) stats += ` MP回${item.mpRegen}/s`;
            slot.innerHTML = slotContent;
            slot.title = `${item.name || 'Unknown'}${item.qualityName ? ' (' + item.qualityName + ')' : ''}${stats}${isEquipped ? ' [已装备]' : ''}`;
            slot.style.borderColor = item.color || '#888';
            slot.style.position = 'relative';
            if (item.quality === 'legendary') {
                slot.classList.add('legendary');
            }
        }
        grid.appendChild(slot);
    }
    
    const eqWeapon = document.getElementById('inv-weapon');
    const eqArmor = document.getElementById('inv-armor');
    const eqHelmet = document.getElementById('inv-helmet');
    const eqBoots = document.getElementById('inv-boots');
    const eqRing = document.getElementById('inv-ring');
    const eqNecklace = document.getElementById('inv-necklace');
    
    if (player.weapon) {
        eqWeapon.textContent = player.weapon.icon + ' ' + player.weapon.name;
        eqWeapon.style.color = player.weapon.color || '#fff';
    }
    if (player.armor) {
        eqArmor.textContent = player.armor.icon + ' ' + player.armor.name;
        eqArmor.style.color = player.armor.color || '#fff';
    }
    if (player.helmet) {
        eqHelmet.textContent = player.helmet.icon + ' ' + player.helmet.name;
        eqHelmet.style.color = player.helmet.color || '#fff';
    }
    if (player.boots) {
        eqBoots.textContent = player.boots.icon + ' ' + player.boots.name;
        eqBoots.style.color = player.boots.color || '#fff';
    }
    if (player.ring) {
        eqRing.textContent = player.ring.icon + ' ' + player.ring.name;
        eqRing.style.color = player.ring.color || '#fff';
    }
    if (player.necklace) {
        eqNecklace.textContent = player.necklace.icon + ' ' + player.necklace.name;
        eqNecklace.style.color = player.necklace.color || '#fff';
    }
    
    document.getElementById('inventory-close').addEventListener('click', closeInventory);
    
    let sellMode = false;
    const sellBtn = document.getElementById('inventory-sell');
    sellBtn.addEventListener('click', () => {
        sellMode = !sellMode;
        sellBtn.textContent = sellMode ? '选择物品出售' : '出售';
        sellBtn.style.background = sellMode ? 'rgba(150,50,50,0.8)' : '';
        
        if (sellMode) {
            showMessage('点击物品出售 (返还50%金币)');
        }
    });
    
    document.querySelectorAll('.quick-sell-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const quality = btn.dataset.quality;
            let totalGold = 0;
            let count = 0;
            
            const equippedUids = new Set([
                player.weapon?.uid, player.armor?.uid, player.helmet?.uid,
                player.boots?.uid, player.ring?.uid, player.necklace?.uid
            ].filter(Boolean));
            
            player.inventory = player.inventory.filter(item => {
                if (item && item.quality === quality && !equippedUids.has(item.uid)) {
                    const price = Math.floor((item.price || 10) * 0.5);
                    totalGold += price;
                    count++;
                    return false;
                }
                return true;
            });
            
            if (count > 0) {
                player.gold += totalGold;
                showMessage(`出售${count}件${quality}装备 +${totalGold}金币`);
                openInventory();
                updateUI();
            } else {
                showMessage(`没有可出售的${quality}装备`);
            }
        });
    });
    
    grid.addEventListener('click', (e) => {
        const slot = e.target.closest('.inv-slot');
        if (!slot) return;
        const index = Array.from(grid.children).indexOf(slot);
        const item = player.inventory[index];
        if (!item) return;
        
        if (sellMode) {
            const itemUid = item.uid;
            const isEquipped = (player.weapon && player.weapon.uid === itemUid) ||
                              (player.armor && player.armor.uid === itemUid) ||
                              (player.helmet && player.helmet.uid === itemUid) ||
                              (player.boots && player.boots.uid === itemUid) ||
                              (player.ring && player.ring.uid === itemUid) ||
                              (player.necklace && player.necklace.uid === itemUid);
            if (isEquipped) {
                showMessage('不能出售已装备的物品!');
                return;
            }
            const price = Math.floor((item.atk || item.def || 5) * 5 * (item.qualityBonus || 1));
            player.gold += price;
            player.inventory.splice(index, 1);
            updateUI();
            openInventory();
            showMessage(`已出售 ${item.name} +${price}金币`);
            return;
        }
        
        useItem(index);
    });
    
    inv.classList.add('show');
}

function closeInventory() {
    inventoryOpen = false;
    document.getElementById('inventory').classList.remove('show');
}

function openCharacterPanel() {
    characterOpen = true;
    inventoryOpen = true;
    const panel = document.getElementById('character-panel');
    const player = window.player;
    
    document.getElementById('char-level').textContent = player.level;
    document.getElementById('char-hp').textContent = `${player.hp}/${player.maxHp}`;
    document.getElementById('char-mp').textContent = `${player.mp}/${player.maxMp}`;
    document.getElementById('char-atk').textContent = player.atk;
    document.getElementById('char-def').textContent = player.def;
    
    const totalAtkPercent = ((player.weapon?.atkPercent || 0) + (player.armor?.atkPercent || 0) + (player.helmet?.atkPercent || 0) + (player.boots?.atkPercent || 0) + (player.ring?.atkPercent || 0) + (player.necklace?.atkPercent || 0));
    const totalDefPercent = ((player.weapon?.defPercent || 0) + (player.armor?.defPercent || 0) + (player.helmet?.defPercent || 0) + (player.boots?.defPercent || 0) + (player.ring?.defPercent || 0) + (player.necklace?.defPercent || 0));
    const totalHpRegen = (player.weapon?.hpRegen || 0) + (player.armor?.hpRegen || 0) + (player.helmet?.hpRegen || 0) + (player.boots?.hpRegen || 0) + (player.ring?.hpRegen || 0) + (player.necklace?.hpRegen || 0);
    const totalMpRegen = (player.weapon?.mpRegen || 0) + (player.armor?.mpRegen || 0) + (player.helmet?.mpRegen || 0) + (player.boots?.mpRegen || 0) + (player.ring?.mpRegen || 0) + (player.necklace?.mpRegen || 0);
    
    document.getElementById('char-atk-percent').textContent = totalAtkPercent > 0 ? `+${totalAtkPercent}%` : '';
    document.getElementById('char-def-percent').textContent = totalDefPercent > 0 ? `+${totalDefPercent}%` : '';
    document.getElementById('char-hp-regen').textContent = totalHpRegen > 0 ? `+${totalHpRegen}/s` : '0';
    document.getElementById('char-mp-regen').textContent = totalMpRegen > 0 ? `+${totalMpRegen}/s` : '0';
    
    document.getElementById('char-weapon').textContent = player.weapon ? player.weapon.icon : '';
    document.getElementById('char-armor').textContent = player.armor ? player.armor.icon : '';
    document.getElementById('char-helmet').textContent = player.helmet ? player.helmet.icon : '';
    document.getElementById('char-boots').textContent = player.boots ? player.boots.icon : '';
    document.getElementById('char-ring').textContent = player.ring ? player.ring.icon : '';
    document.getElementById('char-necklace').textContent = player.necklace ? player.necklace.icon : '';
    document.getElementById('char-body').textContent = '🧙';
    
    document.getElementById('char-weapon').style.borderColor = player.weapon?.color || '#668';
    document.getElementById('char-armor').style.borderColor = player.armor?.color || '#668';
    document.getElementById('char-helmet').style.borderColor = player.helmet?.color || '#668';
    document.getElementById('char-boots').style.borderColor = player.boots?.color || '#668';
    document.getElementById('char-ring').style.borderColor = player.ring?.color || '#668';
    document.getElementById('char-necklace').style.borderColor = player.necklace?.color || '#668';
    
    panel.classList.add('show');
}

function closeCharacterPanel() {
    characterOpen = false;
    inventoryOpen = false;
    document.getElementById('character-panel').classList.remove('show');
}

function generateShopItems() {
    shopItems = [];
    for (let i = 0; i < 8; i++) {
        const level = mapLevel + Math.floor(Math.random() * 3);
        const rand = Math.random();
        const types = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const item = window.generateRandomItem(type, level);
        if (item) {
            item.uid = Date.now() + Math.random();
            item.price = Math.floor((item.atk || item.def || 10) * 10 * (item.quality === 'legendary' ? 3 : item.quality === 'epic' ? 2 : item.quality === 'rare' ? 1.5 : 1));
            shopItems.push(item);
        }
    }
}

function openShop() {
    shopOpen = true;
    inventoryOpen = true;
    const panel = document.getElementById('shop-panel');
    const player = window.player;
    
    document.getElementById('shop-gold-value').textContent = player.gold;
    
    if (shopItems.length === 0) {
        generateShopItems();
    }
    
    renderShopItems();
    
    panel.classList.add('show');
}

function renderShopItems() {
    const container = document.getElementById('shop-items');
    container.innerHTML = '';
    
    shopItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.style.borderColor = item.color || '#654';
        if (item.quality === 'legendary') {
            div.classList.add('legendary');
        }
        
        let stats = '';
        if (item.atk) stats += `<div>⚔️${item.atk}</div>`;
        if (item.atkPercent) stats += `<div>⚔️%+${item.atkPercent}%</div>`;
        if (item.def) stats += `<div>🛡️${item.def}</div>`;
        if (item.defPercent) stats += `<div>🛡️%+${item.defPercent}%</div>`;
        if (item.maxHp) stats += `<div>❤️+${item.maxHp}</div>`;
        if (item.maxMp) stats += `<div>💙+${item.maxMp}</div>`;
        if (item.hpRegen) stats += `<div>💚+${item.hpRegen}/s</div>`;
        if (item.mpRegen) stats += `<div>💙+${item.mpRegen}/s</div>`;
        
        const qualityColor = getQualityColor(item.quality);
        
        div.innerHTML = `
            <span class="shop-item-icon" style="color:${qualityColor}">${item.icon}</span>
            <span class="shop-item-name" style="color:${qualityColor}">${item.name}</span>
            <div class="shop-item-stats">${stats}</div>
            <span class="shop-item-price">💰${item.price}</span>
        `;
        div.onclick = () => buyItem(index);
        container.appendChild(div);
    });
}

function closeShop() {
    shopOpen = false;
    inventoryOpen = false;
    document.getElementById('shop-panel').classList.remove('show');
}

function openBestiary() {
    bestiaryOpen = true;
    renderBestiary();
    document.getElementById('bestiary-panel').classList.add('show');
}

function closeBestiary() {
    bestiaryOpen = false;
    document.getElementById('bestiary-panel').classList.remove('show');
}

function updateBestiaryTabs() {
    document.querySelectorAll('.bestiary-tab').forEach(btn => btn.classList.remove('active'));
    if (bestiaryTab === 'monster') {
        document.getElementById('bestiary-tab-monster')?.classList.add('active');
    } else if (bestiaryTab === 'skill') {
        document.getElementById('bestiary-tab-skill')?.classList.add('active');
    } else if (bestiaryTab === 'equip') {
        document.getElementById('bestiary-tab-equip')?.classList.add('active');
    }
}

function discoverEnemy(type, name) {
    if (!discoveredEnemies[type]) {
        discoveredEnemies[type] = { name: name, count: 0, icon: getEnemyIcon(type) };
    }
    discoveredEnemies[type].count++;
    discoveredEnemies[type].name = name;
}

function getEnemyIcon(type) {
    const icons = {
        'slime': '🟢',
        'goblin': '👺',
        'bat': '🦇',
        'spider': '🕷️',
        'slime_king': '👑',
        'goblin_lord': '👹',
        'orc_king': '👾',
        'dark_mage': '🧙',
        'fire_dragon': '🐉',
        'ice_devil': '❄️',
        'demon_lord': '😈'
    };
    return icons[type] || '👾';
}

function renderBestiary() {
    const list = document.getElementById('bestiary-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (bestiaryTab === 'monster') {
        renderBestiaryMonsters(list);
    } else if (bestiaryTab === 'skill') {
        renderBestiarySkills(list);
    } else if (bestiaryTab === 'equip') {
        renderBestiaryItems(list);
    }
}

function renderBestiaryMonsters(list) {
    const allEnemies = [...window.enemyTypes, ...window.bossTypes];
    const previewCanvas = document.getElementById('bestiary-canvas');
    const previewCtx = previewCanvas.getContext('2d');
    
    allEnemies.forEach(enemy => {
        const discovered = discoveredEnemies[enemy.type] || { count: 0, name: enemy.name };
        
        previewCtx.clearRect(0, 0, 32, 32);
        drawEnemyPreview(previewCtx, enemy.type, enemy.color);
        
        const dataUrl = previewCanvas.toDataURL();
        
        const item = document.createElement('div');
        item.className = 'bestiary-item';
        
        item.innerHTML = `
            <img src="${dataUrl}" class="bestiary-icon" />
            <span class="bestiary-name">${enemy.name}</span>
            <span class="bestiary-info">HP:${enemy.hp} ATK:${enemy.atk}</span>
            <span class="bestiary-count">击杀: ${discovered.count}</span>
        `;
        
        list.appendChild(item);
    });
}

function renderBestiarySkills(list) {
    const allSkills = window.skills;
    
    allSkills.forEach(skill => {
        const discovered = discoveredSkills[skill.id] || { count: 0 };
        
        const item = document.createElement('div');
        item.className = 'bestiary-item';
        
        item.innerHTML = `
            <span class="bestiary-icon">${skill.icon}</span>
            <span class="bestiary-name">${skill.name}</span>
            <span class="bestiary-info">${skill.desc}</span>
            <span class="bestiary-count">使用: ${discovered.count}</span>
        `;
        
        list.appendChild(item);
    });
}

function renderBestiaryItems(list) {
    const allItems = items.filter(i => ['weapon', 'clothes', 'hat', 'boots', 'ring', 'necklace'].includes(i.type));
    const uniqueItems = [];
    const seen = new Set();
    allItems.forEach(item => {
        if (!seen.has(item.id)) {
            seen.add(item.id);
            uniqueItems.push(item);
        }
    });
    
    uniqueItems.forEach(item => {
        const discovered = discoveredItems[item.id] || { count: 0 };
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'bestiary-item';
        
        const qualityColor = getQualityColor(item.quality);
        
        itemDiv.innerHTML = `
            <span class="bestiary-icon" style="color:${qualityColor}">${item.icon}</span>
            <span class="bestiary-name" style="color:${qualityColor}">${item.name}</span>
            <span class="bestiary-info">${item.type}</span>
            <span class="bestiary-count">获得: ${discovered.count}</span>
        `;
        
        list.appendChild(itemDiv);
    });
}

function getQualityColor(quality) {
    const colors = {
        'common': '#fff',
        'uncommon': '#0f0',
        'rare': '#08f',
        'epic': '#a0f',
        'legendary': '#fa0'
    };
    return colors[quality] || '#fff';
}

function drawEnemyPreview(ctx, type, color) {
    const breathe = Math.sin(Date.now() / 400) * 1;
    const x = 4, y = 4 + breathe;
    ctx.fillStyle = color || '#4a4';
    
    if (type === 'slime') {
        ctx.fillRect(x + 4, y + 8, 16, 12);
        ctx.fillRect(x + 2, y + 12, 20, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 6, y + 10, 4, 4);
        ctx.fillRect(x + 14, y + 10, 4, 4);
    } else if (type === 'goblin') {
        ctx.fillRect(x + 6, y + 2, 12, 10);
        ctx.fillRect(x + 4, y + 10, 16, 14);
        ctx.fillRect(x + 2, y + 18, 6, 6);
        ctx.fillRect(x + 16, y + 18, 6, 6);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 7, y + 6, 3, 3);
        ctx.fillRect(x + 14, y + 6, 3, 3);
    } else if (type === 'bat') {
        ctx.fillRect(x + 8, y + 8, 8, 6);
        ctx.fillRect(x + 4, y + 6, 6, 4);
        ctx.fillRect(x + 14, y + 6, 6, 4);
        ctx.fillRect(x + 2, y + 8, 4, 3);
        ctx.fillRect(x + 18, y + 8, 4, 3);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 9, y + 9, 2, 2);
        ctx.fillRect(x + 13, y + 9, 2, 2);
    } else if (type === 'spider') {
        ctx.fillRect(x + 8, y + 4, 8, 8);
        ctx.fillRect(x + 6, y + 10, 12, 10);
        ctx.fillRect(x + 2, y + 8, 4, 4);
        ctx.fillRect(x + 4, y + 14, 3, 8);
        ctx.fillRect(x + 17, y + 14, 3, 8);
        ctx.fillRect(x + 18, y + 8, 4, 4);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 10, y + 6, 2, 2);
        ctx.fillRect(x + 12, y + 6, 2, 2);
    } else if (type.includes('king') || type.includes('lord') || type.includes('dragon') || type.includes('mage') || type.includes('devil') || type.includes('demon')) {
        ctx.fillStyle = color || '#a22';
        ctx.fillRect(x + 8, y, 16, 8);
        ctx.fillRect(x + 4, y + 4, 20, 16);
        ctx.fillRect(x, y + 8, 4, 12);
        ctx.fillRect(x + 24, y + 8, 4, 12);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(x + 6, y + 4, 4, 4);
        ctx.fillRect(x + 18, y + 4, 4, 4);
        ctx.fillStyle = '#f00';
        ctx.fillRect(x + 7, y + 5, 2, 2);
        ctx.fillRect(x + 19, y + 5, 2, 2);
    } else {
        ctx.fillRect(x + 4, y + 2, 16, 12);
        ctx.fillRect(x + 2, y + 10, 20, 12);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 6, y + 6, 4, 4);
        ctx.fillRect(x + 14, y + 6, 4, 4);
    }
}

function buyItem(index) {
    const player = window.player;
    const item = shopItems[index];
    if (!item) return;
    
    if (player.gold < item.price) {
        showMessage('金币不足!');
        return;
    }
    
    player.gold -= item.price;
    player.inventory.push(item);
    if (!discoveredItems[item.id]) {
        discoveredItems[item.id] = { count: 0 };
    }
    discoveredItems[item.id].count++;
    shopItems.splice(index, 1);
    
    document.getElementById('shop-gold-value').textContent = player.gold;
    renderShopItems();
    updateUI();
    showMessage(`已购买 ${item.name} (已放入背包)`);
}

function refreshShop() {
    const player = window.player;
    const cost = 50;
    
    if (player.gold < cost) {
        showMessage('Not enough gold!');
        return;
    }
    
    player.gold -= cost;
    generateShopItems();
    document.getElementById('shop-gold-value').textContent = player.gold;
    renderShopItems();
    showMessage('Shop refreshed!');
    updateUI();
}

function sellItem(index) {
    const player = window.player;
    const item = player.inventory[index];
    if (!item) return;
    
    const price = Math.floor((item.atk || item.def || 5) * 5 * (item.qualityBonus || 1) * 0.5);
    player.gold += price;
    player.inventory.splice(index, 1);
    
    updateUI();
    openInventory();
    showMessage(`已出售 ${item.name} +${price}金币`);
}

function useItem(index) {
    const player = window.player;
    const item = player.inventory[index];
    if (!item) return;
    
    if (item.type === 'consumable') {
        if (item.heal) {
            player.hp = Math.min(player.maxHp, player.hp + item.heal);
            showMessage(`+${item.heal} HP!`);
        }
        if (item.mp) {
            player.mp = Math.min(player.maxMp, player.mp + item.mp);
            showMessage(`+${item.mp} MP!`);
        }
        player.inventory.splice(index, 1);
        updateUI();
        openInventory();
    } else if (['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'].includes(item.type)) {
        showEquipConfirm(item, index);
    }
}

function showEquipConfirm(item, index) {
    const player = window.player;
    const oldItem = player[item.type];
    const typeNames = { weapon: '武器', armor: '衣服', helmet: '帽子', boots: '鞋子', ring: '戒指', necklace: '项链' };
    
    function getStats(i) {
        if (!i) return { atk: 0, def: 0, maxHp: 0, maxMp: 0, hpRegen: 0, mpRegen: 0 };
        return {
            atk: i.atk || 0,
            def: i.def || 0,
            maxHp: i.maxHp || 0,
            maxMp: i.maxMp || 0,
            hpRegen: i.hpRegen || 0,
            mpRegen: i.mpRegen || 0,
            atkPercent: i.atkPercent || 0,
            defPercent: i.defPercent || 0
        };
    }
    
    const oldStats = getStats(oldItem);
    const newStats = getStats(item);
    const sellPrice = Math.floor((item.atk || item.def || 5) * 5 * (item.qualityBonus || 1) * 0.5);
    
    function diffColor(oldVal, newVal) {
        if (newVal > oldVal) return '#4f4';
        if (newVal < oldVal) return '#f44';
        return '#aaa';
    }
    
    const confirmDiv = document.createElement('div');
    confirmDiv.id = 'equip-confirm';
    confirmDiv.innerHTML = `
        <div class="confirm-overlay"></div>
        <div class="confirm-box">
            <div class="confirm-title">装备对比 - ${typeNames[item.type]}</div>
            <div class="confirm-content">
                <div class="confirm-item" style="border-color:${oldItem?.color || '#666'}">
                    <div class="confirm-item-name">${oldItem ? oldItem.icon + ' ' + oldItem.name : '无'}</div>
                    <div class="confirm-stats">
                        <div>攻击: ${oldStats.atk}</div>
                        <div>防御: ${oldStats.def}</div>
                        <div>生命: +${oldStats.maxHp}</div>
                        <div>魔法: +${oldStats.maxMp}</div>
                        <div>HP回复: +${oldStats.hpRegen}/s</div>
                        <div>MP回复: +${oldStats.mpRegen}/s</div>
                    </div>
                </div>
                <div class="confirm-vs">VS</div>
                <div class="confirm-item" style="border-color:${item.color}">
                    <div class="confirm-item-name">${item.icon} ${item.name}</div>
                    <div class="confirm-stats">
                        <div style="color:${diffColor(oldStats.atk, newStats.atk)}">攻击: ${oldStats.atk} → ${newStats.atk}</div>
                        <div style="color:${diffColor(oldStats.def, newStats.def)}">防御: ${oldStats.def} → ${newStats.def}</div>
                        <div style="color:${diffColor(oldStats.maxHp, newStats.maxHp)}">生命: +${oldStats.maxHp} → +${newStats.maxHp}</div>
                        <div style="color:${diffColor(oldStats.maxMp, newStats.maxMp)}">魔法: +${oldStats.maxMp} → +${newStats.maxMp}</div>
                        <div style="color:${diffColor(oldStats.hpRegen, newStats.hpRegen)}">HP回复: +${oldStats.hpRegen} → +${newStats.hpRegen}/s</div>
                        <div style="color:${diffColor(oldStats.mpRegen, newStats.mpRegen)}">MP回复: +${oldStats.mpRegen} → +${newStats.mpRegen}/s</div>
                    </div>
                </div>
            </div>
            <div class="confirm-sell-price">出售可获得: 💰${sellPrice}</div>
            <div class="confirm-buttons">
                <button id="equip-yes">穿戴</button>
                <button id="equip-sell">出售</button>
                <button id="equip-no">取消</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmDiv);
    
    document.getElementById('equip-yes').addEventListener('click', () => {
        equipItem(index);
        confirmDiv.remove();
    });
    
    document.getElementById('equip-sell').addEventListener('click', () => {
        player.gold += sellPrice;
        player.inventory.splice(index, 1);
        updateUI();
        openInventory();
        showMessage(`已出售 ${item.name} +${sellPrice}金币`);
        confirmDiv.remove();
    });
    
    document.getElementById('equip-no').addEventListener('click', () => {
        confirmDiv.remove();
    });
    
    document.querySelector('.confirm-overlay').addEventListener('click', () => {
        confirmDiv.remove();
    });
}

function equipItem(index) {
    const player = window.player;
    const item = player.inventory[index];
    if (!item) return;
    
    const oldItem = player[item.type];
    player[item.type] = item;
    player.inventory[index] = oldItem;
    
    if (oldItem && !oldItem.uid) {
        oldItem.uid = Date.now() + Math.random();
    }
    
    recalculateStats();
    
    showMessage(`Equipped ${item.name}!`);
    updateUI();
    if (inventoryOpen) {
        openInventory();
    }
}

function recalculateStats() {
    const player = window.player;
    
    let totalAtk = 10;
    let totalDef = 5;
    let totalMaxHp = 100;
    let totalMaxMp = 150;
    let totalHpRegen = 0;
    let totalMpRegen = 0;
    let totalAtkPercent = 0;
    let totalDefPercent = 0;
    
    const equipStats = [player.weapon, player.armor, player.helmet, player.boots, player.ring, player.necklace];
    
    equipStats.forEach(eq => {
        if (eq) {
            totalAtk += eq.atk || 0;
            totalDef += eq.def || 0;
            totalMaxHp += eq.maxHp || 0;
            totalMaxMp += eq.maxMp || 0;
            totalHpRegen += eq.hpRegen || 0;
            totalMpRegen += eq.mpRegen || 0;
            totalAtkPercent += eq.atkPercent || 0;
            totalDefPercent += eq.defPercent || 0;
        }
    });
    
    totalAtk = Math.floor(totalAtk * (1 + totalAtkPercent / 100));
    totalDef = Math.floor(totalDef * (1 + totalDefPercent / 100));
    
    player.atk = totalAtk;
    player.def = totalDef;
    player.maxHp = totalMaxHp;
    player.maxMp = totalMaxMp;
    player.hpRegen = totalHpRegen;
    player.mpRegen = totalMpRegen;
}

function handleCloudLightning() {
    const clouds = getClouds();
    if (!clouds || !clouds.length) return;
    
    const playerCenterX = player.x + player.w / 2;
    const playerCenterY = player.y + player.h / 2;
    
    clouds.forEach(cloud => {
        if (!cloud || cloud.type !== 'storm') return;
        if (!cloud.lightningTimer || cloud.lightningTimer !== 1) return;
        
        const cloudCenterX = cloud.x;
        const cloudCenterY = cloud.y;
        
        const distToPlayer = Math.hypot(cloudCenterX - playerCenterX, cloudCenterY - playerCenterY);
        if (distToPlayer < 30) {
            const damage = 1;
            player.hp -= damage;
            spawnDamageNumber(playerCenterX, player.y, damage);
            if (player.hp <= 0) {
                player.hp = 0;
                gameState = 'gameover';
            }
        }
        
        const enemiesCopy = enemies.slice();
        enemiesCopy.forEach(enemy => {
            if (!enemy || enemy.hp <= 0) return;
            const enemyCenterX = enemy.x + 16;
            const enemyCenterY = enemy.y + 16;
            const distToEnemy = Math.hypot(cloudCenterX - enemyCenterX, cloudCenterY - enemyCenterY);
            if (distToEnemy < 30) {
                const damage = 2;
                enemy.hp -= damage;
                spawnDamageNumber(enemyCenterX, enemy.y, damage);
                enemy.aggro = 120;
                spawnParticles(enemy.x + 16, enemy.y + 16, '#ff0', 3);
            }
        });
        
        if (window.boss && window.boss.hp > 0) {
            const bossCenterX = window.boss.x + 24;
            const bossCenterY = window.boss.y + 24;
            const distToBoss = Math.hypot(cloudCenterX - bossCenterX, cloudCenterY - bossCenterY);
            if (distToBoss < 40) {
                const damage = 3;
                window.boss.hp -= damage;
                spawnDamageNumber(bossCenterX, window.boss.y, damage);
                window.boss.aggro = 120;
                spawnParticles(window.boss.x + 24, window.boss.y + 24, '#ff0', 5);
                if (window.boss.hp <= 0) {
                    discoverEnemy(window.boss.type, window.boss.name);
                    player.exp += window.boss.exp;
                    player.gold += window.boss.gold;
                    spawnDrop(window.boss.x, window.boss.y, true);
                    showMessage(`BOSS DEFEATED! +${window.boss.exp} EXP!`);
                    mapLevel++;
                    levelTransitioning = true;
                    setTimeout(() => {
                        generateMap();
                        spawnEnemies();
                        player.x = 7 * window.TILE;
                        player.y = 15 * window.TILE;
                        levelTransitioning = false;
                    }, 2000);
                    window.boss = null;
                }
            }
        }
    });
}

window.onload = initGame;
