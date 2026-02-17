/**
 * PixelARPG - 统一渲染工具模块
 * 所有UI和渲染使用统一的装备/怪物显示逻辑
 */

window.RenderUtils = {
    /**
     * 获取物品的显示名称（带品质颜色）
     */
    getItemNameHtml: function(item) {
        if (!item) return '<span style="color:#667">无装备</span>';
        const color = item.color || '#fff';
        let iconHtml = item.icon;
        if (window.renderEquipmentIcon) {
            const imgUrl = window.renderEquipmentIcon(item, 16);
            iconHtml = `<img src="${imgUrl}" style="image-rendering:pixelated;width:16px;height:16px;vertical-align:middle;">`;
        }
        return `<span style="color:${color}">${iconHtml} ${item.name}</span>`;
    },

    /**
     * 获取物品的品质标签
     */
    getQualityLabel: function(item) {
        if (!item) return '';
        return `${item.qualityName || '普通'} Lv.${item.level || 1}`;
    },

    /**
     * 获取物品的所有属性描述
     */
    getItemStatsText: function(item) {
        if (!item) return '';
        let stats = '';
        if (item.atk) stats += ` ATK:+${item.atk}`;
        if (item.atkPercent) stats += ` ATK+${item.atkPercent}%`;
        if (item.def) stats += ` DEF:+${item.def}`;
        if (item.defPercent) stats += ` DEF+${item.defPercent}%`;
        if (item.maxHp) stats += ` HP:+${item.maxHp}`;
        if (item.maxMp) stats += ` MP:+${item.maxMp}`;
        if (item.hpRegen) stats += ` HP回:+${item.hpRegen}/s`;
        if (item.mpRegen) stats += ` MP回:+${item.mpRegen}/s`;
        return stats;
    },

    /**
     * 获取物品的Tooltip完整描述
     */
    getItemTooltip: function(item, options = {}) {
        if (!item) return options.slotName || '空';
        
        const nameColor = item.color || '#fff';
        const quality = item.qualityName || '普通';
        const level = item.level || 1;
        const stats = this.getItemStatsText(item);
        const equipped = options.isEquipped ? ' [已装备]' : '';
        
        return `${item.name}\n${quality} Lv.${level}${stats}${equipped}`;
    },

    /**
     * 获取物品格子的HTML
     */
    getItemSlotHtml: function(item, options = {}) {
        const {
            isEquipped = false,
            showBadge = true,
            size = 48,
            onclick = '',
            usePixelArt = true
        } = options;

        if (!item) {
            return `<div class="item-slot empty" style="width:${size}px;height:${size}px"></div>`;
        }

        const legendaryClass = item.quality === 'legendary' ? 'legendary' : '';
        const equippedClass = isEquipped ? 'equipped' : '';
        const borderColor = item.color || '#888';
        const tooltip = this.getItemTooltip(item, { isEquipped, slotName: options.slotName });
        
        // 使用像素渲染
        let iconHtml = item.icon || '?';
        if (usePixelArt && window.renderEquipmentIcon) {
            const imgUrl = window.renderEquipmentIcon(item, size - 8);
            iconHtml = `<img src="${imgUrl}" style="image-rendering:pixelated;width:${size-8}px;height:${size-8}px;">`;
        }

        return `<div class="item-slot ${legendaryClass} ${equippedClass}" 
                     style="width:${size}px;height:${size}px;border-color:${borderColor}"
                     title="${tooltip}"
                     ${onclick ? `onclick="${onclick}"` : ''}>
            ${iconHtml}
            ${showBadge && isEquipped ? '<span class="eq-badge">E</span>' : ''}
        </div>`;
    },

    /**
     * 获取装备槽的HTML
     */
    getEquipSlotHtml: function(item, slot, options = {}) {
        const {
            size = 48,
            onclick = '',
            usePixelArt = true
        } = options;

        const slotInfo = window.EQUIPMENT_SLOTS?.[slot] || { name: slot, icon: '?' };
        const hasItem = !!item;
        const legendaryClass = item?.quality === 'legendary' ? 'legendary' : '';
        const borderColor = item?.color || 'rgba(80, 100, 140, 0.25)';
        const tooltip = this.getItemTooltip(item, { isEquipped: true, slotName: slotInfo.name });
        
        let iconHtml = item?.icon || slotInfo.icon;
        if (usePixelArt && item && window.renderEquipmentIcon) {
            const imgUrl = window.renderEquipmentIcon(item, size - 8);
            iconHtml = `<img src="${imgUrl}" style="image-rendering:pixelated;width:${size-8}px;height:${size-8}px;">`;
        }

        return `<div class="equip-slot ${hasItem ? 'has-item' : ''} ${legendaryClass}" 
                     style="width:${size}px;height:${size}px;border-color:${borderColor}"
                     title="${tooltip}"
                     ${onclick ? `onclick="${onclick}"` : ''}>
            ${iconHtml}
        </div>`;
    },

    /**
     * 获取商店物品的HTML
     */
    getShopItemHtml: function(item, options = {}) {
        const {
            onclick = '',
            usePixelArt = true,
            size = 48
        } = options;

        if (!item) return '';

        const legendaryClass = item.quality === 'legendary' ? 'legendary' : '';
        const borderColor = item.color || '#888';
        const tooltip = this.getItemTooltip(item);
        
        let iconHtml = item.icon || '?';
        if (usePixelArt && window.renderEquipmentIcon) {
            const imgUrl = window.renderEquipmentIcon(item, size - 8);
            iconHtml = `<img src="${imgUrl}" style="image-rendering:pixelated;width:${size-8}px;height:${size-8}px;">`;
        }

        return `<div class="shop-item ${legendaryClass}" 
                     style="border-color:${borderColor}"
                     title="${tooltip}"
                     ${onclick ? `onclick="${onclick}"` : ''}>
            <div class="shop-item-icon">${iconHtml}</div>
            <div class="shop-item-name" style="color:${item.color || '#fff'}">${item.name}</div>
            <div class="shop-item-price">💰 ${item.price}</div>
            <div class="shop-item-quality" style="background:${item.color || '#888'}"></div>
        </div>`;
    },

    /**
     * 获取怪物显示名称
     */
    getEnemyNameHtml: function(enemy) {
        if (!enemy) return '未知';
        return `<span style="color:${enemy.color || '#4a4'}">${enemy.name}</span>`;
    },

    /**
     * 获取怪物属性描述
     */
    getEnemyStatsText: function(enemy) {
        if (!enemy) return '';
        return `HP:${enemy.hp} ATK:${enemy.atk} DEF:${enemy.def || 0}`;
    },

    /**
     * 获取怪物的Tooltip
     */
    getEnemyTooltip: function(enemy) {
        if (!enemy) return '未知怪物';
        return `${enemy.name}\nHP: ${enemy.hp}/${enemy.maxHp}\nATK: ${enemy.atk} DEF: ${enemy.def || 0}\n等级: ${enemy.level || 1}`;
    },

    /**
     * 渲染怪物图标（与游戏渲染一致）
     * 直接使用enemies.js中的渲染函数
     */
    renderMonsterIcon: function(enemyType, size = 32) {
        if (window.renderEnemyIcon) {
            return window.renderEnemyIcon(enemyType, size);
        }
        // 备用：直接绘制
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = enemyType.color || '#4a4';
        ctx.fillRect(size*0.25, size*0.2, size*0.5, size*0.5);
        ctx.fillRect(size*0.15, size*0.5, size*0.7, size*0.35);
        return canvas.toDataURL();
    },

    /**
     * 获取图鉴怪物卡片的HTML（使用与游戏一致的渲染）
     */
    getBestiaryMonsterHtml: function(enemy, discovered = 0) {
        const locked = !discovered || discovered === 0;
        const stats = this.getEnemyStatsText(enemy);
        const iconUrl = this.renderMonsterIcon(enemy, 32);
        
        return `<div class="bestiary-card ${locked ? 'locked' : ''}">
            <div class="bestiary-card-icon" style="background:transparent">
                <img src="${iconUrl}" style="image-rendering:pixelated;width:32px;height:32px;">
            </div>
            <div class="bestiary-card-name" style="color:${enemy.color || '#4a4'}">${enemy.name}</div>
            <div class="bestiary-card-info">${stats}</div>
            <div class="bestiary-card-count">击杀: ${discovered}</div>
        </div>`;
    },

    /**
     * 获取图鉴技能卡片的HTML
     */
    getBestiarySkillHtml: function(skill, unlocked = false) {
        const locked = !unlocked;
        const iconUrl = window.renderSkillIcon ? window.renderSkillIcon(skill, 28) : '';
        
        return `<div class="bestiary-card ${locked ? 'locked' : ''}">
            <div class="bestiary-card-icon" style="background:transparent">
                <img src="${iconUrl}" style="image-rendering:pixelated;width:28px;height:28px;">
            </div>
            <div class="bestiary-card-name">${skill.name}</div>
            <div class="bestiary-card-info">${skill.desc || ''}</div>
            <div class="bestiary-card-count">${unlocked ? '已解锁' : '未解锁'}</div>
        </div>`;
    },

    /**
     * 获取图鉴装备卡片的HTML
     */
    getBestiaryEquipmentHtml: function(item, discovered = false) {
        const locked = !discovered;
        const slotName = window.EQUIPMENT_SLOTS?.[item.type]?.name || item.type;
        
        let iconHtml = item.icon;
        if (discovered && window.renderEquipmentIcon) {
            const imgUrl = window.renderEquipmentIcon(item, 32);
            iconHtml = `<img src="${imgUrl}" style="image-rendering:pixelated;width:32px;height:32px;">`;
        }
        
        return `<div class="bestiary-card ${locked ? 'locked' : ''}">
            <div class="bestiary-card-icon">${iconHtml}</div>
            <div class="bestiary-card-name">${item.name}</div>
            <div class="bestiary-card-info">${slotName}</div>
            <div class="bestiary-card-count">${discovered ? '已发现' : '未发现'}</div>
        </div>`;
    },

    /**
     * 对比两个装备的属性差异
     * 返回格式: { 攻击: {old: 10, new: 15, diff: +5}, ... }
     */
    compareItems: function(newItem, oldItem) {
        const attrs = ['atk', 'atkPercent', 'def', 'defPercent', 'maxHp', 'maxMp', 'hpRegen', 'mpRegen'];
        const result = {};
        
        attrs.forEach(attr => {
            const newVal = newItem?.[attr] || 0;
            const oldVal = oldItem?.[attr] || 0;
            if (newVal > 0 || oldVal > 0) {
                result[attr] = {
                    old: oldVal,
                    new: newVal,
                    diff: newVal - oldVal
                };
            }
        });
        
        return result;
    },

    /**
     * 获取对比面板的属性行HTML
     */
    getCompareStatsHtml: function(newItem, oldItem) {
        const comparison = this.compareItems(newItem, oldItem);
        
        const attrNames = {
            atk: '攻击',
            atkPercent: '攻击%',
            def: '防御',
            defPercent: '防御%',
            maxHp: '生命',
            maxMp: '魔法',
            hpRegen: 'HP恢复',
            mpRegen: 'MP恢复'
        };

        let html = '<div class="compare-stats">';
        
        Object.keys(comparison).forEach(attr => {
            const comp = comparison[attr];
            const label = attrNames[attr] || attr;
            const suffix = attr.includes('Percent') ? '%' : '';
            const unit = (attr === 'hpRegen' || attr === 'mpRegen') ? '/s' : '';
            
            const oldStr = comp.old > 0 ? `${comp.old}${suffix}${unit}` : '-';
            const newStr = comp.new > 0 ? `${comp.new}${suffix}${unit}` : '-';
            
            let status = 'neutral';
            if (comp.diff > 0) status = 'plus';
            else if (comp.diff < 0) status = 'minus';
            
            html += `<div class="compare-stat-row">
                <span class="stat-label">${label}</span>
                <span class="stat-old">${oldStr}</span>
                <span class="stat-arrow">→</span>
                <span class="stat-new ${status}">${newStr}</span>
            </div>`;
        });
        
        html += '</div>';
        return html;
    }
};
