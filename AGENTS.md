# dsh-mermaid

独立 DSH Web 插件，npm 包为 `@shellraining/dsh-mermaid`。先读 README.zh-CN.md、package.json、build.ts，再读目标源码。

## 约束

- 业务源码放在 `src/`，全部使用 TypeScript。保持 strict、noUncheckedIndexedAccess、exactOptionalPropertyTypes，不得用 any 批量放宽、@ts-nocheck 或关闭检查完成任务。
- 不得自行新增或改写测试，包括临时测试脚本、夹具与快照。需要测试时先说明范围并取得明确授权。可以运行已有类型检查、构建、归档检查和手动页面验收；`tools/check-package.ts` 是发布归档检查，不是测试套件。
- 通过官方 profile、bundle patch、ModuleLoader 接入，不改宿主源码，不依赖相邻仓库、submodule 或其他插件内部源码。
- 使用宿主设计变量。Fluent 主题适配是可选增强，缺少主题标记时正常显示。宿主 DOM 与临时 CSS 性能处理集中在现有边界，不添加构建 hash 选择器。
- Mermaid 源码与 SVG 不可信，保留大小限制、严格配置与 SVG 清理。异步结果写入前核对当前状态，卸载时释放监听、观察器、计时器和自建节点。
- 精确直接依赖写在 package.json，提交独立 pnpm-lock.yaml。本地 tools/build-plugin.ts 仅服务本仓库，不从旧 monorepo 导入工具。
- 修改行为、安装、构建或发布时同步英文 README.md 与中文 README.zh-CN.md；写文档前加载 write skill。保留许可证与上游署名，不无限扩张知识文档。
- 不擅自修改版本、提交、推送、发布、创建远端或安装到用户 profile。发布仅允许获得授权后手动触发 workflow_dispatch；不得改成 main 推送自动发布。

## 验证

依次运行 `pnpm typecheck`、`pnpm build`、`pnpm pack --out artifacts/package.tgz`、`pnpm pack:check artifacts/package.tgz`。在 Git 仓库内收尾运行 `git diff --check`。

生成的 lib/ 不手改、不提交。构建和归档通过不代表浏览器行为通过；按中文 README 的发布前清单在真实 DSH 页面验证。没有页面控制或加载权限时明确报告未验证，不另起替代服务、不擅自改 profile。
