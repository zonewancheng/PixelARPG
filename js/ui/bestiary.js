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
        this.render();
    },
    
    close: function() {
        if (!this.element) return;
        this.element.style.display = 'none';
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
            const discovered = window.discoveredEnemies?.[enemy.type];
            const count = discovered?.count || 0;
            grid.innerHTML += window.RenderUtils.getBestiaryMonsterHtml(enemy, count);
        });
        
        container.appendChild(grid);
    },
    
    renderBosses: function(container) {
        container.innerHTML = '<div class="bestiary-grid">';
        const grid = container.querySelector('.bestiary-grid');
        
        window.BOSS_TYPES.forEach(boss => {
            const discovered = window.discoveredEnemies?.[boss.type];
            const count = discovered?.count || 0;
            grid.innerHTML += window.RenderUtils.getBestiaryMonsterHtml(boss, count);
        });
        
        container.appendChild(grid);
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
