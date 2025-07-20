// Event Handlers for Graph Visualizer
export class EventHandlers {
    constructor(visualizer) {
        this.visualizer = visualizer;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        window.addEventListener('resize', () => {
            this.visualizer.resizeCanvas();
            this.visualizer.renderer.calculatePositions();
            this.visualizer.render();
        });
        this.visualizer.canvas.focus();
    }
    
    handleKeyPress(e) {
        if (this.visualizer.isEditMode) {
            // Don't handle keys in edit mode - let the textarea handle them
            return;
        }
        
        switch(e.key) {
            case 'ArrowUp':
                if (this.visualizer.currentCell.getUpCached()) {
                    this.visualizer.currentCell = this.visualizer.currentCell.getUpCached();
                    this.visualizer.renderer.calculatePositions();
                    this.visualizer.updateStatus();
                }
                break;
            case 'ArrowDown':
                if (this.visualizer.currentCell.getDownCached()) {
                    this.visualizer.currentCell = this.visualizer.currentCell.getDownCached();
                    this.visualizer.renderer.calculatePositions();
                    this.visualizer.updateStatus();
                }
                break;
            case 'ArrowLeft':
                if (this.visualizer.currentCell.getLeftCached()) {
                    this.visualizer.currentCell = this.visualizer.currentCell.getLeftCached();
                    this.visualizer.renderer.calculatePositions();
                    this.visualizer.updateStatus();
                }
                break;
            case 'ArrowRight':
                if (this.visualizer.currentCell.getRightCached()) {
                    this.visualizer.currentCell = this.visualizer.currentCell.getRightCached();
                    this.visualizer.renderer.calculatePositions();
                    this.visualizer.updateStatus();
                }
                break;
            case 'Enter':
                this.enterEditMode();
                break;
        }
        
        this.visualizer.render();
    }
    
    enterEditMode() {
        this.visualizer.isEditMode = true;
        this.visualizer.updateStatus();
        this.visualizer.render();
        
        // Create textarea for editing
        const pos = this.visualizer.cellPositions.get(this.visualizer.currentCell);
        if (pos) {
            const textarea = document.createElement('textarea');
            textarea.value = this.visualizer.currentCell.contents;
            textarea.style.position = 'absolute';
            textarea.style.left = (this.visualizer.canvas.offsetLeft + pos.x) + 'px';
            textarea.style.top = (this.visualizer.canvas.offsetTop + pos.y) + 'px';
            textarea.style.width = this.visualizer.cellSize.width + 'px';
            textarea.style.height = this.visualizer.cellSize.height + 'px';
            textarea.style.border = '2px solid #28a745';
            textarea.style.borderRadius = '8px';
            textarea.style.padding = '10px';
            textarea.style.fontSize = '12px';
            textarea.style.fontFamily = 'Arial, sans-serif';
            textarea.style.resize = 'none';
            textarea.style.zIndex = '1000';
            textarea.style.boxSizing = 'border-box';
            
            textarea.addEventListener('blur', () => {
                this.visualizer.currentCell.contents = textarea.value;
                this.exitEditMode();
            });
            
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.visualizer.currentCell.contents = textarea.value;
                    this.exitEditMode();
                }
            });
            
            document.body.appendChild(textarea);
            
            // Ensure the textarea is populated and visible
            setTimeout(() => {
                textarea.value = this.visualizer.currentCell.contents;
                textarea.focus();
                textarea.select();
            }, 10);
        }
    }
    
    exitEditMode() {
        this.visualizer.isEditMode = false;
        this.visualizer.updateStatus();
        this.visualizer.render();
        
        // Remove any existing textarea
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => textarea.remove());
    }
} 