// Projects data
const projects = [
    {
        title: "Sustainable Shopper",
        description: `A virtual try-on system using diffusion models to generate photorealistic images of users wearing selected clothing items.

Key Achievements:
• Achieved [95%] accuracy in clothing segmentation
• Generated [10K+] realistic try-on images
• [50ms] average processing time per image
• Served [5K+] active users

Built a FAISS & CLIP powered similarity search for sustainable alternatives with [98%] relevance score.`,
        tags: ["Diffusion Models", "PyTorch", "React", "Flask", "MongoDB", "FAISS"],
        jobTypes: ["Generative AI", "ML Engineering", "Full Stack"],
        insight: "Practical application of generative AI for e-commerce.",
        technologies: ["PyTorch", "React", "Flask", "MongoDB", "FAISS", "CLIP"],
        links: [
            { type: "github", url: "https://github.com", text: "View Code", icon: "🔗" },
            { type: "demo", url: "https://demo.com", text: "Live Demo", icon: "⚡" },
            { type: "article", url: "https://medium.com", text: "Read Article", icon: "✍️" }
        ]
    },
    {
        title: "RAG Based Chatbot",
        description: "Built an ETL pipeline scraping over 10k documents and YouTube transcripts. Fine-tuned a LLaMA model via knowledge distillation and deployed it in a Docker container.",
        tags: ["LLMs", "Hugging Face", "MongoDB", "Qdrant", "Docker"],
        jobTypes: ["Generative AI", "ML Engineering", "Data Science"],
        insight: "Fine-tuned LLM via knowledge distillation from ChatGPT."
    },
    {
        title: "Language Based Audio Retrieval",
        description: "Multimodal model for the 2024 DCASE challenge, matching natural language queries to audio files. Implemented advanced data augmentation and contrastive learning techniques.",
        tags: ["PyTorch", "Audio Encoders", "Text Encoders", "Contrastive Learning"],
        jobTypes: ["ML Engineering", "Data Science"],
        insight: "60% improvement in Mean Average Precision over baseline."
    },
    {
        title: "Sales Analysis Dashboard",
        description: "Built an interactive Tableau dashboard to visualize key metrics like revenue trends, product performance, and regional sales, enabling data-driven decision making.",
        tags: ["Tableau", "Excel", "Data Visualization"],
        jobTypes: ["Data Analyst"],
        insight: "Streamlined analysis workflow for reporting accuracy."
    },
    {
        title: "Samsung Internship Project",
        description: "Implemented SOTA object detection models (YOLO, ViT) for text localization, achieving 83% accuracy for Indic languages. Optimized the video processing pipeline for mobile devices.",
        tags: ["Object Detection", "YOLO", "Vision Transformers", "Python"],
        jobTypes: ["ML Engineering", "Data Science"],
        insight: "30% faster processing on resource-constrained devices."
    },
    {
        title: "Heart Health Monitoring Device",
        description: "A wearable device using ESP32 and an ECG sensor to detect heart anomalies with a lightweight ML model, achieving 95% accuracy and alerting users in real time via a WebSockets dashboard.",
        tags: ["ESP32", "IoT", "Machine Learning", "WebSockets"],
        jobTypes: ["Software Engineer", "IoT"],
        insight: "Achieved 95% accuracy with a lightweight on-device model."
    }
];

