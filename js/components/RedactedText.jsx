// RedactedText Component - Parses and renders text with [redacted] syntax
const RedactedText = ({ text }) => {
    const [revealed, setRevealed] = React.useState([]);
    const [decrypting, setDecrypting] = React.useState(null);

    // Parse text to find [bracketed] content
    const parseRedactedText = (text) => {
        const parts = [];
        const regex = /\[([^\]]+)\]/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Add text before the bracket
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.slice(lastIndex, match.index)
                });
            }

            // Add redacted content
            parts.push({
                type: 'redacted',
                content: match[1],
                id: `redacted_${parts.length}`
            });

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.slice(lastIndex)
            });
        }

        return parts;
    };

    const parts = parseRedactedText(text);

    // Glitch animation component
    const GlitchText = ({ value, onComplete }) => {
        const [displayValue, setDisplayValue] = React.useState('');
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

        React.useEffect(() => {
            let frame = 0;
            const maxFrames = 20;

            const interval = setInterval(() => {
                if (frame >= maxFrames) {
                    setDisplayValue(value);
                    clearInterval(interval);
                    if (onComplete) onComplete();
                    return;
                }

                // Create glitchy version - progressive reveal
                const glitched = value.split('').map((char, idx) => {
                    const progress = frame / maxFrames;

                    // Gradually reveal characters from left to right
                    if (idx < value.length * progress) {
                        return char; // Revealed
                    }

                    // Random glitch character
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }).join('');

                setDisplayValue(glitched);
                frame++;
            }, 50);

            return () => clearInterval(interval);
        }, [value]);

        return <span className="text-[var(--secondary)] glitch-text" style={{ textShadow: '0 0 5px var(--secondary)' }}>{displayValue}</span>;
    };

    const handleDecrypt = (id, value) => {
        if (revealed.includes(id)) return;

        setDecrypting(id);

        // Animation completes after glitch
        setTimeout(() => {
            setRevealed([...revealed, id]);
            setDecrypting(null);
        }, 1000);
    };

    const revealAll = () => {
        const allRedacted = parts.filter(p => p.type === 'redacted');
        let delay = 0;

        allRedacted.forEach(part => {
            if (!revealed.includes(part.id)) {
                setTimeout(() => {
                    setDecrypting(part.id);
                    setTimeout(() => {
                        setRevealed(prev => [...prev, part.id]);
                        setDecrypting(null);
                    }, 300);
                }, delay);
                delay += 400;
            }
        });
    };

    // Expose revealAll to parent
    React.useEffect(() => {
        window.revealAllRedacted = revealAll;
    }, [parts, revealed]);

    return (
        <div className="redacted-text">
            {parts.map((part, idx) => {
                if (part.type === 'text') {
                    return <span key={idx}>{part.content}</span>;
                }

                if (part.type === 'redacted') {
                    const isRevealed = revealed.includes(part.id);
                    const isDecrypting = decrypting === part.id;

                    if (isDecrypting) {
                        return (
                            <GlitchText
                                key={idx}
                                value={part.content}
                            />
                        );
                    }

                    if (isRevealed) {
                        return (
                            <span
                                key={idx}
                                className="text-[var(--secondary)]"
                                style={{ textShadow: '0 0 5px var(--secondary)' }}
                            >
                                {part.content} <span className="text-[var(--primary)] text-xs">✓</span>
                            </span>
                        );
                    }

                    return (
                        <span
                            key={idx}
                            className="redacted-block cursor-pointer inline-block px-1 transition-all hover:bg-red-500/20"
                            onClick={() => handleDecrypt(part.id, part.content)}
                            style={{
                                background: 'rgba(255, 85, 85, 0.1)',
                                border: '1px solid rgba(255, 85, 85, 0.3)',
                                color: '#666',
                                borderRadius: '2px'
                            }}
                            title="Click to decrypt"
                        >
                            {'█'.repeat(part.content.length)}
                        </span>
                    );
                }
            })}
        </div>
    );
};
