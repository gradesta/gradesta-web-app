// Cell distance constants
const MAX_VERTICAL_DISTANCE = 5;
const MAX_GRAPH_DISTANCE = MAX_VERTICAL_DISTANCE + 1;

import { home_graph, Cell } from './exampleGraphs.js';
import { EventHandlers } from './eventHandlers.js';
import { Renderer } from './render.js';

// Graph Visualizer Class
class GraphVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.currentCell = home_graph;
        this.isEditMode = false;
        this.cellPositions = new Map();
        this.cellSize = { width: 120, height: 80 };
        this.spacing = { x: 200, y: 120 };
        this.MAX_VERTICAL_DISTANCE = MAX_VERTICAL_DISTANCE;
        this.MAX_GRAPH_DISTANCE = MAX_GRAPH_DISTANCE;
        
        // Initialize modules
        this.eventHandlers = new EventHandlers(this);
        this.renderer = new Renderer(this);
        
        this.resizeCanvas();
        this.renderer.calculatePositions();
        this.render();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    render() {
        this.renderer.render();
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