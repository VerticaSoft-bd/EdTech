const jwt = require('jsonwebtoken');
const { jwtVerify } = require('jose');

const secret = 'mysecret';
const encodedSecret = new TextEncoder().encode(secret);

async function test() {
    // Simulate what login/route.ts does
    const mongooseId = { toString: () => '64f8e1234567890abcdef123', toJSON: () => '64f8e1234567890abcdef123' };
    const token = jwt.sign({ id: mongooseId, role: 'student' }, secret);
    console.log('Token signed by jsonwebtoken');

    try {
        // Simulate what middleware/lib auth does
        const { payload } = await jwtVerify(token, encodedSecret);
        console.log('Payload verified by jose:', payload);
        console.log('Payload.id type:', typeof payload.id);
    } catch (err) {
        console.error('Jose verification failed:', err);
    }
}

test();
