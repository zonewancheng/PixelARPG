/**
 * PixelARPG - 背包面板模块
 * 完整功能：排序、叠加、穿戴、对比、出售
 */

window.UIInventory = {
    element: null,
    sortType: 'default', // default, quality, type, level
    
    init: function() {
        this.element = document.getElementById('inventory-panel');
    },
    
    open: function() {
        if (!this.element) this.init();
        this.element.style.display = 'flex';
        this.render();
        if (typeof inventoryOpen !== 'undefined') inventoryOpen = true;
    },
    
    close: function() {
        if (!this.element) return;
        this.element.style.display = 'none';
        if (typeof inventoryOpen !== 'undefined') inventoryOpen = false;
    },
    
    render: function() {
        if (!this.element) return;
        
        const player = window.player;
        const equippedUids = this.getEquippedUids();
        
        // 排序背包
        const sortedInventory = this.sortInventory([...player.inventory], this.sortType);
        
        // 生成背包物品格子
        let itemsHtml = '';
        const maxSlots = Math.max(sortedInventory.length, 20);
        for (let i = 0; i < maxSlots; i++) {
            const item = sortedInventory[i];
            const isEquipped = item && equippedUids.has(item.uid);
            
            let slotClass = '';
            if (item) {
                slotClass = `${isEquipped ? 'equipped' : ''} ${item.quality === 'legendary' ? 'legendary' : ''}`;
            } else {
                slotClass = 'empty';
            }
            
            // 只有装备类物品才显示彩色边框，药水等消耗品使用默认边框
            const equipmentTypes = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
            const borderColor = item && equipmentTypes.includes(item.type) ? (item.color || 'rgba(80, 100, 140, 0.2)') : 'rgba(80, 100, 140, 0.2)';
            const tooltip = item ? window.RenderUtils.getItemTooltip(item, { isEquipped }) : '';
            
            let iconHtml = item ? item.icon : '';
            if (item && window.renderEquipmentIcon) {
                const canvas = window.renderEquipmentIcon(item, 40);
                const imgUrl = canvas.toDataURL();
                iconHtml = `<img src="${imgUrl}" style="image-rendering:pixelated;width:40px;height:40px;">`;
            }
            
            // 数量显示
            const qtyBadge = item && item.quantity > 1 ? `<span class="qty-badge">${item.quantity}</span>` : '';
            
            itemsHtml += `<div class="inv-slot ${slotClass}" 
                data-index="${i}" 
                data-item-id="${item?.id || ''}"
                data-quality="${item?.quality || ''}"
                style="border-color:${borderColor}"
                title="${tooltip}">
                ${iconHtml}
                ${qtyBadge}
            </div>`;
        }
        
        // 生成装备栏
        const equipSlots = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'];
        
        // 排序选项
        const sortOptions = [
            { value: 'default', label: '默认' },
            { value: 'quality', label: '品质' },
            { value: 'type', label: '类型' },
            { value: 'level', label: '等级' }
        ];
        
        this.element.innerHTML = `
            <div class="panel-header">
                <h2>背包 (${player.inventory.length}格)</h2>
                <button class="panel-close-btn" id="inventory-close-btn">✕</button>
            </div>
            <div class="inventory-container">
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
                <div class="sort-section">
                    <span class="sort-label">排序:</span>
                    <select id="inventory-sort" class="sort-select">
                        ${sortOptions.map(opt => `<option value="${opt.value}" ${this.sortType === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                    </select>
                </div>
                <div class="item-grid" id="inventory-grid">${itemsHtml}</div>
                <div class="action-section">
                    <button class="action-btn" id="btn-stack">整理背包</button>
                    <div class="sell-section">
                        <div class="sell-title">快速出售</div>
                        <div class="quick-sell-btns">
                            <button class="quick-sell-btn" data-quality="common">白</button>
                            <button class="quick-sell-btn" data-quality="uncommon">绿</button>
                            <button class="quick-sell-btn" data-quality="rare">蓝</button>
                            <button class="quick-sell-btn" data-quality="epic">紫</button>
                            <button class="quick-sell-btn" data-quality="legendary">金</button>
                        </div>
                    </div>
                    <div class="sell-tip">点击查看详情/对比，右键单个出售</div>
                </div>
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
        
        // 排序选择
        const sortSelect = document.getElementById('inventory-sort');
        if (sortSelect) {
            sortSelect.onchange = (e) => {
                this.sortType = e.target.value;
                this.render();
            };
        }
        
        // 整理按钮
        const stackBtn = document.getElementById('btn-stack');
        if (stackBtn) {
            stackBtn.onclick = () => {
                this.stackItems();
                this.render();
                window.showMessage('背包整理完成');
            };
        }
        
        // 快速出售按钮
        document.querySelectorAll('#inventory-panel .quick-sell-btn').forEach(btn => {
            btn.onclick = () => {
                this.quickSell(btn.dataset.quality);
            };
        });
        
        // 物品点击事件
        const self = this;
        document.querySelectorAll('#inventory-grid .inv-slot').forEach(slot => {
            slot.onclick = function() {
                const idx = parseInt(this.dataset.index);
                const item = self.getSortedItem(idx);
                if (item && item.type === 'consumable') {
                    // 消耗品显示确认使用弹窗
                    const healText = item.heal ? '+' + item.heal + ' HP' : '';
                    const mpText = item.mp ? '+' + item.mp + ' MP' : '';
                    const effectText = healText || mpText || '';
                    const originalIndex = window.player.inventory.indexOf(item);
                    const message = effectText ? '效果：' + effectText : '';
                    window.showConfirm('使用道具', '使用 ' + item.name + '？' + (message ? '\n' + message : ''), () => {
                        window.useItem(originalIndex);
                    });
                } else if (item && item.type && ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'].includes(item.type)) {
                    // 装备显示对比面板
                    window.UICompare.show(item, item.type, 'inventory');
                }
            };
            
            // 右键出售
            slot.oncontextmenu = function(e) {
                e.preventDefault();
                const idx = parseInt(this.dataset.index);
                const item = self.getSortedItem(idx);
                if (item) {
                    self.sellItem(idx);
                }
            };
        });
    },
    
    // 排序背包
    sortInventory: function(inventory, sortType) {
        const qualityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        const typeOrder = { weapon: 6, armor: 5, helmet: 4, boots: 3, ring: 2, necklace: 1 };
        
        // 过滤空格子
        let items = inventory.filter(item => item !== null && item !== undefined);
        
        switch(sortType) {
            case 'quality':
                items.sort((a, b) => (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0));
                break;
            case 'type':
                items.sort((a, b) => (typeOrder[b.type] || 99) - (typeOrder[a.type] || 99));
                break;
            case 'level':
                items.sort((a, b) => (b.level || 0) - (a.level || 0));
                break;
            default:
                // 默认按品质+等级
                items.sort((a, b) => {
                    const q = (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0);
                    if (q !== 0) return q;
                    return (b.level || 0) - (a.level || 0);
                });
        }
        
        return items;
    },
    
    // 获取排序后的物品
    getSortedItem: function(index) {
        const sorted = this.sortInventory([...window.player.inventory], this.sortType);
        return sorted[index];
    },
    
    // 叠加物品
    stackItems: function() {
        const player = window.player;
        const newInventory = [];
        const added = new Set();
        
        for (let i = 0; i < player.inventory.length; i++) {
            const item = player.inventory[i];
            if (!item || added.has(item.uid)) continue;
            
            // 查找相同可叠加物品
            const stackable = player.inventory.filter((it, idx) => {
                if (!it || idx <= i || added.has(it.uid)) return false;
                // 可叠加条件：相同ID、非装备类型
                return it.id === item.id && !this.isEquipment(it.type);
            });
            
            if (stackable.length > 0) {
                // 叠加数量
                let totalQty = item.quantity || 1;
                stackable.forEach(it => {
                    totalQty += it.quantity || 1;
                    added.add(it.uid);
                });
                item.quantity = Math.min(totalQty, 99); // 最多99
                added.add(item.uid);
            }
            newInventory.push(item);
        }
        
        player.inventory = newInventory;
    },
    
    // 判断是否是装备
    isEquipment: function(type) {
        return ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace'].includes(type);
    },
    
    // 穿戴装备
    equipItem: function(index) {
        const player = window.player;
        const item = this.getSortedItem(index);
        if (!item || !item.type) return;
        
        const slot = item.type;
        const oldItem = player[slot];
        
        // 卸下旧装备
        if (oldItem) {
            player.inventory.push(oldItem);
        }
        
        // 装备新装备
        player[slot] = item;
        
        // 从背包移除
        const idx = player.inventory.indexOf(item);
        if (idx > -1) {
            player.inventory.splice(idx, 1);
        }
        
        // 重新计算属性
        if (window.recalculateStats) window.recalculateStats();
        
        // 更新头像
        if (window.updatePlayerAvatar) window.updatePlayerAvatar();
        
        window.showMessage('装备 ' + item.name);
        this.render();
    },
    
    // 使用消耗品
    useItem: function(index) {
        const player = window.player;
        const item = this.getSortedItem(index);
        if (!item) return;
        
        // 消耗品效果
        if (item.heal) {
            player.hp = Math.min(player.maxHp, player.hp + item.heal);
            window.showMessage('恢复 ' + item.heal + ' HP');
            // 添加生命药水视觉效果
            if (window.spawnPotionEffect) {
                window.spawnPotionEffect(player.x + player.w/2, player.y + player.h/2, 'heal');
            }
            // 显示治疗数字
            if (window.spawnDamageNumber) {
                window.spawnDamageNumber(player.x + player.w/2, player.y, item.heal, true);
            }
        }
        if (item.mp) {
            player.mp = Math.min(player.maxMp, player.mp + item.mp);
            window.showMessage('恢复 ' + item.mp + ' MP');
            // 添加魔法药水视觉效果
            if (window.spawnPotionEffect) {
                window.spawnPotionEffect(player.x + player.w/2, player.y + player.h/2, 'mana');
            }
            // 显示魔法数字
            if (window.spawnDamageNumber) {
                window.spawnDamageNumber(player.x + player.w/2, player.y - 15, item.mp, true);
            }
        }
        
        // 减少数量
        item.quantity--;
        if (item.quantity <= 0) {
            const idx = player.inventory.indexOf(item);
            if (idx > -1) player.inventory.splice(idx, 1);
        }
        
        this.render();
    },
    
    // 出售单个物品
    sellItem: function(index) {
        const player = window.player;
        const item = this.getSortedItem(index);
        if (!item) return;
        
        const price = Math.floor((item.price || 10) * 0.5);
        const message = '出售 ' + item.name + '？\n获得 ' + price + ' 金币';
        
        window.showConfirm('确认出售', message, () => {
            player.gold += price;
            const idx = player.inventory.indexOf(item);
            if (idx > -1) player.inventory.splice(idx, 1);
            window.showMessage('出售 ' + item.name + '，获得 ' + price + ' 金币');
            this.render();
        });
    },
    
    // 快速出售
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
        const title = '批量出售';
        const message = '出售 ' + sellItems.length + ' 件' + qualityName + '装备？\n将获得 ' + totalGold + ' 金币';
        
        window.showConfirm(title, message, () => {
            player.inventory = player.inventory.filter(item => {
                if (item && item.quality === quality && !equippedUids.has(item.uid)) {
                    player.gold += Math.floor((item.price || 10) * 0.5);
                    return false;
                }
                return true;
            });
            window.showMessage('出售 ' + sellItems.length + ' 件' + qualityName + '装备，获得 ' + totalGold + ' 金币');
            this.render();
        });
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
