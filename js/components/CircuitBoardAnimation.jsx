// CircuitBoardAnimation Component
const CircuitBoardAnimation = () => {
    const canvasRef = React.useRef(null);
    
    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const cellSize = 15;
        let gridWidth, gridHeight, signals = [], lastTime = 0;

        class Signal {
            constructor() {
                const startSide = Math.floor(Math.random() * 4);
                let endSide = Math.floor(Math.random() * 4);
                while (endSide === startSide) { endSide = Math.floor(Math.random() * 4); }
                this.startNode = this.getRandomNodeOnSide(startSide);
                this.endNode = this.getRandomNodeOnSide(endSide);
                this.path = this.findPath(this.startNode, this.endNode);
                this.progress = 0;
                this.speed = Math.random() * 10 + 5;
                this.color = `hsl(${Math.random() > 0.5 ? 180 + Math.random() * 20 : 300 + Math.random() * 40}, 100%, 60%)`;
                this.trailLength = 20;
            }
            
            getRandomNodeOnSide(side) {
                let x, y;
                switch (side) {
                    case 0: x = Math.floor(Math.random() * gridWidth); y = 0; break;
                    case 1: x = gridWidth - 1; y = Math.floor(Math.random() * gridHeight); break;
                    case 2: x = Math.floor(Math.random() * gridWidth); y = gridHeight - 1; break;
                    case 3: x = 0; y = Math.floor(Math.random() * gridHeight); break;
                }
                return { x, y };
            }
            
            findPath(start, end) {
                const queue = [[start]];
                const visited = new Set([`${start.x},${start.y}`]);
                while (queue.length > 0) {
                    const path = queue.shift();
                    const { x, y } = path[path.length - 1];
                    if (x === end.x && y === end.y) return path;
                    const neighbors = [{ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 }];
                    for (let i = neighbors.length - 1; i > 0; i--) { 
                        const j = Math.floor(Math.random() * (i + 1));
                        [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]]; 
                    }
                    for (const neighbor of neighbors) {
                        if (neighbor.x >= 0 && neighbor.x < gridWidth && neighbor.y >= 0 && neighbor.y < gridHeight && !visited.has(`${neighbor.x},${neighbor.y}`)) {
                            visited.add(`${neighbor.x},${neighbor.y}`);
                            const newPath = [...path, neighbor];
                            queue.push(newPath);
                        }
                    }
                }
                return [];
            }
            
            update(deltaTime) { 
                this.progress += this.speed * deltaTime; 
            }
            
            draw() {
                if (!this.path) return;
                for (let i = 0; i < this.path.length; i++) {
                    const distance = this.progress - i;
                    if (distance > 0 && distance < this.trailLength) {
                        const alpha = 1 - (distance / this.trailLength);
                        const { x, y } = this.path[i];
                        ctx.fillStyle = `rgba(${parseInt(this.color.slice(4, 7))}, ${parseInt(this.color.slice(9, 12))}, ${parseInt(this.color.slice(14, 17))}, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                if (this.progress < this.path.length) {
                    const headIndex = Math.floor(this.progress);
                    const p1 = this.path[headIndex];
                    if (p1) {
                        ctx.fillStyle = this.color;
                        ctx.shadowColor = this.color;
                        ctx.shadowBlur = 15;
                        ctx.beginPath();
                        ctx.arc(p1.x * cellSize + cellSize / 2, p1.y * cellSize + cellSize / 2, 2.5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
            }
        }
        
        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gridWidth = Math.floor(canvas.width / cellSize);
            gridHeight = Math.floor(canvas.height / cellSize);
            signals = [];
        };
        
        const animate = (timestamp) => {
            const deltaTime = (timestamp - lastTime) / 1000 || 0;
            lastTime = timestamp;
            ctx.fillStyle = 'rgba(13, 12, 29, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (let i = signals.length - 1; i >= 0; i--) {
                signals[i].update(deltaTime);
                signals[i].draw();
                if (signals[i].progress >= (signals[i].path?.length || 0)) {
                    signals.splice(i, 1);
                }
            }
            if (signals.length < 50 && Math.random() < 0.15) {
                signals.push(new Signal());
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        
        init();
        animate(0);
        window.addEventListener('resize', init);
        return () => { 
            cancelAnimationFrame(animationFrameId); 
            window.removeEventListener('resize', init); 
        };
    }, []);
    
    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen opacity-40 pointer-events-none z-0"></canvas>;
};
