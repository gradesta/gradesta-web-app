// Event Handlers for Graph Visualizer
export class EventHandlers {
    constructor(visualizer) {
        this.visualizer = visualizer;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        window.addEventListener('resize', () => {
            this.visualizer.renderer.resizeCanvas();
            this.visualizer.renderer.calculatePositions();
            this.visualizer.render();
        });
        
        // Add click handler for home icon
        const homeIcon = document.getElementById('homeIcon');
        if (homeIcon) {
            homeIcon.addEventListener('click', () => this.jumpToHome());
        }
        
        this.visualizer.canvas.focus();
    }
    
    handleKeyPress(e) {
        if (this.visualizer.isEditMode) {
            // Don't handle keys in edit mode - let the textarea handle them
            return;
        }
        
        let moved = false;
        let nextCell = null;
        let direction = null;
        switch(e.key) {
            case 'ArrowUp':
                nextCell = this.visualizer.currentCell.getUpCached();
                direction = 'up';
                break;
            case 'ArrowDown':
                nextCell = this.visualizer.currentCell.getDownCached();
                direction = 'down';
                break;
            case 'ArrowLeft':
                nextCell = this.visualizer.currentCell.getLeftCached();
                direction = 'left';
                break;
            case 'ArrowRight':
                nextCell = this.visualizer.currentCell.getRightCached();
                direction = 'right';
                break;
            case 'Enter':
                this.enterEditMode();
                break;
            case 'Home':
                this.jumpToHome();
                break;
        }
        // Log current and next cell info
        console.log('[KeyPress]', e.key, 'CurrentCell:', this.visualizer.currentCell ? {cellId: this.visualizer.currentCell.cellId, text: this.visualizer.currentCell.text} : null, 'NextCell:', nextCell ? {cellId: nextCell.cellId, text: nextCell.text} : null, 'CurrentProvider:', this.visualizer.currentGraphProvider ? this.visualizer.currentGraphProvider.name : null);
        // If a navigation key was pressed and a next cell exists
        if (nextCell) {
            // Use the provider and cellId stored in the nextCell
            let foundProvider = nextCell.provider ? (nextCell.provider.name || null) : null;
            let foundCellId = nextCell.cellId;
            console.log('[Nav]', {foundProvider, foundCellId, nextCell});
            if (foundProvider && (foundProvider !== this.visualizer.currentGraphProvider.name || foundCellId !== this.visualizer.currentCellId)) {
                // Use navigateToCell for provider transitions or cellId changes
                this.visualizer.navigateToCell(foundProvider, foundCellId);
            } else {
                // Same provider, just update currentCell
                this.visualizer.currentCell = nextCell;
                this.visualizer.renderer.calculatePositions();
                this.visualizer.renderer.updateStatus();
                this.updateUrlFromCurrentCell();
                this.visualizer.render(); // Ensure re-render on navigation
            }
            moved = true;
        }
    }
    
    enterEditMode() {
        this.visualizer.isEditMode = true;
        this.visualizer.renderer.updateStatus();
        this.visualizer.render();
        
        // Create textarea for editing
        const pos = this.visualizer.cellPositions.get(this.visualizer.currentCell);
        if (pos) {
            const textarea = document.createElement('textarea');
            textarea.value = this.visualizer.currentCell.text;
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
                this.visualizer.currentCell.text = textarea.value;
                this.exitEditMode();
            });
            
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.visualizer.currentCell.text = textarea.value;
                    this.exitEditMode();
                }
            });
            
            document.body.appendChild(textarea);
            
            // Ensure the textarea is populated and visible
            setTimeout(() => {
                textarea.value = this.visualizer.currentCell.text;
                textarea.focus();
                textarea.select();
            }, 10);
        }
    }
    
    exitEditMode() {
        this.visualizer.isEditMode = false;
        this.visualizer.renderer.updateStatus();
        this.visualizer.render();
        
        // Remove any existing textarea
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => textarea.remove());
    }
    
    updateUrlFromCurrentCell() {
        // Use the provider and cellId stored in the current cell
        if (this.visualizer.currentCell && this.visualizer.currentCell.provider && this.visualizer.currentCell.cellId) {
            this.updateUrlParams(this.visualizer.currentCell.provider.name, this.visualizer.currentCell.cellId);
        }
    }
    
    updateUrlParams(graphProvider, cellId) {
        const url = new URL(window.location);
        url.searchParams.set('graphProvider', graphProvider);
        url.searchParams.set('cellId', cellId);
        window.history.replaceState({}, '', url);
    }
    
    jumpToHome() {
        this.visualizer.navigateToCell('home', 'home');
        this.visualizer.render(); // Ensure re-render after pressing Home
    }
} 