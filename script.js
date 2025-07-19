// Cell data structure with 4 directional pointers and contents
class Cell {
    constructor(contents = "") {
        this.up = null;      // Pointer to cell above
        this.down = null;    // Pointer to cell below
        this.left = null;    // Pointer to cell to the left
        this.right = null;   // Pointer to cell to the right
        this.contents = contents;  // String contents of the cell
    }
}

// Sample graph with 5 cells in a stack with some left/right connections
const sample_graph = (() => {
    // Create 5 cells
    const cell1 = new Cell("Top");
    const cell2 = new Cell("Second");
    const cell3 = new Cell("Third");
    const cell4 = new Cell("Fourth");
    const cell5 = new Cell("Bottom");
    
    // Create left and right branch cells
    const leftBranch = new Cell("Left Branch");
    const rightBranch = new Cell("Right Branch");
    const leftLeaf = new Cell("Left Leaf");
    const rightLeftLeaf = new Cell("Right Left Leaf");
    const rightLeaf = new Cell("Right Leaf");
    
    // Connect main stack vertically
    cell1.down = cell2;
    cell2.up = cell1;
    cell2.down = cell3;
    cell3.up = cell2;
    cell3.down = cell4;
    cell4.up = cell3;
    cell4.down = cell5;
    cell5.up = cell4;
    
    // Add left/right connections
    cell2.left = leftBranch;
    leftBranch.right = cell2;
    leftBranch.down = leftLeaf;
    leftLeaf.up = leftBranch;
    leftLeaf.right = rightLeftLeaf;
    
    cell3.right = rightBranch;
    rightBranch.left = cell3;
    rightBranch.down = rightLeaf;
    rightLeaf.up = rightBranch;
    
    return cell1; // Return the top cell as the entry point
})();

