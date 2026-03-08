import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 });
    }

    console.log('Starting upload to R2...');
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `settings/${Date.now()}-${file.name}`;
    console.log('Bucket:', process.env.R2_BUCKET_NAME);
    console.log('File Name:', fileName);

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    console.log('Sending command to S3 Client...');
    await s3Client.send(command);
    console.log('Upload successful!');

    // Provide the public URL or key back to the client
    // Note: R2 Endpoint should be used with the bucket name in the path if needed,
    // but here we just return the key and a temporary URL.
    const fileUrl = `${process.env.R2_ENDPOINT!}/${process.env.R2_BUCKET_NAME!}/${fileName}`;

    return NextResponse.json({ success: true, url: fileUrl, key: fileName });
  } catch (error) {
    console.error('Detailed Upload error:', error);
    return NextResponse.json({
      error: 'Failed to upload to R2.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
