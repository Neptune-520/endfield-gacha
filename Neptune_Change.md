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
