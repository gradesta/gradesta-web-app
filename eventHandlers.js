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
        
        switch(e.key) {
            case 'ArrowUp':
                if (this.visualizer.currentCell.getUpCached()) {
                    this.visualizer.currentCell = this.visualizer.currentCell.getUpCached();
                    moved = true;
                }
                break;
            case 'ArrowDown':
                if (this.visualizer.currentCell.getDownCached()) {
                    this.visualizer.currentCell = this.visualizer.currentCell.getDownCached();
                    moved = true;
                }
                break;
            case 'ArrowLeft':
                if (this.visualizer.currentCell.getLeftCached()) {
                    this.visualizer.currentCell = this.visualizer.currentCell.getLeftCached();
                    moved = true;
                }
                break;
            case 'ArrowRight':
                if (this.visualizer.currentCell.getRightCached()) {
                    this.visualizer.currentCell = this.visualizer.currentCell.getRightCached();
                    moved = true;
                }
                break;
            case 'Enter':
                this.enterEditMode();
                break;
            case 'Home':
                this.jumpToHome();
                break;
        }
        
        if (moved) {
            this.visualizer.renderer.calculatePositions();
            this.visualizer.renderer.updateStatus();
            this.updateUrlFromCurrentCell();
            this.visualizer.render();
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
        this.visualizer.renderer.updateStatus();
        this.visualizer.render();
        
        // Remove any existing textarea
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => textarea.remove());
    }
    
    updateUrlFromCurrentCell() {
        // Find which graph provider contains the current cell
        for (const [providerName, provider] of this.visualizer.graphProviders) {
            // For each provider, we need to find the cell ID
            if (provider.name === 'home') {
                // For home provider, check each cell
                for (const [cellId, cell] of provider.cells) {
                    if (cell === this.visualizer.currentCell) {
                        this.updateUrlParams(providerName, cellId);
                        return;
                    }
                }
            } else if (provider.name === 'sample') {
                // For sample provider, check each cell
                for (const [cellId, cell] of provider.cells) {
                    if (cell === this.visualizer.currentCell) {
                        this.updateUrlParams(providerName, cellId);
                        return;
                    }
                }
            } else if (provider.name === 'collatz') {
                // For collatz provider, the cell ID is the number itself
                if (this.visualizer.currentCell.contents && !isNaN(parseInt(this.visualizer.currentCell.contents))) {
                    this.updateUrlParams(providerName, this.visualizer.currentCell.contents);
                    return;
                }
            }
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
    }
} 