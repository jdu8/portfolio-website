// Projects data
const projects = [
    {
        title: "Sustainable Shopper",
        description: `A Flask-based digital wardrobe manager with AI-powered virtual try-on using Fashn.ai diffusion models, outfit recommendations based on weather and occasion, and CLIP-based similarity search for sustainable fashion alternatives.

Key Features:
- Integrated [Fashn.ai API] for photorealistic virtual try-on image generation
- Built [GPT-4] powered outfit suggestions using wardrobe items, weather data, and occasion context
- Implemented [CLIP model] visual similarity search to find sustainable clothing alternatives
- Developed [JWT-secured REST API] with MongoDB for wardrobe management and user authentication
- Created [React frontend] with Flask backend serving [real-time weather integration]

Promotes sustainable fashion by helping users maximize existing wardrobe and discover eco-friendly alternatives.`,
        tags: ["Flask", "React", "GPT-4", "CLIP", "MongoDB", "Fashn.ai"],
        jobTypes: ["Generative AI", "Full Stack", "ML Engineering"],
        insight: "AI-driven sustainable fashion through virtual try-on and smart outfit recommendations.",
        links: [
            { type: "github", url: "https://github.com/jdu8/sustainable-shopper", text: "View Code", icon: "🔗" }
        ]
    },
    {
        title: "AI Coding Agents Under Pressure",
        description: `A research study investigating how developer interaction styles affect the behavior, performance, and code structure of AI coding agents (Claude, Gemini, GPT). Published full experimental report analyzing emotional resilience in AI systems.

Key Findings:
- Tested [3 AI models] (Claude, Gemini, GPT) under [3 sentiment conditions] (neutral, encouraging, hostile)
- Discovered [132% increase] in Gemini reasoning token usage under hostile conditions
- Found Gemini/GPT [increased code volume] when pressured, while Claude became [more concise]
- Analyzed [architectural patterns] showing defensive coding and over-engineering under stress
- Conducted [two-phase study]: creative development (Space Invaders) and algorithmic persistence

Demonstrates that developer sentiment significantly alters AI architectural output and problem-solving approaches.`,
        tags: ["Research", "AI Systems", "Python", "Experimental Design", "Comparative Analysis"],
        jobTypes: ["Research", "ML Engineering", "AI Safety"],
        insight: "Developer emotional tone is a meaningful input that fundamentally shapes AI coding behavior.",
        links: [
            { type: "github", url: "https://github.com/jdu8/AI-Coding-Agents-Comparison", text: "View Code", icon: "🔗" },
            { type: "paper", url: "https://github.com/jdu8/AI-Coding-Agents-Comparison/blob/main/report.pdf", text: "Read Report", icon: "📄" }
        ]
    },
    {
        title: "Multi-Agent RAG System",
        description: `A sophisticated code question-answering system featuring four specialized agents for complex query handling. Achieves 1.12x improvement over standard retrieval baselines on the BRIGHT benchmark through multi-hop decomposition and verification.

Technical Architecture:
- Built [4-agent pipeline]: QueryAnalyzer, Retriever, Generator (Qwen2.5-3B), and Verifier
- Achieved [43.8% Recall@10] on LeetCode/StackOverflow benchmark ([1.12x baseline improvement])
- Implemented [multi-hop query decomposition] with Flan-T5 reformulation for complex questions
- Deployed [Qwen2.5-3B] with [4-bit quantization] for memory-efficient generation on [6GB VRAM]
- Integrated [hallucination detection] layer with [49.1% confidence] and [44.4% detection rate]

Uses MongoDB for document storage, Qdrant for vector search, and all-mpnet-base-v2 for embeddings.`,
        tags: ["RAG", "Multi-Agent", "Qwen", "Qdrant", "PyTorch", "MongoDB"],
        jobTypes: ["Generative AI", "ML Engineering", "Research"],
        insight: "Multi-agent architecture with verification outperforms monolithic RAG by 12% on complex queries.",
        links: [
            { type: "github", url: "https://github.com/RiyamPatel2001/Multi-Agent-RAG", text: "View Code", icon: "🔗" }
        ]
    },
    {
        title: "Audio-Text Retrieval System",
        description: `A deep learning bi-modal retrieval system that finds audio files based on natural language queries. Trained multiple encoder architectures (CRNN, TCN, Spec2Vec, BEATs) with contrastive learning on the Clotho v2 dataset.

Key Achievements:
- Implemented [4 encoder architectures] including CRNN, TCN, Spec2Vec, and CNN+BEATs
- Achieved [R@10: 0.470] retrieval accuracy using BEATs encoder with InfoNCE loss
- Developed [multiscale Mel spectrograms] to capture both short and long audio events
- Evaluated [3 loss functions] (InfoNCE, VicReg, Cosine) across all architectures
- Trained on [6,974 audio samples] with [34,870 captions] from Clotho v2 dataset

Bi-encoder architecture with separate audio and text branches using Sentence-BERT for text encoding.`,
        tags: ["PyTorch", "Audio Processing", "Contrastive Learning", "CRNN", "BEATs"],
        jobTypes: ["ML Engineering", "Data Science"],
        insight: "BEATs pretrained alignment with language proved most effective for audio-text matching.",
        links: [
            { type: "github", url: "https://github.com/jdu8/Audio-Text-Retrieval-System", text: "View Code", icon: "🔗" }
        ]
    },
    {
        title: "Heart Health Monitoring System",
        description: `An ESP32-based wearable ECG monitoring system with on-device machine learning for real-time cardiac anomaly detection. Features web dashboard, buzzer alerts, and calorie tracking based on heart rate analysis.

Technical Implementation:
- Deployed [SVM model] on ESP32 achieving [94.87% accuracy] for anomaly detection
- Processed [AD8232 ECG sensor] signals in real-time with embedded feature extraction
- Evaluated [5 ML models] (Logistic Regression, Random Forest, SVM, Gradient Boosting, Neural Network)
- Selected SVM over [96.51% accurate] Neural Network for [efficient memory usage] on microcontroller
- Built [web interface] for real-time ECG waveform visualization and monitoring

Implements 3-lead ECG configuration with automatic heart rate calculation and calorie expenditure estimation.`,
        tags: ["ESP32", "IoT", "SVM", "C++", "Embedded ML", "Web Dashboard"],
        jobTypes: ["IoT", "ML Engineering", "Embedded Systems"],
        insight: "SVM offers optimal accuracy-efficiency tradeoff for resource-constrained embedded ML.",
        links: [
            { type: "github", url: "https://github.com/jdu8/Heart-Health-Monitoring-System", text: "View Code", icon: "🔗" }
        ]
    },
    {
        title: "Portfolio Website",
        description: `An interactive cyberpunk-themed portfolio featuring a fully playable Breakout game built with Canvas API, AI chatbot powered by Gemini, and animated circuit board background with pathfinding algorithms.

Key Features:
- Built a complete [Breakout game] with multi-ball physics, power-ups, and collision detection
- Integrated [Gemini 2.0 Flash] API chatbot with conversation history and rate limiting
- Implemented [BFS pathfinding] for animated circuit signals across canvas grid
- Created [50+ CSS keyframes] for section transitions, glitch effects, and micro-interactions
- Developed [serverless API] endpoints using Vercel Functions and Resend email service

Zero-build architecture using React via CDN with [60 FPS] Canvas animations and [localStorage] persistence.`,
        tags: ["React", "Canvas API", "Gemini AI", "Tailwind CSS", "Vercel", "JavaScript"],
        jobTypes: ["Full Stack", "Software Engineer", "Generative AI"],
        insight: "No build system required—React runs in-browser via CDN with CDN-based Babel transpilation.",
        links: [
            { type: "github", url: "https://github.com/jdu8/portfolio-website", text: "View Code", icon: "🔗" },
            { type: "demo", url: "https://ishanyadav.vercel.app/", text: "Live Demo", icon: "⚡" }
        ]
    }
];