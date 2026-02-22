/**
 * 玩家形象系统
 * 支持多个角色皮肤自由切换
 */

window.PlayerSkins = {
    // 当前选中的皮肤
    current: 'bride',
    
    // 皮肤列表
    skins: {
        // 原始勇者形象
        hero: {
            name: '勇者',
            // 皮肤颜色
            skinColor: '#ffe4d0',
            skinShadow: '#f5c4a8',
            skinHighlight: '#fff0e8',
            // 头发颜色
            hairColor: '#f4c542',
            hairHighlight: '#ffe066',
            hairShadow: '#d4a012',
            // 眼睛颜色
            eyeColor: '#40d0b0',
            eyeHighlight: '#60ffe0',
            // 衣服颜色
            clothesColor: '#4a9eff',
            clothesDark: '#2070cc',
            clothesLight: '#7ac0ff',
            clothesAccent: '#ffd700',
            // 特征
            features: {
                hasVeil: false,
                hasTiara: false,
                dressStyle: 'tunic', // tunic, dress, armor
                hairStyle: 'short', // short, long, wavy
                hasGloves: false,
                hasHighHeels: false
            }
        },
        
        // 动漫新娘形象 - 根据用户描述
        bride: {
            name: '新娘',
            // 皮肤颜色 - 白皙肤色
            skinColor: '#fff5f0',
            skinShadow: '#ffe0d8',
            skinHighlight: '#ffffff',
            // 头发颜色 - 棕色长卷发
            hairColor: '#8B4513',
            hairHighlight: '#A0522D',
            hairShadow: '#5D3A1A',
            // 眼睛颜色 - 紫色
            eyeColor: '#9932CC',
            eyeHighlight: '#DA70D6',
            // 衣服颜色 - 白色婚纱
            clothesColor: '#FFFFFF',
            clothesDark: '#F0F0F0',
            clothesLight: '#FFFFFF',
            clothesAccent: '#FFB6C1', // 粉色装饰
            veilColor: 'rgba(255,255,255,0.6)',
            tiaraColor: '#FFD700',
            tiaraGem: '#FF69B4',
            gloveColor: '#FFFFFF',
            shoeColor: '#FFFFFF',
            // 特征
            features: {
                hasVeil: true,
                hasTiara: true,
                dressStyle: 'wedding', // 高开叉婚纱
                hairStyle: 'wavy', // 波浪长卷发
                hasGloves: true,
                hasHighHeels: true,
                hasSlit: true // 高开叉
            }
        },
        
        // 白骨夫人风格（解锁后可用）
        skeleton: {
            name: '白骨夫人',
            skinColor: '#FFFFFF',
            skinShadow: '#EEEEEE',
            skinHighlight: '#FFFFFF',
            hairColor: '#8a2be2',
            hairHighlight: '#9932cc',
            hairShadow: '#6a0dad',
            eyeColor: '#9932cc',
            eyeHighlight: '#ff00ff',
            clothesColor: '#6a0dad',
            clothesDark: '#4a0080',
            clothesLight: '#8a2be2',
            clothesAccent: '#00bfff',
            features: {
                hasVeil: false,
                hasTiara: true,
                dressStyle: 'bone',
                hairStyle: 'long',
                hasGloves: false,
                hasHighHeels: false,
                isSkeleton: true
            }
        }
    },
    
    // 获取当前皮肤
    getCurrentSkin() {
        return this.skins[this.current] || this.skins.hero;
    },
    
    // 切换皮肤
    setSkin(skinId) {
        if (this.skins[skinId]) {
            this.current = skinId;
            // 保存到本地存储
            try {
                localStorage.setItem('playerSkin', skinId);
            } catch(e) {}
            return true;
        }
        return false;
    },
    
    // 获取所有可用皮肤
    getAvailableSkins() {
        return Object.keys(this.skins).map(id => ({
            id,
            name: this.skins[id].name,
            unlocked: id === 'hero' || id === 'bride' || window.discoveredSkins?.[id]
        }));
    },
    
    // 解锁皮肤
    unlockSkin(skinId) {
        if (!window.discoveredSkins) window.discoveredSkins = {};
        window.discoveredSkins[skinId] = true;
    },
    
    // 初始化 - 从本地存储加载
    init() {
        try {
            const saved = localStorage.getItem('playerSkin');
            if (saved && this.skins[saved]) {
                this.current = saved;
            }
        } catch(e) {}
    }
};

// 自动初始化
window.PlayerSkins.init();
