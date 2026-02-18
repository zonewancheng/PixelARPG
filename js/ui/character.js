/**
 * PixelARPG - 角色面板模块
 * 使用统一的渲染工具
 */

window.UICharacter = {
    element: null,
    
    init: function() {
        this.element = document.getElementById('character-panel');
    },
    
    open: function() {
        if (!this.element) this.init();
        this.element.style.display = 'flex';
        this.render();
        if (window.updatePlayerAvatar) window.updatePlayerAvatar();
        if (typeof characterOpen !== 'undefined') characterOpen = true;
    },
    
    close: function() {
        if (!this.element) return;
        this.element.style.display = 'none';
        if (typeof characterOpen !== 'undefined') characterOpen = false;
    },
    
    render: function() {
        if (!this.element) return;
        
        const player = window.player;
        const expToLevel = player.level * 100;
        const expPercent = Math.floor((player.exp / expToLevel) * 100);
        
        const equipSlots = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
        
        this.element.innerHTML = `
            <div class="panel-header">
                <h2>角色</h2>
                <button class="panel-close-btn" id="character-close-btn">✕</button>
            </div>
            <div class="panel-body">
                <div class="character-display">
                    <div class="equip-column">
                        ${equipSlots.slice(0, 3).map(slot => {
                            const item = player[slot];
                            return window.RenderUtils.getEquipSlotHtml(item, slot, {
                                onclick: item ? `window.UICompare.show(window.player['${slot}'], '${slot}', 'inventory')` : ''
                            });
                        }).join('')}
                    </div>
                    <div class="char-body">
                        ${window.renderPlayerIcon ? `<img src="${window.renderPlayerIcon(player, 48)}" style="image-rendering:pixelated;width:48px;height:48px;">` : '🧙'}
                    </div>
                    <div class="equip-column">
                        ${equipSlots.slice(3, 6).map(slot => {
                            const item = player[slot];
                            return window.RenderUtils.getEquipSlotHtml(item, slot, {
                                onclick: item ? `window.UICompare.show(window.player['${slot}'], '${slot}', 'inventory')` : ''
                            });
                        }).join('')}
                    </div>
                </div>
                <div class="stats-panel">
                    <div class="stat-row">
                        <span class="stat-label">等级</span>
                        <span class="stat-value">${player.level}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">经验</span>
                        <span class="stat-value">${player.exp}/${expToLevel} (${expPercent}%)</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">金币</span>
                        <span class="stat-value">${player.gold}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">生命</span>
                        <span class="stat-value">${Math.floor(player.hp)}/${player.maxHp}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">魔法</span>
                        <span class="stat-value">${Math.floor(player.mp)}/${player.maxMp}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">攻击</span>
                        <span class="stat-value">${player.atk}<span class="stat-value bonus">+${player.atkPercent || 0}%</span></span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">防御</span>
                        <span class="stat-value">${player.def}<span class="stat-value bonus">+${player.defPercent || 0}%</span></span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">HP恢复</span>
                        <span class="stat-value">${player.hpRegen || 0}/s</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">MP恢复</span>
                        <span class="stat-value">${player.mpRegen || 0}/s</span>
                    </div>
                </div>
            </div>
        `;
        
        this.bindEvents();
    },
    
    bindEvents: function() {
        const closeBtn = document.getElementById('character-close-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                window.PanelManager.closePanel('character');
            };
        }
    }
};
