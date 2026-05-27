import fs from 'fs';
import path from 'path';

export async function acfFieldGroupAutoloader(): Promise<NextpressFieldGroup[]> {
    const absolutePath = path.join(process.cwd(), 'src', 'views', 'field-groups');
    const files = fs.readdirSync(absolutePath);

    const fieldGroups: NextpressFieldGroup[] = [];

    for (const file of files) {
        if (!file.endsWith('.ts')) continue;

        const imported = await import(`../../../app/_views/field-groups/${file}`);

        const fieldGroup = imported.default;

        fieldGroups.push(fieldGroup);
    }

    return fieldGroups;
}
