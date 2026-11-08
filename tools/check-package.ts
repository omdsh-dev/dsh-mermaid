// 发布归档检查，不运行插件或浏览器测试。
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const archive = process.argv[2];
if (!archive) throw new Error('Usage: pnpm pack:check <archive.tgz>');
const local = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')) as { name: string; version: string };
const entries = execFileSync('tar', ['-tzf', resolve(archive)], { encoding: 'utf8' }).trim().split('\n');
const required = ['package.json', 'lib/index.js', 'lib/client.js', 'cordis.patch.yml', 'icon.png', 'locale/en.json', 'locale/zh.json', 'README.md', 'README.zh-CN.md', 'LICENSE'];
for (const name of required) {
  if (!entries.includes(`package/${name}`)) throw new Error(`Archive is missing ${name}`);
}
for (const name of entries) {
  if (!name.startsWith('package/') || name.split('/').includes('..') || /(^|\/)(node_modules|\.git)(\/|$)/.test(name)) throw new Error(`Unexpected archive entry: ${name}`);
}
const packed = JSON.parse(execFileSync('tar', ['-xOzf', resolve(archive), 'package/package.json'], { encoding: 'utf8' })) as { name: string; version: string };
if (packed.name !== local.name || packed.version !== local.version) throw new Error('Archive identity differs from package.json');
console.log(`Checked ${packed.name}@${packed.version}: ${entries.length} archive entries`);
console.log(entries.join('\n'));
