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
        
        window.SKILLS.forEach(skill => {
            const unlocked = skill.id === 'slash' || window.discoveredSkills?.[skill.id];
            grid.innerHTML += window.RenderUtils.getBestiarySkillHtml(skill, unlocked);
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
