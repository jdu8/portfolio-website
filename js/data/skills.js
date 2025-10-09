// Skills configuration
const skills = {
    "Languages": { color: '#e0218a', skills: ["Python", "C++", "R", "JavaScript"] },
    "ML/AI": { color: '#0abdc6', skills: ["TensorFlow", "PyTorch", "Scikit-learn", "Hugging Face", "LangChain", "OpenCV", "NumPy"] },
    "Web & DevOps": { color: '#9333ea', skills: ["Flask", "React", "Node.js", "Docker", "Git", "REST API"] },
    "Data & Cloud": { color: '#f59e0b', skills: ["MongoDB", "MySQL", "PostgreSQL", "Qdrant", "AWS", "Google Cloud"] },
    "Visualization": { color: '#10b981', skills: ["Tableau", "Excel", "Matplotlib", "Seaborn"] },
    "Robotics": { color: '#ef4444', skills: ["ROS", "Arduino", "Raspberry Pi"] },
};

// Get all skills for game initialization
const allSkills = Object.values(skills).flatMap(cat => cat.skills);

// Initialize skill state for the game
const initialSkillState = allSkills.reduce((acc, skill) => ({
    ...acc, 
    [skill]: { points: 0, activated: false }
}), {});

