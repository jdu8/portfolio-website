// Projects data
const projects = [
    {
        title: "Sustainable Shopper",
        description: `A Flask-based digital wardrobe manager with AI-powered virtual try-on using Fashn.ai diffusion models, outfit recommendations based on weather and occasion, and CLIP-based similarity search for sustainable fashion alternatives.

Key Features:
• Integrated [Fashn.ai API] for photorealistic virtual try-on image generation
• Built [GPT-4] powered outfit suggestions using wardrobe items, weather data, and occasion context
• Implemented [CLIP model] visual similarity search to find sustainable clothing alternatives
• Developed [JWT-secured REST API] with MongoDB for wardrobe management and user authentication
• Created [React frontend] with Flask backend serving [real-time weather integration]

Promotes sustainable fashion by helping users maximize existing wardrobe and discover eco-friendly alternatives.`,
        tags: ["Flask", "React", "GPT-4", "CLIP", "MongoDB", "Fashn.ai"],
        jobTypes: ["Generative AI", "Full Stack", "ML Engineering"],
        insight: "AI-driven sustainable fashion through virtual try-on and smart outfit recommendations.",
        links: [
            { type: "github", url: "https://github.com/jdu8/sustainable-shopper", text: "View Code", icon: "🔗" }
        ]
    },
    {
        title: "Audio-Text Retrieval System",
        description: `A deep learning bi-modal retrieval system that finds audio files based on natural language queries. Trained multiple encoder architectures (CRNN, TCN, Spec2Vec, BEATs) with contrastive learning on the Clotho v2 dataset.

Key Achievements:
• Implemented [4 encoder architectures] including CRNN, TCN, Spec2Vec, and CNN+BEATs
• Achieved [R@10: 0.470] retrieval accuracy using BEATs encoder with InfoNCE loss
• Developed [multiscale Mel spectrograms] to capture both short and long audio events
• Evaluated [3 loss functions] (InfoNCE, VicReg, Cosine) across all architectures
• Trained on [6,974 audio samples] with [34,870 captions] from Clotho v2 dataset

Bi-encoder architecture with separate audio and text branches using Sentence-BERT for text encoding.`,
        tags: ["PyTorch", "Audio Processing", "Contrastive Learning", "CRNN", "BEATs"],
        jobTypes: ["ML Engineering", "Data Science"],
        insight: "BEATs pretrained alignment with language proved most effective for audio-text matching.",
        links: [
            { type: "github", url: "https://github.com/jdu8/Audio-Text-Retrieval-System", text: "View Code", icon: "🔗" }
        ]
    },
    {
        title: "ROS2 RAG System",
        description: `A production-ready Retrieval-Augmented Generation system for ROS2 robotics development. Features dual LLM architecture with fine-tuned Llama 2 (LoRA), Qdrant vector search, and multi-source knowledge ingestion from GitHub and video transcripts.

Technical Implementation:
• Built [ETL pipeline] crawling [10,000+ chunks] from ros2_documentation, navigation2, and demos repos
• Deployed [Qdrant vector database] with sentence-transformers for [<100ms] similarity search latency
• Fine-tuned [Llama 2 7B] using LoRA with 4-bit quantization for ROS2-specific knowledge
• Implemented [dual inference] modes: local Ollama and HuggingFace with GPU offloading
• Dockerized [microservices architecture] with MongoDB, Gradio UI, and RESTful API

Achieves [<2s response time] with [0.7+ cosine similarity] retrieval threshold for high-quality context.`,
        tags: ["RAG", "Llama 2", "Qdrant", "Docker", "PyTorch", "ROS2"],
        jobTypes: ["Generative AI", "ML Engineering", "Robotics"],
        insight: "LoRA fine-tuning enables domain-specific LLM adaptation with minimal computational overhead.",
        links: [
            { type: "github", url: "https://github.com/jdu8/ROS2-Retrieval-Augmented-Generation-RAG-System", text: "View Code", icon: "🔗" }
        ]
    },
    {
        title: "Portfolio Website",
        description: `An interactive cyberpunk-themed portfolio featuring a fully playable Breakout game built with Canvas API, AI chatbot powered by Gemini, and animated circuit board background with pathfinding algorithms.

Key Features:
• Built a complete [Breakout game] with multi-ball physics, power-ups, and collision detection
• Integrated [Gemini 2.0 Flash] API chatbot with conversation history and rate limiting
• Implemented [BFS pathfinding] for animated circuit signals across canvas grid
• Created [50+ CSS keyframes] for section transitions, glitch effects, and micro-interactions
• Developed [serverless API] endpoints using Vercel Functions and Resend email service

Zero-build architecture using React via CDN with [60 FPS] Canvas animations and [localStorage] persistence.`,
        tags: ["React", "Canvas API", "Gemini AI", "Tailwind CSS", "Vercel", "JavaScript"],
        jobTypes: ["Full Stack", "Software Engineer", "Generative AI"],
        insight: "No build system required—React runs in-browser via CDN with CDN-based Babel transpilation.",
        links: [
            { type: "github", url: "https://github.com/jdu8/portfolio-website", text: "View Code", icon: "🔗" },
            { type: "demo", url: "https://ishanyadav.vercel.app/", text: "Live Demo", icon: "⚡" }
        ]
    },
    {
        title: "Heart Health Monitoring System",
        description: `An ESP32-based wearable ECG monitoring system with on-device machine learning for real-time cardiac anomaly detection. Features web dashboard, buzzer alerts, and calorie tracking based on heart rate analysis.

Technical Implementation:
• Deployed [SVM model] on ESP32 achieving [94.87%] accuracy for anomaly detection
• Processed [AD8232 ECG sensor] signals in real-time with embedded feature extraction
• Evaluated [5 ML models] (Logistic Regression, Random Forest, SVM, Gradient Boosting, Neural Network)
• Selected SVM over [96.51% accurate] Neural Network for [efficient memory usage] on microcontroller
• Built [web interface] for real-time ECG waveform visualization and monitoring

Implements 3-lead ECG configuration with automatic heart rate calculation and calorie expenditure estimation.`,
        tags: ["ESP32", "IoT", "SVM", "C++", "Embedded ML", "Web Dashboard"],
        jobTypes: ["IoT", "ML Engineering", "Embedded Systems"],
        insight: "SVM offers optimal accuracy-efficiency tradeoff for resource-constrained embedded ML.",
        links: [
            { type: "github", url: "https://github.com/jdu8/Heart-Health-Monitoring-System", text: "View Code", icon: "🔗" }
        ]
    },
    {
        title: "Sales Analysis Dashboard",
        description: "Built an interactive Tableau dashboard to visualize key metrics like revenue trends, product performance, and regional sales, enabling data-driven decision making. Streamlined analysis workflow for [improved] reporting accuracy.",
        tags: ["Tableau", "Excel", "Data Visualization"],
        jobTypes: ["Data Analyst"],
        insight: "Streamlined analysis workflow for reporting accuracy."
    }
];
