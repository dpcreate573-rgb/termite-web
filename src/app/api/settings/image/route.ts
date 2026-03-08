import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
        return new Response('Missing key', { status: 400 });
    }

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
        });

        const response = await s3Client.send(command);

        if (!response.Body) {
            return new Response('Not Found', { status: 404 });
        }

        // Convert internal stream to buffer/blob for Response
        const streamToBuffer = async (stream: any): Promise<Buffer> => {
            const chunks: any[] = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        };

        const buffer = await streamToBuffer(response.Body);

        return new Response(buffer, {
            headers: {
                'Content-Type': response.ContentType || 'image/png',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Proxy Image Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
