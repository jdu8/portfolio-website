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
                    <nav className={`hidden md:flex transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'} flex-wrap justify-center md:justify-end gap-x-6 gap-y-2`}>
                        {navLinks.map(link => 
                            <a key={link.name} href={link.href} className="text-gray-300 hover:text-[var(--primary)] transition-colors text-lg">
                                {link.name}
                            </a>
                        )}
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
                </nav>
            </div>
        </>
    );
};

