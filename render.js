// Rendering functionality for Graph Visualizer
export class Renderer {
    constructor(visualizer) {
        this.visualizer = visualizer;
        this.setupRoundRectPolyfill();
    }
    
    resizeCanvas() {
        this.visualizer.canvas.width = window.innerWidth;
        this.visualizer.canvas.height = window.innerHeight;
    }
    
    updateStatus() {
        const statusText = document.getElementById('statusText');
        if (!this.visualizer.currentCell) {
            statusText.textContent = 'No cell selected';
            return;
        }
        
        if (this.visualizer.isEditMode) {
            statusText.textContent = `Editing: ${this.visualizer.currentCell.contents} (Press Esc to exit)`;
        } else {
            statusText.textContent = `Current cell: ${this.visualizer.currentCell.contents} (Use arrow keys to move, Enter to edit)`;
        }
    }
    
    calculatePositions() {
        this.visualizer.cellPositions.clear();
        // Calculate all positions relative to the current cell, with depth limit MAX_GRAPH_DISTANCE
        this.calculatePositionRecursive(this.visualizer.currentCell, 0, 0, new Set(), 0);
        // Apply viewport offset to center the current cell
        const centerX = this.visualizer.canvas.width / 2;
        const centerY = this.visualizer.canvas.height / 2;
        this.visualizer.cellPositions.forEach((pos, cell) => {
            pos.x += centerX - this.visualizer.cellSize.width / 2;
            pos.y += centerY - this.visualizer.cellSize.height / 2;
        });
    }
    
    calculatePositionRecursive(cell, x, y, visited, depth = 0) {
        if (!cell || visited.has(cell) || depth > this.visualizer.MAX_GRAPH_DISTANCE) return;
        visited.add(cell);
        this.visualizer.cellPositions.set(cell, { x, y });
        // Calculate positions for connected cells, incrementing depth
        if (cell.getUpCached()) {
            this.calculatePositionRecursive(cell.getUpCached(), x, y - this.visualizer.spacing.y, visited, depth + 1);
        }
        if (cell.getDownCached()) {
            this.calculatePositionRecursive(cell.getDownCached(), x, y + this.visualizer.spacing.y, visited, depth + 1);
        }
        if (cell.getLeftCached()) {
            this.calculatePositionRecursive(cell.getLeftCached(), x - this.visualizer.spacing.x, y, visited, depth + 1);
        }
        if (cell.getRightCached()) {
            this.calculatePositionRecursive(cell.getRightCached(), x + this.visualizer.spacing.x, y, visited, depth + 1);
        }
    }
    
    render() {
        // Clear canvas
        this.visualizer.ctx.clearRect(0, 0, this.visualizer.canvas.width, this.visualizer.canvas.height);
        
        if (!this.visualizer.currentCell) {
            return;
        }
        
        // Find up to MAX_VERTICAL_DISTANCE cells above and below the current cell
        const verticalColumn = new Set();
        let currentInColumn = this.visualizer.currentCell;
        let steps = 0;
        
        // Go up to MAX_VERTICAL_DISTANCE steps above
        while (currentInColumn && steps < this.visualizer.MAX_VERTICAL_DISTANCE) {
            verticalColumn.add(currentInColumn);
            currentInColumn = currentInColumn.getUpCached();
            steps++;
        }
        
        // Go down to MAX_VERTICAL_DISTANCE steps below
        currentInColumn = this.visualizer.currentCell.getDownCached();
        steps = 0;
        while (currentInColumn && steps < this.visualizer.MAX_VERTICAL_DISTANCE) {
            verticalColumn.add(currentInColumn);
            currentInColumn = currentInColumn.getDownCached();
            steps++;
        }
        
        // Add left and right neighbors of each cell in the vertical column
        const cellsToShow = new Set(verticalColumn);
        verticalColumn.forEach(cell => {
            if (cell.getLeftCached()) cellsToShow.add(cell.getLeftCached());
            if (cell.getRightCached()) cellsToShow.add(cell.getRightCached());
        });
        
        // Draw connections first (so they appear behind cells)
        this.drawConnections(cellsToShow);
        
        // Draw only the visible cells
        this.visualizer.cellPositions.forEach((pos, cell) => {
            if (cellsToShow.has(cell)) {
                this.drawCell(cell, pos.x, pos.y);
            }
        });
    }
    
