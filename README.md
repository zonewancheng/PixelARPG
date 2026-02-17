# Pixel Hero ARPG - 项目说明文档

## 1. 项目概述

### 1.1 游戏简介
Pixel Hero ARPG 是一款基于 HTML5 Canvas 的实时动作角色扮演游戏（ARPG）。玩家在像素风格的游戏世界中冒险，击败怪物、获取装备，提升等级，挑战强大的 Boss。

### 1.2 技术栈
- **前端**: 纯 HTML5 + CSS3 + JavaScript（ES6）
- **渲染**: HTML5 Canvas 2D Context
- **无需依赖**: 不使用任何第三方库，纯原生实现

### 1.3 核心特性
- 实时战斗系统（ARPG）
- 装备系统（武器、服装、帽子、靴子、戒指、项链）
- 技能系统（6种投射技能）
- 物品掉落与自动拾取
- Boss 战斗
- 等级成长系统
- **装备品质系统**（白/绿/蓝/紫/金）
- **商店系统**（购买/出售/刷新）
- **无限背包**（无容量限制）
- **角色面板**（装备外观显示）
- **地图系统**（墙壁、草地、水域、树木、花朵、小山）
- **天气系统**（白云、乌云、闪电）
- **呼吸动画**（玩家、敌人）
- **IndexedDB存档**
- **图鉴系统**（怪物/技能/装备）
- **模块化架构**（数据模块 + UI模块）
- **统一渲染系统**（所有UI使用与游戏一致的像素渲染）

---

## 2. 文件结构

```
PixelARPG/
├── index.html              # 游戏入口文件
├── css/
│   ├── style.css         # 基础样式
│   ├── panels.css        # 统一面板样式
│   ├── character.css     # 角色面板样式
│   ├── shop.css         # 商店面板样式
│   ├── inventory.css    # 背包面板样式
│   └── bestiary.css    # 图鉴面板样式
├── js/
│   ├── data/            # 数据模块
│   │   ├── qualities.js # 装备品质数据
│   │   ├── items.js     # 装备/物品数据 + 渲染函数
│   │   ├── skills.js    # 技能数据 + 渲染函数
│   │   ├── enemies.js   # 怪物/Boss数据 + 渲染函数
│   │   └── world.js    # 地图/天气数据
│   ├── ui/              # UI模块
│   │   ├── panelManager.js # 面板管理器
│   │   ├── compare.js   # 对比面板
│   │   ├── inventory.js # 背包面板
│   │   ├── character.js # 角色面板
│   │   ├── shop.js     # 商店面板
│   │   └── bestiary.js # 图鉴面板
│   ├── renderUtils.js  # 统一渲染工具
│   ├── renderer.js      # 渲染函数
│   └── game.js         # 主游戏逻辑
├── tests/
│   ├── data-tests.html  # 数据模块测试
│   └── ui-tests.html   # UI模块测试
└── README.md            # 项目说明文档
```

---

## 3. 模块说明

### 3.1 数据模块 (js/data/)

#### qualities.js - 装备品质
```javascript
window.ITEM_QUALITIES      // 5种品质定义
window.EQUIPMENT_SLOTS     // 6种装备槽
window.QUALITY_ORDER       // 品质优先级
```

#### items.js - 物品数据 + 渲染
```javascript
window.BASE_ITEMS          // 基础物品定义
window.createItem()         // 创建物品实例
window.generateRandomItem() // 生成随机物品
window.getItemStats()     // 获取物品属性描述
window.renderPlayerSprite()// 渲染玩家外观
window.renderPlayerIcon()  // 渲染玩家头像
window.renderEquipmentIcon()// 渲染装备图标
```

#### skills.js - 技能数据 + 渲染
```javascript
window.SKILLS              // 6种技能定义
window.getSkillById()     // 根据ID获取技能
window.renderSkillIcon()   // 渲染技能图标
```

#### enemies.js - 敌人数据 + 渲染
```javascript
window.ENEMY_TYPES         // 8种普通怪物
window.BOSS_TYPES          // 7种Boss
window.discoverEnemy()    // 记录击杀
window.renderEnemyIcon()  // 渲染怪物图标
```

#### world.js - 世界环境
```javascript
window.TILE_TYPES          // 7种地图瓦片
window.TILE_COLORS         // 瓦片颜色
window.TREE_TYPES          // 5种树木
window.HILL_TYPES          // 3种小山
window.FLOWER_COLORS       // 花朵颜色
window.CLOUD_TYPES         // 3种云
window.initClouds()        // 初始化云朵
window.getTileColor()     // 获取瓦片颜色
```

### 3.2 UI模块 (js/ui/)

#### panelManager.js - 面板管理器
```javascript
window.PanelManager
  .isAnyOpen()            // 检查是否有面板打开
  .isPanelOpen(name)      // 检查指定面板是否打开
  .closeAll()             // 关闭所有面板
  .openPanel(name)        // 打开指定面板
  .closePanel(name)       // 关闭指定面板
  .togglePanel(name)      // 切换面板状态
```

#### compare.js - 对比面板
```javascript
window.UICompare
  .show(item, slot, source) // 显示对比面板
  .hide()                  // 隐藏对比面板
  .equipItem()            // 装备物品
```

