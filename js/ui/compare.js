/**
 * PixelARPG - 对比面板模块
 * 使用统一的渲染工具
 */

window.UICompare = {
    element: null,
    currentItem: null,
    currentSlot: null,
    source: null,
    
    init: function() {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.id = 'compare-panel';
            this.element.innerHTML = `
                <div class="compare-content">
                    <div class="compare-header">
                        <span>装备对比</span>
                        <button class="compare-close" id="compare-close-btn">✕</button>
                    </div>
                    <div class="compare-body">
                        <div class="compare-slot" id="compare-old">
                            <div class="compare-label">已穿戴</div>
                            <div class="compare-item-content"></div>
                        </div>
                        <div class="compare-stats-column" id="compare-stats"></div>
                        <div class="compare-slot" id="compare-new">
                            <div class="compare-label">新装备</div>
                            <div class="compare-item-content"></div>
                        </div>
                    </div>
                    <div class="compare-actions">
                        <button class="compare-btn sell" id="compare-sell-btn">出售</button>
                        <button class="compare-btn cancel" id="compare-cancel-btn">取消</button>
                        <button class="compare-btn confirm" id="compare-confirm-btn">确定</button>
                    </div>
                </div>
            `;
            document.getElementById('ui').appendChild(this.element);
            this.bindEvents();
        }
    },
    
    bindEvents: function() {
        const closeBtn = document.getElementById('compare-close-btn');
        if (closeBtn) {
            closeBtn.onclick = () => this.hide();
        }
        
        const cancelBtn = document.getElementById('compare-cancel-btn');
        if (cancelBtn) {
            cancelBtn.onclick = () => this.hide();
        }
        
        const confirmBtn = document.getElementById('compare-confirm-btn');
        if (confirmBtn) {
            confirmBtn.onclick = () => this.confirm();
        }
        
        const sellBtn = document.getElementById('compare-sell-btn');
        if (sellBtn) {
            sellBtn.onclick = () => this.sellItem();
        }
        
        this.element.onclick = (e) => {
            if (e.target === this.element) {
                this.hide();
            }
        };
    },
    
    show: function(item, slot, source) {
        this.init();
        this.currentItem = item;
        this.currentSlot = slot;
        this.source = source;
        
        const player = window.player;
        const equippedItem = slot ? player[slot] : null;
        
        this.render(item, equippedItem);
        this.element.style.display = 'flex';
    },
    
    hide: function() {
        if (this.element) {
            this.element.style.display = 'none';
        }
        this.currentItem = null;
        this.currentSlot = null;
        this.source = null;
    },
    
    render: function(newItem, equippedItem) {
        const newContent = this.element.querySelector('#compare-new .compare-item-content');
        const oldContent = this.element.querySelector('#compare-old .compare-item-content');
        const statsContent = this.element.querySelector('#compare-stats');
        
        // 使用统一工具生成装备显示
        newContent.innerHTML = this.getItemDisplayHtml(newItem);
        oldContent.innerHTML = this.getItemDisplayHtml(equippedItem);
        statsContent.innerHTML = window.RenderUtils.getCompareStatsHtml(newItem, equippedItem);
        
        const confirmBtn = document.getElementById('compare-confirm-btn');
        const sellBtn = document.getElementById('compare-sell-btn');
        
        if (this.source === 'shop') {
            confirmBtn.textContent = `购买 (${newItem.price}金)`;
            confirmBtn.className = 'compare-btn confirm buy';
            confirmBtn.style.display = 'inline-block';
            sellBtn.style.display = 'none';
        } else if (this.source === 'inventory') {
            confirmBtn.textContent = '穿戴';
            confirmBtn.className = 'compare-btn confirm equip';
            confirmBtn.style.display = 'inline-block';
            sellBtn.style.display = 'inline-block';
        }
    },
    
    getItemDisplayHtml: function(item) {
        if (!item) {
            return '<div class="compare-empty">无装备</div>';
        }
        
        const legendaryClass = item.quality === 'legendary' ? 'legendary' : '';
        const borderColor = item.color || '#888';
        
        let iconHtml = item.icon;
        if (window.renderEquipmentIcon) {
            const imgUrl = window.renderEquipmentIcon(item, 48);
            iconHtml = `<img src="${imgUrl}" style="image-rendering:pixelated;width:48px;height:48px;">`;
        }
        
        return `
            <div class="compare-item-icon ${legendaryClass}" style="border-color:${borderColor}">${iconHtml}</div>
            <div class="compare-item-header" style="color:${item.color || '#fff'}">${item.name}</div>
            <div class="compare-item-quality">${item.qualityName || '普通'} Lv.${item.level || 1}</div>
        `;
    },
    
    confirm: function() {
        if (this.source === 'shop') {
            this.buyItem();
        } else {
            this.equipItem();
        }
    },
    
    equipItem: function() {
        if (!this.currentItem || !this.currentSlot) {
            this.hide();
            return;
        }
        
        const player = window.player;
        const slot = this.currentSlot;
        const oldItem = player[slot];
        
        player[slot] = this.currentItem;
        
        const itemIndex = player.inventory.indexOf(this.currentItem);
        if (itemIndex > -1) {
            player.inventory.splice(itemIndex, 1);
        }
        
        if (oldItem) {
            player.inventory.push(oldItem);
        }
        
        if (window.recalculateStats) window.recalculateStats();
        
        this.hide();
        window.UIInventory?.render();
        window.UICharacter?.render();
        if (window.updatePlayerAvatar) window.updatePlayerAvatar();
    },
    
    buyItem: function() {
        const item = this.currentItem;
        const player = window.player;
        
        if (!item) {
            this.hide();
            return;
        }
        
        if (player.gold < item.price) {
            window.showMessage?.('金币不足!');
            return;
        }
        
        player.gold -= item.price;
        item.uid = Date.now() + Math.random();
        player.inventory.push(item);
        
        // 从商店移除已购买的物品
        if (this.source === 'shop' && window.UIShop?.items) {
            const idx = window.UIShop.items.indexOf(item);
            if (idx > -1) {
                window.UIShop.items.splice(idx, 1);
            }
        }
        
        this.hide();
        window.UIShop?.render();
        window.UIInventory?.render();
        window.updatePlayerAvatar?.();
        window.showMessage?.(`购买 ${item.name}`);
    },
    
    sellItem: function() {
        const item = this.currentItem;
        const player = window.player;
        
        if (!item) {
            this.hide();
            return;
        }
        
        const sellPrice = Math.floor((item.price || 10) * 0.5);
        player.gold += sellPrice;
        
        const itemIndex = player.inventory.indexOf(item);
        if (itemIndex > -1) {
            player.inventory.splice(itemIndex, 1);
        }
        
        this.hide();
        window.UIInventory?.render();
        window.UICharacter?.render();
        window.showMessage?.(`出售 ${item.name} +${sellPrice}金`);
    }
};
