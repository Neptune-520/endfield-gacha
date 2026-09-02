# Neptune 变更记录 (Neptune Change Log)

本文档用于记录项目中的所有自定义修改及其具体功能与作用。

---

## 变更 1：顶部语言切换重构为右下角通知中心上方悬浮按钮

### 1. 修改背景与目的
原顶部的语言切换器占用顶部导航栏右侧空间，现将其重构为右下角悬浮按钮，固定放置在“通知中心”图标上方，提升顶部导航栏的整洁度并统一右下角快捷悬浮工具栏体验。

### 2. 具体修改内容
1. **移除顶部导航栏语言切换器**：
   - 在 `src/components/layout/AppHeader.jsx` 中移除了顶部导航栏右侧的 `LocaleSwitcher`。
2. **扩展 LocaleSwitcher 组件**：
   - 在 `src/components/common/LocaleSwitcher.jsx` 中新增 `variant="floating"` 悬浮按钮模式。
   - 提供图标加当前语言角标（`ZH` / `EN` / `SYS`）的悬浮按钮，支持点击弹出浮动语言切换菜单（支持“中文”、“English”及“跟随系统”）。
3. **集成至右下角悬浮区域**：
   - 在 `src/components/ui/NotificationCenter.jsx` 中将语言切换悬浮按钮与通知中心按钮统一放置在右下角悬浮容器中，语言切换按钮垂直位于通知中心按钮上方。

### 3. 受影响文件
- `[NEW]` `Neptune_Change.md` (根目录变更日志)
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (移除顶部语言切换)
- `[MODIFY]` `src/components/common/LocaleSwitcher.jsx` (新增 floating 悬浮按钮组件模式)
- `[MODIFY]` `src/components/ui/NotificationCenter.jsx` (右下角嵌入悬浮语言切换按钮)

---

## 变更 2：导航栏移除卡池信息区域、靠右布局并优化二级下拉菜单样式

### 1. 修改背景与目的
根据最新导航栏设计需求：
1. 移除顶部导航栏中原有的“当前卡池/下一卡池”信息时间显示（`HeaderPoolTimeInfo`），简化顶部空间。
2. 将主导航菜单靠右对齐，并增加一级菜单项间距。
3. 优化二级下拉菜单（`NavDropdown`）：使其弹窗缩窄（`w-28 sm:w-32`）、内容居中对齐、并在按钮正下方水平居中定位（`left-1/2 -translate-x-1/2`），解决重叠与过宽问题。

### 2. 具体修改内容
1. **移除卡池信息区域**：
   - 从 `src/components/layout/AppHeader.jsx` 中移除了 `HeaderPoolTimeInfo` 组件的引用与渲染容器。
2. **主导航菜单靠右对齐与间距优化**：
   - 设置导航栏容器 `justify-end` 靠右对齐，增大一级菜单按钮之间的 Padding (`px-4 sm:px-6`) 与 Gap 间距 (`gap-2 sm:gap-4`)。
3. **二级下拉菜单精细化调整**：
   - 弹窗宽度收紧至 `w-28 sm:w-32`，解决遮挡与过宽问题。
   - 菜单使用 `left-1/2 -translate-x-1/2` 相对于一级菜单按钮水平居中对齐。
   - 子选项内容调整为 `justify-center text-center` 居中展示。
   - 结合 `overflow-visible` 避免层级裁剪。

### 3. 受影响文件
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (导航菜单靠右、增大间距、精简居中二级菜单)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)

---

## 变更 3：移除顶部导航栏三项图标按钮并将设置按钮移至右下角悬浮区域

### 1. 修改背景与目的
简化顶部导航栏右侧的操作按钮区域，移除顶部的“设置”、“关于”、“服务状态”三项图标按钮（已收纳至二级菜单“关于”与“工具”中），并将“设置”功能重构为右下角悬浮按钮，进一步统一右下角工具栏体验。

### 2. 具体修改内容
1. **移除顶部右侧三项图标按钮**：
   - 从 `src/components/layout/AppHeader.jsx` 中删除了“设置”(`Settings`)、“关于”(`Info`)、“服务状态”(`Activity`) 的静态图标按钮。
