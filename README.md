# Mermaid Diagrams for DSH

English · [简体中文](README.zh-CN.md)

Render Mermaid diagrams in the DeepSeek Harness Web GUI, switch between code and diagram views, and copy the source. Forked from [MrmoLabs/dsh-mermaid](https://github.com/MrmoLabs/dsh-mermaid), originally by Mrmo072, under the MIT license. This plugin is maintained independently in `omdsh-dev/dsh-mermaid`. Oh My DSH is an independent, unofficial community.

## Install

```sh
dsh plugin --profile web add @shellraining/dsh-mermaid
```

The npm name remains unchanged. Refresh the existing DSH page after installation. `web` refers to the standalone Web profile; use the desktop application's plugin manager for its managed profile.

Development requires Node 24.9+ and pnpm 12.6.0. The runtime keeps its existing Node >=22.19.0 range. Integration was developed against DSH 0.2.2-rc.1, but no `engines.dsh` range is declared: installation eligibility is not a compatibility guarantee. Check the actual DSH page after a host upgrade.

## Behavior and compatibility

- Diagrams render within 300 px of the viewport. Previously rendered diagrams remain available when scrolled away. Up to 32 results are cached for the current theme.
- Hover or focus a block to switch views or copy its source. Touch devices show the controls without hover. Copy confirmation lasts one second.
- Colors and geometry use DSH design tokens. Fluent Theme is optional: `data-acrylic-wallpaper` and `data-acrylic-fluent` enable additional material and diagram styling; their absence keeps the default presentation. There is no cross-plugin source dependency.
- Runtime labels use the document's `lang`, falling back to the browser language. Chinese (`zh*`) and English are supported. The plugin observes document language changes and listens for browser `languagechange`; controls and plugin-owned status labels update without injecting a host locale service. Mermaid's own diagnostic text is not translated.
- Source is limited to 50,000 characters and 2,000 lines; Mermaid additionally limits graph edges. Strict rendering disables HTML labels. Adopted SVG is sanitized, but this is not a network sandbox for the Mermaid runtime.
- A compatibility workaround temporarily disables the unanchored `:has()` selectors in DSH 0.2.2's file sidebar stylesheet while Mermaid measures text, restoring them before painting. It matches the module identity and selector shape, not build hashes, and does nothing when the target stylesheet is absent. Review `src/host-css.ts` when upgrading DSH.

## Development

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm pack --out artifacts/package.tgz
pnpm pack:check artifacts/package.tgz
```

Everything needed to build is inside this repository. Exact dependency versions and the independent lockfile replace the former monorepo catalog. `tools/build-plugin.ts` is a local copy of the original build adapter; it bundles Mermaid, creates the host ESM entry and registers the client through DSH ModuleLoader. Both source and build tools are checked with strict TypeScript 7. Generated `lib/` and archives are ignored by Git; no build occurs during consumer installation.

The repository has no test suite. Do not add or rewrite tests without explicit authorization. Type checking, builds, and archive checks do not prove browser behavior. Validate in an actual DSH profile that loads the current build; do not substitute a standalone Vite page or modify a user's profile without permission.

## CI and release

`check.yml` installs, type-checks, builds, packs and validates the archive on pushes and pull requests. Actions are pinned to the original repository's SHAs. `release.yml` publishes only after a manual dispatch on `main` and an exact version confirmation. Pushing to `main` never publishes. The workflow checks the archive before publishing that same archive with npm OIDC and provenance; it does not use an npm token.

Before the first release from the new repository, register its maintainer, confirm npm publishing rights, and update the npm trusted publisher to `omdsh-dev/dsh-mermaid` with workflow `release.yml`. Existing npm versions cannot be republished; a maintainer must explicitly authorize a new version before publishing.

See the [release checklist](README.zh-CN.md#发布前清单) for manual verification. Report ordinary issues through the repository issue tracker after it exists. Do not post secrets, personal data, or exploitable vulnerabilities publicly; use GitHub private vulnerability reporting if enabled, otherwise arrange a private channel with a registered maintainer before sending details.

## License

MIT. The original Mrmo072 copyright notice is preserved in [LICENSE](LICENSE), together with shellRaining's notice for subsequent changes and the copied build tooling. Third-party Mermaid dependencies retain their own licenses.
