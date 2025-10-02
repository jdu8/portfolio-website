// AnimatedText Component
const AnimatedText = ({ text }) => {
    const [displayText, setDisplayText] = React.useState('');
    const targetText = text ? text.toUpperCase() : '';
    
    React.useEffect(() => {
        if (!targetText) return;
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let iteration = 0;
        const interval = setInterval(() => {
            const newText = targetText.split('').map((letter, index) => 
                (index < iteration) ? targetText[index] : chars[Math.floor(Math.random() * chars.length)]
            ).join('');
            setDisplayText(newText);
            if (iteration >= targetText.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 40);
        return () => clearInterval(interval);
    }, [targetText]);
    
    return <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 glitch-hover">{displayText}</h1>;
};

