// SkillsBreaker Component
const SkillsBreaker = ({ skills, skillState, onPointUpdate, onGameEnd, onActivateAll, hasWonGame, onResetProgress }) => {
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
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadingProgress, setLoadingProgress] = React.useState(0);
    const gameStateRef = React.useRef(gameState);
    const skillStateRef = React.useRef(skillState);
    
    React.useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    // Loading screen effect
    React.useEffect(() => {
        const loadingSteps = [
            { progress: 20, message: 'Initializing game engine...' },
            { progress: 45, message: 'Loading skill matrix...' },
            { progress: 70, message: 'Rendering bricks...' },
            { progress: 90, message: 'Calibrating paddle...' },
            { progress: 100, message: 'Ready!' }
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < loadingSteps.length) {
                setLoadingProgress(loadingSteps[currentStep].progress);
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(() => setIsLoading(false), 200);
            }
        }, 150);

        return () => clearInterval(interval);
    }, []);

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
        const MAX_BALLS = 10; // Maximum number of balls allowed
        let speedMultiplier = 1;
        const paddle = {
            x: 0,
            y: 0,
            width: isMobile ? 120 : 100,
            height: isMobile ? 15 : 12,
            dx: 0,
            speed: isMobile ? 10 : 8
        };
        const balls = [{ x: 0, y: 0, radius: isMobile ? 8 : 7, dx: baseSpeed.x, dy: baseSpeed.y, active: true }];
        const bricks = [];
        const powerUps = []; // Array to store falling power-ups
        const hazards = []; // Array to store falling hazards
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
            // Reset to single ball
            balls.length = 0;
            balls.push({
                x: paddle.x + paddle.width / 2,
                y: paddle.y - (isMobile ? 8 : 7),
                radius: isMobile ? 8 : 7,
                dx: baseSpeed.x * (Math.random() > 0.5 ? 1 : -1) * speedMultiplier,
                dy: baseSpeed.y * speedMultiplier,
                active: true
            });
        };

        const addFloatingText = (text, x, y, color) => {
            const id = Date.now() + Math.random();
            setFloatingTexts(prev => [...prev, { id, text, x, y, color }]);
            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
            }, 1500);
        };

        function collisionDetection() {
            balls.forEach(ball => {
                if (!ball.active) return;

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

                                    // Brick regeneration: 5-7 seconds (faster due to multiple balls)
                                    // Don't regenerate if it's a permanent empty space
                                    if (!b.isEmpty) {
                                        const regenTime = 5000 + Math.random() * 2000; // 5-7 seconds
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

                                    // Spawn power-up (10% chance) if not at max balls
                                    const activeBalls = balls.filter(b => b.active).length;
                                    if (Math.random() < 0.1 && activeBalls < MAX_BALLS) {
                                        const powerUpType = Math.random() > 0.5 ? 'multiball' : 'split';
                                        powerUps.push({
                                            x: b.x + brickInfo.width / 2,
                                            y: b.y,
                                            width: 20,
                                            height: 20,
                                            type: powerUpType,
                                            dy: 2
                                        });
                                        console.log(`🎁 Power-up spawned: ${powerUpType} at (${Math.round(b.x)}, ${Math.round(b.y)})`);
                                    }

                                    // Spawn hazard (8% chance)
                                    if (Math.random() < 0.08) {
                                        hazards.push({
                                            x: b.x + brickInfo.width / 2,
                                            y: b.y,
                                            width: 15,
                                            height: 30,
                                            dy: 2.5 // Slightly faster than power-ups
                                        });
                                        console.log(`🔥 Hazard spawned at (${Math.round(b.x)}, ${Math.round(b.y)})`);
                                    }
                                }
                                return;
                            }
                        }
                    }
                }
            });
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
            balls.forEach(ball => {
                if (!ball.active) return;
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#e0218a';
                ctx.fill();
                ctx.closePath();
            });
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
            ctx.fillStyle = '#0abdc6';
            ctx.fill();
            ctx.closePath();
        }

        function drawPowerUps() {
            powerUps.forEach(powerUp => {
                ctx.beginPath();
                ctx.rect(powerUp.x - powerUp.width / 2, powerUp.y, powerUp.width, powerUp.height);
                ctx.fillStyle = powerUp.type === 'multiball' ? '#00ff00' : '#ffff00';
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.closePath();

                // Draw icon/text
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 12px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(powerUp.type === 'multiball' ? 'M' : 'S', powerUp.x, powerUp.y + 14);
            });
        }

        function movePowerUps() {
            powerUps.forEach((powerUp, index) => {
                powerUp.y += powerUp.dy;

                // Check collision with paddle
                if (powerUp.y + powerUp.height > paddle.y &&
                    powerUp.x + powerUp.width / 2 > paddle.x &&
                    powerUp.x - powerUp.width / 2 < paddle.x + paddle.width) {
                    console.log(`⚡ Power-up collected: ${powerUp.type}`);
                    activatePowerUp(powerUp.type);
                    powerUps.splice(index, 1);
                    addFloatingText(`${powerUp.type.toUpperCase()}!`, paddle.x + paddle.width / 2, paddle.y - 10, powerUp.type === 'multiball' ? '#00ff00' : '#ffff00');
                }

                // Remove if off screen
                if (powerUp.y > canvas.height) {
                    powerUps.splice(index, 1);
                }
            });
        }

        function drawHazards() {
            hazards.forEach(hazard => {
                // Draw flame-like hazard
                ctx.beginPath();
                // Main body - red/orange gradient
                const gradient = ctx.createLinearGradient(hazard.x, hazard.y, hazard.x, hazard.y + hazard.height);
                gradient.addColorStop(0, '#ff0000');
                gradient.addColorStop(0.5, '#ff6600');
                gradient.addColorStop(1, '#ffaa00');

                // Draw flame shape (triangle-ish)
                ctx.moveTo(hazard.x, hazard.y + hazard.height);
                ctx.lineTo(hazard.x - hazard.width / 2, hazard.y + hazard.height);
                ctx.lineTo(hazard.x, hazard.y);
                ctx.lineTo(hazard.x + hazard.width / 2, hazard.y + hazard.height);
                ctx.closePath();
                ctx.fillStyle = gradient;
                ctx.fill();

                // Add glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ff0000';
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw skull or danger symbol
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 16px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('💀', hazard.x, hazard.y + 20);
            });
        }

        function moveHazards() {
            hazards.forEach((hazard, index) => {
                hazard.y += hazard.dy;

                // Check collision with paddle - LOSE LIFE!
                if (hazard.y + hazard.height > paddle.y &&
                    hazard.x + hazard.width / 2 > paddle.x &&
                    hazard.x - hazard.width / 2 < paddle.x + paddle.width) {
                    console.log(`💀 HAZARD HIT! Life lost.`);
                    hazards.splice(index, 1);
                    addFloatingText('-1 LIFE!', paddle.x + paddle.width / 2, paddle.y - 10, '#ff0000');

                    // Enhanced flash effect - triple flash
                    canvas.style.backgroundColor = '#ff0000';
                    setTimeout(() => {
                        canvas.style.backgroundColor = '#000000';
                        setTimeout(() => {
                            canvas.style.backgroundColor = '#ff0000';
                            setTimeout(() => {
                                canvas.style.backgroundColor = '#000000';
                                setTimeout(() => {
                                    canvas.style.backgroundColor = '#ff0000';
                                    setTimeout(() => {
                                        canvas.style.backgroundColor = '#000000';
                                        // Only lose life after flash animation completes
                                        setLives(prevLives => prevLives - 1);
                                    }, 100);
                                }, 100);
                            }, 100);
                        }, 100);
                    }, 100);
                }

                // Remove if off screen
                if (hazard.y > canvas.height) {
                    hazards.splice(index, 1);
                }
            });
        }

        function activatePowerUp(type) {
            const activeBalls = balls.filter(b => b.active).length;

            if (type === 'multiball') {
                console.log(`🚀 Activating MULTIBALL (current balls: ${activeBalls})`);
                // Launch 3 new balls from paddle at different angles
                for (let i = 0; i < 3; i++) {
                    if (balls.length >= MAX_BALLS) break;

                    const angle = -60 + (i * 30); // -60°, -30°, 0°
                    const angleRad = (angle * Math.PI) / 180;
                    balls.push({
                        x: paddle.x + paddle.width / 2,
                        y: paddle.y - 10,
                        radius: isMobile ? 8 : 7,
                        dx: baseSpeed.x * Math.sin(angleRad) * speedMultiplier,
                        dy: baseSpeed.y * Math.cos(angleRad) * speedMultiplier,
                        active: true
                    });
                }
                console.log(`   Added ${Math.min(3, MAX_BALLS - activeBalls)} balls. Total: ${balls.filter(b => b.active).length}`);
            } else if (type === 'split') {
                console.log(`💥 Activating SPLIT (current balls: ${activeBalls})`);
                // Split ALL current balls into 3 each
                const currentBalls = balls.filter(b => b.active).slice(); // Copy active balls
                let ballsAdded = 0;

                currentBalls.forEach(ball => {
                    // Add 2 more balls for each existing ball (making 3 total from 1)
                    for (let i = 0; i < 2; i++) {
                        if (balls.length >= MAX_BALLS) break;

                        balls.push({
                            x: ball.x,
                            y: ball.y,
                            radius: ball.radius,
                            dx: ball.dx + (i === 0 ? -1.5 : 1.5),
                            dy: ball.dy,
                            active: true
                        });
                        ballsAdded++;
                    }
                });
                console.log(`   Split ${currentBalls.length} balls into ${currentBalls.length * 3} (added ${ballsAdded}). Total: ${balls.filter(b => b.active).length}`);
            }
        }

        function movePaddle() {
            paddle.x += paddle.dx;
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
        }

        function moveBall() {
            balls.forEach(ball => {
                if (!ball.active) return;

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
                    // Ball went off screen - deactivate it
                    ball.active = false;
                }
            });

            // Check if all balls are inactive - if so, lose a life
            const activeBalls = balls.filter(b => b.active);
            if (activeBalls.length === 0 && gameStateRef.current === 'playing') {
                setLives(prevLives => prevLives - 1);
            }
        }
        
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            drawPowerUps();
            drawHazards();
        }

        function gameLoop() {
            if (gameStateRef.current === 'playing') {
                movePaddle();
                moveBall();
                movePowerUps();
                moveHazards();
                collisionDetection();
            } else if (gameStateRef.current === 'ready') {
               movePaddle();
               // Keep ball(s) attached to paddle in ready state
               if (balls.length > 0 && balls[0].active) {
                   balls[0].x = paddle.x + paddle.width / 2;
               }
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
            {/* Mac-style Terminal Window */}
            <div className="bg-[#2d2d2d] rounded-lg overflow-hidden border border-[#3d3d3d] shadow-2xl">
                {/* Terminal Header */}
                <div className="bg-[#1e1e1e] px-3 py-2 flex items-center justify-between border-b border-[#3d3d3d]">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onGameEnd(false)}
                            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff6f67] transition-colors"
                            title="Close game"
                        ></button>
                        <div className="w-3 h-3 rounded-full bg-[#febc2e] opacity-50 cursor-not-allowed" title="Minimize (disabled)"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28c840] opacity-50 cursor-not-allowed" title="Maximize (disabled)"></div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-gray-400 text-xs font-medium">
                        SkillBreaker
                    </div>
                    <div className="flex items-center gap-3">
                        {isEndlessMode && (
                            <div className="font-mono text-xs text-purple-400">
                                Score: {endlessScore}
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            {[...Array(Math.max(0, Math.min(lives, 5)))].map((_, i) => {
                                const livesLost = 5 - lives;
                                const opacity = 1 - (livesLost * 0.15); // Each life lost reduces opacity by 15%
                                return (
                                    <span key={i} className="text-sm" style={{ opacity: Math.max(0.4, opacity) }}>❤️</span>
                                );
                            })}
                            {[...Array(Math.max(0, 5 - Math.min(lives, 5)))].map((_, i) => (
                                <span key={i} className="text-sm" style={{ filter: 'grayscale(100%) brightness(0.6)' }}>💔</span>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowTutorial(true)}
                            className="w-5 h-5 rounded bg-[#3d3d3d] text-white font-bold text-xs hover:bg-[#4d4d4d] transition-colors flex items-center justify-center"
                        >
                            ?
                        </button>
                    </div>
                </div>
                {/* Terminal Body with Canvas */}
                <div className="relative">
                    <canvas ref={canvasRef} className="w-full h-auto bg-black md:cursor-none touch-none"></canvas>

                    {/* Loading Screen */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50">
                            <div className="w-64 max-w-[80%]">
                                <div className="mb-6 text-center">
                                    <div className="text-[var(--secondary)] font-mono text-lg mb-2 glitch-hover">INITIALIZING...</div>
                                    <div className="text-gray-500 text-xs font-mono">
                                        {loadingProgress < 20 && 'Initializing game engine...'}
                                        {loadingProgress >= 20 && loadingProgress < 45 && 'Loading skill matrix...'}
                                        {loadingProgress >= 45 && loadingProgress < 70 && 'Rendering bricks...'}
                                        {loadingProgress >= 70 && loadingProgress < 90 && 'Calibrating paddle...'}
                                        {loadingProgress >= 90 && 'Ready!'}
                                    </div>
                                </div>
                                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden border border-[var(--secondary)]/30">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-300 ease-out"
                                        style={{
                                            width: `${loadingProgress}%`,
                                            boxShadow: '0 0 10px var(--secondary)'
                                        }}
                                    ></div>
                                </div>
                                <div className="mt-2 text-center text-[var(--primary)] font-mono text-xs">
                                    {loadingProgress}%
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Terminal Footer - Commands */}
                <div className="bg-[#1e1e1e] px-3 py-2 border-t border-[#3d3d3d] flex items-center gap-3">
                    <span className="text-[#28c840] font-mono text-xs">$</span>
                    {!hasWonGame ? (
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
                            className="font-mono text-xs text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Skip the game and activate all skills"
                        >
                            cheat_activate_all
                        </button>
                    ) : (
                        <button
                            onClick={onResetProgress}
                            className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors"
                            title="Reset all progress and start over"
                        >
                            reset_all_progress
                        </button>
                    )}
                </div>
                {/* Floating texts and overlays inside terminal body */}
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
                {/* Game Over / Win Overlay */}
                {(gameState === 'gameOver' || gameState === 'win') && (
                    <div className={`absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center z-30 ${gameState === 'gameOver' ? 'game-over-animation' : 'game-win-animation'}`}>
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
                {/* Tutorial Overlay */}
                {showTutorial && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col justify-center items-center text-center p-4 z-20">
                        <h3 className="text-xl md:text-2xl font-bold mb-4">How to Play</h3>
                        <ul className="space-y-2 mb-4 text-sm md:text-base text-left max-w-md">
                            <li>🎮 <strong>Controls:</strong> Touch, Mouse, A/D, or Arrow Keys to move paddle</li>
                            <li>🚀 <strong>Launch:</strong> Tap/Click/Space to launch the ball</li>
                            <li>🎯 <strong>Goal:</strong> Break bricks to earn points and activate all skills</li>
                            <li>⭐ <strong>Skills:</strong> Collect 5 points to activate a skill</li>
                            <li>🎁 <strong>Power-ups:</strong> Green (M) = Multi-ball, Yellow (S) = Split ball</li>
                            <li>💀 <strong>Hazards:</strong> AVOID red flames or lose a life!</li>
                            <li>🔄 <strong>Bricks:</strong> Regenerate in 5-7 seconds</li>
                            <li>❤️ <strong>Lives:</strong> You have 5 lives - game over when you run out</li>
                            <li>⚡ <strong>Max Balls:</strong> Can have up to 10 balls at once</li>
                        </ul>
                        <button onClick={() => setShowTutorial(false)} className="bg-[var(--primary)] text-white px-4 py-2 rounded button-glow">Got it</button>
                    </div>
                )}
                {/* Hacking Animation Overlay */}
                {isHacking && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col justify-center items-center text-center z-40 hacking-animation">
                        <div className="font-mono text-amber-400 text-sm mb-4">
                            <div className="mb-2">{'>'} Initiating breach protocol...</div>
                            <div className="mb-2">{'>'} {hackingMessage}</div>
                            <div className="inline-block">
                                <span className="animate-pulse">▮</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

