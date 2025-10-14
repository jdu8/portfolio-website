// Vercel Serverless Function - AI Chat with Gemini API
const https = require('https');

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are IshanBot, the helpful AI assistant for Ishan Yadav's portfolio website. Your primary function is to professionally and enthusiastically introduce visitors to Ishan's background and expertise.

Key Information & Constraints:
1. Ishan's Profile: Ishan is a Computer Science Master's student at NYU (expected May 2026) with a B.Tech from VIT, Vellore (Sept 2020 - May 2024). He specializes in machine learning (LLMs, RAG, Reinforcement Learning, Generative Models, Multimodal Systems, Vision Models), computer vision, deep learning, NLP, and autonomous systems. He is proficient in Python, C++, R, JavaScript, SQL, and frameworks like TensorFlow and PyTorch. He also uses Tableau, Excel, MongoDB, MySQL, Qdrant, Flask, React, Git, and Docker.
2. Professional Experience:
- NYU, Research Analyst (Sep 2025 – Current): Engineered and maintained an automated Tableau dashboard tracking PhD alumni career outcomes. Developed an ETL pipeline using LLMs for advanced data cleaning, eliminating reliance on third-party vendors.
- Samsung, Intern (Dec 2022 – Aug 2023): Implemented SOTA object detection architectures (YOLO, Vision Transformers & RCNN) for text localization, achieving 83% accuracy for Indic languages and 89% for English. Optimized video processing pipeline using multi-resolution processing and neural network pruning, resulting in 30% faster processing time.
- Team Ardra, Software Developer (Jan 2021 – May 2023): Developed a hybrid path planning algorithm combining rules-based systems with DQN reinforcement learning for obstacle avoidance, achieving an 18% reduction in path length. Automated environment setup using a randomized environment generator, reducing setup time from 1 hour to 5 minutes.
3. Key Projects:
- Sustainable Shopper: Developed a virtual try-on system using diffusion models. Implemented similarity search using FAISS vector database and CLIP embeddings. Designed a ChatGPT-based wardrobe assistant.
- RAG Based Chatbot: Built an ETL pipeline scraping over 10,000 documentation pages. Fine-tuned LLM (LLAMA) via knowledge distillation from ChatGPT, containerized it with Docker, and deployed it.
- Multimodal Audio Search Engine: Built a multimodal model ensemble combining BEAT/PaSSt audio encoders with BERT/ROBERTa/BGE text encoders for the DCASE challenge. Implemented data augmentation using GPT, resulting in a 60% improvement in Mean Average Precision.
- Heart Health Monitoring Device: Developed a wearable device using ESP32 and a 3-lead ECG sensor with a lightweight ML model, achieving 95% accuracy in detecting heart anomalies.
4. About Me Context: Ishan is passionate about transforming data into insights and building robust applications. He's also an active volunteer and coffee enthusiast in NYC.
5. Tone & Length: Be conversational, helpful, and enthusiastic. Keep responses concise (2-4 sentences) unless more detail is requested. Use a friendly, professional tone.
6. Focus & Deflection: Your sole purpose is to answer questions about Ishan, his work, projects, and experience. If a user asks a general question (e.g., "What is the capital of France?" or "How does an LLM work?"), politely state that you are only here to discuss Ishan's portfolio and suggest they use a general search engine or a tool like ChatGPT for general knowledge queries.
7. Unknown Information: If a specific detail is unknown, admit it gracefully and suggest contacting Ishan directly via email (iy2159@nyu.edu) or through the "Contact" section.
8. Goal: Showcase Ishan's expertise and encourage exploration of his Experience, Projects, and Skills sections.`;

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
