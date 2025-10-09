// SkillsBreaker Component
const SkillsBreaker = ({ skills, skillState, onPointUpdate, onGameEnd, onActivateAll, hasWonGame }) => {
    const canvasRef = React.useRef(null);
    const [gameState, setGameState] = React.useState('ready');
    const [lives, setLives] = React.useState(5);
    const [showTutorial, setShowTutorial] = React.useState(false);
    const [floatingTexts, setFloatingTexts] = React.useState([]);
    const [touchIndicator, setTouchIndicator] = React.useState(null);
    const [isHacking, setIsHacking] = React.useState(false);
    const [hackingMessage, setHackingMessage] = React.useState('');
    const [isEndlessMode, setIsEndlessMode] = React.useState(hasWonGame);
    const [endlessScore, setEndlessScore] = React.useState(0);
    const [isResetting, setIsResetting] = React.useState(false);
    const [resetMessage, setResetMessage] = React.useState('');
    const gameStateRef = React.useRef(gameState);
    const skillStateRef = React.useRef(skillState);
    
    React.useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    React.useEffect(() => {
        skillStateRef.current = skillState;

        // Check for win condition (not in endless mode)
        const allActivated = Object.values(skillState).every(s => s.activated);
        if (allActivated && gameState === 'playing' && !isEndlessMode) {
            setGameState('win');
        }
    }, [skillState, gameState, isEndlessMode]);

    const launchBall = React.useCallback(() => {
        if (gameStateRef.current === 'ready') {
            setGameState('playing');
        }
    }, []);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const handleLaunch = (e) => {
            if (e.code === 'Space' || e.type === 'mousedown' || e.type === 'touchstart') {
                e.preventDefault();
                launchBall();
            }
        };
        document.addEventListener('keydown', handleLaunch);
        canvas.addEventListener('mousedown', handleLaunch);
        canvas.addEventListener('touchstart', handleLaunch);
        return () => {
            document.removeEventListener('keydown', handleLaunch);
            canvas.removeEventListener('mousedown', handleLaunch);
            canvas.removeEventListener('touchstart', handleLaunch);
        };
    }, [launchBall]);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Responsive game settings based on screen size
        const isMobile = window.innerWidth < 768;
        const baseSpeed = { x: isMobile ? 2.5 : 3, y: isMobile ? -2.5 : -3 };
        let speedMultiplier = 1;
        const paddle = {
            x: 0,
            y: 0,
            width: isMobile ? 120 : 100,
            height: isMobile ? 15 : 12,
            dx: 0,
            speed: isMobile ? 10 : 8
        };
        const ball = { x: 0, y: 0, radius: isMobile ? 8 : 7, dx: baseSpeed.x, dy: baseSpeed.y };
        const bricks = [];
        let brickInfo;

        const initGame = (isNewLife = false) => {
            const container = canvas.parentElement;
            canvas.width = container.offsetWidth;
            canvas.height = Math.min(container.offsetWidth * 0.7, 450);

            // Responsive brick layout
            const cols = isMobile ? 6 : 8;
            const rows = isMobile ? 4 : 5;
            brickInfo = {
                rows,
                cols,
                width: 0,
                height: isMobile ? 18 : 20,
                padding: isMobile ? 4 : 5,
                offsetTop: isMobile ? 20 : 30,
                offsetLeft: isMobile ? 4 : 5
            };
            brickInfo.width = (canvas.width - brickInfo.offsetLeft * 2 - brickInfo.padding * (brickInfo.cols - 1)) / brickInfo.cols;
            paddle.x = canvas.width / 2 - paddle.width / 2;
            paddle.y = canvas.height - 30;

            if (!isNewLife) {
                bricks.length = 0;
                const skillCategories = Object.keys(skills);

                // Helper function to check if category is fully activated
                const isCategoryFullyActivated = (category) => {
                    return skills[category].skills.every(skill => skillStateRef.current[skill]?.activated);
                };

                // Get available categories (not fully activated) - only in normal mode
                const getAvailableCategory = () => {
                    if (isEndlessMode) {
                        // In endless mode, use all categories
                        return skillCategories[Math.floor(Math.random() * skillCategories.length)];
                    }
                    const availableCategories = skillCategories.filter(cat => !isCategoryFullyActivated(cat));
                    if (availableCategories.length === 0) return null;
                    return availableCategories[Math.floor(Math.random() * availableCategories.length)];
                };

                // Create bricks with intentional empty spaces (20% empty)
                for (let c = 0; c < brickInfo.cols; c++) {
                    bricks[c] = [];
                    for (let r = 0; r < brickInfo.rows; r++) {
                        // 20% chance of empty space
                        const isEmpty = Math.random() < 0.2;
                        const category = getAvailableCategory() || skillCategories[(c + r) % skillCategories.length];
                        const shouldSkip = isEndlessMode ? isEmpty : (isEmpty || isCategoryFullyActivated(category));
                        bricks[c][r] = {
                            x: 0,
                            y: 0,
                            status: shouldSkip ? 0 : 1,
                            category,
                            color: skills[category].color,
                            isEmpty: shouldSkip // Track permanent empty spaces
                        };
                    }
                }
            }
            resetBall();
        };

        const resetBall = () => {
            setGameState('ready');
            speedMultiplier = 1 + (0.2 * Math.max(0, (5 - Math.min(lives, 5))));
            ball.x = paddle.x + paddle.width / 2;
            ball.y = paddle.y - ball.radius;
            ball.dx = baseSpeed.x * (Math.random() > 0.5 ? 1 : -1) * speedMultiplier;
            ball.dy = baseSpeed.y * speedMultiplier;
        };

        const addFloatingText = (text, x, y, color) => {
            const id = Date.now() + Math.random();
            setFloatingTexts(prev => [...prev, { id, text, x, y, color }]);
            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
            }, 1500);
        };

        function collisionDetection() {
            for (let c = 0; c < brickInfo.cols; c++) {
                for (let r = 0; r < brickInfo.rows; r++) {
                    const b = bricks[c][r];
                    if (b.status === 1) {
                        if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brickInfo.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brickInfo.height) {
                            ball.dy = -ball.dy;

                            // Check if this category is fully activated
                            const categorySkills = skills[b.category].skills;
                            const isCategoryActivated = categorySkills.every(skill => skillStateRef.current[skill]?.activated);

                            if (isCategoryActivated && !isEndlessMode) {
                                // Instantly destroy brick from activated category (not in endless mode)
                                b.status = 0;
                                b.isEmpty = true; // Mark as permanent empty
                                addFloatingText('ACTIVATED!', b.x + brickInfo.width / 2, b.y, b.color);
                            } else {
                                b.status = 2; // Temporarily disabled

                                // Slower regeneration: 8-10 seconds instead of 3 seconds
                                // Don't regenerate if it's a permanent empty space
                                if (!b.isEmpty) {
                                    const regenTime = 8000 + Math.random() * 2000; // 8-10 seconds
                                    setTimeout(() => {
                                        if (b.status === 2) b.status = 1;
                                    }, regenTime);
                                }

                                speedMultiplier += 0.02;

                                if (isEndlessMode) {
                                    // In endless mode, just add score
                                    setEndlessScore(prev => prev + 1);
                                    addFloatingText('+1', b.x + brickInfo.width / 2, b.y, b.color);
                                } else {
                                    // Normal mode: add points to skills
                                    const points = Math.floor(Math.random() * 5) + 1;
                                    // Filter out maxed skills
                                    const availableSkills = categorySkills.filter(skill => !skillStateRef.current[skill]?.activated);
                                    const randomSkill = availableSkills.length > 0
                                        ? availableSkills[Math.floor(Math.random() * availableSkills.length)]
                                        : categorySkills[Math.floor(Math.random() * categorySkills.length)];
                                    onPointUpdate(randomSkill, points);
                                    addFloatingText(`+${points} ${randomSkill}`, b.x + brickInfo.width / 2, b.y, b.color);
                                }
                            }
                            return;
                        }
                    }
                }
            }
        }

        function drawBricks() {
            for (let c = 0; c < brickInfo.cols; c++) {
                for (let r = 0; r < brickInfo.rows; r++) {
                    const b = bricks[c][r];
                    if (b.status > 0) {
                        b.x = c * (brickInfo.width + brickInfo.padding) + brickInfo.offsetLeft;
                        b.y = r * (brickInfo.height + brickInfo.padding) + brickInfo.offsetTop;
                        ctx.beginPath();
                        ctx.rect(b.x, b.y, brickInfo.width, brickInfo.height);
                        ctx.fillStyle = b.color;
                        ctx.globalAlpha = b.status === 1 ? 1 : 0.3;
                        ctx.fill();
                        ctx.closePath();
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }
        
        function drawBall() {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#e0218a';
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
            ctx.fillStyle = '#0abdc6';
            ctx.fill();
            ctx.closePath();
        }

        function movePaddle() {
            paddle.x += paddle.dx;
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
        }

        function moveBall() {
            ball.x += ball.dx * speedMultiplier;
            ball.y += ball.dy * speedMultiplier;

            // Wall collision detection with position correction to prevent sticking
            if (ball.x + ball.radius > canvas.width) {
                ball.x = canvas.width - ball.radius;
                ball.dx = -Math.abs(ball.dx); // Force negative direction
            }
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.dx = Math.abs(ball.dx); // Force positive direction
            }

            // Top wall collision
            if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.dy = Math.abs(ball.dy); // Force downward
            }

            // Paddle collision with position correction
            if (ball.y + ball.radius > paddle.y && ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width) {
                if (ball.dy > 0) {
                    ball.y = paddle.y - ball.radius; // Prevent ball from going below paddle
                    ball.dy = -ball.dy;
                    let deltaX = ball.x - (paddle.x + paddle.width / 2);
                    ball.dx = Math.max(-8, Math.min(8, deltaX * 0.2));
                }
            } else if (ball.y + ball.radius > canvas.height) {
                if (gameStateRef.current === 'playing') {
                    setLives(prevLives => prevLives - 1);
                }
            }
        }
        
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks(); 
            drawBall(); 
            drawPaddle();
        }

        function gameLoop() {
            if (gameStateRef.current === 'playing') {
                movePaddle(); 
                moveBall(); 
                collisionDetection();
            } else if (gameStateRef.current === 'ready') {
               movePaddle();
               ball.x = paddle.x + paddle.width / 2;
            }
            draw();
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        initGame();
        const keyDownHandler = (e) => {
            if (e.key === "Right" || e.key === "ArrowRight" || e.key.toLowerCase() === "d") paddle.dx = paddle.speed;
            else if (e.key === "Left" || e.key === "ArrowLeft" || e.key.toLowerCase() === "a") paddle.dx = -paddle.speed;
        };
        const keyUpHandler = (e) => {
            if (["Right", "ArrowRight", "d", "Left", "ArrowLeft", "a"].includes(e.key) || ["right", "arrowright", "d", "left", "arrowleft", "a"].includes(e.key.toLowerCase())) paddle.dx = 0;
        };
        const mouseMoveHandler = e => {
            const relativeX = e.clientX - canvas.getBoundingClientRect().left;
            if (relativeX > 0 && relativeX < canvas.width) paddle.x = relativeX - paddle.width / 2;
        };
        const touchMoveHandler = e => {
            e.preventDefault();
            const relativeX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
            const relativeY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddle.x = relativeX - paddle.width / 2;

                // Show touch indicator
                setTouchIndicator({ x: relativeX, y: relativeY });
            }
        };
        const touchEndHandler = () => {
            setTouchIndicator(null);
        };
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
        canvas.addEventListener('mousemove', mouseMoveHandler);
        canvas.addEventListener('touchmove', touchMoveHandler, { passive: false });
        canvas.addEventListener('touchend', touchEndHandler);
        canvas.addEventListener('touchcancel', touchEndHandler);
        gameLoop();
        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
            canvas.removeEventListener('mousemove', mouseMoveHandler);
            canvas.removeEventListener('touchmove', touchMoveHandler);
            canvas.removeEventListener('touchend', touchEndHandler);
            canvas.removeEventListener('touchcancel', touchEndHandler);
        };
    }, [lives]);
    
    React.useEffect(() => {
        if (lives <= 0 && gameStateRef.current !== 'gameOver') {
            setGameState('gameOver');
        }
    }, [lives]);

    // Group skills by category for display
    const skillsByCategory = Object.entries(skills).map(([category, data]) => ({
        category,
        color: data.color,
        skills: data.skills.map(skill => ({
            name: skill,
            points: skillState[skill]?.points || 0,
            activated: skillState[skill]?.activated || false
        }))
    }));

    return (
        <div className={`relative max-w-3xl mx-auto ${gameState === 'ready' ? 'game-start-animation' : ''}`}>
            {/* Skills display on larger screens */}
            <div className="hidden xl:flex absolute left-0 top-0 bottom-0 -ml-44 flex-col gap-3 w-40 justify-center">
                {skillsByCategory.slice(0, Math.ceil(skillsByCategory.length / 2)).map(({ category, color, skills: categorySkills }) => (
                    <div key={category} className="bg-[var(--bg-medium)] rounded-lg p-2 border border-white/10">
                        <div className="text-xs font-bold mb-1" style={{ color }}>{category}</div>
                        <div className="flex flex-wrap gap-1">
                            {categorySkills.map(({ name, points, activated }) => (
                                <div
                                    key={name}
                                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                                    style={{
                                        backgroundColor: activated ? color : 'transparent',
                                        border: `1px solid ${points >= 1 ? color : 'rgba(255,255,255,0.1)'}`,
                                        boxShadow: points >= 1 ? `0 0 ${points * 2}px ${color}` : 'none',
                                        color: points >= 1 ? '#fff' : '#666'
                                    }}
                                    title={`${name}: ${points}/5`}
                                >
                                    {points}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="hidden xl:flex absolute right-0 top-0 bottom-0 -mr-44 flex-col gap-3 w-40 justify-center">
                {skillsByCategory.slice(Math.ceil(skillsByCategory.length / 2)).map(({ category, color, skills: categorySkills }) => (
                    <div key={category} className="bg-[var(--bg-medium)] rounded-lg p-2 border border-white/10">
                        <div className="text-xs font-bold mb-1" style={{ color }}>{category}</div>
                        <div className="flex flex-wrap gap-1">
                            {categorySkills.map(({ name, points, activated }) => (
                                <div
                                    key={name}
                                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                                    style={{
                                        backgroundColor: activated ? color : 'transparent',
                                        border: `1px solid ${points >= 1 ? color : 'rgba(255,255,255,0.1)'}`,
                                        boxShadow: points >= 1 ? `0 0 ${points * 2}px ${color}` : 'none',
                                        color: points >= 1 ? '#fff' : '#666'
                                    }}
                                    title={`${name}: ${points}/5`}
                                >
                                    {points}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
                <button onClick={() => setShowTutorial(true)} className="w-8 h-8 rounded-full bg-black/50 text-white font-bold text-xl hover:bg-black/80 transition-colors">?</button>
                <div className="flex items-center gap-2">
                     {isEndlessMode && (
                         <div className="font-mono text-sm font-bold text-purple-400 mr-2">
                             Score: {endlessScore}
                         </div>
                     )}
                     {[...Array(Math.max(0, Math.min(lives, 5)))].map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>)}
                     {[...Array(Math.max(0, 5 - Math.min(lives, 5)))].map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-gray-600"></div>)}
                </div>
            </div>
            <canvas ref={canvasRef} className="w-full h-auto bg-black rounded-lg md:cursor-none touch-none"></canvas>
            <div className="absolute inset-0 pointer-events-none">
                {floatingTexts.map(ft => (
                     <div key={ft.id} className="absolute floating-text font-mono font-bold" style={{ left: `${ft.x}px`, top: `${ft.y}px`, color: ft.color }}>
                        {ft.text}
                    </div>
                ))}
                {touchIndicator && (
                    <div
                        className="absolute w-6 h-6 rounded-full border-2 border-[var(--secondary)] animate-pulse"
                        style={{
                            left: `${touchIndicator.x}px`,
                            top: `${touchIndicator.y}px`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 10px var(--secondary)'
                        }}
                    />
                )}
            </div>
            {(gameState === 'gameOver' || gameState === 'win') && (
                <div className={`absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center rounded-lg z-30 ${gameState === 'gameOver' ? 'game-over-animation' : 'game-win-animation'}`}>
                    <h3 className="text-4xl font-bold text-glow">{gameState === 'win' ? 'ALL SYSTEMS ACTIVATED' : 'GAME OVER'}</h3>
                    <button onClick={() => {
                        const isWin = gameState === 'win';
                        if (isWin) {
                            onGameEnd(true);
                        } else {
                            // Just reset the game without closing it
                            setLives(5);
                            setGameState('ready');
                            if (isEndlessMode) {
                                setEndlessScore(0);
                            }
                        }
                    }} className="mt-4 bg-[var(--secondary)] text-white font-bold px-6 py-3 rounded-md button-glow">
                        {gameState === 'win' ? 'Continue' : 'Play Again'}
                    </button>
                </div>
            )}
            {showTutorial && (
                <div className="absolute inset-0 bg-black/90 flex flex-col justify-center items-center text-center p-4 rounded-lg z-20">
                    <h3 className="text-xl md:text-2xl font-bold mb-4">How to Play</h3>
                    <ul className="space-y-2 mb-4 text-sm md:text-base">
                        <li>- Use <strong>Touch</strong>, <strong>Mouse</strong>, <strong>A/D</strong>, or <strong>Arrow Keys</strong> to move paddle</li>
                        <li>- <strong>Tap/Click/Space</strong> to launch the ball</li>
                        <li>- Break colored bricks to earn points for skill categories</li>
                        <li>- Collect <strong>5 points</strong> for a skill to activate it</li>
                        <li>- Bricks regenerate slowly - use the gaps!</li>
                        <li>- Activate all skills to win! You have <strong>3 lives</strong></li>
                    </ul>
                    <button onClick={() => setShowTutorial(false)} className="bg-[var(--primary)] text-white px-4 py-2 rounded button-glow">Got it</button>
                </div>
            )}
            {isHacking && (
                <div className="absolute inset-0 bg-black/90 flex flex-col justify-center items-center text-center rounded-lg z-40 hacking-animation">
                    <div className="font-mono text-amber-400 text-sm mb-4">
                        <div className="mb-2">{'>'} Initiating breach protocol...</div>
                        <div className="mb-2">{'>'} {hackingMessage}</div>
                        <div className="inline-block">
                            <span className="animate-pulse">▮</span>
                        </div>
                    </div>
                </div>
            )}
            {!hasWonGame && (
                <div className="mt-4 flex justify-center gap-2 relative z-20">
                    <button
                        onClick={async () => {
                            setIsHacking(true);
                            const messages = [
                                'Bypassing firewall...',
                                'Decrypting security protocols...',
                                'Accessing skill matrix...',
                                'Injecting activation codes...',
                                'Uploading exploits...',
                                'Granting full access...'
                            ];

                            const allSkills = Object.keys(skillState);

                            for (let i = 0; i < messages.length; i++) {
                                setHackingMessage(messages[i]);
                                await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
                            }

                            // Activate skills one by one
                            for (const skill of allSkills) {
                                onPointUpdate(skill, 5);
                                await new Promise(resolve => setTimeout(resolve, 50));
                            }

                            await new Promise(resolve => setTimeout(resolve, 500));
                            setIsHacking(false);
                            setHackingMessage('');
                            onActivateAll();
                        }}
                        disabled={isHacking}
                        className="font-mono text-xs px-3 py-1 rounded border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Skip the game and activate all skills"
                    >
                        /cheat_activate_all
                    </button>
                </div>
            )}
        </div>
    );
};