    drawConnections(cellsToShow) {
        this.visualizer.ctx.strokeStyle = '#666';
        this.visualizer.ctx.lineWidth = 2;
        this.visualizer.ctx.setLineDash([]);
        
        this.visualizer.cellPositions.forEach((pos, cell) => {
            // Only draw connections for visible cells
            if (cellsToShow.has(cell)) {
                const centerX = pos.x + this.visualizer.cellSize.width / 2;
                const centerY = pos.y + this.visualizer.cellSize.height / 2;
                
                // Draw arrows to connected cells (only if both cells are visible)
                if (cell.getUpCached() && cellsToShow.has(cell.getUpCached())) {
                    const upPos = this.visualizer.cellPositions.get(cell.getUpCached());
                    this.drawArrow(centerX, centerY, centerX, upPos.y + this.visualizer.cellSize.height, 'up');
                }
                if (cell.getDownCached() && cellsToShow.has(cell.getDownCached())) {
                    const downPos = this.visualizer.cellPositions.get(cell.getDownCached());
                    this.drawArrow(centerX, centerY, centerX, downPos.y, 'down');
                }
                if (cell.getLeftCached() && cellsToShow.has(cell.getLeftCached())) {
                    const leftPos = this.visualizer.cellPositions.get(cell.getLeftCached());
                    this.drawArrow(centerX, centerY, leftPos.x + this.visualizer.cellSize.width, centerY, 'left');
                }
                if (cell.getRightCached() && cellsToShow.has(cell.getRightCached())) {
                    const rightPos = this.visualizer.cellPositions.get(cell.getRightCached());
                    this.drawArrow(centerX, centerY, rightPos.x, centerY, 'right');
                }
            }
        });
    }
    
    drawArrow(fromX, fromY, toX, toY, direction) {
        this.visualizer.ctx.beginPath();
        this.visualizer.ctx.moveTo(fromX, fromY);
        this.visualizer.ctx.lineTo(toX, toY);
        this.visualizer.ctx.stroke();
        
        // Draw arrowhead
        const arrowSize = 8;
        this.visualizer.ctx.beginPath();
        
        switch(direction) {
            case 'up':
                this.visualizer.ctx.moveTo(toX, toY);
                this.visualizer.ctx.lineTo(toX - arrowSize, toY + arrowSize);
                this.visualizer.ctx.lineTo(toX + arrowSize, toY + arrowSize);
                break;
            case 'down':
                this.visualizer.ctx.moveTo(toX, toY);
                this.visualizer.ctx.lineTo(toX - arrowSize, toY - arrowSize);
                this.visualizer.ctx.lineTo(toX + arrowSize, toY - arrowSize);
                break;
            case 'left':
                this.visualizer.ctx.moveTo(toX, toY);
                this.visualizer.ctx.lineTo(toX + arrowSize, toY - arrowSize);
                this.visualizer.ctx.lineTo(toX + arrowSize, toY + arrowSize);
                break;
            case 'right':
                this.visualizer.ctx.moveTo(toX, toY);
                this.visualizer.ctx.lineTo(toX - arrowSize, toY - arrowSize);
                this.visualizer.ctx.lineTo(toX - arrowSize, toY + arrowSize);
                break;
        }
        
        this.visualizer.ctx.closePath();
        this.visualizer.ctx.fillStyle = '#666';
        this.visualizer.ctx.fill();
    }
    
    drawCell(cell, x, y) {
        const isSelected = cell === this.visualizer.currentCell;
        
        // Draw cell background
        this.visualizer.ctx.fillStyle = isSelected ? '#e8f5e8' : '#fff';
        this.visualizer.ctx.strokeStyle = isSelected ? '#28a745' : '#ccc';
        this.visualizer.ctx.lineWidth = isSelected ? 3 : 2;
        
        this.visualizer.ctx.beginPath();
        this.visualizer.ctx.roundRect(x, y, this.visualizer.cellSize.width, this.visualizer.cellSize.height, 8);
        this.visualizer.ctx.fill();
        this.visualizer.ctx.stroke();
        
        // Draw cell content
        this.visualizer.ctx.fillStyle = '#333';
        this.visualizer.ctx.font = '12px Arial';
        this.visualizer.ctx.textAlign = 'center';
        this.visualizer.ctx.textBaseline = 'middle';
        
        const textX = x + this.visualizer.cellSize.width / 2;
        const textY = y + this.visualizer.cellSize.height / 2;
        
        // Wrap text if it's too long
        const maxWidth = this.visualizer.cellSize.width - 20;
        const words = cell.contents.split(' ');
        let line = '';
        let lines = [];
        
        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = this.visualizer.ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        
        // Draw lines of text
        const lineHeight = 16;
        const startY = textY - (lines.length - 1) * lineHeight / 2;
        
        lines.forEach((line, index) => {
            this.visualizer.ctx.fillText(line.trim(), textX, startY + index * lineHeight);
        });
    }
    
    setupRoundRectPolyfill() {
        // Add roundRect polyfill for older browsers
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
        }
    }
} 