#### inventory.js - 背包
```javascript
window.UIInventory
  .init()                 // 初始化
  .open()                 // 打开背包
  .close()                // 关闭背包
  .render()               // 渲染内容
  .equipItem(item)        // 装备物品
  .quickSell(quality)     // 一键出售
```

#### character.js - 角色
```javascript
window.UICharacter
  .init()                 // 初始化
  .open()                 // 打开角色面板
  .close()                // 关闭角色面板
  .render()               // 渲染内容
```

#### shop.js - 商店
```javascript
window.UIShop
  .init()                 // 初始化
  .open()                 // 打开商店
  .close()                // 关闭商店
  .refreshItems()          // 刷新商品
  .buyItem(index)         // 购买物品
  .sellEquipment()         // 出售装备
```

#### bestiary.js - 图鉴
```javascript
window.UIBestiary
  .init()                 // 初始化
  .open()                 // 打开图鉴
  .close()                // 关闭图鉴
  .setTab(tab)           // 切换标签页
  .render()               // 渲染内容
```

### 3.3 渲染模块

#### renderUtils.js - 统一渲染工具
```javascript
window.RenderUtils
  .getItemTooltip()              // 获取物品提示
  .getItemNameHtml()             // 获取物品名称HTML
  .getItemSlotHtml()             // 获取物品格子HTML
  .getEquipSlotHtml()            // 获取装备槽HTML
  .getShopItemHtml()             // 获取商店物品HTML
  .getBestiaryMonsterHtml()      // 获取图鉴怪物HTML
  .getBestiarySkillHtml()       // 获取图鉴技能HTML
  .getBestiaryEquipmentHtml()   // 获取图鉴装备HTML
  .compareItems()                // 对比装备属性
```

#### renderer.js - 游戏渲染
```javascript
drawMap()               // 绘制地图
drawPlayer()            // 绘制玩家
drawEnemies()           // 绘制敌人
drawBoss()              // 绘制Boss
drawDrops()            // 绘制掉落物
drawProjectiles()       // 绘制投射物
drawParticles()         // 绘制粒子
drawClouds()            // 绘制云朵
drawUI()                // 绘制UI
drawDamageNumbers()     // 绘制伤害数字
```

---

## 4. 核心机制

### 4.1 战斗系统

| 技能 | 类型 | MP消耗 | 冷却 | 效果 |
|------|------|--------|------|------|
| 斩击 | 单体 | 0 | 0s | 基础攻击 |
| 火球 | 投射 | 15 | 60f | 火球术 |
| 雷电 | 投射 | 20 | 80f | 雷电术 |
| 藤蔓 | 投射 | 15 | 70f | 藤蔓术 |
| 龙卷 | 投射 | 25 | 100f | 旋风 |
| 冰霜 | 投射 | 18 | 75f | 冰锥术 |

### 4.2 装备品质

| 品质 | 颜色 | 属性加成 |
|------|------|---------|
| 普通 | 白色 #fff | 100% |
| 优秀 | 绿色 #4f4 | 130% |
| 稀有 | 蓝色 #44f | 160% |
| 史诗 | 紫色 #a4f | 200% |
| 传说 | 金色 #fa4 | 250% |

### 4.3 地图瓦片

| 类型 | ID | 描述 |
|------|-----|------|
| 地面 | 0 | 默认地面 |
| 墙壁 | 1 | 障碍物 |
| 草丛 | 2 | 装饰 |
| 水域 | 3 | 障碍物 |
| 小山 | 4 | 装饰 |
| 树木 | 5 | 障碍物/装饰 |
| 花朵 | 6 | 装饰 |

### 4.4 渲染字段

所有数据现在都包含 `render` 字段，用于统一渲染：
- 怪物: `render: 'slime'`, `'boss_dragon'` 等
- 装备: `sprite: 'fire_sword'`, `'dragon'` 等
- 技能: `render: 'fireball'`, `'ice'` 等

---

## 5. 控制方式

### 5.1 键盘控制
- W/↑: 上移
- S/↓: 下移
- A/←: 左移
- D/→: 右移
- 空格/J: 攻击
- 1-6: 使用技能

### 5.2 触屏控制
- 虚拟方向键（D-Pad）
- 攻击按钮

---

## 6. 测试

### 运行测试
在浏览器中打开：
- `tests/data-tests.html` - 数据模块测试
- `tests/ui-tests.html` - UI模块测试

---

## 7. 扩展指南

### 7.1 添加新物品
在 `js/data/items.js` 的 `BASE_ITEMS` 数组中添加，并实现 `renderEquipmentIcon` 中的渲染逻辑。

### 7.2 添加新技能
在 `js/data/skills.js` 的 `SKILLS` 数组中添加，并实现 `renderSkillIcon` 中的渲染逻辑。

### 7.3 添加新怪物
在 `js/data/enemies.js` 的 `ENEMY_TYPES` 或 `BOSS_TYPES` 中添加，并实现 `renderEnemyIcon` 中的渲染逻辑。

### 7.4 添加新渲染类型
在 `js/renderer.js` 的 `drawPixelSprite` 函数中添加新的渲染分支。

---

## 8. 许可证

本项目为开源项目，可自由学习和修改。

---

*文档版本: 1.7*  
*最后更新: 2026-02-18*
