/**
 * 玩家形象系统
 * 支持多个角色皮肤自由切换
 */

window.PlayerSkins = {
    // 当前选中的皮肤
    current: 'hero',
    
    // 皮肤列表
    skins: {
        // 原始勇者形象
        hero: {
            id: 'hero',
            name: '勇者',
            description: '经典勇者形象，蓝色披风，金色短发',
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
            features: {
                hasVeil: false,
                hasTiara: false,
                dressStyle: 'tunic',
                hairStyle: 'short',
                hasGloves: false,
                hasHighHeels: false
            }
        },
        
        // 动漫新娘形象
        bride: {
            id: 'bride',
            name: '新娘',
            description: '美丽的新娘，棕色长卷发，白色婚纱',
            skinColor: '#fff5f0',
            skinShadow: '#ffe0d8',
            skinHighlight: '#ffffff',
            hairColor: '#8B4513',
            hairHighlight: '#A0522D',
            hairShadow: '#5D3A1A',
            eyeColor: '#9932CC',
            eyeHighlight: '#DA70D6',
            clothesColor: '#FFFFFF',
            clothesDark: '#F0F0F0',
            clothesLight: '#FFFFFF',
            clothesAccent: '#FFB6C1',
            features: {
                hasVeil: true,
                hasTiara: true,
                dressStyle: 'wedding',
                hairStyle: 'wavy',
                hasGloves: true,
                hasHighHeels: true
            }
        },
        
        // 白骨夫人风格
        skeleton: {
            id: 'skeleton',
            name: '白骨夫人',
            description: '白骨夫人风格，紫色长发，骨骼身躯',
            skinColor: '#f5f5f5',
            skinShadow: '#e0e0e0',
            skinHighlight: '#ffffff',
            hairColor: '#9932CC',
            hairHighlight: '#DA70D6',
            hairShadow: '#6B238E',
            eyeColor: '#ff00ff',
            eyeHighlight: '#ff88ff',
            clothesColor: '#2a2a2a',
            clothesDark: '#1a1a1a',
            clothesLight: '#3a3a3a',
            clothesAccent: '#9932CC',
            features: {
                hasVeil: false,
                hasTiara: false,
                dressStyle: 'bone',
                hairStyle: 'long',
                hasGloves: false,
                hasHighHeels: false
            }
        },
        
        // 忍者风格
        ninja: {
            id: 'ninja',
            name: '忍者',
            description: '神秘忍者，黑色装束，敏捷身手',
            skinColor: '#ffe4d0',
            skinShadow: '#f5c4a8',
            skinHighlight: '#fff0e8',
            hairColor: '#1a1a1a',
            hairHighlight: '#3a3a3a',
            hairShadow: '#000000',
            eyeColor: '#ff0000',
            eyeHighlight: '#ff6666',
            clothesColor: '#1a1a1a',
            clothesDark: '#000000',
            clothesLight: '#2a2a2a',
            clothesAccent: '#ff0000',
            features: {
                hasVeil: false,
                hasTiara: false,
                dressStyle: 'ninja',
                hairStyle: 'short',
                hasGloves: true,
                hasHighHeels: false
            }
        },
        
        // 圣骑士
        paladin: {
            id: 'paladin',
            name: '圣骑士',
            description: '神圣圣骑士，金色铠甲，正义之光',
            skinColor: '#ffe4d0',
            skinShadow: '#f5c4a8',
            skinHighlight: '#fff0e8',
            hairColor: '#ffd700',
            hairHighlight: '#ffee88',
            hairShadow: '#cc9900',
            eyeColor: '#0066ff',
            eyeHighlight: '#66aaff',
            clothesColor: '#ffd700',
            clothesDark: '#cc9900',
            clothesLight: '#ffee88',
            clothesAccent: '#ffffff',
            features: {
                hasVeil: false,
                hasTiara: false,
                dressStyle: 'armor',
                hairStyle: 'short',
                hasGloves: true,
                hasHighHeels: false
            }
        }
    },
    
    // 获取当前皮肤配置
    getCurrentSkin: function() {
        return this.skins[this.current] || this.skins.hero;
    },
    
    // 获取所有可用皮肤列表
    getAvailableSkins: function() {
        return Object.values(this.skins);
    },
    
    // 设置当前皮肤
    setSkin: function(skinId) {
        if (this.skins[skinId]) {
            this.current = skinId;
            // 保存到本地存储
            try {
                localStorage.setItem('playerSkin', skinId);
            } catch (e) {}
            
            // 触发皮肤切换事件
            window.dispatchEvent(new CustomEvent('skinChanged', { detail: { skinId } }));
            
            return true;
        }
        return false;
    },
    
    // 初始化 - 从本地存储恢复皮肤选择
    init: function() {
        try {
            const saved = localStorage.getItem('playerSkin');
            if (saved && this.skins[saved]) {
                this.current = saved;
            }
        } catch (e) {}
    }
};

// 初始化
PlayerSkins.init();

// 自动初始化
window.PlayerSkins.init();
