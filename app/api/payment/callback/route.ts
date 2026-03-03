import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    return handleCallback(req);
}

export async function POST(req: NextRequest) {
    return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
    try {
        await dbConnect();

        // 1. Extract params (Support both GET query and POST body if needed)
        // PayStation usually sends GET params or POST body. Docs say "callback_url" redirect, implying GET usually or POST.
        // Let's check searchParams first.
        const { searchParams } = new URL(req.url);
        let invoice_number = searchParams.get('invoice_number');
        let status = searchParams.get('status'); // PayStation might send status directly

        // If not in query, try body if POST (less likely for browser redirect, but possible for IPN)
        if (!invoice_number && req.method === 'POST') {
            try {
                const body = await req.json();
                invoice_number = body.invoice_number;
            } catch (e) { }
        }

        if (!invoice_number) {
            return NextResponse.redirect(new URL('/dashboard/wallet?status=invalid_callback', req.url));
        }

        // 2. Verify with PayStation API (Server-to-Server Check)
        const merchantId = process.env.PAYSTATION_MERCHANT_ID;
        const password = process.env.PAYSTATION_PASSWORD;
        const payStationUrl = process.env.PAYSTATION_API_URL || 'https://api.paystation.com.bd';

        const verifyRes = await fetch(`${payStationUrl}/transaction-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'merchantId': merchantId!,
                'password': password!
            },
            body: JSON.stringify({ invoice_number })
        });

        const verifyData = await verifyRes.json();

        // 3. Process Verification Result
        const transaction = await Transaction.findOne({ transactionId: invoice_number });

        if (!transaction) {
            return NextResponse.redirect(new URL('/dashboard/wallet?status=trx_not_found', req.url));
        }
        console.log("verifyData", verifyData);
        // status: "success" or "failed" usually
        if (verifyData.status === 'success') {

            // Allow idempotency: If already completed, just redirect success
            if (transaction.status === 'completed') {
                return NextResponse.redirect(new URL('/dashboard/wallet?status=success', req.url));
            }

            // Update Transaction
            transaction.status = 'completed';
            transaction.gateway_ref = verifyData.data.trx_id || JSON.stringify(verifyData.data);
            await transaction.save();

            // Update User Balance
            await User.findByIdAndUpdate(transaction.user, {
                $inc: { depositBalance: transaction.amount }
            });

            return NextResponse.redirect(new URL('/dashboard/wallet?status=success', req.url));
        } else {
            // Failed
            transaction.status = 'failed';
            transaction.metadata = { ...transaction.metadata, verifyResponse: verifyData };
            await transaction.save();
            return NextResponse.redirect(new URL('/dashboard/wallet?status=failed', req.url));
        }

    } catch (error) {
        console.error("Callback Error:", error);
        return NextResponse.redirect(new URL('/dashboard/wallet?status=error', req.url));
    }
}
