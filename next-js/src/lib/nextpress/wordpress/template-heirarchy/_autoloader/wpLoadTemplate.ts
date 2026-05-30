import fs from 'fs';
import { Metadata } from 'next';
import path from 'path';
import { JSX } from 'react';

async function loadFile(template: string, exportSuffix: 'Metadata' | 'Template'): Promise<any | undefined> {
    const absolutePath = path.join(process.cwd(), 'src', 'app', '_templates');
    const files = fs.readdirSync(absolutePath);

    const imports: any[] = [];

    for (const file of files) {
        if (file !== (`${template.toLowerCase()}.tsx`)) continue;

        try {
            const imported = await import(`../../../../../app/_templates/${file}`);

            const exported = imported[`${template}${exportSuffix}`];

            imports.push(exported);
        } catch (_error) {
            return undefined;
        }
    }

    return imports[0];
}

export async function wpLoadMetadata(template: string, ...args: any[]): Promise<Metadata | undefined> {
    const metadataFn = await loadFile(template, 'Metadata');
    if (metadataFn) {
        return typeof metadataFn === 'function' ? metadataFn(...args) : metadataFn;
    }
}

export async function wpLoadTemplate(template: string): Promise<React.ComponentType<any> | undefined> {
    const element = await loadFile(template, 'Template');
    if (element) {
        return element as React.ComponentType<any>;
    }
}

