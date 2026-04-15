import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';
import Course from '@/models/Course';
import Batch from '@/models/Batch';
import { deleteFromS3 } from '@/lib/s3-client';

export const dynamic = 'force-dynamic';

// GET - Fetch site settings (returns single settings doc, creates default if none exists)
export async function GET() {
    try {
        await connectDB();
        
        // Explicitly check models to ensure they are registered for population
        if (!mongoose.models.Course) {
            console.log("Registering Course model for settings population");
        }
        if (!mongoose.models.Batch) {
            console.log("Registering Batch model for settings population");
        }

        let settings = await SiteSettings.findOne().populate({
            path: 'specialPackageCourses',
            populate: {
                path: 'assignedBatches'
            }
        });

        if (!settings) {
            settings = await SiteSettings.create({});
            settings = await SiteSettings.findById(settings._id).populate({
                path: 'specialPackageCourses',
                populate: {
                    path: 'assignedBatches'
                }
            });
        }

        if (!settings) {
            return NextResponse.json({ success: false, message: "Failed to initialize site settings" }, { status: 500 });
        }

        // Fill in defaults for legacy records with empty logo/favicon
        if (!settings.logo) { settings.logo = '/images/logo.png'; await settings.save(); }
        if (!settings.favicon) { settings.favicon = '/favicon.ico'; await settings.save(); }
        
        return NextResponse.json({ success: true, data: settings });
    } catch (error: any) {
        console.error("Settings GET Error:", error);
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

            // Check for brands
            if (body.brands && Array.isArray(body.brands)) {
                const oldBrands = currentSettings.brands || [];
                const newBrands = body.brands;

                for (const oldB of oldBrands) {
                    const newB = newBrands.find((b: any) => b._id && b._id === oldB._id.toString());
                    if (!newB || (oldB.logo && oldB.logo !== newB.logo)) {
                        if (oldB.logo) await deleteFromS3(oldB.logo);
                    }
                }
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