2. **设置按钮迁移至右下角**：
   - 在 `src/components/ui/NotificationCenter.jsx` 右下角悬浮工具栏中新增“设置”悬浮按钮。
   - 悬浮工具栏从上到下的顺序为：**新闻** -> **设置** -> **语言** -> **通知中心**。
   - 点击“设置”悬浮按钮可快捷切换并打开设置面板。

### 3. 受影响文件
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (移除顶部设置、关于、服务状态图标按钮)
- `[MODIFY]` `src/components/ui/NotificationCenter.jsx` (新增悬浮设置按钮)
- `[MODIFY]` `src/GachaAnalyzer.jsx` (传入 onOpenSettings 回调)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)

---

## 变更 4：移除顶部新闻菜单，重构为右下角悬浮按钮与 65% 占位暗化分栏弹窗

### 1. 修改背景与目的
1. 移除顶部导航栏中的“新闻”一级菜单及其二级下拉菜单，进一步简化顶部导航栏结构。
2. 将新闻公告功能重构为右下角悬浮按钮，点击后弹出遮罩暗化（Backdrop Blur）且占页面约 65% 的专业左右分栏公告弹窗。

### 2. 具体修改内容
1. **移除顶部新闻菜单**：
   - 在 `src/components/layout/AppHeader.jsx` 中删除了“新闻”一级菜单及其子项（官方公告、本站公告）。
2. **新增右下角新闻悬浮按钮**：
   - 在 `src/components/ui/NotificationCenter.jsx` 右下角悬浮控制区域最上方新增“新闻公告”(`Megaphone`) 悬浮按钮，若存在未读新公告则显示红色高亮脉冲圆点。
3. **新建新闻公告弹窗组件 (`NewsModal.jsx`)**：
   - **尺寸与背景**：占用页面约 65% 空间（`w-[92vw] max-w-[1100px] h-[65vh]`），全屏暗化加高斯模糊背景 (`bg-black/60 backdrop-blur-sm`)。
   - **顶部 Tab 标签**：包含 **官方公告**、**本站公告** 选项卡切换，以及右上角 **关闭按钮** (`X`)。
   - **左右分栏布局**：
     - *左侧标题列表*（`w-64 sm:w-80`）：展示对应分类下所有公告的标题、发布时间，支持点击选中并高亮显示（黄色侧边 border 与背景浅色高亮）。
     - *右侧内容详情*（`flex-1`）：展现当前选中公告的完整标题、发布时间、来源外链及渲染的文本/HTML/Markdown正文内容。

### 3. 受影响文件
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (移除新闻一级菜单及二级选项)
- `[NEW]` `src/components/modals/NewsModal.jsx` (新建分栏公告弹窗组件)
- `[MODIFY]` `src/components/ui/NotificationCenter.jsx` (嵌入悬浮新闻按钮及红点提示)
- `[MODIFY]` `src/GachaAnalyzer.jsx` (挂载 NewsModal 状态与回调)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)

---

## 变更 5：移除首页友情链接与路线图卡片，抽离为独立页面并在二级菜单关联

### 1. 修改背景与目的
为了使首页结构更加紧凑纯粹，将原首页底部的“友情链接”与“功能路线图”模块从主页移除，并分别抽离为独立的单页模块，同时在顶部导航栏“关于”二级下拉菜单中关联对应的页面跳转。

### 2. 具体修改内容
1. **首页瘦身移除组件**：
   - 在 `src/components/home/HomePage.jsx` 中移除了底部引用的 `<HomeFriendlyLinksCard />` 与 `<RoadmapCard />`。
2. **新建独立单页组件**：
   - 新建 `src/components/links/FriendLinksPage.jsx` 友情链接独立页面。
   - 新建 `src/components/roadmap/RoadmapPage.jsx` 开发路线图独立页面。
3. **注册新路由与 Tab 常量**：
   - 在 `src/constants/appRoutes.js` 中注册 `links` (`/links`) 与 `roadmap` (`/roadmap`) 页面路由。
   - 在 `src/components/app/DesktopAppRoutes.jsx` 中完成两款独立单页的懒加载与路由分发。
