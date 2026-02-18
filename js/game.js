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
let message = '';
let messageTimer = 0;
let damageFlash = 0;
let keys = {};

// 视口/摄像机系统
let camera = { x: 0, y: 0 };

// 初始化摄像机
function initCamera() {
    const player = window.player;
    if (!player) return;
    const mapWidth = window.MAP_W * window.TILE;
    const mapHeight = window.MAP_H * window.TILE;
    camera.x = Math.max(0, player.x + player.w / 2 - gameWidth / 2);
    camera.y = Math.max(0, player.y + player.h / 2 - gameHeight / 2);
    camera.x = Math.min(camera.x, mapWidth - gameWidth);
    camera.y = Math.min(camera.y, mapHeight - gameHeight);
}

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

// 全局音频上下文（解决浏览器自动播放限制）
let globalAudioCtx = null;
function getAudioContext() {
    if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }
    return globalAudioCtx;
}

// 游戏画布尺寸（逻辑像素）
let gameWidth = 480;
let gameHeight = 640;

function initGame() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    
    // 自适应屏幕大小
    const dpr = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 计算合适的画布大小（保留一定边距）
    const margin = 0;
    gameWidth = Math.min(480, screenWidth - margin);
    gameHeight = Math.min(640, screenHeight - margin);
    
    canvas.width = gameWidth * dpr;
    canvas.height = gameHeight * dpr;
    canvas.style.width = gameWidth + 'px';
    canvas.style.height = gameHeight + 'px';
    ctx.scale(dpr, dpr);
    
    // 根据画布大小自动计算地图参数
    if (window.initMapSize) {
        window.initMapSize(gameWidth, gameHeight);
    }
    
    window.boss = null;
    window.player = createPlayer();
    window.playerSkills = window.skills.slice(0, 7);
    window.skillCooldowns = {};
    window.skills.forEach(s => window.skillCooldowns[s.id] = 0);
    
    if (!window.discoveredEnemies) window.discoveredEnemies = {};
    if (!window.discoveredSkills) window.discoveredSkills = {};
    if (!window.discoveredItems) window.discoveredItems = {};
    
    // 解锁初始技能
    window.discoveredSkills['slash'] = true;
    
    if (window.initClouds) {
        window.initClouds(canvas.width, canvas.height);
    }
    
    generateMap();
    spawnEnemies();
    initCamera();
    setupInput();
    setupUI();
    
    setTimeout(() => {
        updatePlayerAvatar();
    }, 100);
    
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
                // 只在边界生成墙壁
                map[y][x] = 1;
            } else {
                const rand = Math.random();
                if (rand < 0.03 + mapLevel * 0.005) {
                    // 石头堆 - 取代内部墙壁
                    map[y][x] = 7;
                } else if (rand < 0.06 + mapLevel * 0.008) {
                    map[y][x] = 5;
                } else if (rand < 0.09 + mapLevel * 0.008) {
                    map[y][x] = 4;
                } else if (rand < 0.12 + mapLevel * 0.01) {
                    map[y][x] = 2;
                } else if (rand < 0.15 + mapLevel * 0.01) {
                    map[y][x] = 6;
                } else if (rand < 0.18 + mapLevel * 0.01) {
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

/**
 * 获取敌人的攻击类型
 */
function getEnemyAttackType(enemyType) {
    const attackTypes = {
        'slime': 'bite',
        'goblin': 'claw',
        'bat': 'claw',
        'spider': 'bite',
        'skeleton': 'claw',
        'wolf': 'claw',
        'snake': 'stab',
        'scorpion': 'stab'
    };
    return attackTypes[enemyType] || 'claw';
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
            hp: et.hp + mapLevel * 10,
            maxHp: et.hp + mapLevel * 10,
            atk: et.atk + mapLevel * 4,
            def: et.def + mapLevel,
            type: et.type,
            render: et.render,
            vx: 0, vy: 0,
            attackCooldown: 0,
            isAttacking: false,
            attackProgress: 0,
            attackType: getEnemyAttackType(et.type),
            aggro: 30,
            exp: et.exp + mapLevel * 4,
            gold: et.gold + mapLevel * 2,
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
    
    spawnBoss();
}

function spawnBoss() {
    // 随机选择一个Boss
    const idx = Math.floor(Math.random() * window.bossTypes.length);
    const bossType = window.bossTypes[idx];
    
    // 使用Boss自带的技能（从玩家技能中获取）
    const bossSkills = [];
    if (bossType.skills) {
        bossType.skills.forEach(skillId => {
            const skill = window.getSkillById(skillId);
            if (skill) bossSkills.push(skill);
        });
    }
    
    window.boss = {
        x: 7 * window.TILE,
        y: 3 * window.TILE,
        w: bossType.size, h: bossType.size,
        hp: bossType.hp + mapLevel * 40,
        maxHp: bossType.hp + mapLevel * 40,
        atk: bossType.atk + mapLevel * 6,
        def: bossType.def + mapLevel * 4,
        type: 'boss',
        render: bossType.render,
        vx: 0, vy: 0,
        attackCooldown: 0,
        aggro: 60,
        exp: bossType.exp + mapLevel * 20,
        gold: bossType.gold + mapLevel * 40,
        name: bossType.name,
        color: bossType.color,
        skills: bossSkills,
        skillCooldowns: {}
    };
    
    bossSkills.forEach(s => {
        window.boss.skillCooldowns[s.id] = 0;
    });
    
    const skillNames = bossSkills.map(s => s.name).join(', ');
    const skillDescs = bossSkills.map(s => s.desc || '').join(' | ');
    showMessage(`BOSS: ${bossType.name}! [${skillNames}]`, 180);
    if (skillDescs) {
        setTimeout(() => showMessage(skillDescs, 120), 2000);
    }
    playSound('boss');
}

function bossUseSkill(skill) {
    if (!window.boss || !skill) return;
    
    const player = window.player;
    const boss = window.boss;
    const baseX = boss.x + boss.w / 2;
    const baseY = boss.y + boss.h / 2;
    const targetX = player.x + player.w / 2;
    const targetY = player.y + player.h / 2;
    
    const dirX = targetX - baseX;
    const dirY = targetY - baseY;
    const dist = Math.sqrt(dirX * dirX + dirY * dirY);
    
    if (dist === 0) return;
    
    const dirXNorm = dirX / dist;
    const dirYNorm = dirY / dist;
    
    const speed = skill.speed || 6;
    
    // 播放Boss技能音效
    playSound('bossSkill');
    
    if (skill.type === 'projectile') {
        projectiles.push({
            x: baseX,
            y: baseY,
            vx: dirXNorm * speed,
            vy: dirYNorm * speed,
            damage: Math.floor(boss.atk * skill.damage),
            color: skill.projectileColor || '#fff',
            particleColor: skill.particleColor || '#fff',
            size: skill.size || 10,
            life: 120,
            isBoss: true,
            skillName: skill.name,
            isFire: skill.isFire,
            isLightning: skill.isLightning,
            isVine: skill.isVine,
            isTornado: skill.isTornado,
            isIce: skill.isIce,
            // 新颜色属性
            coreColor: skill.coreColor,
            innerColor: skill.innerColor,
            outerColor: skill.outerColor,
            glowColor: skill.glowColor,
            boltColor: skill.boltColor,
            stemColor: skill.stemColor,
            leafColor: skill.leafColor,
            thornColor: skill.thornColor,
            midColor: skill.midColor,
            debrisColor: skill.debrisColor,
            crystalColor: skill.crystalColor,
            edgeColor: skill.edgeColor
        });
        showMessage(`BOSS uses ${skill.name}!`);
    }
}

function spawnDrop(x, y, isBoss = false) {
    if (!window.discoveredItems) window.discoveredItems = {};
    
    const rand = Math.random();
    let item;
    const level = mapLevel + (isBoss ? 3 : 0);
    const equipTypes = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
    
    if (rand < 0.25) {
        item = window.items.find(i => i.id === 'potion');
    } else if (rand < 0.35) {
        item = window.items.find(i => i.id === 'potion2');
    } else if (rand < 0.43) {
        item = window.items.find(i => i.id === 'mpotion');
    } else if (rand < 0.50) {
        item = window.items.find(i => i.id === 'mpotion2');
    } else if (rand < 0.60) {
        item = window.items.find(i => i.id === 'gold');
    } else {
        const type = equipTypes[Math.floor(Math.random() * equipTypes.length)];
        item = window.generateRandomItem(type, level);
        if (item && item.baseId) window.discoverItem(item.baseId);
    }
    drops.push({ x: x + 10, y: y + 10, item: item, life: 1800 });
    
    const extraDrops = isBoss ? 3 : 1;
    for (let i = 0; i < extraDrops; i++) {
        const rand2 = Math.random();
        let item2;
        const equipTypes = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
        
        if (rand2 < 0.25) {
            item2 = window.items.find(i => i.id === 'potion');
        } else if (rand2 < 0.38) {
            item2 = window.items.find(i => i.id === 'potion2');
        } else if (rand2 < 0.48) {
            item2 = window.items.find(i => i.id === 'mpotion');
        } else if (rand2 < 0.56) {
            item2 = window.items.find(i => i.id === 'mpotion2');
        } else if (rand2 < 0.64) {
            item2 = window.items.find(i => i.id === 'gold');
        } else if (rand2 < 0.72) {
            item2 = window.generateItemByQuality('uncommon', 'weapon', level);
            if (item2 && item2.baseId) window.discoverItem(item2.baseId);
        } else if (rand2 < 0.7) {
            item2 = window.generateItemByQuality('rare', 'armor', level);
            if (item2 && item2.baseId) window.discoverItem(item2.baseId);
        } else if (rand2 < 0.8) {
            item2 = window.generateItemByQuality('epic', 'helmet', level);
            if (item2 && item2.baseId) window.discoverItem(item2.baseId);
        } else {
            const type = equipTypes[Math.floor(Math.random() * equipTypes.length)];
            item2 = window.generateItemByQuality('legendary', type, level);
            if (item2 && item2.baseId) window.discoverItem(item2.baseId);
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
        x: x + (Math.random() - 0.5) * 20,
        y: y - 10,
        value: value,
        isHeal: isHeal,
        life: 45
    });
}

/**
 * 生成药水效果
 * @param {number} x - x坐标
 * @param {number} y - y坐标
 * @param {string} type - 'heal' 或 'mana'
 */
function spawnPotionEffect(x, y, type) {
    const colors = type === 'heal' 
        ? ['#ff4444', '#ff6666', '#ff8888', '#ffaaaa'] 
        : ['#44ffff', '#66ffff', '#88ffff', '#aaffff'];
    
    const glowColors = type === 'heal'
        ? ['#ff2222', '#ff0000']
        : ['#00ffff', '#0088ff'];
    
    // 创建大量粒子
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2, // 向上飘散
            life: 40 + Math.random() * 20,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 3 + Math.random() * 3,
            type: 'potion'
        });
    }
    
    // 上升的光点
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 1,
            vy: -3 - Math.random() * 2,
            life: 30 + Math.random() * 15,
            color: glowColors[Math.floor(Math.random() * glowColors.length)],
            size: 2 + Math.random() * 2,
            type: 'potion_glow'
        });
    }
    
    // 治疗/魔法光环效果
    particles.push({
        x: x,
        y: y,
        vx: 0,
        vy: -1,
        life: 25,
        color: type === 'heal' ? '#ff6666' : '#66ffff',
        size: 20,
        type: 'potion_ring',
        maxLife: 25
    });
}

