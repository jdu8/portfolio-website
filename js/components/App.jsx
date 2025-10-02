// Main App Component
function App() {
    const [isGameActive, setGameActive] = React.useState(false);
    const [skillState, setSkillState] = React.useState(initialSkillState);
    const [showScrollPrompt, setShowScrollPrompt] = React.useState(false);
    const [projectFilter, setProjectFilter] = React.useState('All');
    const [activeSection, setActiveSection] = React.useState('home');

    const jobTypes = ['All', ...new Set(projects.flatMap(p => p.jobTypes))];
    const filteredProjects = projectFilter === 'All' ? projects : projects.filter(p => p.jobTypes.includes(projectFilter));

    // Scroll detection for active section based on headline visibility
    React.useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
            const viewportHeight = window.innerHeight;
            const scrollPosition = window.scrollY;
            
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top;
                    const elementBottom = rect.bottom;
                    
                    // Check if the headline area (top portion of section) is visible in viewport
                    // Headlines typically appear in the first 150px of each section
                    const headlineAreaTop = elementTop;
                    const headlineAreaBottom = elementTop + 150;
                    const viewportCenter = viewportHeight * 0.5;
                    
                    const headlineAreaVisible = headlineAreaTop < viewportCenter && headlineAreaBottom > viewportHeight * 0.3;
                    
                    if (headlineAreaVisible) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handlePointUpdate = (skill, points) => {
        setSkillState(prev => {
            if (!prev[skill]) return prev;
            const newPoints = prev[skill].points + points;
            const isActivated = newPoints >= 5;
            const newState = { ...prev, [skill]: { points: newPoints, activated: isActivated } };
            const allActivated = Object.values(newState).every(s => s.activated);
            if (allActivated && isGameActive) {
                // The game component will handle its own win state display
            }
            return newState;
        });
    };

    const handleActivateAll = () => {
        setSkillState(prev => {
            const newState = { ...prev };
            for (const skill in newState) { 
                newState[skill] = { points: 5, activated: true }; 
            }
            return newState;
        });
        setGameActive(false);
    };

    const handleGameEnd = (isWin) => {
        if (isWin) {
            handleActivateAll();
        } else {
            setGameActive(false);
        }
    };

    return (
        <div>
            <CircuitBoardAnimation />
            <Header navLinks={navLinks} onAnimationComplete={() => setShowScrollPrompt(true)} />
            <main className="relative z-10">
                <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
                     <div className="container mx-auto px-6 md:px-10 relative z-10">
                        <div className="max-w-3xl">
                            <AnimatedText text={userData.name} />
                            <h2 className="text-2xl md:text-4xl font-bold text-glow mb-6">{userData.title}</h2>
                            <p className="text-lg text-gray-300 max-w-xl mb-8">{userData.tagline}</p>
                            <a href="#projects" className="inline-block bg-[var(--secondary)] text-white font-bold px-6 py-3 rounded-md button-glow">View My Work</a>
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 w-full transition-all duration-500 z-10 ${showScrollPrompt ? 'bottom-10' : 'bottom-0'}`}>
                        <div className={`transition-all duration-500 ${showScrollPrompt ? 'mb-16' : 'mb-0'}`}>
                            <InteractiveTicker items={cvHighlights} />
                        </div>
                        <a href="#about" className={`absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500 transform ${showScrollPrompt ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <span className="font-mono text-sm text-[var(--secondary)]">Scroll</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--secondary)] bouncy-arrow">
                                <path d="M12 5v14M19 12l-7 7-7-7"/>
                            </svg>
                        </a>
                    </div>
                </section>
                <div className="container mx-auto px-6 md:px-10 relative z-10">
                    <section id="about" className="py-24">
                       <h2 className={`text-3xl font-bold text-white mb-8 glitch-hover ${activeSection === 'about' ? 'section-glow' : ''}`}>About Me</h2>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                            <div className="md:col-span-2 text-lg text-gray-300 space-y-4">
                                <p>{userData.bio}</p>
                                <p>When not at the keyboard, I'm exploring NYC, hunting for the best coffee, or contributing to open-source projects.</p>
                            </div>
                            <div className="flex justify-center">
                                <Logo size="w-52 h-52"/>
                            </div>
                        </div>
                    </section>
                    <section id="experience" className="py-24">
                       <h2 className={`text-3xl font-bold text-white mb-12 glitch-hover ${activeSection === 'experience' ? 'section-glow' : ''}`}>Career Trajectory</h2>
                       <div className="max-w-3xl mx-auto">
                            <div className="relative border-l-2 border-[var(--bg-medium)]">
                                {experience.map((job, index) => (
                                    <div key={index} className="mb-10 ml-6">
                                        <span className="absolute flex items-center justify-center w-4 h-4 bg-[var(--secondary)] rounded-full -left-2 ring-4 ring-[var(--bg-dark)]"></span>
                                        <h3 className="flex items-center mb-1 text-xl font-semibold text-white">{job.role} <span className="text-[var(--primary)] text-sm font-medium ml-3">@ {job.company}</span></h3>
                                        <time className="block mb-2 text-sm font-normal leading-none text-gray-500">{job.date}</time>
                                        <p className="text-gray-400">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="skills" className="py-24">
                       <h2 className={`text-3xl font-bold text-white mb-8 glitch-hover ${activeSection === 'skills' ? 'section-glow' : ''}`}>Skillset Matrix</h2>
                       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                           {Object.entries(skills).map(([category, data]) => 
                                data.skills.map(skill => (
                                    <div 
                                        key={skill} 
                                        className={`flex flex-col items-center justify-center text-center p-4 bg-[var(--bg-medium)] rounded-lg border transition-all duration-300 font-mono text-sm ${skillState[skill].activated ? 'skill-glow' : 'border-transparent'}`}
                                        style={{'--glow-color': data.color}}
                                    >
                                        <span>{skill}</span>
                                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                                            <div className="h-1.5 rounded-full" style={{ width: `${Math.min(skillState[skill].points / 5 * 100, 100)}%`, backgroundColor: data.color }}></div>
                                        </div>
                                    </div>
                                ))
                           )}
                       </div>
                       <div className="mt-12 text-center">
                           {!isGameActive ? (
                                <button onClick={() => { setSkillState(initialSkillState); setGameActive(true); }} className="bg-[var(--primary)] text-white font-bold px-8 py-4 rounded-md transition-all hover:bg-opacity-80 text-lg">
                                    Can you activate them all?
                                </button>
                            ) : (
                                <SkillsBreaker 
                                    skills={skills} 
                                    skillState={skillState} 
                                    onPointUpdate={handlePointUpdate}
                                    onGameEnd={handleGameEnd}
                                    onActivateAll={handleActivateAll}
                                />
                            )}
                        </div>
                    </section>
                    <section id="projects" className="py-24">
                        <h2 className={`text-3xl font-bold text-white mb-8 glitch-hover ${activeSection === 'projects' ? 'section-glow' : ''}`}>Featured Projects</h2>
                        <div className="flex flex-wrap justify-center gap-2 mb-10">
                            {jobTypes.map(type => (
                                <button 
                                    key={type} 
                                    onClick={() => setProjectFilter(type)}
                                    className={`font-mono px-4 py-2 text-sm rounded-full border transition-colors ${projectFilter === type ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project, index) => (
                                <div key={project.title} className="bg-[var(--bg-medium)] rounded-lg p-6 flex flex-col justify-between border border-white/10 transition-all duration-300 hover:border-[var(--primary)] hover:scale-105">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                                        <p className="text-gray-400 mb-4">{project.description}</p>
                                        <p className="font-mono text-[var(--accent)] text-sm mb-4">
                                            {project.insight && `[+] ${project.insight}`}
                                        </p>
                                    </div>
                                    <div>
                                        <ul className="flex flex-wrap gap-2 mb-4">
                                            {project.tags.map(tag => <li key={tag} className="bg-gray-700 text-sm px-2 py-1 rounded">{tag}</li>)}
                                        </ul>
                                        <div className="flex space-x-4">
                                             <a href={userData.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[var(--primary)]">GitHub</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="contact" className="py-24 text-center">
                        <h2 className={`text-3xl font-bold text-white mb-4 glitch-hover ${activeSection === 'contact' ? 'section-glow' : ''}`}>Get In Touch</h2>
                        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
                            I'm actively seeking new opportunities and collaborations. My inbox is always open, whether you have a question or just want to connect.
                        </p>
                        <a href={`mailto:${userData.email}`} className="inline-block bg-[var(--secondary)] text-white font-bold px-8 py-4 rounded-md button-glow">Say Hello</a>
                    </section>
                </div>
            </main>
            <footer className="text-center py-6 text-gray-500 relative z-10">
                <div className="flex justify-center space-x-6 mb-4">
                     <a href={userData.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)]">GitHub</a>
                     <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)]">LinkedIn</a>
                </div>
                <p>Designed & Built by {userData.name}</p>
            </footer>
        </div>
    );
}
