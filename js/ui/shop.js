/**
 * PixelARPG - 商店面板模块
 * 使用统一的渲染工具
 */

window.UIShop = {
    element: null,
    items: [],
    
    init: function() {
        this.element = document.getElementById('shop-panel');
    },
    
    open: function() {
        if (!this.element) this.init();
        this.refreshItems();
        this.render();
        this.element.style.display = 'flex';
        if (typeof shopOpen !== 'undefined') shopOpen = true;
    },
    
    close: function() {
        if (!this.element) return;
        this.element.style.display = 'none';
        if (typeof shopOpen !== 'undefined') shopOpen = false;
    },
    
    refreshItems: function() {
        const player = window.player;
        const level = player.level || 1;
        const types = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
        
        this.items = [];
        for (let i = 0; i < 6; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const item = window.generateRandomItem(type, level);
            if (item) {
                item.uid = Date.now() + Math.random();
                this.items.push(item);
            }
        }
    },
    
    render: function() {
        if (!this.element) return;
        
        const player = window.player;
        
        // 使用统一工具生成商店物品
        const itemsHtml = this.items.map((item, i) => {
            return window.RenderUtils.getShopItemHtml(item, {
                onclick: `window.UICompare.show(window.UIShop.items[${i}], '${item.type}', 'shop')`
            });
        }).join('');
        
        this.element.innerHTML = `
            <div class="panel-header">
                <h2>商店</h2>
                <button class="panel-close-btn" id="shop-close-btn">✕</button>
            </div>
            <div class="panel-body">
                <div class="shop-header">
                    <span>商品</span>
                    <span class="shop-gold">💰 ${player.gold}</span>
                </div>
                <div class="shop-items">${itemsHtml}</div>
                <div class="shop-buttons">
                    <button class="panel-btn" id="shop-refresh-btn">刷新 (50金)</button>
                    <button class="panel-btn" id="shop-sell-btn">出售装备</button>
                </div>
            </div>
        `;
        
        this.bindEvents();
    },
    
    bindEvents: function() {
        const closeBtn = document.getElementById('shop-close-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                window.PanelManager.closePanel('shop');
            };
        }
        
        const refreshBtn = document.getElementById('shop-refresh-btn');
        if (refreshBtn) {
            refreshBtn.onclick = () => {
                if (window.player.gold >= 50) {
                    window.player.gold -= 50;
                    this.refreshItems();
                    this.render();
                    window.showMessage?.('商店已刷新');
                } else {
                    window.showMessage?.('金币不足!');
                }
            };
        }
        
        const sellBtn = document.getElementById('shop-sell-btn');
        if (sellBtn) {
            sellBtn.onclick = () => this.sellEquipment();
        }
    },
    
    sellEquipment: function() {
        const player = window.player;
        const equippedUids = new Set([
            player.weapon?.uid, player.armor?.uid, player.helmet?.uid,
            player.boots?.uid, player.ring?.uid, player.necklace?.uid
        ].filter(Boolean));
        
        const sellItems = player.inventory.filter(item => item && !equippedUids.has(item.uid));
        
        if (sellItems.length === 0) {
            window.showMessage?.('没有可出售的装备');
            return;
        }
        
        const totalGold = sellItems.reduce((sum, item) => sum + Math.floor((item.price || 10) * 0.5), 0);
        
        window.showConfirm(`出售 ${sellItems.length} 件装备？\n将获得 ${totalGold} 金币`, () => {
            player.gold += totalGold;
            player.inventory = player.inventory.filter(item => !item || equippedUids.has(item.uid));
            window.showMessage?.(`出售装备获得 ${totalGold} 金币`);
            this.render();
        });
    }
};