4. **导航栏二级菜单关联绑定**：
   - 在 `src/components/layout/AppHeader.jsx` 的“关于”二级下拉菜单中：
     - 点击“友情链接”➔ 快捷跳转至友情链接独立单页 (`/links`)。
     - 点击“开发路线”➔ 快捷跳转至开发路线图独立单页 (`/roadmap`)。

### 3. 受影响文件
- `[MODIFY]` `src/components/home/HomePage.jsx` (从首页中移除 FriendlyLinksCard 与 RoadmapCard)
- `[NEW]` `src/components/links/FriendLinksPage.jsx` (新建友情链接独立页面)
- `[NEW]` `src/components/roadmap/RoadmapPage.jsx` (新建开发路线图独立页面)
- `[MODIFY]` `src/constants/appRoutes.js` (添加 links 和 roadmap 路由定义)
- `[MODIFY]` `src/components/app/DesktopAppRoutes.jsx` (注册 links 与 roadmap 单页路由)
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (关于二级菜单关联新单页跳转)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)

---

## 变更 6：平衡顶部导航栏一级菜单项宽度

### 1. 修改背景与目的
顶部导航栏中，包含二级下拉菜单的菜单项（“分析”、“工具”、“关于”）因为带有向下/上 Chevron 箭头图标和 Gap 间距，其渲染宽度大于无箭头的普通菜单项（“首页”、“管理”）。为了提升顶部导航栏的视觉平衡性与美观度，对所有一级菜单项的宽度进行了对齐平衡。

### 2. 具体修改内容
1. **设置统一最小宽度与居中对齐**：
   - 在 `src/components/layout/AppHeader.jsx` 中，对 `NavTab`（普通菜单项）与 `NavDropdown`（下拉菜单项）的按钮均设置了 `min-w-[76px] sm:min-w-[92px]` 最小宽度与 `justify-center` 内容居中对齐。
2. **平衡内边距**：
   - 调整按钮 Padding 为 `px-3 sm:px-4`，保证 2 字文本包含/不包含箭头图标时，按钮整体渲染宽度统一为 `92px`（桌面端）/ `76px`（移动端）。
3. **视觉一体化**：
   - 保持所有一级菜单在 Hover 悬停高亮、底部 Active 激活线（3px 黄色线条）长度以及间距上的完全对称与平齐。

### 3. 受影响文件
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (为 NavTab 与 NavDropdown 按钮添加 min-w 与 justify-center 样式)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)

---

## 变更 7：顶部导航栏页面顶部透明化（二级菜单保持不透明）

### 1. 修改背景与目的
在页面滚动至最顶部时，将顶部导航栏背景变为完全透明状态，移除下边框与阴影，使页面顶部视觉更具沉浸感；当页面向下滚动时，平滑过渡回高斯模糊半透明背景与下边框；同时确保二级下拉菜单在任何状态下均保持 100% 不透明度，保证下拉菜单的可读性。

### 2. 具体修改内容
1. **添加页面滚动监听与状态控制**：
   - 在 `src/components/layout/AppHeader.jsx` 中新增 `isScrolled` 状态与 `window.addEventListener('scroll')` 监听事件。
   - 当 `scrollY <= 10` 时为顶部透明状态（`bg-transparent border-b border-transparent shadow-none`），网格背景 `opacity-0`。
   - 当 `scrollY > 10` 时平滑过渡（`transition-all duration-300`）为固定半透明磨砂吸顶背景（`bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm`），网格背景 `opacity-100`。
2. **二级菜单独立不透明**：
   - 将 `NavDropdown` 浮动下拉弹窗面板背景显式设为实体纯色 `bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800`，不受顶部导航栏父级透明度影响，保持完好的不透明视觉与阅读体验。

### 3. 受影响文件
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (添加滚动透明度逻辑，并将二级下拉菜单样式明确设为实体不透明)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)

---

## 变更 8：移除首页嵌入的游戏公告区域

### 1. 修改背景与目的
鉴于新闻与游戏公告功能已统一收口至右下角悬浮按钮及 65% 占位的分栏公告弹窗（`NewsModal`），避免首页内容冗余，将首页原有的“游戏公告”模块（`GameAnnouncementFeed`）从首页主视图中移除。

