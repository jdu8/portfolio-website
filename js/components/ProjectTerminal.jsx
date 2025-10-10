// ProjectTerminal Component - Mac-style terminal for project details
const ProjectTerminal = ({ project, onClose }) => {
    const [isClosing, setIsClosing] = React.useState(false);
    const [showContent, setShowContent] = React.useState(false);

    React.useEffect(() => {
        // Show content after terminal animation completes
        const timer = setTimeout(() => setShowContent(true), 300);
        return () => clearTimeout(timer);
    }, []);

    if (!project) return null;

    const handleRevealAll = () => {
        if (window.revealAllRedacted) {
            window.revealAllRedacted();
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };

    return (
        <div
            className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            style={{
                animation: isClosing ? 'none' : 'fadeIn 0.2s ease-out'
            }}
            onClick={handleClose}
        >
            <div
                className="bg-[#2d2d2d] rounded-lg overflow-hidden border border-[#3d3d3d] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                style={{
                    animation: isClosing ? 'terminalClose 0.2s cubic-bezier(0.4, 0, 1, 1)' : 'terminalOpen 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                {/* Terminal Header */}
                <div className="bg-[#1e1e1e] px-3 py-2 flex items-center justify-between border-b border-[#3d3d3d] sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleClose}
                            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff6f67] transition-colors"
                            title="Close"
                        ></button>
                        <div className="w-3 h-3 rounded-full bg-[#febc2e] opacity-50 cursor-not-allowed" title="Minimize (disabled)"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28c840] opacity-50 cursor-not-allowed" title="Maximize (disabled)"></div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-gray-400 text-xs font-medium">
                        {project.title}
                    </div>
                    <div className="text-gray-500 text-xs font-mono">
                        details.log
                    </div>
                </div>

                {/* Terminal Body */}
                <div className="p-6 font-mono text-sm text-gray-300">
                    {/* Description with redacted text */}
                    <div className="mb-6">
                        <div className="text-[var(--primary)] mb-2 typing-line" style={{ animationDelay: '0s' }}>
                            $ cat project_description.txt
                        </div>
                        {showContent && (
                            <div className="pl-4 leading-relaxed whitespace-pre-line typing-content" style={{ animationDelay: '0.3s' }}>
                                <RedactedText text={project.description} />
                            </div>
                        )}
                    </div>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && showContent && (
                        <div className="mb-6">
                            <div className="text-[var(--primary)] mb-2 typing-line" style={{ animationDelay: '0.5s' }}>
                                $ ls technologies/
                            </div>
                            <div className="flex flex-wrap gap-2 pl-4 typing-content" style={{ animationDelay: '0.7s' }}>
                                {project.technologies.map((tech, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-[var(--bg-medium)] border border-[var(--secondary)]/30 rounded text-xs"
                                        style={{
                                            color: 'var(--secondary)',
                                            animation: `fadeIn 0.3s ease-out ${0.7 + idx * 0.05}s both`
                                        }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    {project.links && project.links.length > 0 && showContent && (
                        <div className="mb-4">
                            <div className="text-[var(--primary)] mb-2 typing-line" style={{ animationDelay: '0.9s' }}>
                                $ cat links.txt
                            </div>
                            <div className="flex flex-wrap gap-3 pl-4 typing-content" style={{ animationDelay: '1.1s' }}>
                                {project.links.map((link, idx) => {
                                    const linkStyles = {
                                        github: { bg: 'bg-gray-800/50', border: 'border-gray-600', icon: '🔗' },
                                        demo: { bg: 'bg-blue-900/30', border: 'border-blue-500/50', icon: '⚡' },
                                        docs: { bg: 'bg-purple-900/30', border: 'border-purple-500/50', icon: '📄' },
                                        article: { bg: 'bg-orange-900/30', border: 'border-orange-500/50', icon: '✍️' }
                                    };

                                    const style = linkStyles[link.type] || linkStyles.github;

                                    return (
                                        <a
                                            key={idx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${style.bg} border ${style.border} px-4 py-2 rounded hover:opacity-80 transition-opacity flex items-center gap-2 text-sm`}
                                            style={{ animation: `fadeIn 0.3s ease-out ${1.1 + idx * 0.1}s both` }}
                                        >
                                            <span>{style.icon}</span>
                                            <span>{link.text}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Terminal Footer */}
                <div className="bg-[#1e1e1e] px-3 py-2 border-t border-[#3d3d3d] flex items-center gap-3 sticky bottom-0">
                    <span className="text-[#28c840] font-mono text-xs">$</span>
                    <button
                        onClick={handleRevealAll}
                        className="font-mono text-xs text-amber-400 hover:text-amber-300 transition-colors"
                        title="Reveal all redacted information"
                    >
                        reveal_all
                    </button>
                </div>
            </div>
        </div>
    );
};
