// Logo Component
const Logo = ({ size = 'w-12 h-12', isAnimated = false }) => {
    const textSize = size.includes('52') ? 'text-7xl' : 'text-2xl';
    return (
        <a href="#home" className={`${size} rounded-md bg-[var(--bg-medium)] p-1 inline-block flex-shrink-0 glitch-hover ${isAnimated ? 'flicker-in' : ''}`}>
            <div className="w-full h-full border-2 border-[var(--primary)] rounded-sm flex items-center justify-center">
                <span className={`${textSize} font-bold text-[var(--primary)] font-mono`}>IY</span>
            </div>
        </a>
    );
};

