import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { join, dirname } from 'path';

const appDir: string = dirname(require.main.filename);
export const frontStaticFolder = join(appDir, '..', 'front');
export const frontIndexFile = join(frontStaticFolder, 'index.html');

export const StaticModuleForRoot: ServeStaticModuleOptions = {
	rootPath: frontStaticFolder
};
