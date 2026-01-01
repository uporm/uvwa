import React, {useState, useRef, useCallback, ReactNode} from 'react';
import styles from './styles.less';

interface ResizablePanelProps {
    children: ReactNode;
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    isMaximized?: boolean;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
                    children,
                    defaultWidth = 400,
                    minWidth = 200,
                    maxWidth = 1200,
                    isMaximized = false
                }) => {
    const [panelWidth, setPanelWidth] = useState(defaultWidth);
    const [dragging, setDragging] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setDragging(true);

        const handleMouseMove = (e: MouseEvent) => {
            if (panelRef.current) {
                const rect = panelRef.current.getBoundingClientRect();
                const newWidth = rect.right - e.clientX;
                const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
                setPanelWidth(clampedWidth);
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [minWidth, maxWidth]);

    return (
        <div ref={panelRef}
             className={styles.resizablePanel}
             style={{height: '100%', ...(isMaximized ? {} : {width: panelWidth})}}>
            <div className={`${styles.resizeHandle} ${dragging ? styles.resizeHandleActive : ''}`}
                 onMouseDown={handleMouseDown}/>
            {children}
        </div>
    );
}

export default ResizablePanel;