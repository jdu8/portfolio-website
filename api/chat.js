// Vercel Serverless Function - AI Chat with Gemini API
const https = require('https');

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an AI assistant for Ishan Yadav's portfolio website. Your role is to help visitors learn about Ishan's background, skills, projects, and experience in a friendly and professional manner.

Key Information:
- Ishan is a Computer Science graduate student at NYU
- Former Samsung Research intern focused on computer vision and generative AI
- Specializes in machine learning, deep learning, NLP, and autonomous systems
- Experienced with Python, TensorFlow, PyTorch, React, and various ML frameworks
- Has worked on projects including LLMs, computer vision, autonomous vehicles, and full-stack development
- Graduated from VIT Vellore before joining NYU

Guidelines:
- Be conversational, helpful, and enthusiastic about Ishan's work
- Keep responses concise (2-4 sentences unless more detail is requested)
- If asked about specific projects or experience, provide relevant details
- If you don't know something specific, admit it and suggest they contact Ishan directly
- Encourage visitors to explore the portfolio sections (Experience, Projects, Skills, etc.)
- Use a friendly, professional tone that matches the modern, tech-forward aesthetic of the portfolio

Remember: You're here to showcase Ishan's expertise and help visitors understand his qualifications and interests!`;

module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, conversationHistory } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        // Build conversation context
        const contents = [];

        // Add system instruction as the first user message
        contents.push({
            role: 'user',
            parts: [{ text: SYSTEM_PROMPT }]
        });
        contents.push({
            role: 'model',
            parts: [{ text: "Understood! I'm ready to help visitors learn about Ishan's background and work." }]
        });

        // Add conversation history (limit to last 10 messages to avoid token limits)
        if (conversationHistory && Array.isArray(conversationHistory)) {
            const recentHistory = conversationHistory.slice(-10);
            recentHistory.forEach(msg => {
                if (msg.role === 'user') {
                    contents.push({
                        role: 'user',
                        parts: [{ text: msg.content }]
                    });
                } else if (msg.role === 'assistant') {
                    contents.push({
                        role: 'model',
                        parts: [{ text: msg.content }]
                    });
                }
            });
        }

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Prepare request payload
        const payload = JSON.stringify({
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 500
            }
        });

        // Make request to Gemini API
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

        const response = await new Promise((resolve, reject) => {
            const urlObj = new URL(apiUrl);
            const options = {
                hostname: urlObj.hostname,
                path: urlObj.pathname + urlObj.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload)
                }
            };

            const apiReq = https.request(options, (apiRes) => {
                let data = '';

                apiRes.on('data', (chunk) => {
                    data += chunk;
                });

                apiRes.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve({ statusCode: apiRes.statusCode, data: jsonData });
                    } catch (error) {
                        reject(new Error('Failed to parse API response'));
                    }
                });
            });

            apiReq.on('error', (error) => {
                reject(error);
            });

            apiReq.write(payload);
            apiReq.end();
        });

        if (response.statusCode !== 200) {
            console.error('Gemini API error:', response.data);
            return res.status(response.statusCode).json({
                error: 'Failed to generate response',
                details: response.data
            });
        }

        // Extract the response text
        const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            return res.status(500).json({ error: 'No response generated' });
        }

        return res.status(200).json({
            response: aiResponse
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};