// Graph Visualizer Class
class GraphVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.currentCell = sample_graph;
        this.isEditMode = false;
        this.cellPositions = new Map();
        this.cellSize = { width: 120, height: 80 };
        this.spacing = { x: 200, y: 120 };
        
        this.setupEventListeners();
        this.resizeCanvas();
        this.calculatePositions();
        this.render();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.calculatePositions();
            this.render();
        });
        this.canvas.focus();
    }
    
    handleKeyPress(e) {
        if (this.isEditMode) {
            // Don't handle keys in edit mode - let the textarea handle them
            return;
        }
        
        switch(e.key) {
            case 'ArrowUp':
                if (this.currentCell.up) {
                    this.currentCell = this.currentCell.up;
                    this.calculatePositions();
                    this.updateStatus();
                }
                break;
            case 'ArrowDown':
                if (this.currentCell.down) {
                    this.currentCell = this.currentCell.down;
                    this.calculatePositions();
                    this.updateStatus();
                }
                break;
            case 'ArrowLeft':
                if (this.currentCell.left) {
                    this.currentCell = this.currentCell.left;
                    this.calculatePositions();
                    this.updateStatus();
                }
                break;
            case 'ArrowRight':
                if (this.currentCell.right) {
                    this.currentCell = this.currentCell.right;
                    this.calculatePositions();
                    this.updateStatus();
                }
                break;
            case 'Enter':
                this.enterEditMode();
                break;
        }
        
        this.render();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    enterEditMode() {
        this.isEditMode = true;
        this.updateStatus();
        this.render();
        
        // Create textarea for editing
        const pos = this.cellPositions.get(this.currentCell);
        if (pos) {
            const textarea = document.createElement('textarea');
            textarea.value = this.currentCell.contents;
            textarea.style.position = 'absolute';
            textarea.style.left = (this.canvas.offsetLeft + pos.x) + 'px';
            textarea.style.top = (this.canvas.offsetTop + pos.y) + 'px';
            textarea.style.width = this.cellSize.width + 'px';
            textarea.style.height = this.cellSize.height + 'px';
            textarea.style.border = '2px solid #28a745';
            textarea.style.borderRadius = '8px';
            textarea.style.padding = '10px';
            textarea.style.fontSize = '12px';
            textarea.style.fontFamily = 'Arial, sans-serif';
            textarea.style.resize = 'none';
            textarea.style.zIndex = '1000';
            textarea.style.boxSizing = 'border-box';
            
            textarea.addEventListener('blur', () => {
                this.currentCell.contents = textarea.value;
                this.exitEditMode();
            });
            
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.currentCell.contents = textarea.value;
                    this.exitEditMode();
                }
            });
            
            document.body.appendChild(textarea);
            
            // Ensure the textarea is populated and visible
            setTimeout(() => {
                textarea.value = this.currentCell.contents;
                textarea.focus();
                textarea.select();
            }, 10);
        }
    }
    
    exitEditMode() {
        this.isEditMode = false;
        this.updateStatus();
        this.render();
        
        // Remove any existing textarea
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => textarea.remove());
    }
    
    calculatePositions() {
        this.cellPositions.clear();
        
        // Calculate all positions relative to the current cell
        this.calculatePositionRecursive(this.currentCell, 0, 0, new Set());
        
        // Apply viewport offset to center the current cell
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.cellPositions.forEach((pos, cell) => {
            pos.x += centerX - this.cellSize.width / 2;
            pos.y += centerY - this.cellSize.height / 2;
        });
    }
    
    calculatePositionRecursive(cell, x, y, visited) {
        if (!cell || visited.has(cell)) return;
        visited.add(cell);
        
        this.cellPositions.set(cell, { x, y });
        
        // Calculate positions for connected cells
        if (cell.up) {
            this.calculatePositionRecursive(cell.up, x, y - this.spacing.y, visited);
        }
        if (cell.down) {
            this.calculatePositionRecursive(cell.down, x, y + this.spacing.y, visited);
        }
        if (cell.left) {
            this.calculatePositionRecursive(cell.left, x - this.spacing.x, y, visited);
        }
        if (cell.right) {
            this.calculatePositionRecursive(cell.right, x + this.spacing.x, y, visited);
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate viewport bounds (3 columns centered on current cell)
        const centerX = this.canvas.width / 2;
        const leftBound = centerX - this.spacing.x * 1.5;
        const rightBound = centerX + this.spacing.x * 1.5;
        
        // Draw connections first (so they appear behind cells)
        this.drawConnections(leftBound, rightBound);
        
        // Draw cells within viewport
        this.cellPositions.forEach((pos, cell) => {
            if (pos.x >= leftBound - this.cellSize.width && pos.x <= rightBound + this.cellSize.width) {
                this.drawCell(cell, pos.x, pos.y);
            }
        });
    }
    
    drawConnections(leftBound, rightBound) {
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        
        this.cellPositions.forEach((pos, cell) => {
            // Only draw connections for cells within or near the viewport
            if (pos.x >= leftBound - this.cellSize.width && pos.x <= rightBound + this.cellSize.width) {
                const centerX = pos.x + this.cellSize.width / 2;
                const centerY = pos.y + this.cellSize.height / 2;
                
                // Draw arrows to connected cells
                if (cell.up && this.cellPositions.has(cell.up)) {
                    const upPos = this.cellPositions.get(cell.up);
                    this.drawArrow(centerX, centerY, centerX, upPos.y + this.cellSize.height, 'up');
                }
                if (cell.down && this.cellPositions.has(cell.down)) {
                    const downPos = this.cellPositions.get(cell.down);
                    this.drawArrow(centerX, centerY, centerX, downPos.y, 'down');
                }
                if (cell.left && this.cellPositions.has(cell.left)) {
                    const leftPos = this.cellPositions.get(cell.left);
                    this.drawArrow(centerX, centerY, leftPos.x + this.cellSize.width, centerY, 'left');
                }
                if (cell.right && this.cellPositions.has(cell.right)) {
                    const rightPos = this.cellPositions.get(cell.right);
                    this.drawArrow(centerX, centerY, rightPos.x, centerY, 'right');
                }
            }
        });
    }
    
    drawArrow(fromX, fromY, toX, toY, direction) {
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.stroke();
        
        // Draw arrowhead
        const arrowSize = 8;
        this.ctx.beginPath();
        
        switch(direction) {
            case 'up':
                this.ctx.moveTo(toX, toY);
                this.ctx.lineTo(toX - arrowSize, toY + arrowSize);
                this.ctx.lineTo(toX + arrowSize, toY + arrowSize);
                break;
            case 'down':
                this.ctx.moveTo(toX, toY);
                this.ctx.lineTo(toX - arrowSize, toY - arrowSize);
                this.ctx.lineTo(toX + arrowSize, toY - arrowSize);
                break;
            case 'left':
                this.ctx.moveTo(toX, toY);
                this.ctx.lineTo(toX + arrowSize, toY - arrowSize);
                this.ctx.lineTo(toX + arrowSize, toY + arrowSize);
                break;
            case 'right':
                this.ctx.moveTo(toX, toY);
                this.ctx.lineTo(toX - arrowSize, toY - arrowSize);
                this.ctx.lineTo(toX - arrowSize, toY + arrowSize);
                break;
        }
        
        this.ctx.closePath();
        this.ctx.fillStyle = '#666';
        this.ctx.fill();
    }
    
    drawCell(cell, x, y) {
        const isSelected = cell === this.currentCell;
        
        // Draw cell background
        this.ctx.fillStyle = isSelected ? '#e8f5e8' : '#fff';
        this.ctx.strokeStyle = isSelected ? '#28a745' : '#ccc';
        this.ctx.lineWidth = isSelected ? 3 : 2;
        
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, this.cellSize.width, this.cellSize.height, 8);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw cell content
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const textX = x + this.cellSize.width / 2;
        const textY = y + this.cellSize.height / 2;
        
        // Wrap text if it's too long
        const maxWidth = this.cellSize.width - 20;
        const words = cell.contents.split(' ');
        let line = '';
        let lines = [];
        
        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = this.ctx.measureText(testLine);
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
            this.ctx.fillText(line.trim(), textX, startY + index * lineHeight);
        });
    }
    
    updateStatus() {
        const statusText = document.getElementById('statusText');
        if (this.isEditMode) {
            statusText.textContent = `Editing: ${this.currentCell.contents} (Press Esc to exit)`;
        } else {
            statusText.textContent = `Current cell: ${this.currentCell.contents} (Use arrow keys to move, Enter to edit)`;
        }
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GraphVisualizer('graphCanvas');
});

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