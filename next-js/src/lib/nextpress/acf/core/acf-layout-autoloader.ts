import fs from 'fs';
import path from 'path';
import { ComponentSet } from '../../types/acf/components/ComponentSet';

export async function acfLayoutAutoloader(): Promise<ComponentSet[]> {
    const absolutePath = path.join(process.cwd(), 'src', 'app', '_templates', 'components');
    const files = fs.readdirSync(absolutePath);

    const layouts: ComponentSet[] = [];

    for (const file of files) {
        if (!file.endsWith('.tsx')) continue;

        const imported = await import(`../../../../app/_templates/components/${file}`);

        const layout = imported.layout;
        const component = imported.default;
        if (!layout || !component) continue;

        layouts.push({layout, component});
    }

    return layouts;
}
