// SkillsBreaker Component
const SkillsBreaker = ({ skills, skillState, onPointUpdate, onGameEnd, onActivateAll }) => {
    const canvasRef = React.useRef(null);
    const [gameState, setGameState] = React.useState('ready');
    const [lives, setLives] = React.useState(3);
    const [showTutorial, setShowTutorial] = React.useState(false);
    const [floatingTexts, setFloatingTexts] = React.useState([]);
    const gameStateRef = React.useRef(gameState);
    
    React.useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

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
        const baseSpeed = { x: 3, y: -3 };
        let speedMultiplier = 1;
        const paddle = { x: 0, y: 0, width: 100, height: 12, dx: 0, speed: 8 };
        const ball = { x: 0, y: 0, radius: 7, dx: baseSpeed.x, dy: baseSpeed.y };
        const bricks = [];
        let brickInfo;

        const initGame = (isNewLife = false) => {
            const container = canvas.parentElement;
            canvas.width = container.offsetWidth;
            canvas.height = Math.min(container.offsetWidth * 0.7, 450);
            brickInfo = { rows: 5, cols: 8, width: 0, height: 20, padding: 5, offsetTop: 30, offsetLeft: 5 };
            brickInfo.width = (canvas.width - brickInfo.offsetLeft * 2 - brickInfo.padding * (brickInfo.cols - 1)) / brickInfo.cols;
            paddle.x = canvas.width / 2 - paddle.width / 2;
            paddle.y = canvas.height - 30;
            if (!isNewLife) {
                bricks.length = 0;
                const skillCategories = Object.keys(skills);
                for (let c = 0; c < brickInfo.cols; c++) {
                    bricks[c] = [];
                    for (let r = 0; r < brickInfo.rows; r++) {
                        const category = skillCategories[(c + r) % skillCategories.length];
                        bricks[c][r] = { x: 0, y: 0, status: 1, category, color: skills[category].color };
                    }
                }
            }
            resetBall();
        };

        const resetBall = () => {
            setGameState('ready');
            speedMultiplier = 1 + (0.2 * (3 - lives));
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
                            b.status = 2;
                            setTimeout(() => b.status = 1, 3000);
                            speedMultiplier += 0.02;
                            const points = Math.floor(Math.random() * 5) + 1;
                            const categorySkills = skills[b.category].skills;
                            const randomSkill = categorySkills[Math.floor(Math.random() * categorySkills.length)];
                            onPointUpdate(randomSkill, points);
                            addFloatingText(`+${points} ${randomSkill}`, b.x + brickInfo.width / 2, b.y, b.color);
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
            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx = -ball.dx;
            if (ball.y - ball.radius < 0) ball.dy = -ball.dy;
            if (ball.y + ball.radius > paddle.y && ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width) {
                if (ball.dy > 0) {
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
            if (relativeX > 0 && relativeX < canvas.width) paddle.x = relativeX - paddle.width / 2;
        };
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
        canvas.addEventListener('mousemove', mouseMoveHandler);
        canvas.addEventListener('touchmove', touchMoveHandler, { passive: false });
        gameLoop();
        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
            canvas.removeEventListener('mousemove', mouseMoveHandler);
            canvas.removeEventListener('touchmove', touchMoveHandler);
        };
    }, [lives]);
    
    React.useEffect(() => {
        if (lives <= 0 && gameStateRef.current !== 'gameOver') {
            setGameState('gameOver');
        }
    }, [lives]);

    return (
        <div className="relative max-w-3xl mx-auto">
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
                <button onClick={() => setShowTutorial(true)} className="w-8 h-8 rounded-full bg-black/50 text-white font-bold text-xl hover:bg-black/80 transition-colors">?</button>
                <div className="flex items-center gap-2">
                     {[...Array(Math.max(0, lives))].map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>)}
                     {[...Array(Math.max(0, 3 - lives))].map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-gray-600"></div>)}
                </div>
            </div>
            <canvas ref={canvasRef} className="w-full h-auto bg-black/30 rounded-lg cursor-none"></canvas>
            <div className="absolute inset-0 pointer-events-none">
                {floatingTexts.map(ft => (
                     <div key={ft.id} className="absolute floating-text font-mono font-bold" style={{ left: `${ft.x}px`, top: `${ft.y}px`, color: ft.color }}>
                        {ft.text}
                    </div>
                ))}
            </div>
            {(gameState === 'gameOver' || gameState === 'win') && (
                <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center rounded-lg">
                    <h3 className="text-4xl font-bold text-glow">{gameState === 'win' ? 'ALL SYSTEMS ACTIVATED' : 'GAME OVER'}</h3>
                    <button onClick={() => { setLives(3); onGameEnd(gameState === 'win'); }} className="mt-4 bg-[var(--secondary)] text-white font-bold px-6 py-3 rounded-md button-glow">Play Again</button>
                </div>
            )}
            {showTutorial && (
                <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-center p-4 rounded-lg z-20">
                    <h3 className="text-2xl font-bold mb-4">How to Play</h3>
                    <ul className="space-y-2 mb-4">
                        <li>- Use **Mouse**, **A/D**, or **Arrow Keys** to move the paddle.</li>
                        <li>- **Click** or press **Space** to launch the ball.</li>
                        <li>- Break colored bricks to earn points for skill categories.</li>
                        <li>- Collect **5 points** for a skill to activate it.</li>
                        <li>- Activate all skills to win! You have **3 lives**.</li>
                    </ul>
                    <button onClick={() => setShowTutorial(false)} className="bg-[var(--primary)] text-white px-4 py-2 rounded">Got it</button>
                </div>
            )}
            <div className="mt-4 text-center">
                <button onClick={onActivateAll} className="bg-gray-700 text-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-600">I'm bored now</button>
            </div>
        </div>
    );
};

