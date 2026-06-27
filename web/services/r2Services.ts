'use server';

import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadFile(file: File) {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: file.name,
            Body: buffer,
            ContentType:file.type
        });
        const response = await r2.send(command);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}