### 2. 具体修改内容
1. **首页移除游戏公告组件**：
   - 从 `src/components/home/HomePage.jsx` 中移除了游戏公告列表模块（`GameAnnouncementFeed`）及其摘要卡片。
   - 清理了首页中对应未使用的依赖与状态逻辑（`GameAnnouncementFeed` 引用、`resolveGameAnnouncementDigest` 摘要计算以及 `showGameAnnouncements` 展开收起状态）。
2. **保持悬浮弹窗完整体验**：
   - 官方游戏公告与本站公告依然可通过右下角悬浮“新闻”按钮随时打开分栏弹窗进行全量浏览。

### 3. 受影响文件
- `[MODIFY]` `src/components/home/HomePage.jsx` (移除首页游戏公告模块及相关依赖)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)

---

## 变更 9：“全站统计”升级为顶部一级导航菜单

### 1. 修改背景与目的
为了提高高频核心功能“全站统计”的访问便捷性，将“全站统计”从“分析”二级下拉菜单中移出，提升为顶部一级导航菜单，固定放置在“首页”菜单项右侧。

### 2. 具体修改内容
1. **主导航结构调整**：
   - 在 `src/components/layout/AppHeader.jsx` 中，将 `id="summary"`（“全站统计”）独立为 `NavTab` 一级菜单组件，置于“首页”（`id="home"`）右侧。
2. **二级菜单精简**：
   - 从“分析”（`NavDropdown`）二级下拉菜单中移除“全站统计”选项，仅保留“卡池信息”与“卡池分析”。
   - 更新“分析”下拉菜单的高亮激活状态判定为 `active={activeTab === 'dashboard'}`。

### 3. 受影响文件
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (将全站统计移至首页右侧作为一级菜单，并精简分析下拉菜单)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)

---

## 变更 10：“轮换计划”与“公测卡池机制速览”迁移至二级菜单“卡池信息”

### 1. 修改背景与目的
为进一步精简首页布局、使其更加轻量聚焦，将首页原有的“轮换计划”（`HomeRotationScheduleCard`）与“公测卡池机制速览”（`PoolMechanicsCard`）模块从首页移除，并完整迁移合并至“分析 ➔ 卡池信息”视图中。

### 2. 具体修改内容
1. **首页移除卡片**：
   - 从 `src/components/home/HomePage.jsx` 中删除了“轮换计划”与“公测卡池机制速览”模块及相关依赖引入与状态。
2. **卡池信息集成与定位**：
   - 在 `src/components/app/DesktopDashboardWorkspace.jsx` 中引入“轮换计划”与“公测卡池机制速览”组件，将其挂载在“卡池信息”面板底部（带有 `#pool-info-section` 锚点标识）。
   - 在 `src/components/layout/AppHeader.jsx` 中为“卡池信息”下拉菜单项的点击事件增加了平滑滚动锚点逻辑，点击“卡池信息”可快速直达轮换计划与卡池机制说明区域。

### 3. 受影响文件
- `[MODIFY]` `src/components/home/HomePage.jsx` (从首页中移除轮换计划与卡池机制模块)
- `[MODIFY]` `src/components/app/DesktopDashboardWorkspace.jsx` (在卡池信息视图中嵌入轮换计划与卡池机制模块，并补齐 `useCallback` 导入)
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (给卡池信息下拉菜单点击绑定锚点平滑滚动)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)

---

## 变更 11：优化“分析”二级菜单中“卡池信息”与“卡池分析”的独立高亮激活状态

### 1. 修改背景与目的
此前由于“卡池信息”与“卡池分析”在下拉菜单中共享同一个 `activeTab === 'dashboard'` 的判定标准，导致展开“分析”下拉菜单时两个子选项会同时显示高亮。现改为依据 Hash 路径（`#pool-info-section`）精确区分两者的激活状态。

