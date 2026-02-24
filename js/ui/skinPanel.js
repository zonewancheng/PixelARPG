/**
 * 皮肤选择面板UI
 * 功能：显示皮肤列表，支持切换
 */

window.initSkinPanel = function() {
    const skinBtn = document.getElementById('skinBtn');
    const skinPanel = document.getElementById('skin-panel');
    const skinList = document.getElementById('skin-list');
    
    if (!skinBtn || !skinPanel || !skinList) {
        console.warn('皮肤面板元素未找到');
        return;
    }
    
    // 打开面板
    function openPanel() {
        renderSkinList();
        skinPanel.style.display = 'block';
        if (typeof skinOpen !== 'undefined') skinOpen = true;
        if (window.PanelManager) window.PanelManager.panels.skin = true;
    }
    
    // 关闭面板
    function closePanel() {
        skinPanel.style.display = 'none';
        if (typeof skinOpen !== 'undefined') skinOpen = false;
        if (window.PanelManager) window.PanelManager.panels.skin = false;
    }
    
    // 切换按钮
    skinBtn.addEventListener('click', () => {
        const isVisible = skinPanel.style.display === 'block';
        if (isVisible) {
            closePanel();
        } else {
            openPanel();
        }
    });
    
    // 关闭按钮 - 使用事件委托确保始终有效
    skinPanel.addEventListener('click', (e) => {
        if (e.target.classList.contains('panel-close-btn') || e.target.id === 'skin-close-btn') {
            closePanel();
        }
    });
    
    // 渲染皮肤列表
    function renderSkinList() {
        if (!window.PlayerSkins) return;
        
        const skins = PlayerSkins.getAvailableSkins();
        const currentSkin = PlayerSkins.current;
        
        skinList.innerHTML = `
            <div style="padding: 10px;">
                <h3 style="color: #ffd700; margin-bottom: 15px; text-align: center;">选择角色皮肤</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                    ${skins.map(skin => {
                        const isSelected = skin.id === currentSkin;
                        
                        return `
                            <div class="skin-card" 
                                 data-skin-id="${skin.id}"
                                 style="
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    padding: 15px;
                                    background: ${isSelected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 0, 0, 0.4)'};
                                    border-radius: 10px;
                                    border: 2px solid ${isSelected ? '#ffd700' : 'rgba(255, 255, 255, 0.1)'};
                                    cursor: pointer;
                                    transition: all 0.2s;
                                 ">
                                <!-- 颜色预览 -->
                                <div style="display: flex; gap: 4px; margin-bottom: 10px;">
                                    <div style="width: 24px; height: 24px; background: ${skin.skinColor}; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3);"></div>
                                    <div style="width: 24px; height: 24px; background: ${skin.hairColor}; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3);"></div>
                                    <div style="width: 24px; height: 24px; background: ${skin.eyeColor}; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3);"></div>
                                    <div style="width: 24px; height: 24px; background: ${skin.clothesColor}; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3);"></div>
                                </div>
                                
                                <!-- 皮肤名称 -->
                                <div style="
                                    font-weight: bold;
                                    font-size: 14px;
                                    color: ${isSelected ? '#ffd700' : '#fff'};
                                    margin-bottom: 5px;
                                ">
                                    ${skin.name}
                                    ${isSelected ? ' ✓' : ''}
                                </div>
                                
                                <!-- 皮肤描述 -->
                                <div style="
                                    font-size: 11px;
                                    color: #aaa;
                                    text-align: center;
                                ">
                                    ${skin.description || '神秘角色'}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        // 绑定点击事件
        skinList.querySelectorAll('.skin-card').forEach(card => {
            card.addEventListener('click', function() {
                const skinId = this.dataset.skinId;
                const skin = PlayerSkins.skins[skinId];
                
                // 切换皮肤
                if (PlayerSkins.setSkin(skinId)) {
                    renderSkinList();
                    
                    // 更新角色面板头像
                    if (window.updatePlayerAvatar) {
                        window.updatePlayerAvatar();
                    }
                    
                    // 显示消息
                    if (typeof showMessage === 'function') {
                        showMessage(`已切换为: ${skin.name}`);
                    }
                }
            });
            
            // 悬停效果
            card.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected')) {
                    this.style.background = 'rgba(255, 255, 255, 0.1)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const skinId = this.dataset.skinId;
                const isSelected = skinId === PlayerSkins.current;
                this.style.background = isSelected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 0, 0, 0.4)';
            });
        });
    }
    
    // 初始渲染
    renderSkinList();
    console.log('皮肤面板初始化完成');
};

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof window.initSkinPanel === 'function') {
            window.initSkinPanel();
        }
    }, 300);
});
