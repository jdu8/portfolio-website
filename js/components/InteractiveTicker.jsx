// Interactive Ticker Component
const InteractiveTicker = ({ items }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [hoveredIndex, setHoveredIndex] = React.useState(-1);
    const tickerRef = React.useRef(null);
    const itemRefs = React.useRef([]);

    const handleMouseMove = (e) => {
        if (!tickerRef.current) return;
        
        const rect = tickerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate which item is closest to mouse in both X and Y dimensions
        let closestIndex = -1;
        let closestDistance = Infinity;
        
        itemRefs.current.forEach((itemRef, index) => {
            if (itemRef) {
                const itemRect = itemRef.getBoundingClientRect();
                const itemCenterX = itemRect.left + itemRect.width / 2 - rect.left;
                const itemCenterY = itemRect.top + itemRect.height / 2 - rect.top;
                
                // Calculate 2D distance between mouse and item center
                const deltaX = mouseX - itemCenterX;
                const deltaY = mouseY - itemCenterY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                // Only consider items that are reasonably close (within 100px)
                if (distance < 100 && distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            }
        });
        
        setHoveredIndex(closestIndex);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setHoveredIndex(-1);
    };

    return (
        <div className="ticker-wrap">
            <div
                ref={tickerRef}
                className={`ticker ${isHovered ? 'ticker-paused' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {items.map((item, i) => (
                    <div
                        key={i}
                        ref={el => itemRefs.current[i] = el}
                        className={`ticker-item ${hoveredIndex === i ? 'ticker-item-highlighted' : ''}`}
                    >
                        {item}
                    </div>
                ))}
                {items.map((item, i) => (
                    <div
                        key={`dup-${i}`}
                        ref={el => itemRefs.current[i + items.length] = el}
                        className={`ticker-item ${hoveredIndex === (i + items.length) ? 'ticker-item-highlighted' : ''}`}
                    >
                        {item}
                    </div>
                ))}
                {items.map((item, i) => (
                    <div
                        key={`dup2-${i}`}
                        className={`ticker-item ${hoveredIndex === (i + items.length * 2) ? 'ticker-item-highlighted' : ''}`}
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};
