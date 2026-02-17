/**
 * PixelARPG - 面板管理器模块
 * 统一管理所有UI面板的打开/关闭状态
 */

window.PanelManager = {
    // 面板状态
    panels: {
        inventory: false,
        character: false,
        shop: false,
        bestiary: false
    },
    
    // 当前标签页
    currentTab: {
        bestiary: 'monster'
    },
    
    /**
     * 检查是否有任何面板打开
     * @returns {boolean} 是否有面板打开
     */
    isAnyOpen: function() {
        return this.panels.inventory || this.panels.character || this.panels.shop || this.panels.bestiary;
    },
    
    /**
     * 关闭所有面板
     */
    closeAll: function() {
        if (this.panels.inventory) {
            this.panels.inventory = false;
            if (window.UIInventory) window.UIInventory.close();
        }
        if (this.panels.character) {
            this.panels.character = false;
            if (window.UICharacter) window.UICharacter.close();
        }
        if (this.panels.shop) {
            this.panels.shop = false;
            if (window.UIShop) window.UIShop.close();
        }
        if (this.panels.bestiary) {
            this.panels.bestiary = false;
            if (window.UIBestiary) window.UIBestiary.close();
        }
    },
    
    /**
     * 打开指定面板 (会先关闭其他面板)
     * @param {string} panelName - 面板名称
     */
    openPanel: function(panelName) {
        this.closeAll();
        this.panels[panelName] = true;
        
        // 根据面板名称打开对应的UI
        switch(panelName) {
            case 'inventory':
                if (window.UIInventory) window.UIInventory.open();
                break;
            case 'character':
                if (window.UICharacter) window.UICharacter.open();
                break;
            case 'shop':
                if (window.UIShop) window.UIShop.open();
                break;
            case 'bestiary':
                if (window.UIBestiary) window.UIBestiary.open();
                break;
        }
    },
    
    /**
     * 关闭指定面板
     * @param {string} panelName - 面板名称
     */
    closePanel: function(panelName) {
        this.panels[panelName] = false;
        
        switch(panelName) {
            case 'inventory':
                if (window.UIInventory) window.UIInventory.close();
                break;
            case 'character':
                if (window.UICharacter) window.UICharacter.close();
                break;
            case 'shop':
                if (window.UIShop) window.UIShop.close();
                break;
            case 'bestiary':
                if (window.UIBestiary) window.UIBestiary.close();
                break;
        }
    },
    
    /**
     * 切换面板状态
     * @param {string} panelName - 面板名称
     */
    togglePanel: function(panelName) {
        if (this.panels[panelName]) {
            this.closePanel(panelName);
        } else {
            this.openPanel(panelName);
        }
    },
    
    /**
     * 获取面板状态
     * @param {string} panelName - 面板名称
     * @returns {boolean} 面板是否打开
     */
    getPanelState: function(panelName) {
        return this.panels[panelName] || false;
    },
    
    /**
     * 设置图鉴标签页
     * @param {string} tab - 标签页名称
     */
    setBestiaryTab: function(tab) {
        this.currentTab.bestiary = tab;
    },
    
    /**
     * 获取当前图鉴标签页
     * @returns {string} 当前标签页
     */
    getBestiaryTab: function() {
        return this.currentTab.bestiary;
    }
};
