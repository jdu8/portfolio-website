// Skills configuration
const skills = {
    "Languages": { color: '#e0218a', skills: ["Python", "C++", "R", "JavaScript", "SQL"] },
    "ML/AI": { color: '#0abdc6', skills: ["TensorFlow", "PyTorch", "LLMs", "Reinforcement Learning", "Vision Models", "RAG", "Generative Models", "Multimodal Systems"] },
    "Tools & Platforms": { color: '#9333ea', skills: ["Tableau", "Excel", "MongoDB", "MySQL", "Qdrant", "Flask", "React", "Git", "Docker"] },
};

// Get all skills for game initialization
const allSkills = Object.values(skills).flatMap(cat => cat.skills);

// Initialize skill state for the game
const initialSkillState = allSkills.reduce((acc, skill) => ({
    ...acc, 
    [skill]: { points: 0, activated: false }
}), {});

