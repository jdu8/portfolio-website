// Main App Component
function App() {
    const [isGameActive, setGameActive] = React.useState(false);
    const [skillState, setSkillState] = React.useState(initialSkillState);
    const [showScrollPrompt, setShowScrollPrompt] = React.useState(false);
    const [projectFilter, setProjectFilter] = React.useState('All');
    const [activeSection, setActiveSection] = React.useState('home');
    const [hasPlayedGame, setHasPlayedGame] = React.useState(false);
    const [hasWonGame, setHasWonGame] = React.useState(false);
    const [isResetting, setIsResetting] = React.useState(false);
    const [currentNavIndex, setCurrentNavIndex] = React.useState(0);
    const [expandedJobs, setExpandedJobs] = React.useState({});
    const [loadingJobs, setLoadingJobs] = React.useState({});
    const [selectedProject, setSelectedProject] = React.useState(null);

    const navSections = ['Experience', 'Education', 'Skills', 'Projects', 'Contact'];

    const handleJobExpand = async (index) => {
        if (expandedJobs[index]) {
            // Collapsing
            setExpandedJobs(prev => ({ ...prev, [index]: false }));
        } else {
            // Expanding
            setLoadingJobs(prev => ({ ...prev, [index]: true }));
            await new Promise(resolve => setTimeout(resolve, 1200));
            setLoadingJobs(prev => ({ ...prev, [index]: false }));
            setExpandedJobs(prev => ({ ...prev, [index]: true }));
        }
    };
    const jobTypes = ['All', ...new Set(projects.flatMap(p => p.jobTypes))];
    const filteredProjects = projectFilter === 'All' ? projects : projects.filter(p => p.jobTypes.includes(projectFilter));

    // Scroll detection for active section based on headline visibility
    React.useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'about', 'experience', 'education', 'skills', 'projects', 'contact'];
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

    // Intersection Observer for section animations
    React.useEffect(() => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    entry.target.classList.remove('section-hidden');
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('.section-about, .section-experience, .section-education, .section-skills, .section-projects, .section-contact');
        sections.forEach(section => {
            section.classList.add('section-hidden');
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    // Cycle through navigation items
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentNavIndex((prev) => (prev + 1) % navSections.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handlePointUpdate = (skill, points) => {
        setSkillState(prev => {
            if (!prev[skill]) return prev;
            const newPoints = Math.min(prev[skill].points + points, 5); // Cap at 5
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
        setHasWonGame(true);
        setHasPlayedGame(true);
    };

    const handleGameEnd = (isWin) => {
        if (isWin) {
            handleActivateAll();
            setHasWonGame(true);
        }
        // Always deactivate the game and show button
        setGameActive(false);
        setHasPlayedGame(true);
    };

    return (
        <div>
            <CircuitBoardAnimation />
            <Header navLinks={navLinks} onAnimationComplete={() => setShowScrollPrompt(true)} />
            <main className="relative z-10">
                <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
                     <div className="container mx-auto px-6 md:px-10 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="max-w-3xl">
                                <AnimatedText text={userData.name} />
                                <h2 className="text-2xl md:text-4xl font-bold mb-6 hero-title-glow">{userData.title}</h2>
                                <p className="text-lg text-gray-300 max-w-xl mb-8">{userData.tagline}</p>
                                <div className="flex gap-4">
                                    <a
                                        href={`#${navSections[currentNavIndex].toLowerCase()}`}
                                        className="relative inline-block border-2 border-[var(--secondary)] text-[var(--secondary)] font-bold px-6 py-3 rounded-md hover:bg-[var(--secondary)]/10 transition-all duration-300 overflow-hidden"
                                        style={{
                                            boxShadow: '0 0 5px var(--secondary), inset 0 0 5px var(--secondary)',
                                            textShadow: '0 0 5px var(--secondary)'
                                        }}
                                    >
                                        <span className="cycling-text-container">
                                            {navSections.map((section, index) => (
                                                <span
                                                    key={section}
                                                    className={`cycling-text ${index === currentNavIndex ? 'cycling-text-active' : ''}`}
                                                >
                                                    {section}
                                                </span>
                                            ))}
                                        </span>
                                    </a>
                                    <a
                                        href="https://drive.google.com/file/d/1GK7wQ9Vd4anf2bOLFZLN5bSQtasSSnc6/view?usp=sharing"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block border-2 border-[var(--primary)] text-[var(--primary)] font-bold px-6 py-3 rounded-md hover:bg-[var(--primary)]/10 transition-all duration-300"
                                        style={{
                                            boxShadow: '0 0 5px var(--primary), inset 0 0 5px var(--primary)',
                                            textShadow: '0 0 5px var(--primary)'
                                        }}
                                    >
                                        Download CV
                                    </a>
                                </div>
                            </div>
                            <div className="hidden lg:flex justify-center items-center">
                                <img
                                    src="assets/hero-image.png"
                                    alt="Ishan Yadav"
                                    className="w-80 h-80 object-contain animate-float hero-image-entrance"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 w-full transition-all duration-500 z-10 ${showScrollPrompt ? 'bottom-10' : 'bottom-0'}`}>
                        <div className={`transition-all duration-500 ${showScrollPrompt ? 'mb-16' : 'mb-0'}`}>
                            <InteractiveTicker items={cvHighlights} />
                        </div>
                        <a href="#about" className={`absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500 transform ${showScrollPrompt ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <span className="font-mono text-sm text-[var(--secondary)]">Scroll</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--secondary)] bouncy-arrow">
                                <path d="M12 5v14M19 12l-7 7-7-7"/>
                            </svg>
                        </a>
                    </div>
                </section>
                <div className="container mx-auto px-6 md:px-10 relative z-10">
                    <section id="about" className="section-about py-24">
                       <h2 className={`text-3xl font-bold text-white mb-8 glitch-hover ${activeSection === 'about' ? 'section-glow' : ''}`}>About Me</h2>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                            <div className="md:col-span-2 text-lg text-gray-300 space-y-4">
                                <p>{userData.bio}</p>
                                <p>When not at the keyboard, I'm exploring NYC, volunteering at Sean Casey Animal Rescue and New York Cares, or hunting for the best coffee.</p>
                            </div>
                            <div className="flex justify-center">
                                <Logo size="w-52 h-52"/>
                            </div>
                        </div>
                    </section>
                    <section id="experience" className="section-experience py-24">
                       <h2 className={`text-3xl font-bold text-white mb-12 glitch-hover ${activeSection === 'experience' ? 'section-glow' : ''}`}>Career Trajectory</h2>
                       <div className="max-w-3xl mx-auto">
                            <div className="relative border-l-2 border-[var(--bg-medium)]">
                                {experience.map((job, index) => (
                                    <div key={index} className="mb-10 ml-6 relative">
                                        <span className="absolute flex items-center justify-center w-4 h-4 bg-[var(--secondary)] rounded-full -left-[29px] top-1 ring-4 ring-[var(--bg-dark)]"></span>
                                        <h3 className="flex items-center mb-1 text-xl font-semibold text-white">{job.role} <span className="text-[var(--primary)] text-sm font-medium ml-3">@ {job.company}</span></h3>
                                        <time className="block mb-2 text-sm font-normal leading-none text-gray-500">{job.date}</time>
                                        <p className="text-gray-400 mb-3">{job.headline}</p>
                                        {job.details && job.details.length > 0 && (
                                            <>
                                                <button
                                                    onClick={() => handleJobExpand(index)}
                                                    disabled={loadingJobs[index]}
                                                    className="text-[var(--secondary)] text-sm font-mono hover:text-[var(--primary)] transition-colors duration-300 mb-2 flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    <span>{expandedJobs[index] ? '▼' : '▶'}</span>
                                                    {expandedJobs[index] ? 'Hide details' : 'Show details'}
                                                </button>
                                                {loadingJobs[index] && (
                                                    <div className="terminal-window bg-black/40 border border-[var(--secondary)]/30 rounded p-4 mb-3 font-mono text-sm">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                            <span className="ml-2 text-gray-500 text-xs">terminal</span>
                                                        </div>
                                                        <div className="text-[var(--secondary)]">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[var(--primary)]">$</span>
                                                                <span className="typing-animation">fetch --experience --details</span>
                                                            </div>
                                                            <div className="mt-2 flex items-center gap-2">
                                                                <span className="loading-dots">Retrieving data</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className={`overflow-hidden transition-all duration-500 ${expandedJobs[index] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className="terminal-window bg-black/40 border border-[var(--secondary)]/30 rounded p-4 mb-3 font-mono text-sm">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <button
                                                                onClick={() => handleJobExpand(index)}
                                                                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
                                                                title="Close"
                                                            ></button>
                                                            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-50 cursor-not-allowed" title="Minimize (disabled)"></div>
                                                            <div className="w-3 h-3 rounded-full bg-green-500 opacity-50 cursor-not-allowed" title="Maximize (disabled)"></div>
                                                            <span className="ml-2 text-gray-500 text-xs">output</span>
                                                        </div>
                                                        <div className="text-[var(--secondary)] mb-2">
                                                            <span className="text-[var(--primary)]">$</span> fetch --experience --details
                                                        </div>
                                                        <div className="text-green-400 mb-2">✓ Success: Retrieved {job.details.length} entries</div>
                                                        <ul className="space-y-2 text-gray-300">
                                                            {job.details.map((detail, detailIndex) => (
                                                                <li key={detailIndex} className="leading-relaxed terminal-line" style={{ animationDelay: `${detailIndex * 0.1}s` }}>
                                                                    <span className="text-[var(--secondary)]">▸</span> {detail}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="education" className="section-education py-24">
                       <h2 className={`text-3xl font-bold text-white mb-12 glitch-hover ${activeSection === 'education' ? 'section-glow' : ''}`}>Education</h2>
                       <div className="max-w-3xl mx-auto space-y-8">
                            {education.map((edu, index) => (
                                <div key={index} className="bg-[var(--bg-medium)] rounded-lg p-6 border border-white/10 transition-all duration-300 hover:border-[var(--primary)]">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                                            <p className="text-[var(--secondary)] font-medium">{edu.institution}</p>
                                            {edu.specialization && (
                                                <p className="text-sm text-gray-400 italic">{edu.specialization}</p>
                                            )}
                                        </div>
                                        <div className="text-right mt-2 md:mt-0">
                                            <p className="text-sm text-gray-400">{edu.date}</p>
                                            <p className="text-sm text-gray-400">{edu.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[var(--primary)] font-bold">{edu.gpa}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="skills" className="section-skills py-24">
                       <h2 className={`text-3xl font-bold text-white mb-8 glitch-hover ${activeSection === 'skills' ? 'section-glow' : ''}`}>Skillset Matrix</h2>
                       <div className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-4xl mx-auto ${isResetting ? 'reset-animation' : ''}`}>
                           {Object.entries(skills).map(([category, data]) => {
                                const categoryFullyActivated = data.skills.every(skill => skillState[skill]?.activated);

                                return data.skills.map(skill => {
                                    const skillPoints = skillState[skill]?.points || 0;
                                    const skillActivated = skillState[skill]?.activated || false;

                                    const boxClasses = categoryFullyActivated ? 'group-activated' : (skillPoints >= 1 ? 'skill-glow' : 'border-transparent');
                                    const iconClasses = categoryFullyActivated ? 'group-activated-icon' : '';

                                    return (
                                    <div
                                        key={skill}
                                        className={`aspect-square flex flex-col items-center justify-center text-center p-3 bg-[var(--bg-medium)] rounded-lg border font-mono text-sm relative group ${boxClasses}`}
                                        style={{
                                            '--glow-color': data.color,
                                            borderColor: skillPoints >= 1 ? data.color : 'transparent',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <img
                                            src={skillIcons[skill]}
                                            alt={skill}
                                            className={`w-10 h-10 transition-all duration-300 ${iconClasses}`}
                                            style={{
                                                filter: skillPoints >= 1
                                                    ? `brightness(${0.7 + (skillPoints / 5) * 0.6}) drop-shadow(0 0 ${skillPoints * 3}px ${data.color}) saturate(${1 + skillPoints / 10})`
                                                    : 'brightness(1.2) saturate(0.5) contrast(1.1)',
                                                transform: categoryFullyActivated
                                                    ? undefined // Let CSS animation handle transform for activated groups
                                                    : (skillPoints >= 1 ? `scale(${1 + skillPoints / 20})` : 'scale(1)'),
                                                willChange: categoryFullyActivated ? 'transform' : 'auto'
                                            }}
                                        />
                                        <div
                                            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-bold"
                                            style={{
                                                color: data.color,
                                                textShadow: skillState[skill]?.points >= 1
                                                    ? `0 0 ${skillState[skill].points * 2}px ${data.color}`
                                                    : 'none'
                                            }}
                                        >
                                            {skill}
                                        </div>
                                    </div>
                                );
                                });
                           })}
                       </div>
                       <div className="mt-12 text-center">
                           {!isGameActive ? (
                                <div className="flex flex-col items-center gap-4">
                                    <button onClick={() => {
                                        if (!hasWonGame) {
                                            setSkillState(initialSkillState);
                                        }
                                        setGameActive(true);
                                    }} className="bg-[var(--primary)] text-white font-bold px-8 py-4 rounded-md transition-all hover:bg-opacity-80 text-lg">
                                        {!hasWonGame ? 'Can you activate them all?' : 'Play Endless Mode'}
                                    </button>
                                    {hasWonGame && (
                                        <button onClick={async () => {
                                            setIsResetting(true);
                                            await new Promise(resolve => setTimeout(resolve, 500));
                                            setSkillState(initialSkillState);
                                            setHasWonGame(false);
                                            setHasPlayedGame(false);
                                            setIsResetting(false);
                                        }} className="font-mono text-sm px-4 py-2 rounded border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-all">
                                            /reset_all_progress
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <SkillsBreaker
                                    skills={skills}
                                    skillState={skillState}
                                    onPointUpdate={handlePointUpdate}
                                    onGameEnd={handleGameEnd}
                                    onActivateAll={handleActivateAll}
                                    hasWonGame={hasWonGame}
                                    onResetProgress={async () => {
                                        setIsResetting(true);
                                        setGameActive(false);
                                        await new Promise(resolve => setTimeout(resolve, 500));
                                        setSkillState(initialSkillState);
                                        setHasWonGame(false);
                                        setHasPlayedGame(false);
                                        setIsResetting(false);
                                    }}
                                />
                            )}
                        </div>
                    </section>
                    <section id="projects" className="section-projects py-24">
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
                                <div key={project.title} className="bg-[var(--bg-medium)] rounded-lg p-6 flex flex-col justify-between border border-white/10 transition-all duration-300 hover:border-[var(--primary)] hover:scale-105 cursor-pointer" onClick={() => setSelectedProject(project)}>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                                        <p className="text-gray-400 mb-4 line-clamp-3">{typeof project.description === 'string' ? project.description : project.description.split('\n')[0]}</p>
                                        <p className="font-mono text-[var(--accent)] text-sm mb-4">
                                            {project.insight && `[+] ${project.insight}`}
                                        </p>
                                    </div>
                                    <div>
                                        <ul className="flex flex-wrap gap-2 mb-4">
                                            {project.tags.map(tag => <li key={tag} className="bg-gray-700 text-sm px-2 py-1 rounded">{tag}</li>)}
                                        </ul>
                                        <div className="flex items-center justify-end">
                                             <span className="text-xs text-gray-500 font-mono">Click for details →</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="contact" className="section-contact py-24">
                        <h2 className={`text-3xl font-bold text-white mb-4 text-center glitch-hover ${activeSection === 'contact' ? 'section-glow' : ''}`}>Get In Touch</h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 text-center">
                            I'm actively seeking new opportunities and collaborations. Choose how you'd like to connect.
                        </p>
                        <ContactOptions />
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

            {/* Project Terminal Popup */}
            {selectedProject && (
                <ProjectTerminal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}

            {/* AI Chatbot */}
            <Chatbot />
        </div>
    );
}
