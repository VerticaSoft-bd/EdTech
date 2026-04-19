import connectToDatabase from "./db";
import SiteSettings from "@/models/SiteSettings";

export async function sendSMS(contact: string, message: string, type: 'text' | 'unicode' = 'text' ) {
    try {
        // 1. Get credentials from env or DB
        let apiKey = process.env.SMS_API_KEY;
        let senderId = process.env.SMS_SENDER_ID;

        if (!apiKey || !senderId) {
            await connectToDatabase();
            const settings = await SiteSettings.findOne();
            if (settings?.smsConfig) {
                apiKey = apiKey || settings.smsConfig.apiKey;
                senderId = senderId || settings.smsConfig.senderId;
            }
        }

        if (!apiKey || !senderId) {
            console.error("SMS Error: SMS_API_KEY or SMS_SENDER_ID is missing.");
            return { success: false, message: "SMS configuration missing" };
        }

        // 2. Format phone number (MRAM expects 8801XXXXXXXX)
        // Ensure it has 88 prefix if it's a BD number and doesn't have it
        let formattedContact = contact.trim().replace(/\s+/g, '');
        if (formattedContact.startsWith('01') && formattedContact.length === 11) {
            formattedContact = '88' + formattedContact;
        } else if (formattedContact.startsWith('+8801')) {
            formattedContact = formattedContact.replace('+', '');
        }

        // 3. Auto-detect type if not unicode
        let smsType = type;
        const isUnicode = /[^\u0000-\u007f]/.test(message);
        if (isUnicode) smsType = 'unicode';

        const encodedApiKey = encodeURIComponent(apiKey);
        const encodedSenderId = encodeURIComponent(senderId);
        const encodedMsg = encodeURIComponent(message);
        
        // Removed label=transactional just in case it's causing issues with 1003
        const url = `https://msg.mram.com.bd/smsapi?api_key=${encodedApiKey}&type=${smsType}&contacts=${formattedContact}&senderid=${encodedSenderId}&msg=${encodedMsg}`;

        // Log the attempt (masking API key)
        const maskedUrl = url.replace(/api_key=[^&]+/, "api_key=********");
        console.log(`[SMS] Sending to ${formattedContact}: "${message.substring(0, 20)}..." URL: ${maskedUrl}`);

        // 4. Send request
        const response = await fetch(url, { method: 'GET' });
        const result = await response.text();

        console.log("[SMS] API Response Raw:", result);

        // Handle error codes from documentation
        const errorCodeMatch = result.match(/(\d{4})/);
        if (errorCodeMatch) {
            const code = errorCodeMatch[1];
            const errorMeanings: Record<string, string> = {
                "1002": "Sender Id/Masking Not Found",
                "1003": "API Not Found",
                "1004": "SPAM Detected",
                "1005": "Internal Error",
                "1006": "Internal Error",
                "1007": "Balance Insufficient",
                "1008": "Message is empty",
                "1009": "Message Type Not Set",
                "1010": "Invalid User & Password",
                "1011": "Invalid User Id",
                "1012": "Invalid Number",
                "1013": "API limit error",
                "1014": "No matching template",
                "1015": "SMS Content Validation Fails",
                "1016": "IP address not allowed!!",
                "1019": "Sms Purpose Missing"
            };

            if (errorMeanings[code]) {
                console.error(`[SMS] Error ${code}: ${errorMeanings[code]}`);
                return { success: false, message: errorMeanings[code], code };
            }
        }
        
        return { success: true, data: result };

    } catch (error: any) {
        console.error("SMS Send Error:", error);
        return { success: false, message: error.message };
    }
}
