import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import { deleteFromS3 } from '@/lib/s3-client';

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
            await deleteFromS3(category.thumbnail);
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
            await deleteFromS3(existingCategory.thumbnail);
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
