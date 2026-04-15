import AWS from 'aws-sdk';

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

/**
 * Extracts the S3 Key from a full URL.
 * Handles both virtual-hosted style and path-style URLs.
 */
export function getS3KeyFromUrl(url: string | undefined): string | null {
    if (!url || typeof url !== 'string' || url.startsWith('/') || !url.includes('amazonaws.com')) {
        return null;
    }

    try {
        const urlObj = new URL(url);
        // The pathname usually looks like /folder/filename.jpg
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

/**
 * Deletes an object from S3 based on its URL.
 */
export async function deleteFromS3(url: string | undefined): Promise<boolean> {
    const key = getS3KeyFromUrl(url);
    if (!key) return false;

    try {
        const bucketName = process.env.AWS_BUCKET_NAME as string;
        await s3.deleteObject({
            Bucket: bucketName,
            Key: key
        }).promise();
        console.log(`Successfully deleted from S3: ${key}`);
        return true;
    } catch (error: any) {
        console.error(`Failed to delete from S3 (${key}):`, error.message);
        return false;
    }
}

/**
 * Compares old data and new data for specific media fields and deletes replaced files.
 */
export async function handleMediaUpdate(oldData: any, newData: any, mediaFields: string[]) {
    if (!oldData) return;

    for (const field of mediaFields) {
        const oldUrl = oldData[field];
        const newUrl = newData[field];

        // If old URL exists and is different from the new URL (or new URL is missing/different)
        if (oldUrl && oldUrl !== newUrl) {
            await deleteFromS3(oldUrl);
        }
    }
}

/**
 * Cleans up all media fields from an object being deleted.
 */
export async function cleanupMedia(data: any, mediaFields: string[]) {
    if (!data) return;

    for (const field of mediaFields) {
        const url = data[field];
        if (url) {
            await deleteFromS3(url);
        }
    }
}

export default s3;
