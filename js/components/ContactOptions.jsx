// ContactOptions Component - Split contact into Schedule Call & Send Message
const ContactOptions = () => {
    const [selectedOption, setSelectedOption] = React.useState(null);
    const [selectedDuration, setSelectedDuration] = React.useState('30min');
    const [selectedDate, setSelectedDate] = React.useState('');
    const [selectedTime, setSelectedTime] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [messagesSent, setMessagesSent] = React.useState(0);
    const [lastResetDate, setLastResetDate] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [nameError, setNameError] = React.useState('');
    const MESSAGE_LIMIT = 10;

    // Email validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Load rate limiting data from localStorage
    React.useEffect(() => {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('contactRateLimit');

        if (stored) {
            const data = JSON.parse(stored);
            if (data.date === today) {
                setMessagesSent(data.count);
                setLastResetDate(data.date);
            } else {
                // New day, reset counter
                setMessagesSent(0);
                setLastResetDate(today);
                localStorage.setItem('contactRateLimit', JSON.stringify({ date: today, count: 0 }));
            }
        } else {
            setLastResetDate(today);
            localStorage.setItem('contactRateLimit', JSON.stringify({ date: today, count: 0 }));
        }
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setEmailError('');
        setNameError('');

        // Validate inputs
        if (!name.trim()) {
            setNameError('⚠️ Name is required');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('⚠️ Invalid email format');
            return;
        }

        if (messagesSent >= MESSAGE_LIMIT) {
            setEmailError(`⚠️ Daily limit of ${MESSAGE_LIMIT} messages reached`);
            return;
        }

        setLoading(true);
        setLoadingMessage('Sending message...');

        try {
            // Send message via API
            const response = await fetch('/api/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            // Check if API endpoint exists (405 = Method Not Allowed means endpoint doesn't exist)
            if (response.status === 405 || response.status === 404) {
                // Fallback for local development (API not deployed yet)
                console.log('📧 Message (API not deployed yet):', { name, email, message });

                // Update rate limit
                const newCount = messagesSent + 1;
                const today = new Date().toDateString();
                localStorage.setItem('contactRateLimit', JSON.stringify({ date: today, count: newCount }));
                setMessagesSent(newCount);

                setLoading(false);

                // Reset form
                setMessage('');
                setName('');
                setEmail('');
                setSelectedOption(null);
                return;
            }

            const data = await response.json();

            if (response.ok) {
                // Update rate limit
                const newCount = messagesSent + 1;
                const today = new Date().toDateString();
                localStorage.setItem('contactRateLimit', JSON.stringify({ date: today, count: newCount }));
                setMessagesSent(newCount);

                setLoading(false);

                // Reset form
                setMessage('');
                setName('');
                setEmail('');
                setSelectedOption(null);
            } else {
                setLoading(false);
                setEmailError(`❌ Failed to send message: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            setEmailError('❌ Network error. Please try again.');
        }
    };

    const handleScheduleCall = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setEmailError('');
        setNameError('');

        // Validate inputs
        if (!name.trim()) {
            setNameError('⚠️ Name is required');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('⚠️ Invalid email format');
            return;
        }

        setLoading(true);
        setLoadingMessage('Scheduling call...');

        try {
            // Send call request via API
            const response = await fetch('/api/schedule-call', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    duration: selectedDuration,
                    date: selectedDate,
                    time: selectedTime
                }),
            });

            // Check if API endpoint exists (405 = Method Not Allowed means endpoint doesn't exist)
            if (response.status === 405 || response.status === 404) {
                // Fallback for local development (API not deployed yet)
                console.log('📅 Call request (API not deployed yet):', {
                    name,
                    email,
                    duration: selectedDuration,
                    date: selectedDate,
                    time: selectedTime
                });

                setLoading(false);

                // Reset form
                setSelectedDate('');
                setSelectedTime('');
                setName('');
                setEmail('');
                setSelectedOption(null);
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setLoading(false);

                // Reset form
                setSelectedDate('');
                setSelectedTime('');
                setName('');
                setEmail('');
                setSelectedOption(null);
            } else {
                setLoading(false);
                setEmailError(`❌ Failed to schedule call: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            setEmailError('❌ Network error. Please try again.');
        }
    };

    const remainingMessages = MESSAGE_LIMIT - messagesSent;

    return (
        <div className="max-w-6xl mx-auto">
            {!selectedOption ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Schedule Call Option */}
                    <div
                        className="bg-[var(--bg-medium)] rounded-lg p-8 border border-white/10 transition-all duration-300 hover:border-[var(--primary)] hover:scale-105 cursor-pointer"
                        onClick={() => setSelectedOption('schedule')}
                    >
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-2xl font-bold text-white mb-3">Schedule a Call</h3>
                        <p className="text-gray-400 mb-4">
                            Book a time to discuss opportunities, collaborations, or just to connect.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-2 mb-6">
                            <li>• 30 minutes, 1 hour, or custom duration</li>
                            <li>• Pick a time that works for you</li>
                            <li>• I'll send a calendar invite</li>
                        </ul>
                        <button className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-md button-glow">
                            Select Time
                        </button>
                    </div>

                    {/* Send Message Option */}
                    <div
                        className="bg-[var(--bg-medium)] rounded-lg p-8 border border-white/10 transition-all duration-300 hover:border-[var(--secondary)] hover:scale-105 cursor-pointer"
                        onClick={() => setSelectedOption('message')}
                    >
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-2xl font-bold text-white mb-3">Send a Message</h3>
                        <p className="text-gray-400 mb-4">
                            Have a quick question or want to reach out? Drop me a message.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-2 mb-6">
                            <li>• Quick and simple</li>
                            <li>• {remainingMessages} messages remaining today</li>
                            <li>• I'll respond within 24 hours</li>
                        </ul>
                        <button className="w-full bg-[var(--secondary)] text-white font-bold py-3 rounded-md button-glow">
                            Write Message
                        </button>
                    </div>
                </div>
            ) : selectedOption === 'schedule' ? (
                // Schedule Call Form
                <div className="max-w-2xl mx-auto bg-[var(--bg-medium)] rounded-lg p-8 border border-[var(--primary)] relative">
                    <button
                        onClick={() => setSelectedOption(null)}
                        className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
                    >
                        ← Back to options
                    </button>
                    <h3 className="text-2xl font-bold text-white mb-6">📅 Schedule a Call</h3>

                    <form onSubmit={handleScheduleCall}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setNameError(''); }}
                                className={`w-full px-4 py-2 bg-[var(--bg-dark)] border ${nameError ? 'border-red-500' : 'border-white/10'} rounded-md text-white focus:border-[var(--primary)] focus:outline-none transition-colors`}
                                placeholder="John Doe"
                            />
                            {nameError && (
                                <p className="text-red-400 text-xs mt-1 font-mono">{nameError}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                                className={`w-full px-4 py-2 bg-[var(--bg-dark)] border ${emailError ? 'border-red-500' : 'border-white/10'} rounded-md text-white focus:border-[var(--primary)] focus:outline-none transition-colors`}
                                placeholder="john@example.com"
                            />
                            {emailError && (
                                <p className="text-red-400 text-xs mt-1 font-mono">{emailError}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                            <div className="flex gap-3">
                                {['30min', '1hr', 'custom'].map((duration) => (
                                    <button
                                        key={duration}
                                        type="button"
                                        onClick={() => setSelectedDuration(duration)}
                                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                            selectedDuration === duration
                                                ? 'bg-[var(--primary)] text-white'
                                                : 'bg-[var(--bg-dark)] text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {duration === '1hr' ? '1 hour' : duration === '30min' ? '30 min' : 'Custom'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Date</label>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {(() => {
                                    const today = new Date();
                                    const dates = [];
                                    for (let i = 0; i < 7; i++) {
                                        const date = new Date(today);
                                        date.setDate(today.getDate() + i);
                                        const dateStr = date.toISOString().split('T')[0];
                                        const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' });
                                        const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                        dates.push({ dateStr, dayName, dateLabel });
                                    }
                                    return dates.map(({ dateStr, dayName, dateLabel }) => (
                                        <button
                                            key={dateStr}
                                            type="button"
                                            onClick={() => setSelectedDate(dateStr)}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                selectedDate === dateStr
                                                    ? 'bg-[var(--primary)] text-white'
                                                    : 'bg-[var(--bg-dark)] text-gray-400 hover:text-white hover:border-[var(--primary)]/50'
                                            } border ${selectedDate === dateStr ? 'border-[var(--primary)]' : 'border-white/10'}`}
                                        >
                                            <div className="font-bold">{dayName}</div>
                                            <div className="text-xs opacity-80">{dateLabel}</div>
                                        </button>
                                    ));
                                })()}
                            </div>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 bg-[var(--bg-dark)] border border-white/10 rounded-md text-white text-sm focus:border-[var(--primary)] focus:outline-none"
                                placeholder="Or pick a custom date"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Time</label>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setSelectedTime(time)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            selectedTime === time
                                                ? 'bg-[var(--primary)] text-white'
                                                : 'bg-[var(--bg-dark)] text-gray-400 hover:text-white hover:border-[var(--primary)]/50'
                                        } border ${selectedTime === time ? 'border-[var(--primary)]' : 'border-white/10'}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-4 py-2 bg-[var(--bg-dark)] border border-white/10 rounded-md text-white text-sm focus:border-[var(--primary)] focus:outline-none"
                                placeholder="Or enter custom time"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-md button-glow hover:opacity-90 transition-opacity"
                        >
                            Request Call
                        </button>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                            I'll send you a calendar invite to confirm the call
                        </p>
                    </form>

                    {/* Loading Overlay for Schedule Call */}
                    {loading && (
                        <div className="absolute inset-0 bg-[var(--bg-dark)] rounded-lg flex items-center justify-center z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative w-8 h-8 flex-shrink-0">
                                    <div className="absolute inset-0 border-2 border-[var(--primary)]/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-2 border-transparent border-t-[var(--primary)] rounded-full animate-spin"></div>
                                </div>
                                <p className="text-[var(--primary)] font-mono text-sm">
                                    {loadingMessage}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // Send Message Form
                <div className="max-w-2xl mx-auto bg-[var(--bg-medium)] rounded-lg p-8 border border-[var(--secondary)] relative">
                    <button
                        onClick={() => setSelectedOption(null)}
                        className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
                    >
                        ← Back to options
                    </button>
                    <h3 className="text-2xl font-bold text-white mb-2">💬 Send a Message</h3>
                    <p className="text-sm text-gray-400 mb-6">
                        {remainingMessages > 0
                            ? `${remainingMessages} message${remainingMessages !== 1 ? 's' : ''} remaining today`
                            : 'Daily limit reached. Try again tomorrow.'}
                    </p>

                    <form onSubmit={handleSendMessage}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setNameError(''); }}
                                className={`w-full px-4 py-2 bg-[var(--bg-dark)] border ${nameError ? 'border-red-500' : 'border-white/10'} rounded-md text-white focus:border-[var(--secondary)] focus:outline-none transition-colors`}
                                placeholder="John Doe"
                            />
                            {nameError && (
                                <p className="text-red-400 text-xs mt-1 font-mono">{nameError}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                                className={`w-full px-4 py-2 bg-[var(--bg-dark)] border ${emailError ? 'border-red-500' : 'border-white/10'} rounded-md text-white focus:border-[var(--secondary)] focus:outline-none transition-colors`}
                                placeholder="john@example.com"
                            />
                            {emailError && (
                                <p className="text-red-400 text-xs mt-1 font-mono">{emailError}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows="5"
                                className="w-full px-4 py-2 bg-[var(--bg-dark)] border border-white/10 rounded-md text-white focus:border-[var(--secondary)] focus:outline-none resize-none"
                                placeholder="Your message here..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={remainingMessages <= 0}
                            className="w-full bg-[var(--secondary)] text-white font-bold py-3 rounded-md button-glow hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {remainingMessages > 0 ? 'Send Message' : 'Daily Limit Reached'}
                        </button>
                        {remainingMessages <= 0 && (
                            <p className="text-xs text-red-400 mt-3 text-center">
                                Please try again tomorrow or schedule a call instead
                            </p>
                        )}
                    </form>

                    {/* Loading Overlay for Send Message */}
                    {loading && (
                        <div className="absolute inset-0 bg-[var(--bg-dark)] rounded-lg flex items-center justify-center z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative w-8 h-8 flex-shrink-0">
                                    <div className="absolute inset-0 border-2 border-[var(--primary)]/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-2 border-transparent border-t-[var(--primary)] rounded-full animate-spin"></div>
                                </div>
                                <p className="text-[var(--primary)] font-mono text-sm">
                                    {loadingMessage}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