### 2. 具体修改内容
1. **精确区分激活状态**：
   - 在 `src/components/layout/AppHeader.jsx` 中，引入 `useLocation` 获取 URL Hash。
   - 当 Hash 为 `#pool-info-section` 时，仅高亮“卡池信息”；当 Hash 不为 `#pool-info-section` 时（如页面顶部），仅高亮“卡池分析”。
2. **菜单跳转改进**：
   - 点击“卡池信息”跳转至 `/dashboard#pool-info-section` 并平滑滚动至轮换计划及卡池机制区域。
   - 点击“卡池分析”跳转至 `/dashboard` 并平滑置顶展示卡池分析数据。

### 3. 受影响文件
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (精确区分卡池信息与卡池分析下拉选项的高亮激活状态)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)

---

## 变更 12：“卡池信息”与“卡池分析”拆分为完全独立的页面组件

### 1. 修改背景与目的
根据最新架构与需求，“卡池信息”（`/pool-info`）与“卡池分析”（`/dashboard`）被彻底拆分为两个完全独立的页面组件：
- **卡池信息**（`PoolInfoPage`）：无需登录，专一展示从首页迁移过来的“轮换计划”与“公测卡池机制速览”两项公开资讯。
- **卡池分析**（`DesktopDashboardWorkspace`）：维持个人抽卡分析中心定位，需登录/导入个人抽卡日志后进行分析与查阅。

### 2. 具体修改内容
1. **新建独立页面组件**：
   - 新建 `src/components/pool/PoolInfoPage.jsx`，专门渲染“轮换计划”与“公测卡池机制速览”，无个人数据依赖，开放给所有访问者浏览。
2. **注册独立路由**：
   - 在 `src/constants/appRoutes.js` 中注册 `poolInfo: '/pool-info'` 路由。
   - 在 `src/components/app/DesktopAppRoutes.jsx` 中添加 `/pool-info` 路由项。
3. **恢复卡池分析纯粹性**：
   - 从 `src/components/app/DesktopDashboardWorkspace.jsx` 中移除此前临时嵌入的轮换计划与卡池机制，恢复其作为“卡池分析”的个人分析工作台功能。
4. **导航菜单精准绑定**：
   - 在 `src/components/layout/AppHeader.jsx` 的“分析”下拉菜单中，将“卡池信息”绑定至 `/pool-info`（`activeTab === 'poolInfo'`），将“卡池分析”绑定至 `/dashboard`（`activeTab === 'dashboard'`），彻底解决两个子项同时高亮的问题。

### 3. 受影响文件
- `[NEW]` `src/components/pool/PoolInfoPage.jsx` (新建卡池信息独立页面组件)
- `[MODIFY]` `src/constants/appRoutes.js` (注册 poolInfo 路由)
- `[MODIFY]` `src/components/app/DesktopAppRoutes.jsx` (配置 /pool-info 路由页面)
- `[MODIFY]` `src/components/app/DesktopDashboardWorkspace.jsx` (移除嵌入的轮换与机制卡片，恢复纯粹的卡池分析)
- `[MODIFY]` `src/components/layout/AppHeader.jsx` (精准绑定卡池信息与卡池分析导航跳转与高亮)
---

## 变更 13：将“安全与隐私声明”及“QQ 交流群”模块迁移至左下角悬浮窗

### 1. 修改背景与目的
为了使首页主展示区更加聚焦于核心倒计时与资讯，同时保证安全隐私说明和 QQ 社区群入口始终随手触达，将首页原有的“安全与隐私声明”与“欢迎加入 QQ 群”卡片从页面主网格中移出，重构成左下角可收起/展开的浮动组件（`SecurityCommunityWidget`）。

### 2. 具体修改内容
1. **新建左下角悬浮组件**：
   - 新建 `src/components/home/SecurityCommunityWidget.jsx`，固定定位在左下角（`fixed bottom-6 left-6 z-[80]`）。
   - **收起状态**：呈现胶囊样式悬浮按钮，带有绿黄图标组合与指示呼吸灯，点击可展开面板。
   - **展开状态**：渲染玻璃磨砂面板（`backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95`），整合“安全与隐私声明”及“欢迎加入 QQ 群”（提供一键复制 QQ 群号与 Toast 提示）。
   - 记忆用户的收起/展开状态。
