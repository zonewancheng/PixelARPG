/**
 * PixelARPG - 商店面板模块
 * 全新设计的商店界面
 */

window.UIShop = {
    element: null,
    items: [],
    maxItems: 6,
    
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
        const level = player?.level || 1;
        const types = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
        
        this.items = [];
        for (let i = 0; i < this.maxItems; i++) {
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
        
        // 生成商品卡片HTML
        const itemsHtml = this.items.length > 0 
            ? this.items.map((item, i) => this.createShopItemHtml(item, i)).join('')
            : '<div class="shop-empty">暂无商品</div>';
        
        this.element.innerHTML = `
            <div class="panel-header">
                <h2>⚔️ 商店</h2>
                <button class="panel-close-btn" id="shop-close-btn">✕</button>
            </div>
            <div class="panel-body">
                <div class="shop-header">
                    <span>商品列表</span>
                    <span class="shop-gold">${player?.gold || 0}</span>
                </div>
                <div class="shop-items">${itemsHtml}</div>
                <div class="shop-buttons">
                    <button class="panel-btn" id="shop-refresh-btn">刷新商品 (50金)</button>
                    <button class="panel-btn" id="shop-sell-btn">出售装备</button>
                </div>
            </div>
        `;
        
        this.bindEvents();
    },
    
    createShopItemHtml: function(item, index) {
        const quality = item.quality || 0;
        const qualityNames = ['普通', '优秀', '稀有', '史诗', '传说'];
        const qualityColors = ['#9ca3af', '#22c55e', '#3b82f6', '#a855f7', '#f59e0b'];
        const typeNames = {
            weapon: '武器',
            armor: '护甲',
            helmet: '头盔',
            boots: '靴子',
            ring: '戒指',
            necklace: '项链'
        };
        
        // 获取品质索引
        let qualityIndex = 0;
        if (window.QUALITY_ORDER) {
            qualityIndex = window.QUALITY_ORDER.indexOf(quality);
        } else {
            qualityIndex = quality;
        }
        qualityIndex = Math.max(0, Math.min(4, qualityIndex));
        
        // 生成物品图标
        let iconHtml = '';
        if (window.renderEquipmentIcon) {
            const iconCanvas = window.renderEquipmentIcon(item, 40);
            if (iconCanvas) {
                iconHtml = `<img src="${iconCanvas.toDataURL()}" alt="${item.name}">`;
            }
        }
        
        // 如果没有图标，使用emoji
        if (!iconHtml) {
            const typeEmojis = {
                weapon: '⚔️',
                armor: '🛡️',
                helmet: '⛑️',
                boots: '👢',
                ring: '💍',
                necklace: '📿'
            };
            iconHtml = `<span style="font-size: 24px;">${typeEmojis[item.type] || '📦'}</span>`;
        }
        
        return `
            <div class="shop-item quality-${qualityIndex}" 
                 onclick="window.UIShop.showItemDetail(${index})"
                 title="${item.name} (${qualityNames[qualityIndex]})">
                <div class="shop-item-icon">
                    ${iconHtml}
                </div>
                <div class="shop-item-name" style="color: ${qualityColors[qualityIndex]}">
                    ${item.name}
                </div>
                <div class="shop-item-type">${typeNames[item.type] || item.type}</div>
                <div class="shop-item-price">${item.price || 10}</div>
            </div>
        `;
    },
    
    showItemDetail: function(index) {
        const item = this.items[index];
        if (!item) return;
        
        // 显示对比面板
        if (window.UICompare && window.UICompare.show) {
            window.UICompare.show(item, item.type, 'shop');
        }
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
            refreshBtn.onclick = () => this.handleRefresh();
        }
        
        const sellBtn = document.getElementById('shop-sell-btn');
        if (sellBtn) {
            sellBtn.onclick = () => this.sellEquipment();
        }
    },
    
    handleRefresh: function() {
        const player = window.player;
        if (!player) return;
        
        if (player.gold >= 50) {
            player.gold -= 50;
            this.refreshItems();
            this.render();
            window.showMessage?.('商店商品已刷新！');
        } else {
            window.showMessage?.('金币不足！需要50金币');
        }
    },
    
    sellEquipment: function() {
        const player = window.player;
        if (!player || !player.inventory) return;
        
        const equippedUids = new Set([
            player.weapon?.uid, 
            player.armor?.uid, 
            player.helmet?.uid,
            player.boots?.uid, 
            player.ring?.uid, 
            player.necklace?.uid
        ].filter(Boolean));
        
        const sellItems = player.inventory.filter(item => item && !equippedUids.has(item.uid));
        
        if (sellItems.length === 0) {
            window.showMessage?.('背包中没有可出售的装备');
            return;
        }
        
        const totalGold = sellItems.reduce((sum, item) => {
            return sum + Math.floor((item.price || 10) * 0.5);
        }, 0);
        
        window.showConfirm?.(
            `确定要出售 ${sellItems.length} 件装备吗？\n预计获得 ${totalGold} 金币`,
            () => {
                player.gold += totalGold;
                player.inventory = player.inventory.filter(item => 
                    !item || equippedUids.has(item.uid)
                );
                window.showMessage?.(`成功出售装备，获得 ${totalGold} 金币！`);
                this.render();
            }
        );
    },
    
    // 购买物品
    buyItem: function(item) {
        const player = window.player;
        if (!player || !item) return false;
        
        const price = item.price || 10;
        
        if (player.gold < price) {
            window.showMessage?.('金币不足！');
            return false;
        }
        
        if (player.inventory.length >= (player.maxInventory || 30)) {
            window.showMessage?.('背包已满！');
            return false;
        }
        
        player.gold -= price;
        player.inventory.push(item);
        
        // 从商店移除
        const index = this.items.findIndex(i => i.uid === item.uid);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        
        window.showMessage?.(`购买成功：${item.name}`);
        this.render();
        return true;
    }
};

// 兼容旧代码
window.shopOpen = false;
