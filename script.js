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
        
        this.renderer.resizeCanvas();
        this.renderer.calculatePositions();
        this.render();
    }
    
    render() {
        this.renderer.render();
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GraphVisualizer('graphCanvas');
}); 