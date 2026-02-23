import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as Blob | null;

        if (!file || file.size === 0) {
            return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
        }

        console.log("File detected in Upload API:", (file as any).name, "size:", file.size, "type:", file.type);
        const buffer = Buffer.from(await file.arrayBuffer());

        // Sanitize the file name to prevent S3 errors
        const originalName = (file as any).name || 'file';
        const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}-${sanitizedName}`;

        const bucketName = process.env.AWS_BUCKET_NAME as string;

        // Parse the folder name correctly from env variables
        let folderName = process.env.AWS_BUCKET_FOLDER_NAME || '';
        folderName = folderName.replace(/['"]/g, ''); // strip any wrapping quotes from env
        if (folderName && !folderName.endsWith('/')) {
            folderName += '/'; // ensure it ends with a slash
        }

        const key = `${folderName}${fileName}`;
        console.log(`Prepared to upload to bucket: ${bucketName}, key: ${key}`);

        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: file.type || 'application/octet-stream',
        };

        try {
            const uploadResult = await s3.upload(uploadParams).promise();
            console.log("S3 Upload Success! File located at:", uploadResult.Location);
            return NextResponse.json({
                success: true,
                url: uploadResult.Location,
                message: "File uploaded successfully"
            }, { status: 200 });
        } catch (uploadError: any) {
            console.error("====== S3 Upload API Error ======");
            console.error("Error Message:", uploadError.message);
            console.error("Error Code:", uploadError.code);
            console.error("Error Details:", uploadError);
            return NextResponse.json({ success: false, message: `S3 Upload Failed: ${uploadError.message}` }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Upload Route Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