2. **首页布局精简**：
   - 从 `src/components/home/HomePage.jsx` 中移除了静态嵌入的安全声明与 QQ 群网格卡片，将主展示区精简为直接呈现赞助与核心倒计时，并引入渲染 `SecurityCommunityWidget` 浮动组件。

### 3. 受影响文件
- `[NEW]` `src/components/home/SecurityCommunityWidget.jsx` (新建左下角安全声明与交流群悬浮组件)
- `[MODIFY]` `src/components/home/HomePage.jsx` (移除首页静态安全声明与 QQ 群卡片，挂载悬浮组件)
---

## 变更 14：首页菜单正下方重构全屏全宽 Hero Banner

### 1. 修改背景与目的
为提升首页整体品牌沉浸感与视觉冲击力，在顶部导航菜单下方重构了横跨全屏宽度的全宽 Hero Banner 区域，集中展示品牌标题、全站域名标签、功能介绍以及突破 2K+ 数据的互动庆祝按钮。

### 2. 具体修改内容
1. **全宽 Hero Banner 样式**：
   - 在 `src/components/home/HomePage.jsx` 顶部采用全宽边到边大 Banner（`-mx-4 sm:-mx-6 -mt-8 mb-6`），深色发光背景（`bg-gradient-to-r from-zinc-950 via-zinc-900 to-black`）搭配网格微光。
2. **完整内容展示**：
   - **大标题**：`终末地抽卡分析器`（配以品牌 Icon 与终末地黄主题配色）。
   - **域名标签**：双域名标签 `ef-gacha.mogujun.icu` 与 `ef.nepst.cn`（带有外链指示与状态灯点）。
   - **核心描述**：`记录您的抽卡历程，分析出货规律，为后续规划提供参考`。
   - **互动庆祝**：右侧突出展示`恭喜网站突破 2K+ 人贡献抽卡数据`粒子庆祝胶囊按钮，点击可触发全屏礼花粒子效果。

### 3. 受影响文件
---

## 变更 15：重构白底极简常规网站 Hero Banner 并置于应用全局最顶层容器

### 1. 修改背景与目的
为了彻底解决之前 Banner 受到 `<main className="max-w-[1440px]">` 局限无法真正 100% 填满屏幕宽度的结构问题，将 Hero Banner 抽离为独立的 `HomeHeroBanner` 组件，并直接挂载在 `GachaAnalyzer` 顶层 App Shell 容器上（位于 `AppHeader` 紧下方）。同时将背景重构为干净清爽的白底风格（`bg-white dark:bg-zinc-900`），符合常规现代化网站大 Banner 的高品质展示规范。

### 2. 具体修改内容
1. **架构层级调整实现真正全屏**：
   - 新建 `src/components/home/HomeHeroBanner.jsx`。
   - 在 `src/GachaAnalyzer.jsx` 中将 `HomeHeroBanner` 挂载在最外层 `app-shell` 容器，避开了 `main` 容器的 `max-w-[1440px]` 宽度约束，从而实现真正的 100% 满屏无横向滚动条全宽 Banner。
2. **白底极简常规网站 Banner 视觉设计**：
   - **配色方案**：采用极简纯白/深灰背景（`bg-white dark:bg-zinc-900`），顶部配有极细金色渐变光边与立体网格，清爽明亮。
   - **包含内容**：包含“终末地抽卡分析器”、“ef-gacha.mogujun.icu”、“ef.nepst.cn”、“记录您的抽卡历程，分析出货规律，为后续规划提供参考”及“恭喜网站突破 2K+ 人贡献抽卡数据”的全部要素。
   - **右侧侧边卡片**：集成简洁的数据特点与分析优势看板。

### 3. 受影响文件
- `[NEW]` `src/components/home/HomeHeroBanner.jsx` (新建 100% 屏幕满屏全高白底 Hero Cover 组件)
- `[MODIFY]` `src/GachaAnalyzer.jsx` (在最顶层 Shell 挂载 HomeHeroBanner 实现真正全宽全屏)
---

## 变更 16：顶部 Banner 添加“快速开始”按钮与使用指南弹窗重构

