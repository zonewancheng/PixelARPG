/**
 * PixelARPG - 图鉴面板模块
 * 使用统一的渲染工具
 */

window.UIBestiary = {
    element: null,
    currentTab: 'monster',
    
    init: function() {
        this.element = document.getElementById('bestiary-panel');
    },
    
    open: function() {
        if (!this.element) this.init();
        this.element.style.display = 'flex';
        if (typeof bestiaryOpen !== 'undefined') bestiaryOpen = true;
        this.render();
    },
    
    close: function() {
        if (!this.element) return;
        this.element.style.display = 'none';
        if (typeof bestiaryOpen !== 'undefined') bestiaryOpen = false;
    },
    
    render: function() {
        if (!this.element) return;
        
        this.element.innerHTML = `
            <div class="panel-header">
                <h2>图鉴</h2>
                <button class="panel-close-btn" id="bestiary-close-btn">✕</button>
            </div>
            <div class="panel-body">
                <div class="panel-tabs">
                    <button class="panel-tab ${this.currentTab === 'monster' ? 'active' : ''}" data-tab="monster">怪物</button>
                    <button class="panel-tab ${this.currentTab === 'boss' ? 'active' : ''}" data-tab="boss">Boss</button>
                    <button class="panel-tab ${this.currentTab === 'skin' ? 'active' : ''}" data-tab="skin">皮肤</button>
                    <button class="panel-tab ${this.currentTab === 'skill' ? 'active' : ''}" data-tab="skill">技能</button>
                    <button class="panel-tab ${this.currentTab === 'passive' ? 'active' : ''}" data-tab="passive">被动</button>
                    <button class="panel-tab ${this.currentTab === 'consumable' ? 'active' : ''}" data-tab="consumable">道具</button>
                    <button class="panel-tab ${this.currentTab === 'equipment' ? 'active' : ''}" data-tab="equipment">装备</button>
                </div>
                <div class="bestiary-content"></div>
            </div>
        `;
        
        this.bindEvents();
        this.renderContent();
    },
    
    bindEvents: function() {
        const closeBtn = document.getElementById('bestiary-close-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                window.PanelManager.closePanel('bestiary');
            };
        }
        
        document.querySelectorAll('#bestiary-panel .panel-tab').forEach(tab => {
            tab.onclick = () => {
                this.currentTab = tab.dataset.tab;
                this.render();
            };
        });
    },
    
    renderContent: function() {
        const content = document.querySelector('.bestiary-content');
        if (!content) return;
        
        if (this.currentTab === 'monster') {
            this.renderMonsters(content);
        } else if (this.currentTab === 'boss') {
            this.renderBosses(content);
        } else if (this.currentTab === 'skin') {
            this.renderSkins(content);
        } else if (this.currentTab === 'skill') {
            this.renderSkills(content);
        } else if (this.currentTab === 'passive') {
            this.renderPassives(content);
        } else if (this.currentTab === 'consumable') {
            this.renderConsumables(content);
        } else if (this.currentTab === 'equipment') {
            this.renderEquipment(content);
        }
    },
    
    renderMonsters: function(container) {
        container.innerHTML = '<div class="bestiary-grid">';
        const grid = container.querySelector('.bestiary-grid');
        
        window.ENEMY_TYPES.forEach(enemy => {
            grid.innerHTML += window.RenderUtils.getBestiaryMonsterHtml(enemy, 0);
        });
        
        container.appendChild(grid);
    },
    
    renderBosses: function(container) {
        container.innerHTML = '<div class="bestiary-grid">';
        const grid = container.querySelector('.bestiary-grid');
        
        window.BOSS_TYPES.forEach(boss => {
            grid.innerHTML += window.RenderUtils.getBestiaryMonsterHtml(boss, 0);
        });
        
        container.appendChild(grid);
    },
    
    renderSkins: function(container) {
        container.innerHTML = '<div class="bestiary-grid">';
        const grid = container.querySelector('.bestiary-grid');
        
        if (!window.PlayerSkins) {
            grid.innerHTML = '<div class="bestiary-empty">皮肤系统未加载</div>';
            container.appendChild(grid);
            return;
        }
        
        const allSkins = window.PlayerSkins.getAllSkins();
        const rarityColors = {
            common: '#9d9d9d',
            rare: '#1eff00',
            epic: '#0070dd',
            legendary: '#ff8000',
            mythical: '#e600e6'
        };
        
        allSkins.forEach(skin => {
            const unlocked = window.PlayerSkins.isUnlocked(skin.id);
            const current = window.PlayerSkins.current === skin.id;
            const rarityColor = rarityColors[skin.rarity] || '#fff';
            
            // 渲染皮肤预览
            let previewHtml = '';
            if (unlocked) {
                const imgSrc = this.renderSkinPreview(skin);
                previewHtml = `<img src="${imgSrc}" style="width:48px;height:48px;image-rendering:pixelated;border-radius:6px;">`;
            } else {
                previewHtml = `<div style="width:48px;height:48px;background:linear-gradient(135deg,#222,#111);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px dashed #444;">🔒</div>`;
            }
            
            grid.innerHTML += `
                <div class="bestiary-item ${unlocked ? 'unlocked' : 'locked'} ${current ? 'current' : ''}" 
                     data-skin-id="${skin.id}"
                     style="opacity: ${unlocked ? 1 : 0.5}; ${current ? 'border-color: #ffd700;' : ''}">
                    <div class="item-icon" style="background: transparent;">
                        ${previewHtml}
                    </div>
                    <div class="item-info">
                        <div class="item-name" style="color:${unlocked ? rarityColor : '#666'};${current ? 'font-weight:bold;' : ''}">
                            ${skin.name} ${current ? '✓' : ''}
                        </div>
                        <div class="item-desc">${unlocked ? skin.description : '击败对应Boss解锁'}</div>
                        <div class="item-source" style="color:#888;font-size:11px;">${unlocked ? '来源: ' + skin.source : ''}</div>
                        <div class="item-rarity" style="color:${rarityColor};font-size:10px;">${unlocked ? skin.rarity : ''}</div>
                    </div>
                </div>
            `;
        });
        
        container.appendChild(grid);
        
        // 绑定点击事件
        container.querySelectorAll('.bestiary-item').forEach(item => {
            item.onclick = () => {
                const skinId = item.dataset.skinId;
                if (window.PlayerSkins.isUnlocked(skinId)) {
                    window.PlayerSkins.setSkin(skinId);
                    this.renderSkins(container);
                    showMessage(`已切换为: ${window.PlayerSkins.skins[skinId].name}`, 60);
                }
            };
        });
    },
    
    renderSkinPreview: function(skin) {
        // 直接返回canvas渲染
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        canvas.style.imageRendering = 'pixelated';
        
        const cx = 24;
        const size = 48;
        
        const ctx = canvas.getContext('2d');
        
        // 阴影
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, size * 0.9, size * 0.2, size * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 腿部
        ctx.fillStyle = skin.clothesColor;
        ctx.fillRect(cx - 8, size * 0.6, 6, size * 0.25);
        ctx.fillRect(cx + 2, size * 0.6, 6, size * 0.25);
        
        // 身体
        ctx.fillStyle = skin.clothesColor;
        ctx.beginPath();
        ctx.roundRect(cx - 12, size * 0.35, 24, size * 0.28, 3);
        ctx.fill();
        
        // 头部
        ctx.fillStyle = skin.skinColor;
        ctx.beginPath();
        ctx.arc(cx, size * 0.25, size * 0.18, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = skin.eyeColor;
        ctx.beginPath();
        ctx.arc(cx - 4, size * 0.24, 2.5, 0, Math.PI * 2);
        ctx.arc(cx + 4, size * 0.24, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛高光
        ctx.fillStyle = skin.eyeHighlight || '#fff';
        ctx.beginPath();
        ctx.arc(cx - 3, size * 0.23, 1, 0, Math.PI * 2);
        ctx.arc(cx + 5, size * 0.23, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // 头发
        ctx.fillStyle = skin.hairColor;
        ctx.beginPath();
        ctx.arc(cx, size * 0.18, size * 0.16, Math.PI, Math.PI * 2);
        ctx.fill();
        
        // 返回data URL
        return canvas.toDataURL();
    },
    
    renderSkills: function(container) {
        container.innerHTML = '<div class="bestiary-grid">';
        const grid = container.querySelector('.bestiary-grid');
        
        // 只显示主动技能，不显示被动技能
        const activeSkills = window.SKILLS.filter(skill => !skill.passive);
        activeSkills.forEach(skill => {
            const unlocked = skill.id === 'slash' || window.discoveredSkills?.[skill.id];
            grid.innerHTML += window.RenderUtils.getBestiarySkillHtml(skill, unlocked);
        });
        
        container.appendChild(grid);
    },
    
    renderPassives: function(container) {
        container.innerHTML = '<div class="bestiary-grid">';
        const grid = container.querySelector('.bestiary-grid');
        
        // 筛选被动技能
        const passiveSkills = window.SKILLS.filter(skill => skill.passive);
        
        if (passiveSkills.length === 0) {
            grid.innerHTML += '<div class="bestiary-empty">暂无被动技能</div>';
        } else {
            passiveSkills.forEach(skill => {
                // 被动技能默认已解锁
                grid.innerHTML += window.RenderUtils.getBestiarySkillHtml(skill, true);
            });
        }
        
        container.appendChild(grid);
    },
    
    renderConsumables: function(container) {
        container.innerHTML = '<div class="bestiary-grid">';
        const grid = container.querySelector('.bestiary-grid');
        
        const consumables = window.CONSUMABLES || [];
        consumables.forEach(consumable => {
            const iconUrl = window.renderConsumableIcon ? window.renderConsumableIcon(consumable, 28) : '';
            
            let effectText = '';
            if (consumable.heal) effectText = `治疗: ${consumable.heal}`;
            else if (consumable.mp) effectText = `魔法: ${consumable.mp}`;
            else if (consumable.value) effectText = `价值: ${consumable.value}`;
            
            grid.innerHTML += `<div class="bestiary-card">
                <div class="bestiary-card-icon" style="background:transparent">
                    ${iconUrl ? `<img src="${iconUrl}" style="image-rendering:pixelated;width:28px;height:28px;">` : `<span style="font-size:24px">${consumable.icon}</span>`}
                </div>
                <div class="bestiary-card-name">${consumable.name}</div>
                <div class="bestiary-card-info">${consumable.desc || ''}</div>
                <div class="bestiary-card-count">${effectText}</div>
            </div>`;
        });
        
        container.appendChild(grid);
    },
    
    renderEquipment: function(container) {
        container.innerHTML = '<div class="bestiary-grid">';
        const grid = container.querySelector('.bestiary-grid');
        
        const types = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
        types.forEach(type => {
            const items = window.BASE_ITEMS?.filter(i => i.type === type) || [];
            items.forEach(item => {
                const discovered = window.discoveredItems?.[item.id];
                grid.innerHTML += window.RenderUtils.getBestiaryEquipmentHtml(item, discovered);
            });
        });
        
        container.appendChild(grid);
    }
};
