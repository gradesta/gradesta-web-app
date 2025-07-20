// Cell distance constants
const MAX_VERTICAL_DISTANCE = 5;
const MAX_GRAPH_DISTANCE = MAX_VERTICAL_DISTANCE + 1;

import { homeProvider, Cell, graphProviders } from './exampleGraphs.js';
import { EventHandlers } from './eventHandlers.js';
import { Renderer } from './render.js';

// URL parameter utilities
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        graphProvider: urlParams.get('graphProvider') || 'home',
        cellId: urlParams.get('cellId') || 'home'
    };
}

function updateUrlParams(graphProvider, cellId) {
    const url = new URL(window.location);
    url.searchParams.set('graphProvider', graphProvider);
    url.searchParams.set('cellId', cellId);
    window.history.replaceState({}, '', url);
}

// Graph Visualizer Class
class GraphVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.graphProviders = graphProviders;
        this.currentGraphProvider = null;
        this.currentCell = null;
        this.isEditMode = false;
        this.cellPositions = new Map();
        this.cellSize = { width: 120, height: 80 };
        this.spacing = { x: 200, y: 120 };
        this.MAX_VERTICAL_DISTANCE = MAX_VERTICAL_DISTANCE;
        this.MAX_GRAPH_DISTANCE = MAX_GRAPH_DISTANCE;
        
        // Initialize from URL parameters
        this.initializeFromUrl();
        
        // Initialize modules
        this.eventHandlers = new EventHandlers(this);
        this.renderer = new Renderer(this);
        
        this.renderer.resizeCanvas();
        this.renderer.calculatePositions();
        this.render();
    }
    
    initializeFromUrl() {
        const params = getUrlParams();
        this.currentGraphProvider = this.graphProviders.get(params.graphProvider) || homeProvider;
        this.currentCell = this.currentGraphProvider.getCell(params.cellId) || homeProvider.getCell('home');
    }
    
    navigateToCell(graphProviderName, cellId) {
        const graphProvider = this.graphProviders.get(graphProviderName);
        if (graphProvider) {
            const cell = graphProvider.getCell(cellId);
            if (cell) {
                this.currentGraphProvider = graphProvider;
                this.currentCell = cell;
                this.renderer.calculatePositions();
                this.renderer.updateStatus();
                this.render();
                updateUrlParams(graphProviderName, cellId);
                return true;
            }
        }
        return false;
    }
    
    render() {
        this.renderer.render();
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GraphVisualizer('graphCanvas');
}); 