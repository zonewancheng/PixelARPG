/**
 * 皮肤选择面板UI
 */
window.initSkinPanel = function() {
    const skinBtn = document.getElementById('skinBtn');
    const skinPanel = document.getElementById('skin-panel');
    const skinList = document.getElementById('skin-list');
    
    if (!skinBtn || !skinPanel) return;
    
    function openPanel() {
        renderSkinList();
        skinPanel.style.display = 'block';
        if (typeof skinOpen !== 'undefined') skinOpen = true;
        if (window.PanelManager) window.PanelManager.panels.skin = true;
    }
    
    function closePanel() {
        skinPanel.style.display = 'none';
        if (typeof skinOpen !== 'undefined') skinOpen = false;
        if (window.PanelManager) window.PanelManager.panels.skin = false;
    }
    
    // 切换面板显示
    skinBtn.addEventListener('click', () => {
        const isVisible = skinPanel.style.display === 'block';
        if (isVisible) {
            closePanel();
        } else {
            openPanel();
        }
    });
    
    // 绑定关闭按钮
    const closeBtn = skinPanel.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.onclick = closePanel;
    }
    
    // 渲染皮肤列表
    function renderSkinList() {
        if (!skinList || !window.PlayerSkins) return;
        
        const skins = PlayerSkins.getAvailableSkins();
        const currentSkin = PlayerSkins.current;
        
        skinList.innerHTML = skins.map(skin => {
            const skinData = PlayerSkins.skins[skin.id];
            const isSelected = skin.id === currentSkin;
            
            // 创建皮肤预览色块
            const colorPreview = `
                <div style="display:flex;gap:2px;margin-bottom:8px;">
                    <div style="width:20px;height:20px;background:${skinData.hairColor};border-radius:4px;"></div>
                    <div style="width:20px;height:20px;background:${skinData.eyeColor};border-radius:4px;"></div>
                    <div style="width:20px;height:20px;background:${skinData.clothesColor};border-radius:4px;"></div>
                </div>
            `;
            
            return `
                <div class="skin-item ${isSelected ? 'selected' : ''}" 
                     data-skin-id="${skin.id}"
                     style="
                        display:flex;
                        align-items:center;
                        padding:12px;
                        margin:8px 0;
                        background:${isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'};
                        border-radius:8px;
                        border:2px solid ${isSelected ? '#ffd700' : 'transparent'};
                        cursor:pointer;
                        transition:all 0.2s;
                     "
                     onmouseover="this.style.background='rgba(255,255,255,0.15)'"
                     onmouseout="this.style.background='${isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'}'">
                    ${colorPreview}
                    <div style="flex:1;">
                        <div style="font-weight:bold;font-size:16px;color:${isSelected ? '#ffd700' : '#fff'};">
                            ${skinData.name}
                            ${isSelected ? ' ✓' : ''}
                        </div>
                        <div style="font-size:12px;color:#aaa;margin-top:4px;">
                            ${getSkinDescription(skin.id)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // 绑定点击事件
        skinList.querySelectorAll('.skin-item').forEach(item => {
            item.addEventListener('click', () => {
                const skinId = item.dataset.skinId;
                if (PlayerSkins.setSkin(skinId)) {
                    renderSkinList();
                    // 显示切换提示
                    if (typeof showMessage === 'function') {
                        showMessage(`已切换为: ${PlayerSkins.skins[skinId].name}`);
                    }
                }
            });
        });
    }
    
    function getSkinDescription(skinId) {
        const descriptions = {
            hero: '经典勇者形象，蓝色披风，金色短发',
            bride: '美丽的新娘，棕色长卷发，白色婚纱',
            skeleton: '白骨夫人风格，紫色长发，骨骼身躯'
        };
        return descriptions[skinId] || '神秘角色';
    }
    
    // 初始渲染
    renderSkinList();
};

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.initSkinPanel?.();
    }, 100);
});
