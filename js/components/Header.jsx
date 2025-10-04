// Header Component
const Header = ({ navLinks, onAnimationComplete }) => {
    const [visible, setVisible] = React.useState(false);
    const [show, setShow] = React.useState(true);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const lastScrollY = React.useRef(0);

    React.useEffect(() => {
        const controlNavbar = () => {
            if (window.scrollY > lastScrollY.current && window.scrollY > 100) { 
                setShow(false); 
            } else { 
                setShow(true); 
            }
            lastScrollY.current = window.scrollY;
        };
        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, []);
    
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
            if(onAnimationComplete) onAnimationComplete();
        }, 2000);
        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-50 bg-[var(--bg-dark)]/80 backdrop-blur-sm transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
                    <Logo size="w-12 h-12" isAnimated={true} />
                    <nav className={`hidden md:flex transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'} flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 items-center`}>
                        {navLinks.map(link =>
                            <a key={link.name} href={link.href} className="text-gray-300 hover:text-[var(--primary)] transition-colors text-lg">
                                {link.name}
                            </a>
                        )}
                        <div className="flex gap-3 ml-2 items-center border-l border-gray-700 pl-4">
                            <a
                                href={userData.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[var(--primary)] transition-all duration-300 hover:scale-110"
                                aria-label="GitHub"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                            <a
                                href={userData.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[var(--secondary)] transition-all duration-300 hover:scale-110"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </nav>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`z-50 space-y-2 ${isMenuOpen ? 'hamburger-active' : ''}`}>
                            <span className="block w-6 h-0.5 bg-white hamburger-line top-line"></span>
                            <span className="block w-6 h-0.5 bg-white hamburger-line middle-line"></span>
                            <span className="block w-6 h-0.5 bg-white hamburger-line bottom-line"></span>
                        </button>
                    </div>
                </div>
            </header>
            <div className={`md:hidden fixed inset-0 bg-[var(--bg-dark)]/95 backdrop-blur-lg z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <nav className="flex flex-col items-center justify-center h-full gap-y-8">
                    {navLinks.map(link =>
                        <a key={link.name} href={link.href} className="text-3xl font-mono text-gray-200 hover:text-[var(--primary)]" onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </a>
                    )}
                    <div className="flex gap-6 mt-8">
                        <a
                            href={userData.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[var(--primary)] transition-all duration-300"
                            aria-label="GitHub"
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                        <a
                            href={userData.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[var(--secondary)] transition-all duration-300"
                            aria-label="LinkedIn"
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                    </div>
                </nav>
            </div>
        </>
    );
};

