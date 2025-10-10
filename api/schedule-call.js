// Vercel Serverless Function - Schedule Call Request via Resend
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, duration, date, time } = req.body;

    // Validate input
    if (!name || !email || !duration || !date || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Format the datetime nicely
        const dateObj = new Date(`${date}T${time}`);
        const formattedDateTime = dateObj.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });

        // Send email to you (notification)
        await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: [process.env.YOUR_EMAIL],
            replyTo: email,
            subject: `Portfolio: Call Request from ${name}`,
            html: `
                <h2>New Call Request</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Duration:</strong> ${duration}</p>
                <p><strong>Preferred Time:</strong> ${formattedDateTime}</p>
                <hr>
                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>Reply to this email to confirm or suggest alternative times</li>
                    <li>Or send a calendar invite directly to ${email}</li>
                </ul>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    Sent from your portfolio website contact form
                </p>
            `
        });

        // Send confirmation to user
        await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: [email],
            subject: 'Call Request Received',
            html: `
                <h2>Thanks for reaching out, ${name}!</h2>
                <p>I've received your request to schedule a call.</p>

                <h3>Details:</h3>
                <ul>
                    <li><strong>Duration:</strong> ${duration}</li>
                    <li><strong>Preferred Time:</strong> ${formattedDateTime}</li>
                </ul>

                <p>I'll review your request and send you a calendar invite or suggest alternative times within 24 hours.</p>

                <p>Looking forward to connecting!</p>

                <hr>
                <p style="color: #666; font-size: 12px;">
                    This is an automated confirmation from the portfolio website
                </p>
            `
        });

        return res.status(200).json({
            success: true,
            message: 'Call request sent successfully'
        });
    } catch (error) {
        console.error('Error scheduling call:', error);
        return res.status(500).json({
            error: 'Failed to schedule call',
            details: error.message
        });
    }
}
