import fs from 'fs';
import path, { dirname } from 'path';

export async function getQueries(): Promise<Map<string,string>> {
    try {
        const files = await fs.promises.readdir(path.join(__dirname, 'queries'));
        const entries = await Promise.all(files.map(async file => {
            const filePath = path.join(__dirname, 'queries', file);
            const stat = await fs.promises.stat(filePath);
            if (stat.isFile()) {
                const fileNameWithoutExt = path.parse(file).name;
                const fileContent = await fs.promises.readFile(filePath, 'utf8');
                return [fileNameWithoutExt, fileContent];
            } else {
                return null;
            }
        }));

        return new Map(entries.filter(entry => entry !== null) as [[string,string]]);
            
        
    } catch (error) {
        console.error('Error reading queries directory:', error);
    }
}