### 1. 修改背景与目的
为了使首页底部布局更清爽，同时方便新用户在 Banner 核心区域快速了解使用流程，移除了首页底部的静态《使用指南》展牌，并在顶部大 Banner 显眼位置添加了“快速开始”按钮，点击后直接弹出高品质的《使用指南》弹窗（`GuideModal`）。

### 2. 具体修改内容
1. **新建使用指南弹窗组件**：
   - 新建 `src/components/modals/GuideModal.jsx`，以全屏 Modal 弹窗形式交互式渲染包含 STEP 01（账号注册与数据导入）、STEP 02（数据分析与统计）、STEP 03（实用工具与服务）在内的完整指引，支持一键快捷跳转。
2. **Banner 挂载“快速开始”按钮**：
   - 在 `src/components/home/HomeHeroBanner.jsx` 中添加黄黑亮色“快速开始”高吸引力按钮，点击触发 `GuideModal` 弹窗展示。
3. **首页底部布局精简**：
   - 从 `src/components/home/HomePage.jsx` 底部移除了原先的静态展开式 `GuideCard`。

### 3. 受影响文件
- `[NEW]` `src/components/modals/GuideModal.jsx` (新建使用指南 Modal 弹窗组件)
---

## 变更 17：顶部 Banner 添加“全站统计”快捷按钮

### 1. 修改背景与目的
为方便用户从首页 Banner 区域一键直达全服数据分析与统计视图，在“快速开始”按钮右侧新增了“全站统计”按钮，点击后自动跳转至 `/summary` 页面。

### 2. 具体修改内容
1. **Banner 添加“全站统计”按钮**：
   - 在 `src/components/home/HomeHeroBanner.jsx` 的核心按钮区中，为“快速开始”按钮右侧加入 `<Link to="/summary">` 跳转按钮，配备 `PieChart` 图标与高亮 Hover 视效。

---

## 变更 18：重构首页下半部分四区块为双列 Dashboard 响应式网格

### 1. 修改背景与目的
为了解决首页下方的四个区块（抽奖区块、赞助区块、卡池倒计时区块、官方活动/版本预告区块）单列平铺堆叠、缺乏视觉层级与审美单调的问题，将其重构为左右双列响应式 Dashboard 布局，突出主次层级。

### 2. 具体修改内容
1. **左侧核心栏 (7/12 列)**：
   - 包含“卡池倒计时与公测预告”标题区。
   - 顺序组合渲染**主限定寻访倒计时**、**次级/额外寻访倒计时**以及**官方版本/公测预告卡片**。
2. **右侧社区与支持栏 (5/12 列)**：
   - 包含“活动与赞助支持”标题区。
   - 顺序组合渲染**夏日抽奖活动 Banner** (`SummerLotteryBanner`) 与**赞助致谢卡片** (`DonationThanksCard`)。

---

## 变更 19：抽奖活动 Banner 调整为独占整行全宽展示

### 1. 修改背景与目的
由于夏日抽奖活动 Banner (`SummerLotteryBanner`) 包含合作方 Logo、奖品日期与操作按钮等多项长布局信息，在窄列网格中容易造成文字被截断。现将其调整为独占一整行全宽展示，确保信息完整且视觉冲击力强。

### 2. 具体修改内容
1. **抽奖 Banner 独占整行**：
   - 从 5 列右侧子网格中提取出 `SummerLotteryBanner`，放置在双列 Dashboard 网格的上方独占整行展现。

---

## 变更 20：将抽奖区块移动至右侧栏并重构为伸缩折叠面板

### 1. 修改背景与目的
为使首页主视角更加精简聚焦，将抽奖活动区块移至右侧栏中，并为其配备带有箭头控制器的伸缩折叠面板（`CollapsibleContent`），用户可随意展开或折叠抽奖活动明细，同时自动保存折叠状态。

### 2. 具体修改内容
1. **抽奖区块右侧伸缩折叠化**：
   - 将 `SummerLotteryBanner` 移动至右侧（`lg:col-span-5`）与赞助致谢卡片并排组合。
   - 包装为顶部带有 `Gift` Icon、标题与 `ChevronUp` 旋转箭头的折叠控制头，内部采用平滑 CSS 动画展开/收缩抽奖明细（使用 `compact` 紧凑渲染风格）。
   - 自动在 `localStorage` 中记录折叠状态。

