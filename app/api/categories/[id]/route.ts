import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import AWS from 'aws-sdk';

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Helper function to extract S3 Key from URL
function getS3KeyFromUrl(url: string, bucketName: string) {
    if (!url) return null;

    try {
        const urlObj = new URL(url);
        // The pathname usually looks like /uploads/folder/filename.jpg
        // But if the bucket name is part of the host (bucket.s3.region.amazonaws.com)
        // Then pathname is just /uploads/folder/filename.jpg
        // We decode it to handle spaces or special characters
        let key = decodeURIComponent(urlObj.pathname);
        if (key.startsWith('/')) {
            key = key.substring(1); // remove leading slash
        }
        return key;
    } catch (e) {
        console.error("Failed to parse S3 URL:", url, e);
        return null; // Invalid URL
    }
}

// DELETE a single category
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        // 1. Find the category
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
        }

        // 2. Delete image from S3 if it exists
        if (category.thumbnail) {
            const bucketName = process.env.AWS_BUCKET_NAME as string;
            const key = getS3KeyFromUrl(category.thumbnail, bucketName);

            if (key) {
                console.log(`Attempting to delete image from S3. Bucket: ${bucketName}, Key: ${key}`);
                try {
                    await s3.deleteObject({
                        Bucket: bucketName,
                        Key: key
                    }).promise();
                    console.log(`Successfully deleted image from S3: ${key}`);
                } catch (s3Error: any) {
                    console.error("====== S3 Delete Error ======");
                    console.error("Failed to delete old image from S3:", s3Error.message);
                    // Decide if S3 failure should block DB deletion. Usually, we log and proceed to not break the UI.
                }
            } else {
                console.log("Could not extract S3 key from thumbnail URL:", category.thumbnail);
            }
        }

        // 3. Delete category from Database
        await Category.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Category deleted successfully' }, { status: 200 });

    } catch (error: any) {
        console.error("Category Deletion Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT (update) a single category
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        await connectToDatabase();

        // 1. Find the existing category to check if thumbnail changed
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
        }

        const { name, description, status, color, thumbnail } = body;

        // 2. Check if thumbnail was updated/removed and delete the old one from S3
        if (existingCategory.thumbnail && existingCategory.thumbnail !== thumbnail) {
            const bucketName = process.env.AWS_BUCKET_NAME as string;
            const key = getS3KeyFromUrl(existingCategory.thumbnail, bucketName);

            if (key) {
                console.log(`Thumbnail changed! Deleting old image from S3. Key: ${key}`);
                try {
                    await s3.deleteObject({
                        Bucket: bucketName,
                        Key: key
                    }).promise();
                } catch (s3Error: any) {
                    console.error("Failed to delete replaced image from S3:", s3Error.message);
                }
            }
        }

        // 3. Update the database
        const payload = {
            name,
            description,
            status,
            color,
            thumbnail
        };

        const updatedCategory = await Category.findByIdAndUpdate(id, payload, { new: true });

        return NextResponse.json({ success: true, data: updatedCategory }, { status: 200 });

    } catch (error: any) {
        console.error("Category Update Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
