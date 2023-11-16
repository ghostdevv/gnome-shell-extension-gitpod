// Based on https://github.com/gjsify/gnome-shell/blob/31db6445909bfc282ea24c351339431c6e3874cf/examples/hello-world/esbuild.js#L1C1-L52C4

/// <reference types="@types/node" />

import metadata from '../src/metadata.json' assert { type: 'json' };
import { copyFile, rm } from 'node:fs/promises';
import { relative } from 'node:path';
import { build } from 'esbuild';
import AdmZip from 'adm-zip';
import { join } from 'desm';
import k from 'kleur';

console.clear();
// prettier-ignore
console.log(`Building ${k.blue(metadata.name)} ${k.dim('v' + metadata.version)}...`);

const DIST_DIR = join(import.meta.url, '../dist');

await rm(DIST_DIR, { recursive: true, force: true });

await build({
	entryPoints: ['src/extension.ts'],
	outdir: 'dist',
	bundle: true,
	treeShaking: false,
	target: 'firefox102',
	platform: 'neutral',
	format: 'esm',
	// prettier-ignore
	external: ['gi:\/\/*', 'resource:\/\/*', 'system', 'gettext', 'cairo'],
});

const ZIP = `${DIST_DIR}/${metadata.uuid}.zip`;

await copyFile(
	join(import.meta.url, '../src/metadata.json'),
	`${DIST_DIR}/metadata.json`,
);

const zip = new AdmZip();

zip.addLocalFolder(DIST_DIR);
zip.writeZip(ZIP);

const REL_ZIP = relative(process.cwd(), ZIP);

console.log('Built to', k.magenta(`"${REL_ZIP}"\n`));

// prettier-ignore
console.log('Install with:', k.green(`gnome-extensions install --force ${REL_ZIP}`));
// prettier-ignore
console.log('Enable with:', k.green(`gnome-extensions enable ${metadata.uuid}\n`));
// prettier-ignore
console.log('Disable with:', k.red(`gnome-extensions disable ${metadata.uuid}`));
// prettier-ignore
console.log('Remove with:', k.red(`gnome-extensions uninstall ${metadata.uuid}`));