---

## 变更 21：将抽奖区块重构为紧贴屏幕右侧边缘的悬浮吸附折叠面板 (`SummerLotteryWidget`)

### 1. 修改背景与目的
为了避免抽奖卡片在页面常规排版中占用主视觉空间或被窄列截断，将其完全重构为独立固定在**屏幕最右侧边缘**（`fixed right-0`）的悬浮折叠吸附抽屉（`SummerLotteryWidget`）。

### 2. 具体修改内容
1. **新建右侧边缘悬浮抽屉**：
   - 新建 `src/components/home/SummerLotteryWidget.jsx`，固定在屏幕右侧边缘（`fixed top-1/4 right-0 z-[85]`）。
   - **收起状态**：呈现吸附在屏幕最右侧边缘的金色弧形悬浮标签（`夏日抽奖` + 跳动礼盒 Icon），不遮挡任何主视图内容。
   - **展开状态**：平滑向左滑出侧边悬浮面板，渲染精致紧凑的抽奖活动明细卡片（`SummerLotteryBanner`），并带有独立的向右收起按钮。
   - 自动在 `localStorage` 中记录并恢复用户的展开/收起偏好。

---

## 变更 22：优化 SummerLotteryWidget 默认收缩状态、竖长条收缩标签与横向完整 Banner 展开样式

### 1. 修改背景与目的
根据最新交互要求对右侧悬浮抽奖组件（`SummerLotteryWidget`）进行精确重构：
1. 默认状态调整为全站进入即为收缩状态。
2. 收缩状态改为紧贴右侧边缘的“竖向窄长方形”精美胶囊。
3. 展开状态恢复为全宽“横向长方形”原生 Banner 样式，不裁切、不挤压。

### 2. 具体修改内容
1. **默认状态收缩化**：
   - 将 `isOpen` 初始值调整为 `false`，确保默认进入网站时保持简洁收缩状态。
2. **收缩状态（竖向长方形标签）**：
   - 采用竖向文本（`writing-mode: vertical-rl`）、顶部跳动礼盒 Icon 与底部缩进箭头，构成贴合屏幕右侧边缘（`fixed top-1/3 right-0`）的精美竖向窄矩形按钮（`w-9 sm:w-10`）。
3. **展开状态（原生横向大 Banner 浮窗）**：
   - 展开浮窗扩展为大尺寸横向长方形（`w-[680px]` / `lg:w-[820px]`），内部挂载 `compact={false}` 的原生横向 `SummerLotteryBanner`，完全保留合作 Logo、奖品细节与完整美术效果。

---

## 变更 23：提高 SummerLotteryWidget 浮窗层级并拉长横向容器宽度

### 1. 修改背景与目的
为了解决抽奖弹窗展开时会被 Banner 标题或底层元素透过遮挡的问题，将其置于最高 `z-[200]` 层级并加入高透明度磨砂 Backdrop 遮罩；同时将展开容器宽度拉长至 `1060px`，确保所有活动文本与横向 Banner 元素在一行完整伸展不折行。

### 2. 具体修改内容
1. **提升图层 z-index 至 highest 顶层**：
   - 将悬浮抽奖组件的 z-index 提升至 `z-[200]`，同时在展开时加入 `z-[190]` 的防穿透黑色磨砂遮罩（`bg-black/40 backdrop-blur-xs`），彻底隔离底层页面文字。
2. **容器横向宽幅拉长**：
   - 将展开窗口容器宽度提升至 `lg:w-[1060px] max-w-[1080px]`，为 `SummerLotteryBanner` 提供完全充裕的横向展示空间，消除文字被迫换行的问题。

### 3. 受影响文件
- `[MODIFY]` `src/components/home/SummerLotteryWidget.jsx` (提高 z-index 至 z-[200] 并拉长横向宽度至 1060px)
- `[MODIFY]` `Neptune_Change.md` (更新变更日志)


















