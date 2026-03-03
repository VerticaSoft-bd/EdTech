import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) return unauthorizedResponse();

        const { amount, courseName, email } = await req.json();

        if (!amount || amount < 10) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        await dbConnect();

        // 1. Create Pending Transaction (Invoice)
        // Format: INV-TIMESTAMP-USERIDSHORT
        const invoiceNumber = `INV-${Date.now()}-${user._id.toString().slice(-4)}`;

        const newTransaction = await Transaction.create({
            user: user._id,
            type: courseName ? 'course_purchase' : 'deposit',
            amount: amount,
            status: 'pending',
            transactionId: invoiceNumber, // Used as Invoice Number
            description: courseName ? `Payment for ${courseName}` : 'Deposit via PayStation',
            method: 'PayStation',
            metadata: courseName ? { courseName, email: email || user.email } : {}
        });

        // 2. Prepare PayStation Payload
        const merchantId = process.env.PAYSTATION_MERCHANT_ID;
        const password = process.env.PAYSTATION_PASSWORD;
        // Default to production, but allow override for sandbox
        const payStationUrl = process.env.PAYSTATION_API_URL || 'https://api.paystation.com.bd';

        if (!merchantId || !password) {
            console.error("PayStation credentials missing");
            return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const callbackUrl = `${baseUrl}/api/payment/callback`;

        const formData = new FormData();
        formData.append('invoice_number', invoiceNumber);
        formData.append('currency', 'BDT');
        formData.append('payment_amount', amount.toString());
        formData.append('cust_name', user?.name || "Customer");
        formData.append('cust_phone', "01700000000"); // User model doesn't have phone, so use placeholder
        formData.append('cust_email', user?.email || "customer@example.com");
        formData.append('cust_address', "Bangladesh");
        formData.append('callback_url', callbackUrl);
        formData.append('checkout_type', 'hosted');
        formData.append('reference', invoiceNumber);
        formData.append('merchantId', merchantId);
        formData.append('password', password);

        console.log("PayStation Payload (FormData Fields):", {
            merchantId, invoice_number: invoiceNumber, amount, callbackUrl, url: `${payStationUrl}/initiate-payment`
        });

        // 3. Call PayStation API
        const payRes = await fetch(`${payStationUrl}/initiate-payment`, {
            method: 'POST',
            // convert to standard FormData if needed, but Next.js/Node fetch supports it directly
            body: formData
        });

        const payData = await payRes.json();
        console.log("PayStation Response:", payData);

        if (payData.status === 'success' && payData.payment_url) {
            return NextResponse.json({ payment_url: payData.payment_url });
        } else {
            console.error("PayStation Init Error:", payData);
            // Cleanup failed transaction
            await Transaction.findByIdAndDelete(newTransaction._id);
            return NextResponse.json({ error: payData.message || 'Payment initiation failed' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Payment Create Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
