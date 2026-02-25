/**
 * 玩家形象系统
 * Boss掉落皮肤，皮肤在图鉴中收集
 */

window.PlayerSkins = {
    current: 'hero',
    unlockedSkins: ['hero'],
    
    skins: {
        hero: {
            id: 'hero',
            name: '勇者',
            description: '经典勇者形象，蓝色披风，金色短发',
            source: '初始',
            rarity: 'common',
            skinColor: '#ffe4d0',
            skinShadow: '#f5c4a8',
            skinHighlight: '#fff0e8',
            hairColor: '#f4c542',
            hairHighlight: '#ffe066',
            hairShadow: '#d4a012',
            eyeColor: '#40d0b0',
            eyeHighlight: '#60ffe0',
            clothesColor: '#4a9eff',
            clothesDark: '#2070cc',
            clothesLight: '#7ac0ff',
            clothesAccent: '#ffd700',
            features: { hasVeil: false, hasTiara: false, dressStyle: 'tunic', hairStyle: 'short', hasGloves: false }
        },
        slime_king: {
            id: 'slime_king',
            name: '史莱姆勇者',
            description: '史莱姆王之力，透明的蓝色胶质身体',
            source: '史莱姆王',
            rarity: 'rare',
            skinColor: '#88ddff',
            skinShadow: '#55aadd',
            skinHighlight: '#aaffff',
            hairColor: '#22aa88',
            hairHighlight: '#44ffcc',
            hairShadow: '#118866',
            eyeColor: '#ffffff',
            eyeHighlight: '#ffffff',
            clothesColor: '#44ccaa',
            clothesDark: '#229977',
            clothesLight: '#77eedd',
            clothesAccent: '#aaffdd',
            features: { hasVeil: false, hasTiara: false, dressStyle: 'slime', hairStyle: 'droopy', hasGloves: true }
        },
        goblin_lord: {
            id: 'goblin_lord',
            name: '哥布林猎手',
            description: '哥布林领主的皮甲，绿色的肌肤',
            source: '哥布林领主',
            rarity: 'rare',
            skinColor: '#7ccc66',
            skinShadow: '#559944',
            skinHighlight: '#aaee88',
            hairColor: '#445522',
            hairHighlight: '#667744',
            hairShadow: '#223311',
            eyeColor: '#ffaa00',
            eyeHighlight: '#ffcc44',
            clothesColor: '#665533',
            clothesDark: '#443322',
            clothesLight: '#887744',
            clothesAccent: '#aa7733',
            features: { hasVeil: false, hasTiara: false, dressStyle: 'leather', hairStyle: 'messy', hasGloves: true }
        },
        orc_king: {
            id: 'orc_king',
            name: '兽战士',
            description: '兽人统领的肌肉与獠牙，凶猛无比',
            source: '兽人统领',
            rarity: 'epic',
            skinColor: '#558855',
            skinShadow: '#336633',
            skinHighlight: '#77aa77',
            hairColor: '#222222',
            hairHighlight: '#444444',
            hairShadow: '#111111',
            eyeColor: '#ff4400',
            eyeHighlight: '#ff6622',
            clothesColor: '#8b4513',
            clothesDark: '#5c2e0a',
            clothesLight: '#a0522d',
            clothesAccent: '#cd853f',
            features: { hasVeil: false, hasTiara: false, dressStyle: 'warrior', hairStyle: 'short', hasGloves: false }
        },
        dark_mage: {
            id: 'dark_mage',
            name: '暗法师',
            description: '黑暗法师的神秘长袍与法杖',
            source: '黑暗法师',
            rarity: 'epic',
            skinColor: '#d8bfd8',
            skinShadow: '#a890a8',
            skinHighlight: '#f0dff0',
            hairColor: '#2a1a3a',
            hairHighlight: '#4a2a5a',
            hairShadow: '#1a0a2a',
            eyeColor: '#9932cc',
            eyeHighlight: '#bb55ee',
            clothesColor: '#2a1a4a',
            clothesDark: '#1a0a3a',
            clothesLight: '#4a2a6a',
            clothesAccent: '#6633cc',
            features: { hasVeil: true, hasTiara: true, dressStyle: 'robe', hairStyle: 'long', hasGloves: true }
        },
        skeleton_queen: {
            id: 'skeleton_queen',
            name: '白骨公主',
            description: '白骨夫人的华丽骨骼装扮',
            source: '白骨夫人',
            rarity: 'legendary',
            skinColor: '#f5f5f5',
            skinShadow: '#e0e0e0',
            skinHighlight: '#ffffff',
            hairColor: '#9932cc',
            hairHighlight: '#da70d6',
            hairShadow: '#6b238e',
            eyeColor: '#ff00ff',
            eyeHighlight: '#ff88ff',
            clothesColor: '#2a2a2a',
            clothesDark: '#1a1a1a',
            clothesLight: '#4a4a4a',
            clothesAccent: '#cc00cc',
            features: { hasVeil: true, hasTiara: true, dressStyle: 'elegant', hairStyle: 'wavy', hasGloves: true }
        },
        fire_dragon: {
            id: 'fire_dragon',
            name: '龙骑士',
            description: '火龙的火焰之力，炽热的红色鳞片',
            source: '火龙',
            rarity: 'legendary',
            skinColor: '#ff6644',
            skinShadow: '#cc3322',
            skinHighlight: '#ff8866',
            hairColor: '#ff2200',
            hairHighlight: '#ff4400',
            hairShadow: '#aa1100',
            eyeColor: '#ffaa00',
            eyeHighlight: '#ffcc00',
            clothesColor: '#8b0000',
            clothesDark: '#5c0000',
            clothesLight: '#a52a2a',
            clothesAccent: '#ff4500',
            features: { hasVeil: false, hasTiara: true, dressStyle: 'armor', hairStyle: 'spiky', hasGloves: true }
        },
        ice_devil: {
            id: 'ice_devil',
            name: '冰霜行者',
            description: '冰魔的寒冰之力，冰雪般的肌肤',
            source: '冰魔',
            rarity: 'legendary',
            skinColor: '#e0f0ff',
            skinShadow: '#b0d0e8',
            skinHighlight: '#ffffff',
            hairColor: '#00ccff',
            hairHighlight: '#44ddff',
            hairShadow: '#0088aa',
            eyeColor: '#00ffff',
            eyeHighlight: '#88ffff',
            clothesColor: '#4488cc',
            clothesDark: '#225577',
            clothesLight: '#77aadd',
            clothesAccent: '#00eeff',
            features: { hasVeil: true, hasTiara: false, dressStyle: 'frost', hairStyle: 'flowing', hasGloves: true }
        },
        demon_lord: {
            id: 'demon_lord',
            name: '恶魔猎手',
            description: '恶魔领主的暗黑之力，强大的气场',
            source: '恶魔领主',
            rarity: 'mythical',
            skinColor: '#4a2a5a',
            skinShadow: '#2a1a3a',
            skinHighlight: '#6a4a7a',
            hairColor: '#1a0a2a',
            hairHighlight: '#3a1a4a',
            hairShadow: '#0a051a',
            eyeColor: '#ff0000',
            eyeHighlight: '#ff4444',
            clothesColor: '#2a0a3a',
            clothesDark: '#1a051a',
            clothesLight: '#4a2a5a',
            clothesAccent: '#8800ff',
            features: { hasVeil: true, hasTiara: true, dressStyle: 'demon', hairStyle: 'horned', hasGloves: true }
        }
    },
    
    getAvailableSkins: function() {
        return Object.values(this.skins).filter(s => this.unlockedSkins.includes(s.id));
    },
    
    getAllSkins: function() {
        return Object.values(this.skins);
    },
    
    getCurrentSkin: function() {
        return this.skins[this.current];
    },
    
    setSkin: function(skinId) {
        if (this.unlockedSkins.includes(skinId)) {
            this.current = skinId;
            this.save();
            this.triggerSkinChange();
            return true;
        }
        return false;
    },
    
    unlockSkin: function(skinId) {
        if (this.skins[skinId] && !this.unlockedSkins.includes(skinId)) {
            this.unlockedSkins.push(skinId);
            this.save();
            return true;
        }
        return false;
    },
    
    isUnlocked: function(skinId) {
        return this.unlockedSkins.includes(skinId);
    },
    
    save: function() {
        try {
            localStorage.setItem('pixelarpg_skins', JSON.stringify({
                current: this.current,
                unlockedSkins: this.unlockedSkins
            }));
        } catch(e) {}
    },
    
    load: function() {
        try {
            const saved = JSON.parse(localStorage.getItem('pixelarpg_skins'));
            if (saved) {
                this.current = saved.current || 'hero';
                this.unlockedSkins = saved.unlockedSkins || ['hero'];
            }
        } catch(e) {
            this.current = 'hero';
            this.unlockedSkins = ['hero'];
        }
    },
    
    triggerSkinChange: function() {
        try {
            if (window.SpriteManager && window.SpriteManager.defaultHero !== undefined) {
                window.SpriteManager.defaultHero = null;
                window.SpriteManager.generateDefaultHero();
            }
        } catch(e) {
            console.log('SpriteManager not ready:', e);
        }
        if (window.updatePlayerAvatar) {
            window.updatePlayerAvatar();
        }
    },
    
    init: function() {
        this.load();
    }
};

window.PlayerSkins.init();
