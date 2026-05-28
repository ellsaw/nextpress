import fs from 'fs';
import path from 'path';

export async function acfFieldGroupAutoloader(): Promise<NextpressFieldGroup[]> {
    const absolutePath = path.join(process.cwd(), 'src', 'app', '_templates', 'components', 'field-groups');
    const files = fs.readdirSync(absolutePath);

    const fieldGroups: NextpressFieldGroup[] = [];

    for (const file of files) {
        if (!file.endsWith('.ts')) continue;

        const imported = await import(`../../../../app/_templates/components/field-groups/${file}`);
        const exportName = file.replace('.ts', '');
        const fieldGroup = imported[exportName];

        fieldGroups.push(fieldGroup);
    }

    return fieldGroups;
}
