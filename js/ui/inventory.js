/**
 * PixelARPG - 背包面板模块
 * 使用统一的渲染工具
 */

window.UIInventory = {
    element: null,
    
    init: function() {
        this.element = document.getElementById('inventory-panel');
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
        
        const player = window.player;
        const equippedUids = this.getEquippedUids();
        
        // 生成背包物品格子
        let itemsHtml = '';
        const maxSlots = Math.max(player.inventory.length, 16);
        for (let i = 0; i < maxSlots; i++) {
            const item = player.inventory[i];
            const isEquipped = item && equippedUids.has(item.uid);
            
            let slotClass = '';
            if (item) {
                slotClass = `${isEquipped ? 'equipped' : ''} ${item.quality === 'legendary' ? 'legendary' : ''}`;
            } else {
                slotClass = 'empty';
            }
            
            const borderColor = item?.color || 'rgba(80, 100, 140, 0.2)';
            const tooltip = item ? window.RenderUtils.getItemTooltip(item, { isEquipped }) : '';
            
            let iconHtml = item ? item.icon : '';
            if (item && window.renderEquipmentIcon) {
                const imgUrl = window.renderEquipmentIcon(item, 40);
                iconHtml = `<img src="${imgUrl}" style="image-rendering:pixelated;width:40px;height:40px;">`;
            }
            
            itemsHtml += `<div class="item-slot ${slotClass}" 
                data-index="${i}" 
                style="border-color:${borderColor}"
                title="${tooltip}">
                ${iconHtml}
            </div>`;
        }
        
        // 生成装备栏
        const equipSlots = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
        
        this.element.innerHTML = `
            <div class="panel-header">
                <h2>背包 (${player.inventory.length})</h2>
                <button class="panel-close-btn" id="inventory-close-btn">✕</button>
            </div>
            <div class="panel-body">
                <div class="equipment-section">
                    ${equipSlots.map(slot => {
                        const item = player[slot];
                        return `
                            <div class="equip-column">
                                ${window.RenderUtils.getEquipSlotHtml(item, slot, {
                                    onclick: item ? `window.UICompare.show(window.player['${slot}'], '${slot}', 'inventory')` : ''
                                })}
                                <span class="equip-label">${window.EQUIPMENT_SLOTS?.[slot]?.name || slot}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="item-grid">${itemsHtml}</div>
                <div class="sell-section">
                    <div class="sell-title">一键出售</div>
                    <div class="quick-sell-btns">
                        <button class="quick-sell-btn" data-quality="common" style="border-color:#fff">白</button>
                        <button class="quick-sell-btn" data-quality="uncommon" style="border-color:#4f4">绿</button>
                        <button class="quick-sell-btn" data-quality="rare" style="border-color:#44f">蓝</button>
                        <button class="quick-sell-btn" data-quality="epic" style="border-color:#a4f">紫</button>
                        <button class="quick-sell-btn" data-quality="legendary" style="border-color:#fa4">金</button>
                    </div>
                    <div class="sell-tip">点击物品查看详情/穿戴，长按品质按钮直接出售</div>
                </div>
            </div>
        `;
        
        this.bindEvents();
    },
    
    bindEvents: function() {
        const closeBtn = document.getElementById('inventory-close-btn');
        if (closeBtn) {
            closeBtn.onclick = () => window.PanelManager.closePanel('inventory');
        }
        
        // 物品格子点击 - 打开对比面板
        document.querySelectorAll('#inventory-panel .item-slot:not(.empty)').forEach(slot => {
            slot.onclick = () => {
                const index = parseInt(slot.dataset.index);
                const item = window.player.inventory[index];
                if (item) {
                    window.UICompare.show(item, item.type, 'inventory');
                }
            };
        });
        
        // 物品格子长按 - 一键出售该品质
        document.querySelectorAll('#inventory-panel .item-slot:not(.empty)').forEach(slot => {
            slot.oncontextmenu = (e) => {
                e.preventDefault();
                const index = parseInt(slot.dataset.index);
                const item = window.player.inventory[index];
                if (item) {
                    this.quickSell(item.quality);
                }
            };
        });
        
        // 一键出售按钮
        document.querySelectorAll('#inventory-panel .quick-sell-btn').forEach(btn => {
            btn.onclick = () => {
                this.quickSell(btn.dataset.quality);
            };
        });
    },
    
    quickSell: function(quality) {
        const player = window.player;
        const equippedUids = this.getEquippedUids();
        
        const sellItems = player.inventory.filter(item => {
            return item && item.quality === quality && !equippedUids.has(item.uid);
        });
        
        if (sellItems.length === 0) {
            window.showMessage('没有可出售的该品质装备');
            return;
        }
        
        const totalGold = sellItems.reduce((sum, item) => sum + Math.floor((item.price || 10) * 0.5), 0);
        const qualityName = this.getQualityName(quality);
        
        const confirmed = confirm(`出售 ${sellItems.length} 件${qualityName}装备？\n将获得 ${totalGold} 金币`);
        
        if (confirmed) {
            player.inventory = player.inventory.filter(item => {
                if (item && item.quality === quality && !equippedUids.has(item.uid)) {
                    player.gold += Math.floor((item.price || 10) * 0.5);
                    return false;
                }
                return true;
            });
            window.showMessage(`出售 ${sellItems.length} 件${qualityName}装备，获得 ${totalGold} 金币`);
            this.render();
        }
    },
    
    getEquippedUids: function() {
        const player = window.player;
        return new Set([
            player.weapon?.uid, player.armor?.uid, player.helmet?.uid,
            player.boots?.uid, player.ring?.uid, player.necklace?.uid
        ].filter(Boolean));
    },
    
    getQualityName: function(quality) {
        const names = {
            common: '普通',
            uncommon: '优秀',
            rare: '精良',
            epic: '史诗',
            legendary: '传说'
        };
        return names[quality] || quality;
    }
};
