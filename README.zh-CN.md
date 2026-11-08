# DSH Mermaid 图表

[English](README.md) · 简体中文

在 DeepSeek Harness Web GUI 中渲染 Mermaid 图表，切换代码和图表视图、复制源码。基于 Mrmo072 的 [MrmoLabs/dsh-mermaid](https://github.com/MrmoLabs/dsh-mermaid)，保留 MIT 许可与署名。本目录是为 `omdsh-dev/dsh-mermaid` 准备的独立仓库，远端创建和迁入需另行操作。Oh My DSH 是独立、非官方社区。

## 安装

```sh
dsh plugin --profile web add @shellraining/dsh-mermaid
```

npm 包名保持不变。安装后刷新已有 DSH 页面。`web` 指独立 Web profile，桌面应用的受管 profile 请通过应用内插件管理器操作。

开发需要 Node 24.9+、pnpm 12.6.0，运行时保留原有 Node >=22.19.0 范围。接入按 DSH 0.2.2-rc.1 开发，暂未声明 `engines.dsh` 范围，能够安装不代表已经验证兼容。升级宿主后需检查实际页面。

## 行为与兼容边界

- 图表进入视口上下 300px 附近时绘制，移出后保留。当前主题最多缓存 32 份绘图结果。
- 悬停或聚焦图表可切换视图、复制源码，触摸设备不依赖悬停。复制成功反馈保持一秒。
- 使用 DSH 设计变量。Fluent 主题可选，`data-acrylic-wallpaper` 和 `data-acrylic-fluent` 标记提供额外材质、圆角和线条适配；没有标记时保留默认呈现，不跨插件导入源码。
- 运行时先读页面 `lang`，为空时读浏览器语言，支持中文（`zh*`）和英文。观察页面语言变化并监听浏览器 `languagechange`，更新按钮和插件自身状态文案，不注入宿主可能未提供的语言服务。Mermaid 自己的诊断信息不翻译。
- 源码最多 50,000 字符、2,000 行，Mermaid 另有限制边数。严格渲染关闭 HTML 标签，并在插入 SVG 前做清理；这不构成 Mermaid 运行时的网络沙箱。
- DSH 0.2.2 文件侧栏的无锚点 `:has()` 规则会放大 Mermaid 测量文字的开销。插件绘图期间暂时停用匹配规则，在绘制页面前恢复；按样式模块标识和选择器形状匹配，不依赖构建 hash，目标样式不存在时不处理。升级宿主时核对 `src/host-css.ts`，宿主修复后可移除这一兼容代码。

## 开发

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm pack --out artifacts/package.tgz
pnpm pack:check artifacts/package.tgz
```

构建所需文件全部在本仓库内，精确依赖与独立锁文件替代原 monorepo catalog。`tools/build-plugin.ts` 是原构建适配的本地副本，打包 Mermaid，生成宿主 ESM 入口与通过 DSH ModuleLoader 注册的客户端。业务源码和构建工具均通过 strict TypeScript 7 检查。生成目录 `lib/` 与归档不入库，用户安装时不执行构建。

本仓库不保留测试套件。未经明确授权，不得新增或改写测试。类型检查、构建和打包检查不能代替浏览器验收。应在加载本次构建产物的真实 DSH profile 中验证，不能以独立 Vite 页面代替，也不能未经授权修改用户 profile。

## CI 与发布

`check.yml` 在推送和 PR 时依次安装、类型检查、构建、打包并核查归档，Actions 沿用原仓库锁定的 SHA。`release.yml` 仅允许在 `main` 上手动触发，并要求输入与清单一致的版本号。推送到 `main` 不会发布。流水线先检查归档，再以 npm OIDC 和 provenance 发布同一归档，不使用 npm token。

新仓库首次发布前，需要登记仓库维护者、确认 npm 发布权限，将 npm trusted publisher 改为 `omdsh-dev/dsh-mermaid` 和 `release.yml`。当前保留版本可能已在 npm 上存在，不能重复发布，必须由维护者明确授权新版本后再操作。本次准备不创建远端、不发布软件包。

## 发布前清单

- 确认新远端已建立、维护者已登记、仓库权限和 npm trusted publisher 已核对。
- 确认 npm 包名、入口、Cordis ID、ModuleLoader ID、许可证与上游署名未意外改变。
- 运行上方全部命令，检查归档含宿主入口、客户端、patch、图标、双语元数据、双语说明和许可证，且不含 `node_modules` 或旧仓库路径。
- 在真实 DSH 页面验证明暗主题、中文和英文及动态切换、代码/图表切换、复制、语法错误、长图、滚动懒加载、会话切换和插件启停清理。
- 分别检查单独使用和与 Fluent 主题一起使用；确认不堆叠模糊、减少动态与减少透明度及高对比度模式可用。
- 核对宿主升级后代码块语义标记与文件侧栏性能兼容代码是否仍适用。
- 确认要发布的版本尚不存在，取得修改版本与发布的明确授权，再在 `main` 手动触发；不要把保留的已发布版本当作可重复发布的版本。

普通问题可在远端建立后使用仓库 Issue。不要公开提交凭据、个人数据或可利用漏洞；启用 GitHub 私密漏洞报告时使用该入口，否则先与登记维护者约定私密渠道，再发送细节。

## 许可

MIT。[LICENSE](LICENSE) 保留 Mrmo072 的上游版权声明，并补充 shellRaining 后续修改与构建工具的版权声明。Mermaid 及其第三方依赖继续遵循各自许可证。