window.triggerCloudDamage = function(cloudCenterX, cloudCenterY) {
    let hasHit = false;
    
    // 对怪物造成伤害
    enemies.forEach(e => {
        const eCenterX = e.x + e.w / 2;
        const eCenterY = e.y + e.h / 2;
        const edx = eCenterX - cloudCenterX;
        const edy = eCenterY - cloudCenterY;
        const edist = Math.sqrt(edx * edx + edy * edy);
        
        if (edist < 60) {
            const eDmg = Math.max(1, 15 + Math.floor(Math.random() * 10) - (e.def || 0));
            e.hp -= eDmg;
            spawnParticles(eCenterX, eCenterY, '#ff0', 8);
            spawnDamageNumber(eCenterX, eCenterY, eDmg);
            hasHit = true;
        }
    });
    
    // 对Boss造成伤害
    if (window.boss) {
        const bossCenterX = window.boss.x + window.boss.w / 2;
        const bossCenterY = window.boss.y + window.boss.h / 2;
        const bdx = bossCenterX - cloudCenterX;
        const bdy = bossCenterY - cloudCenterY;
        const bdist = Math.sqrt(bdx * bdx + bdy * bdy);
        
        if (bdist < 80) {
            const bossDmg = Math.max(1, 20 + Math.floor(Math.random() * 15) - (window.boss.def || 0));
            window.boss.hp -= bossDmg;
            spawnParticles(bossCenterX, bossCenterY, '#ff0', 12);
            spawnDamageNumber(bossCenterX, bossCenterY, bossDmg);
            hasHit = true;
        }
    }
    
    // 雷电伤害音效
    if (hasHit) {
        playSound('lightning');
    }
};

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

