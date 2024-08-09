const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

// Helper function to generate QR code
async function generateQRCode(text) {
    try {
        return await QRCode.toDataURL(text);
    } catch (err) {
        throw new Error('QR Code generation failed');
    }
}

router.post('/generate-receive-qr', async (req, res, next) => {
    try {
        const { upiId, amount } = req.body;
        if (!upiId || !amount) {
            return res.json({ error: 'UPI ID and amount are required' });
        }

        const upiUrl = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`;
        const qrCode = await generateQRCode(upiUrl);
        
        res.json({ qrCode });
    } catch (error) {
        next(error);
    }
});

router.post('/generate-send-qr', async (req, res, next) => {
    try {
        const { amount } = req.body;
        if (!amount) {
            return res.json({ error: 'Amount is required' });
        }

        const upiUrl = `upi://pay?am=${amount}&cu=INR`;
        const qrCode = await generateQRCode(upiUrl);
        
        res.json({ qrCode });
    } catch (error) {
        next(error);
    }
});

module.exports = router;