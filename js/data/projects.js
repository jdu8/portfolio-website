// Projects data
const projects = [
    {
        title: "Sustainable Shopper",
        description: `A virtual try-on system using diffusion models that generates photorealistic images of users wearing selected clothing items.

Key Achievements:
• Developed virtual try-on system using [diffusion models] for photorealistic image generation
• Implemented [FAISS] vector database with [CLIP] embeddings for similarity search
• Built [ETL pipeline] to collect and process fashion data from multiple sources
• Designed [ChatGPT-based] wardrobe assistant for outfit suggestions

The system matches user input images with visually similar sustainable alternatives, optimizing for both accuracy and query speed. The wardrobe assistant provides daily outfit suggestions based on user wardrobe, occasion, and weather, and identifies wardrobe gaps.`,
        tags: ["Diffusion Models", "PyTorch", "React", "Flask", "MongoDB", "FAISS", "CLIP", "ChatGPT API"],
        jobTypes: ["Generative AI", "ML Engineering", "Full Stack"],
        insight: "Practical application of generative AI for real-world e-commerce problems.",
        technologies: ["PyTorch", "React", "Flask", "MongoDB", "FAISS", "CLIP", "Diffusion Models"],
        links: []
    },
    {
        title: "RAG Based Chatbot",
        description: `An intelligent chatbot built with retrieval-augmented generation (RAG) architecture and fine-tuned LLM.

Key Achievements:
• Built [ETL pipeline] that scraped over [10,000] documentation pages and YouTube transcripts
• Stored data in [MongoDB] with embeddings in [Qdrant] vector database
• [Fine-tuned LLAMA] via knowledge distillation from ChatGPT
• Containerized with [Docker] and deployed as web application

The system combines efficient data retrieval with advanced language generation to provide accurate, context-aware responses.`,
        tags: ["LLMs", "Hugging Face", "MongoDB", "Qdrant", "Docker", "RAG", "LLAMA"],
        jobTypes: ["Generative AI", "ML Engineering", "Full Stack"],
        insight: "Fine-tuned LLM via knowledge distillation from ChatGPT.",
        technologies: ["LLAMA", "MongoDB", "Qdrant", "Docker", "Hugging Face"],
        links: []
    },
    {
        title: "Language Based Audio Retrieval",
        description: `A multimodal model ensemble for the 2024 DCASE challenge that matches natural language queries with relevant audio files.

Key Achievements:
• Built multimodal ensemble combining [BEAT/PaSSt] audio encoders with [BERT/RoBERTa/BGE] text encoders
• Implemented data augmentation using [GPT] and language translation-retranslation
• Achieved [60%] improvement in Mean Average Precision vs baseline
• Experimented with advanced contrastive learning ([InfoNCE] and [n-LTM] loss functions)

The system demonstrates effective cross-modal learning between audio and text domains.`,
        tags: ["PyTorch", "Audio Encoders", "Text Encoders", "Contrastive Learning", "BERT", "RoBERTa"],
        jobTypes: ["ML Engineering", "Research"],
        insight: "60% improvement in Mean Average Precision over baseline methods.",
        technologies: ["PyTorch", "BEAT", "PaSSt", "BERT", "RoBERTa", "BGE"],
        links: []
    },
    {
        title: "Sales Analysis Dashboard",
        description: `An interactive Tableau dashboard for comprehensive sales analytics and business intelligence.

Key Achievements:
• Built interactive dashboard visualizing [revenue trends], [product performance], and [regional sales]
• Utilized [Excel] for data cleaning, transformation, and integration
• Enabled [data-driven decision making] through intuitive visualizations
• Streamlined analysis workflow improving [reporting accuracy] and [efficiency]

The dashboard provides actionable insights for business stakeholders through clean, interactive visualizations.`,
        tags: ["Tableau", "Excel", "Data Visualization", "Business Intelligence"],
        jobTypes: ["Data Analyst", "Business Intelligence"],
        insight: "Streamlined analysis workflow for improved reporting accuracy.",
        technologies: ["Tableau", "Excel"],
        links: []
    },
    {
        title: "Heart Health Monitoring Device",
        description: `A wearable IoT device for real-time heart health monitoring using ML for anomaly detection.

Key Achievements:
• Developed wearable using [ESP32] and [3-lead ECG sensor] for heart anomaly detection
• Achieved [95%] accuracy with lightweight ML model
• Implemented [real-time alerts] for detected anomalies
• Built [WebSockets dashboard] for real-time heartbeat visualization and calorie tracking

The system demonstrates practical application of edge ML for healthcare monitoring.`,
        tags: ["ESP32", "IoT", "Machine Learning", "WebSockets", "ECG Sensor", "Edge ML"],
        jobTypes: ["IoT", "ML Engineering", "Hardware"],
        insight: "Achieved 95% accuracy with lightweight on-device ML model.",
        technologies: ["ESP32", "WebSockets", "Machine Learning", "ECG Sensor"],
        links: []
    },
    {
        title: "Samsung - Text Detection System",
        description: `An advanced text localization and detection system for mobile devices developed during internship at Samsung.

Key Achievements:
• Implemented [SOTA] object detection architectures ([YOLO], [Vision Transformers], [RCNN])
• Achieved [83%] accuracy for Indic languages and [89%] for English text recognition
• Engineered [corpus-based autocorrect] algorithm for low-confidence scenarios
• Optimized video processing through [multi-resolution processing] and [neural network pruning]
• Achieved [30%] faster processing without sacrificing accuracy

The system was optimized for deployment on resource-constrained mobile devices through innovative multi-resolution processing and model compression techniques.`,
        tags: ["Object Detection", "YOLO", "Vision Transformers", "RCNN", "Computer Vision", "Model Optimization"],
        jobTypes: ["ML Engineering", "Computer Vision", "Mobile ML"],
        insight: "30% faster processing on resource-constrained devices through optimization.",
        technologies: ["YOLO", "Vision Transformers", "RCNN", "PyTorch", "OpenCV"],
        links: []
    },
    {
        title: "Team Ardra - Autonomous UAV Navigation",
        description: `An advanced hybrid path planning system for autonomous UAV navigation combining traditional algorithms with reinforcement learning.

Key Achievements:
• Developed hybrid algorithm combining [rules-based system] with [DQN reinforcement learning]
• Integrated [GPS], [Lidar], and [camera data] for intelligent obstacle avoidance
• Achieved [18%] reduction in path length and [30%] decrease in false collision detections
• Automated environment setup with [randomized generator], reducing setup time from [1 hour to 5 minutes]
• Directed creation of flight demos and interactive games, leading to [40%] increase in team applications

The system intelligently combines multiple sensor inputs with learned behaviors for robust autonomous navigation.`,
        tags: ["Reinforcement Learning", "DQN", "Computer Vision", "Path Planning", "Robotics", "Lidar"],
        jobTypes: ["ML Engineering", "Robotics", "Computer Vision"],
        insight: "18% reduction in path length through hybrid RL and traditional planning.",
        technologies: ["Python", "DQN", "Lidar", "GPS", "Computer Vision", "ROS"],
        links: []
    }
];
