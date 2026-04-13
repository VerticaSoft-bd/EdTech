import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';
import Course from '@/models/Course';
import Batch from '@/models/Batch';
import AWS from 'aws-sdk';

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Helper function to extract S3 Key from URL
function getS3KeyFromUrl(url: string) {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        let key = decodeURIComponent(urlObj.pathname);
        if (key.startsWith('/')) {
            key = key.substring(1);
        }
        return key;
    } catch (e) {
        return null;
    }
}

async function deleteFromS3(url: string) {
    const key = getS3KeyFromUrl(url);
    if (!key) return;

    try {
        const bucketName = process.env.AWS_BUCKET_NAME as string;
        await s3.deleteObject({
            Bucket: bucketName,
            Key: key
        }).promise();
        console.log(`Successfully deleted from S3: ${key}`);
    } catch (error: any) {
        console.error(`Failed to delete from S3 (${key}):`, error.message);
    }
}

// GET - Fetch site settings (returns single settings doc, creates default if none exists)
export async function GET() {
    try {
        await connectDB();
        let settings = await SiteSettings.findOne().populate({
            path: 'specialPackageCourses',
            populate: { path: 'assignedBatches' }
        });
        if (!settings) {
            settings = await SiteSettings.create({});
            settings = await SiteSettings.findById(settings._id).populate({
                path: 'specialPackageCourses',
                populate: { path: 'assignedBatches' }
            });
        }
        // Fill in defaults for legacy records with empty logo/favicon
        if (!settings.logo) { settings.logo = '/images/logo.png'; await settings.save(); }
        if (!settings.favicon) { settings.favicon = '/favicon.ico'; await settings.save(); }
        return NextResponse.json({ success: true, data: settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT - Update site settings
export async function PUT(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // fetch current settings to handle file deletion
        const currentSettings = await SiteSettings.findOne();

        if (currentSettings) {
            // Check for changed testimonials
            if (body.testimonials && Array.isArray(body.testimonials)) {
                const oldTestimonials = currentSettings.testimonials || [];
                const newTestimonials = body.testimonials;

                // Identify removed or updated media
                for (const oldT of oldTestimonials) {
                    const newT = newTestimonials.find((t: any) => t._id && t._id === oldT._id.toString());
                    
                    // If testimonial was deleted or video URL changed
                    if (!newT || (oldT.videoUrl && oldT.videoUrl !== newT.videoUrl)) {
                        if (oldT.videoUrl) await deleteFromS3(oldT.videoUrl);
                    }
                    
                    // If image URL changed
                    if (!newT || (oldT.image && oldT.image !== newT.image)) {
                        if (oldT.image) await deleteFromS3(oldT.image);
                    }

                    // If avatar changed
                    if (!newT || (oldT.avatar && oldT.avatar !== newT.avatar)) {
                        if (oldT.avatar) await deleteFromS3(oldT.avatar);
                    }
                }
            }

            // Check for general site images
            if (body.logo && body.logo !== currentSettings.logo) {
                if (currentSettings.logo && !currentSettings.logo.startsWith('/')) await deleteFromS3(currentSettings.logo);
            }
            if (body.favicon && body.favicon !== currentSettings.favicon) {
                if (currentSettings.favicon && !currentSettings.favicon.startsWith('/')) await deleteFromS3(currentSettings.favicon);
            }
        }

        // Use findOneAndUpdate to ensure atomic updates and avoid multiple doc issues
        const settings = await SiteSettings.findOneAndUpdate(
            {},
            { $set: body },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json({ success: true, data: settings });
    } catch (error: any) {
        console.error("Settings Update Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