function showConfirm(message, onConfirm) {
    let modal = document.getElementById('confirm-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirm-modal';
        modal.innerHTML = `
            <div class="confirm-overlay"></div>
            <div class="confirm-box">
                <div class="confirm-message"></div>
                <div class="confirm-buttons">
                    <button class="confirm-cancel">取消</button>
                    <button class="confirm-ok">确定</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        const style = document.createElement('style');
        style.textContent = `
            #confirm-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000; display: none; }
            #confirm-modal.show { display: flex; align-items: center; justify-content: center; }
            #confirm-modal .confirm-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); }
            #confirm-modal .confirm-box { position: relative; background: linear-gradient(145deg, #1a1d26, #12151c); border: 1px solid rgba(100,140,180,0.3); border-radius: 12px; padding: 20px; max-width: 280px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            #confirm-modal .confirm-message { color: #e8f0ff; font-size: 15px; margin-bottom: 20px; line-height: 1.5; white-space: pre-line; }
            #confirm-modal .confirm-buttons { display: flex; gap: 12px; }
            #confirm-modal button { flex: 1; padding: 10px 16px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
            #confirm-modal .confirm-cancel { background: rgba(80,90,100,0.4); color: #99aabb; border: 1px solid rgba(120,130,150,0.3); }
            #confirm-modal .confirm-cancel:hover { background: rgba(100,110,120,0.5); }
            #confirm-modal .confirm-ok { background: linear-gradient(135deg, rgba(80,150,100,0.5), rgba(60,120,80,0.5)); color: #8feda3; border: 1px solid rgba(100,200,130,0.3); }
            #confirm-modal .confirm-ok:hover { background: linear-gradient(135deg, rgba(90,170,110,0.6), rgba(70,140,90,0.6)); }
        `;
        document.head.appendChild(style);
    }
    
    const msgEl = modal.querySelector('.confirm-message');
    const cancelBtn = modal.querySelector('.confirm-cancel');
    const okBtn = modal.querySelector('.confirm-ok');
    
    msgEl.textContent = message;
    
    const cleanup = () => {
        modal.classList.remove('show');
        cancelBtn.onclick = null;
        okBtn.onclick = null;
    };
    
    cancelBtn.onclick = cleanup;
    okBtn.onclick = () => {
        cleanup();
        onConfirm?.();
    };
    
    modal.classList.add('show');
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
                player.hp = Math.min(player.maxHp, player.hp + player.hpRegen);
            }
            if (player.mp < player.maxMp) {
                player.mp = Math.min(player.maxMp, player.mp + player.mpRegen);
            }
        }
    }
    
    Object.keys(window.skillCooldowns).forEach(key => {
        if (window.skillCooldowns[key] > 0) window.skillCooldowns[key]--;
    });
    
    // 更新Boss技能冷却
    if (window.boss && window.boss.skillCooldowns) {
        Object.keys(window.boss.skillCooldowns).forEach(key => {
            if (window.boss.skillCooldowns[key] > 0) window.boss.skillCooldowns[key]--;
        });
    }
    
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
        
        const speed = 0.2;
        if (e.slowed > 0) speed *= 0.5;
        if (e.frozen > 0) speed = 0;
        
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        const detectRange = 150;
        const chaseRange = 200;
        
        if ((dist < chaseRange && dist > 0) && (e.aggro > 0 || dist < detectRange)) {
            if (e.frozen <= 0) {
                const chaseSpeed = speed;
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
                    }
                    break;
                case 'patrol_v':
                    if (!e.patrolDir) e.patrolDir = Math.random() > 0.5 ? 1 : -1;
                    e.y += e.patrolDir * speed * 0.3;
                    if (Math.abs(e.y - e.spawnY) > patrolRange || e.y < window.TILE || e.y > (window.MAP_H - 1) * window.TILE) {
                        e.patrolDir *= -1;
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
                    break;
                case 'idle':
                default:
                    break;
            }
            
            // 边界限制 - 不直接重置位置
            e.x = Math.max(window.TILE, Math.min((window.MAP_W - 1) * window.TILE - 10, e.x));
            e.y = Math.max(window.TILE, Math.min((window.MAP_H - 1) * window.TILE - 10, e.y));
        }
        
        // 更新攻击动画
        if (e.isAttacking) {
            e.attackProgress += 0.1;
            if (e.attackProgress >= 1) {
                e.isAttacking = false;
                e.attackProgress = 0;
            }
        }
        
        // 敌人攻击逻辑
        if (dist < 30 && e.attackCooldown <= 0 && player.invulnerable <= 0 && e.frozen <= 0) {
            // 触发攻击动画
            e.isAttacking = true;
            e.attackProgress = 0;
            
            // 播放敌人攻击音效
            const enemyType = e.type || e.name?.toLowerCase();
            if (enemyType?.includes('slime')) {
                playSound('slimeAttack');
            } else if (enemyType?.includes('goblin')) {
                playSound('goblinAttack');
            } else if (enemyType?.includes('bat')) {
                playSound('batAttack');
            } else if (enemyType?.includes('spider')) {
                playSound('spiderAttack');
            } else if (enemyType?.includes('skeleton')) {
                playSound('skeletonAttack');
            } else if (enemyType?.includes('wolf')) {
                playSound('wolfAttack');
            } else if (enemyType?.includes('snake')) {
                playSound('snakeAttack');
            } else if (enemyType?.includes('scorpion')) {
                playSound('scorpionAttack');
            } else {
                playSound('enemyAttack');
            }
            
            const dmg = Math.max(1, e.atk - player.def + Math.floor(Math.random() * 3));
            player.hp -= dmg;
            player.invulnerable = 30;
            damageFlash = 10;
            spawnParticles(player.x + player.w/2, player.y + player.h/2, '#f00', 8);
            spawnDamageNumber(player.x + player.w/2, player.y, dmg);
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
        if (!window.boss.wanderTimer) window.boss.wanderTimer = 0;
        if (!window.boss.wanderDir) window.boss.wanderDir = Math.random() * Math.PI * 2;
        
        // 使用中心点计算距离
        const playerCenterX = player.x + player.w / 2;
        const playerCenterY = player.y + player.h / 2;
        const bossCenterX = window.boss.x + window.boss.w / 2;
        const bossCenterY = window.boss.y + window.boss.h / 2;
        const dx = playerCenterX - bossCenterX;
        const dy = playerCenterY - bossCenterY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Boss chases player when in range but maintains distance
        if (dist < 250 && dist > 40) {
            const chaseSpeed = 0.3;
            window.boss.x += (dx / dist) * chaseSpeed;
            window.boss.y += (dy / dist) * chaseSpeed;
        } else if (dist >= 250) {
            // Idle wandering when player is far
            window.boss.wanderTimer--;
            if (window.boss.wanderTimer <= 0) {
                window.boss.wanderDir = Math.random() * Math.PI * 2;
                window.boss.wanderTimer = 60 + Math.random() * 60;
            }
            const wanderSpeed = 0.1;
            window.boss.x += Math.cos(window.boss.wanderDir) * wanderSpeed;
            window.boss.y += Math.sin(window.boss.wanderDir) * wanderSpeed;
        }
        
        // 边界限制 - 平滑限制
        window.boss.x = Math.max(window.TILE, Math.min((window.MAP_W - 2) * window.TILE, window.boss.x));
        window.boss.y = Math.max(window.TILE, Math.min((window.MAP_H - 2) * window.TILE, window.boss.y));
        
        // Boss碰到墙壁则反弹
        const bossTileX = Math.floor((window.boss.x + window.boss.w/2) / window.TILE);
        const bossTileY = Math.floor((window.boss.y + window.boss.h/2) / window.TILE);
        if (map[bossTileY] && map[bossTileY][bossTileX] === 1) {
            window.boss.x = Math.max(window.TILE, Math.min((window.MAP_W - 2) * window.TILE, window.boss.x - 10));
            window.boss.y = Math.max(window.TILE, Math.min((window.MAP_H - 2) * window.TILE, window.boss.y - 10));
            window.boss.wanderDir = Math.random() * Math.PI * 2;
        }
        
        // Boss技能攻击 - 在技能范围内即可释放，随机选择技能
        if (window.boss.skills && window.boss.skills.length > 0 && window.boss.attackCooldown <= 0) {
            // 找出所有冷却好的技能
            const readySkills = window.boss.skills.filter(s => {
                const cd = window.boss.skillCooldowns[s.id] || 0;
                return cd <= 0;
            });
            
            // 随机选择一个技能
            if (readySkills.length > 0) {
                const readySkill = readySkills[Math.floor(Math.random() * readySkills.length)];
                
                if (dist < readySkill.range) {
                    bossUseSkill(readySkill);
                    window.boss.skillCooldowns[readySkill.id] = readySkill.cd;
                    window.boss.attackCooldown = 45;
                    return;
                }
            }
        }
        
        // Boss普通攻击 - 需要靠近玩家
        if (dist < 40 && window.boss.attackCooldown <= 0 && player.invulnerable <= 0) {
            playSound('bossAttack');
            const dmg = Math.max(1, window.boss.atk - player.def + Math.floor(Math.random() * 5));
            player.hp -= dmg;
            player.invulnerable = 20;
            damageFlash = 15;
            spawnParticles(player.x + player.w/2, player.y + player.h/2, '#f00', 10);
            spawnDamageNumber(player.x + player.w/2, player.y, dmg);
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
                // 药水视觉效果
                const isHealPotion = d.item.heal > 0;
                const isManaPotion = d.item.mp > 0;
                
                if (isHealPotion) {
                    player.hp = Math.min(player.maxHp, player.hp + d.item.heal);
                    spawnDamageNumber(player.x + player.w/2, player.y, d.item.heal, true);
                    showMessage(`+${d.item.heal} HP!`);
                    // 生命药水特效 - 红色粒子
                    spawnPotionEffect(player.x + player.w/2, player.y + player.h/2, 'heal');
                }
                if (isManaPotion) {
                    player.mp = Math.min(player.maxMp, player.mp + d.item.mp);
                    spawnDamageNumber(player.x + player.w/2, player.y - 15, d.item.mp, true);
                    showMessage(`+${d.item.mp} MP!`);
                    // 魔法药水特效 - 蓝色粒子
                    spawnPotionEffect(player.x + player.w/2, player.y + player.h/2, 'mana');
                }
            } else {
                player.inventory.push(d.item);
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
        d.y -= 0.8;
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
                e.aggro = 120;
                spawnParticles(e.x + e.w/2, e.y + e.h/2, '#f84', 5);
                spawnDamageNumber(e.x + e.w/2, e.y, p.damage);
                hit = true;
            }
        });
        
        enemies = enemies.filter(e => {
            if (e.hp <= 0) {
                player.exp += Math.floor(e.exp * 1.5);
                player.gold += e.gold;
                spawnDrop(e.x, e.y);
                window.discoverEnemy?.(e.type, e.name);
                showMessage(`Defeated ${e.name}! +${e.exp} EXP`);
                return false;
            }
            return true;
        });
        
        if (window.boss && !p.isBoss) {
            const dx = p.x - (window.boss.x + window.boss.w/2);
            const dy = p.y - (window.boss.y + window.boss.h/2);
            if (Math.sqrt(dx*dx + dy*dy) < 30) {
                window.boss.hp -= p.damage;
                window.boss.aggro = 120;
                spawnParticles(window.boss.x + window.boss.w/2, window.boss.y + window.boss.h/2, '#f84', 10);
                spawnDamageNumber(window.boss.x + window.boss.w/2, window.boss.y, p.damage);
                hit = true;
                if (window.boss.hp <= 0) {
                    player.exp += Math.floor(window.boss.exp * 1.5);
                    player.gold += window.boss.gold;
                    spawnDrop(window.boss.x, window.boss.y, true);
                    window.discoverEnemy?.(window.boss.render, window.boss.name);
                    showMessage(`BOSS DEFEATED! +${Math.floor(window.boss.exp * 1.5)} EXP!`);
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
        
        // Boss投射物击中玩家
        if (p.isBoss && player.invulnerable <= 0) {
            const dx = p.x - (player.x + player.w/2);
            const dy = p.y - (player.y + player.h/2);
            if (Math.sqrt(dx*dx + dy*dy) < 20) {
                const dmg = Math.max(1, p.damage - player.def);
                player.hp -= dmg;
                player.invulnerable = 15;
                damageFlash = 10;
                spawnParticles(player.x + player.w/2, player.y + player.h/2, p.particleColor || '#f00', 8);
                spawnDamageNumber(player.x + player.w/2, player.y, dmg);
                showMessage(`BOSS ${p.skillName || 'ATTACK'}! -${dmg} HP`);
                if (player.hp <= 0) {
                    gameState = 'gameover';
                    showMessage('GAME OVER - Tap to restart', 300);
                }
                hit = true;
            }
        }
        
        return p.life > 0 && !hit;
    });
    
    if (player.exp >= player.level * 120) {
        player.level++;
        player.maxHp += 20;
        player.hp = player.maxHp;
        player.maxMp += 10;
        player.mp = player.maxMp;
        player.atk += 3;
        player.def += 1;
        player.hpRegen += 0.2;
        player.mpRegen += 0.1;
        player.invulnerable = 60;
        showMessage(`LEVEL UP! Now level ${player.level}! (+HP +MP +ATK +DEF)`);
        playSound('levelup');
    }
    
    updateUI();
}

// 更新摄像机位置
function updateCamera() {
    const player = window.player;
    if (!player) return;
    
    const mapWidth = window.MAP_W * window.TILE;
    const mapHeight = window.MAP_H * window.TILE;
    
    // 目标摄像机位置（玩家中心）
    let targetX = player.x + player.w / 2 - gameWidth / 2;
    let targetY = player.y + player.h / 2 - gameHeight / 2;
    
    // 限制在地图范围内
    targetX = Math.max(0, Math.min(targetX, mapWidth - gameWidth));
    targetY = Math.max(0, Math.min(targetY, mapHeight - gameHeight));
    
    // 平滑移动摄像机
    const smoothing = 0.15;
    camera.x += (targetX - camera.x) * smoothing;
    camera.y += (targetY - camera.y) * smoothing;
}

function render() {
    const player = window.player;
    
    // 更新摄像机位置，使玩家居中
    updateCamera();
    
    if (gameState === 'playing' && !inventoryOpen && !characterOpen && !shopOpen) {
        update();
    }
    
    if (damageFlash > 0) {
        ctx.fillStyle = `rgba(255, 0, 0, ${damageFlash / 30})`;
        ctx.fillRect(0, 0, gameWidth, gameHeight);
        damageFlash--;
    }
    
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    
    drawMap(ctx, map, window.TILE, window.MAP_W, window.MAP_H);
    drawDrops(ctx, drops);
    drawProjectiles(ctx, projectiles);
    drawEnemies(ctx, enemies, drawPixelSprite);
    drawEnemiesAttack(ctx, enemies);
    drawBoss(ctx, window.boss, drawPixelSprite);
    drawPlayer(ctx, player, drawPixelSprite, player.invulnerable);
    drawPlayerAttack(ctx, player);
    drawParticles(ctx, particles);
    drawDamageNumbers(ctx, damageNumbers);
    
    ctx.restore();
    
    drawClouds(ctx, gameWidth, gameHeight, player);
    
    if (message) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(gameWidth * 0.17, 40, gameWidth * 0.67, 40);
        ctx.fillStyle = '#fff';
        ctx.font = '18px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(message, gameWidth / 2, 68);
        ctx.textAlign = 'left';
        if (messageTimer > 0) messageTimer--;
        else message = '';
    }
    
    if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, gameWidth, gameHeight);
        ctx.fillStyle = '#f00';
        ctx.font = '36px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', gameWidth / 2, gameHeight / 2);
        ctx.fillStyle = '#fff';
        ctx.font = '18px Courier New';
        ctx.fillText('Tap to restart', gameWidth / 2, gameHeight / 2 + 40);
        ctx.textAlign = 'left';
    }
}

function updatePlayerAvatar() {
    if (window.renderPlayerIcon) {
        const avatarBtn = document.getElementById('characterBtn');
        if (avatarBtn) {
            try {
                const canvas = window.renderPlayerIcon(window.player, 40);
                const imgUrl = canvas.toDataURL();
                avatarBtn.innerHTML = `<img src="${imgUrl}" style="image-rendering:pixelated;width:40px;height:40px;">`;
            } catch (e) {
                console.error('Failed to render player avatar:', e);
                avatarBtn.innerHTML = '🧙';
            }
        }
    }
    if (window.UICharacter?.render) {
        window.UICharacter.render();
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
    // 首次用户交互时恢复音频上下文
    const resumeAudio = () => {
        getAudioContext();
    };
    document.addEventListener('click', resumeAudio, { once: true });
    document.addEventListener('keydown', resumeAudio, { once: true });
    
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
            
            if (map[ty] && map[ty][tx] !== 1) {
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
    
    // 摇杆模式下自动锁定最近敌人
    let dirX = player.dirX;
    let dirY = player.dirY;
    
    if (window.controlMode === 'joystick') {
        const target = getAutoTarget();
        if (target) {
            const targetX = target.x + (target.w || 0) / 2;
            const targetY = target.y + (target.h || 0) / 2;
            const baseX = player.x + player.w / 2;
            const baseY = player.y + player.h / 2;
            const dx = targetX - baseX;
            const dy = targetY - baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                dirX = dx / dist;
                dirY = dy / dist;
                player.dirX = dirX;
                player.dirY = dirY;
            }
        }
    }
    
    const px = player.x + player.w/2;
    const py = player.y + player.h/2;
    const range = 50;
    
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
            e.vx = dirX * 5;
            e.vy = dirY * 5;
            spawnParticles(e.x + e.w/2, e.y + e.h/2, '#f44', 5);
            spawnDamageNumber(e.x + e.w/2, e.y, dmg);
            if (e.hp <= 0) {
                player.exp += Math.floor(e.exp * 1.5);
                player.gold += e.gold;
                spawnDrop(e.x, e.y);
                window.discoverEnemy?.(e.type, e.name);
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
            spawnDamageNumber(window.boss.x + window.boss.w/2, window.boss.y, dmg);
            if (window.boss.hp <= 0) {
                player.exp += Math.floor(window.boss.exp * 1.5);
                player.gold += window.boss.gold;
                spawnDrop(window.boss.x, window.boss.y, true);
                window.discoverEnemy?.(window.boss.render, window.boss.name);
                showMessage(`BOSS DEFEATED! +${Math.floor(window.boss.exp * 1.5)} EXP!`);
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

// 技能自动锁定最近的敌人
function getAutoTarget() {
    const player = window.player;
    if (!player) return null;
    
    const playerX = player.x + player.w / 2;
    const playerY = player.y + player.h / 2;
    
    let nearestEnemy = null;
    let nearestDist = Infinity;
    
    // 检查普通敌人
    enemies.forEach(e => {
        const ex = e.x + e.w / 2;
        const ey = e.y + e.h / 2;
        const dist = Math.sqrt((ex - playerX) ** 2 + (ey - playerY) ** 2);
        if (dist < nearestDist && e.hp > 0) {
            nearestDist = dist;
            nearestEnemy = e;
        }
    });
    
    // 检查Boss
    if (window.boss && window.boss.hp > 0) {
        const bossX = window.boss.x + window.boss.w / 2;
        const bossY = window.boss.y + window.boss.h / 2;
        const dist = Math.sqrt((bossX - playerX) ** 2 + (bossY - playerY) ** 2);
        if (dist < nearestDist) {
            nearestEnemy = window.boss;
        }
    }
    
    return nearestEnemy;
}

// 技能栏扇形布局
function updateSkillFanLayout() {
    const container = document.getElementById('skills-container');
    const skills = window.playerSkills || [];
    if (!container || skills.length === 0) return;
    
    const radius = 80;
    const startAngle = -Math.PI * 0.7;
    const endAngle = Math.PI * 0.3;
    const angleStep = (endAngle - startAngle) / (skills.length - 1 || 1);
    
    skills.forEach((skill, i) => {
        const slot = container.querySelector(`[data-skill-index="${i}"]`);
        if (slot) {
            const angle = startAngle + angleStep * i;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            slot.style.left = `calc(50% + ${x}px)`;
            slot.style.bottom = `calc(50% + ${y}px)`;
        }
    });
}

// 重置技能栏布局
function resetSkillLayout() {
    const slots = document.querySelectorAll('#skills-container .skill-slot');
    slots.forEach(slot => {
        slot.style.left = '';
        slot.style.bottom = '';
        slot.style.position = '';
    });
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
    
    // 摇杆模式下自动锁定最近敌人
    let dirX = player.dirX;
    let dirY = player.dirY;
    
    if (window.controlMode === 'joystick') {
        const target = getAutoTarget();
        if (target) {
            const targetX = target.x + (target.w || 0) / 2;
            const targetY = target.y + (target.h || 0) / 2;
            const baseX = player.x + player.w / 2;
            const baseY = player.y + player.h / 2;
            const dx = targetX - baseX;
            const dy = targetY - baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                dirX = dx / dist;
                dirY = dy / dist;
                // 更新玩家朝向
                player.dirX = dirX;
                player.dirY = dirY;
            }
        }
    }
    
    player.mp -= skill.mp;
    window.skillCooldowns[skill.id] = skill.cd;
    window.discoverSkill?.(skill.id);
    
    const baseX = player.x + player.w/2;
    const baseY = player.y + player.h/2;
    
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
                spawnDamageNumber(e.x + e.w/2, e.y, dmg);
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
                spawnDamageNumber(window.boss.x + window.boss.w/2, window.boss.y, dmg);
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
            isFire: skill.isFire || false,
            // 新颜色属性
            coreColor: skill.coreColor,
            innerColor: skill.innerColor,
            outerColor: skill.outerColor,
            glowColor: skill.glowColor,
            boltColor: skill.boltColor,
            stemColor: skill.stemColor,
            leafColor: skill.leafColor,
            thornColor: skill.thornColor,
            midColor: skill.midColor,
            outerColor: skill.outerColor,
            debrisColor: skill.debrisColor,
            crystalColor: skill.crystalColor,
            edgeColor: skill.edgeColor
        });
    }
    
    playSound('skill');
}

function setupUI() {
    const skillsContainer = document.getElementById('skills');
    skillsContainer.innerHTML = '';
    
    window.playerSkills.forEach((skill, i) => {
        const slot = document.createElement('div');
        slot.className = 'skill-slot';
        slot.dataset.skillIndex = i;
        let iconHtml = skill.icon;
        if (window.renderSkillIcon) {
            const iconUrl = window.renderSkillIcon(skill, 28);
            iconHtml = `<img src="${iconUrl}" style="image-rendering:pixelated;width:28px;height:28px;">`;
        }
        slot.innerHTML = `
            <span class="hotkey">${i + 1}</span>
            ${iconHtml}
            <div class="cooldown"></div>
        `;
        slot.addEventListener('click', () => useSkill(i));
        skillsContainer.appendChild(slot);
    });
    
    if (window.renderPlayerIcon) {
        const avatarBtn = document.getElementById('characterBtn');
        if (avatarBtn) {
            const canvas = window.renderPlayerIcon(window.player, 40);
            const imgUrl = canvas.toDataURL();
            avatarBtn.innerHTML = `<img src="${imgUrl}" style="image-rendering:pixelated;width:40px;height:40px;">`;
        }
    }
    
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
    
    // 控制模式变量
    window.controlMode = 'dpad'; // 'dpad', 'joystick', 'none'
    const controlModeBtn = document.getElementById('controlModeBtn');
    const controlsEl = document.getElementById('controls');
    const joystickArea = document.getElementById('joystick-area');
    
    // 切换控制模式
    window.toggleControlMode = function() {
        const modes = ['dpad', 'joystick', 'none'];
        const currentIndex = modes.indexOf(window.controlMode);
        window.controlMode = modes[(currentIndex + 1) % modes.length];
        
        // 更新UI显示
        if (controlModeBtn) {
            controlModeBtn.className = 'icon-btn';
            if (window.controlMode === 'dpad') {
                controlModeBtn.textContent = '⬡';
                controlModeBtn.classList.add('dpad-mode');
            } else if (window.controlMode === 'joystick') {
                controlModeBtn.textContent = '◎';
                controlModeBtn.classList.add('joystick-mode');
            } else {
                controlModeBtn.textContent = '✕';
                controlModeBtn.classList.add('hidden-mode');
            }
        }
        
        // 显示/隐藏控制
        if (controlsEl) {
            controlsEl.classList.toggle('show', window.controlMode === 'dpad');
        }
        if (joystickArea) {
            joystickArea.classList.toggle('show', window.controlMode === 'joystick');
        }
        
        // 更新技能栏布局
        const skillsContainer = document.getElementById('skills-container');
        if (skillsContainer) {
            if (window.controlMode === 'joystick') {
                skillsContainer.classList.add('joystick-mode');
                updateSkillFanLayout();
            } else {
                skillsContainer.classList.remove('joystick-mode');
                resetSkillLayout();
            }
        }
        
        // 保存设置
        try {
            localStorage.setItem('pixelarpg_controlmode', window.controlMode);
        } catch(e) {}
    };
    
    // 初始化控制模式
    if (controlModeBtn) {
        controlModeBtn.addEventListener('click', window.toggleControlMode);
        // 加载保存的设置
        try {
            const saved = localStorage.getItem('pixelarpg_controlmode');
            if (saved && modes.includes(saved)) {
                window.controlMode = saved;
            }
        } catch(e) {}
        
        // 初始化显示
        window.toggleControlMode();
    }
    
    // 虚拟摇杆逻辑
    const joystickKnob = document.getElementById('joystick-knob');
    const joystickBase = document.getElementById('joystick-base');
    let joystickActive = false;
    let joystickCenter = { x: 0, y: 0 };
    
    function initJoystick() {
        if (!joystickBase || !joystickKnob) return;
        const rect = joystickBase.getBoundingClientRect();
        joystickCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }
    
    function handleJoystickMove(clientX, clientY) {
        if (window.controlMode !== 'joystick') return;
        
        const dx = clientX - joystickCenter.x;
        const dy = clientY - joystickCenter.y;
        const maxDist = 35;
        const dist = Math.min(Math.sqrt(dx*dx + dy*dy), maxDist);
        const angle = Math.atan2(dy, dx);
        
        const knobX = Math.cos(angle) * dist;
        const knobY = Math.sin(angle) * dist;
        
        joystickKnob.style.left = (25 + knobX) + 'px';
        joystickKnob.style.top = (25 + knobY) + 'px';
        
        // 转换为方向键
        const threshold = 15;
        keys['ArrowUp'] = dy < -threshold;
        keys['ArrowDown'] = dy > threshold;
        keys['ArrowLeft'] = dx < -threshold;
        keys['ArrowRight'] = dx > threshold;
    }
    
    function resetJoystick() {
        if (!joystickKnob) return;
        joystickKnob.style.left = '25px';
        joystickKnob.style.top = '25px';
        keys['ArrowUp'] = false;
        keys['ArrowDown'] = false;
        keys['ArrowLeft'] = false;
        keys['ArrowRight'] = false;
    }
    
    if (joystickArea) {
        joystickArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            joystickActive = true;
            initJoystick();
            const touch = e.touches[0];
            handleJoystickMove(touch.clientX, touch.clientY);
        });
        
        joystickArea.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (joystickActive) {
                const touch = e.touches[0];
                handleJoystickMove(touch.clientX, touch.clientY);
            }
        });
        
        joystickArea.addEventListener('touchend', (e) => {
            e.preventDefault();
            joystickActive = false;
            resetJoystick();
        });
        
        // 鼠标支持
        joystickArea.addEventListener('mousedown', (e) => {
            joystickActive = true;
            initJoystick();
            handleJoystickMove(e.clientX, e.clientY);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (joystickActive) {
                handleJoystickMove(e.clientX, e.clientY);
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (joystickActive) {
                joystickActive = false;
                resetJoystick();
            }
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
            if (window.PanelManager?.isPanelOpen('bestiary')) {
                window.PanelManager.closePanel('bestiary');
            } else {
                window.PanelManager.openPanel('bestiary');
            }
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
        const audioCtx = getAudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'attack') {
            // 玩家攻击 - 挥砍的唰唰声
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
        } else if (type === 'enemyAttack') {
            // 敌人攻击 - 低沉的打击声
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
        } else if (type === 'bossAttack') {
            // Boss攻击 - 更沉重的打击声
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.35, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'bossSkill') {
            // Boss技能 - 能量聚集释放的声音
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.2);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.4);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.4);
        } else if (type === 'slimeAttack') {
            // 史莱姆 - 粘稠的水滴声
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'goblinAttack') {
            // 哥布林 - 尖锐的刺击声
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.08);
        } else if (type === 'batAttack') {
            // 蝙蝠 - 快速的拍打声
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'spiderAttack') {
            // 蜘蛛 - 毒液喷射声
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(250, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.12);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.12);
        } else if (type === 'skeletonAttack') {
            // 骷髅 - 骨骼碰撞声
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(180, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'wolfAttack') {
            // 狼 - 凶猛的咬击声
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.12);
            gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.12);
        } else if (type === 'snakeAttack') {
            // 蛇 - 快速的毒牙穿刺声
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(350, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.08);
        } else if (type === 'scorpionAttack') {
            // 蝎子 - 尾刺蜇刺声
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(280, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'lightning') {
            // 雷电 - 劈裂声
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
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
    window.UIInventory.open();
}

function closeInventory() {
    window.UIInventory.close();
}

function openCharacterPanel() {
    window.UICharacter.open();
}

function closeCharacterPanel() {
    window.UICharacter.close();
}

function openShop() {
    window.UIShop.open();
}

function closeShop() {
    window.UIShop.close();
}

function openBestiary() {
    window.UIBestiary.open();
}

function closeBestiary() {
    window.UIBestiary.close();
}

function generateShopItems() {
}

function closeCharacterPanel() {
    window.UICharacter.close();
}

function openShop() {
    window.UIShop.open();
}

function closeShop() {
    window.UIShop.close();
}

function openBestiary() {
    window.UIBestiary.open();
}

function closeBestiary() {
    window.UIBestiary.close();
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
            spawnDamageNumber(player.x + player.w/2, player.y, item.heal, true);
            showMessage(`+${item.heal} HP!`);
        }
        if (item.mp) {
            player.mp = Math.min(player.maxMp, player.mp + item.mp);
            spawnDamageNumber(player.x + player.w/2, player.y - 15, item.mp, true);
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

window.onload = initGame;
