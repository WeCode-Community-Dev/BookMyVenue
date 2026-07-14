export interface IFileStorage {
    upload(
        fileName: string,
        buffer: Buffer,
    ): Promise<string>;

    delete(path: string): Promise<void>;
}