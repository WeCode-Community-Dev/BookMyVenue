import { promises as fs } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import type { IFileStorage } from 'src/core/application/_shared/storage/file-storage.interface';
import { APP_CONFIG } from 'src/config/app.config';

export class LocalFileStorageService implements IFileStorage {
    private readonly uploadDir = path.join(
        process.cwd(),
        'uploads',
        'venues',
    );

    async upload(
        fileName: string,
        buffer: Buffer,
    ): Promise<string> {
        await fs.mkdir(
            this.uploadDir,
            { recursive: true },
        );

        const extension =
            path.extname(fileName);

        const storedFileName =
            `${randomUUID()}${extension}`;

        const fullPath = path.join(
            this.uploadDir,
            storedFileName,
        );

        await fs.writeFile(
            fullPath,
            buffer,
        );

        return APP_CONFIG.BASE_URL + `/uploads/venues/${storedFileName}`;
    }

    async delete(
        filePath: string,
    ): Promise<void> {
        const fullPath = path.join(
            process.cwd(),
            filePath,
        );

        await fs.unlink(fullPath);
    }
}