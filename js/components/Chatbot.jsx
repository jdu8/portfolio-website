// AI Chatbot Component - Terminal-style chat interface
const Chatbot = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState([]);
    const [inputMessage, setInputMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageCount, setMessageCount] = React.useState(0);
    const [isMobile, setIsMobile] = React.useState(false);
    const messagesEndRef = React.useRef(null);
    const MESSAGE_LIMIT = 20;

    // Check if mobile on mount and window resize
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load chat history and rate limit from localStorage
    React.useEffect(() => {
        const today = new Date().toDateString();

        // Load messages
        const storedMessages = localStorage.getItem('chatMessages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        } else {
            // Initial greeting
            const greeting = {
                id: Date.now(),
                role: 'assistant',
                content: "Hey there! 👋 I'm Ishan's AI assistant. Ask me anything about his experience, projects, skills, or background!",
                timestamp: new Date().toISOString()
            };
            setMessages([greeting]);
            localStorage.setItem('chatMessages', JSON.stringify([greeting]));
        }

        // Load rate limit
        const storedLimit = localStorage.getItem('chatRateLimit');
        if (storedLimit) {
            const data = JSON.parse(storedLimit);
            if (data.date === today) {
                setMessageCount(data.count);
            } else {
                // New day, reset
                setMessageCount(0);
                localStorage.setItem('chatRateLimit', JSON.stringify({ date: today, count: 0 }));
            }
        } else {
            localStorage.setItem('chatRateLimit', JSON.stringify({ date: today, count: 0 }));
        }
    }, []);

    // Auto-scroll to bottom when messages change
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        // Check rate limit
        if (messageCount >= MESSAGE_LIMIT) {
            alert(`You've reached the daily limit of ${MESSAGE_LIMIT} messages. Come back tomorrow!`);
            return;
        }

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        setInputMessage('');
        setIsLoading(true);

        try {
            // Call Gemini API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputMessage.trim(),
                    conversationHistory: messages
                })
            });

            // Fallback for local development
            if (response.status === 405 || response.status === 404) {
                console.log('💬 Chat message (API not deployed yet):', inputMessage);
                const fallbackResponse = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: "I'm currently in development mode! Deploy to Vercel to enable AI responses. But I'd love to chat about Ishan's projects once I'm live! 🤖",
                    timestamp: new Date().toISOString()
                };
                const newMessages = [...updatedMessages, fallbackResponse];
                setMessages(newMessages);
                localStorage.setItem('chatMessages', JSON.stringify(newMessages));
                setIsLoading(false);

                // Update rate limit
                const today = new Date().toDateString();
                const newCount = messageCount + 1;
                setMessageCount(newCount);
                localStorage.setItem('chatRateLimit', JSON.stringify({ date: today, count: newCount }));
                return;
            }

            const data = await response.json();

            if (response.ok) {
                const aiMessage = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: data.response,
                    timestamp: new Date().toISOString()
                };

                const newMessages = [...updatedMessages, aiMessage];
                setMessages(newMessages);
                localStorage.setItem('chatMessages', JSON.stringify(newMessages));

                // Update rate limit
                const today = new Date().toDateString();
                const newCount = messageCount + 1;
                setMessageCount(newCount);
                localStorage.setItem('chatRateLimit', JSON.stringify({ date: today, count: newCount }));
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting right now. Please try again!",
                timestamp: new Date().toISOString()
            };
            const newMessages = [...updatedMessages, errorMessage];
            setMessages(newMessages);
            localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        if (confirm('Clear chat history?')) {
            const greeting = {
                id: Date.now(),
                role: 'assistant',
                content: "Hey there! 👋 I'm Ishan's AI assistant. Ask me anything about his experience, projects, skills, or background!",
                timestamp: new Date().toISOString()
            };
            setMessages([greeting]);
            localStorage.setItem('chatMessages', JSON.stringify([greeting]));
        }
    };

    const remainingMessages = MESSAGE_LIMIT - messageCount;

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-8 right-8 z-50 w-14 h-14 md:w-16 md:h-16 bg-[var(--primary)] rounded-full shadow-[0_0_30px_rgba(0,255,157,0.5)] hover:shadow-[0_0_40px_rgba(0,255,157,0.7)] transition-all duration-300 flex items-center justify-center group animate-pulse hover:animate-none"
                    aria-label="Open AI Chat"
                >
                    <svg className="w-7 h-7 md:w-8 md:h-8 text-[var(--bg-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {remainingMessages < MESSAGE_LIMIT && (
                        <div className="absolute -top-1 -right-1 bg-[var(--secondary)] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {remainingMessages}
                        </div>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`fixed z-50 ${
                    isMobile
                        ? 'inset-0 bg-[var(--bg-dark)]'
                        : 'bottom-8 right-8 w-[400px] h-[600px] rounded-lg shadow-[0_0_40px_rgba(0,255,157,0.3)]'
                } flex flex-col`}>

                    {/* Terminal Header */}
                    <div className={`bg-[var(--bg-medium)] border-b-2 border-[var(--primary)] ${isMobile ? 'px-4 py-3' : 'px-4 py-3 rounded-t-lg'} flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                            {!isMobile && (
                                <div className="flex gap-2">
                                    <button
                                        className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110 transition-all"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close chat"
                                    ></button>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                            )}
                            <h3 className="text-white font-mono text-sm md:text-base font-bold ml-2">AI Assistant</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearChat}
                                className="text-gray-400 hover:text-white text-xs hover:underline transition-colors"
                                title="Clear chat"
                            >
                                Clear
                            </button>
                            {isMobile && (
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    aria-label="Close chat"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-dark)] space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                        msg.role === 'user'
                                            ? 'bg-[var(--secondary)] text-white'
                                            : 'bg-[var(--bg-medium)] text-[var(--primary)] border border-[var(--primary)]/30'
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    <span className="text-xs opacity-50 mt-1 block">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[var(--bg-medium)] text-[var(--primary)] border border-[var(--primary)]/30 px-4 py-2 rounded-lg">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className={`bg-[var(--bg-medium)] border-t-2 border-[var(--primary)] p-4 ${!isMobile && 'rounded-b-lg'}`}>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                disabled={remainingMessages <= 0}
                                className="flex-1 px-3 py-2 bg-[var(--bg-dark)] border border-white/10 rounded-md text-white text-sm focus:border-[var(--primary)] focus:outline-none disabled:opacity-50"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isLoading || remainingMessages <= 0}
                                className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            {remainingMessages > 0
                                ? `${remainingMessages} message${remainingMessages !== 1 ? 's' : ''} remaining today`
                                : 'Daily limit reached. Try again tomorrow!'}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
