// Vercel Serverless Function - Send Message via Resend
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Send email using Resend
        const data = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>', // Use verified domain or onboarding
            to: [process.env.YOUR_EMAIL],
            replyTo: email,
            subject: `Portfolio Contact: Message from ${name}`,
            html: `
                <h2>New Contact Message</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    Sent from your portfolio website contact form
                </p>
            `
        });

        return res.status(200).json({
            success: true,
            messageId: data.id
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            error: 'Failed to send message',
            details: error.message
        });
    }
}
