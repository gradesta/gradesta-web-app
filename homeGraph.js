import { Cell } from './Cell.js';
import { GraphProvider } from './GraphProvider.js';

// Home Graph Provider
export class HomeGraphProvider extends GraphProvider {
    constructor() {
        super('home');
        this.cells = new Map();
        this.initializeCells();
    }
    
    initializeCells() {
        this.cells.set('home', new Cell('Home'));
        this.cells.set('sampleEntry', new Cell('Sample Graph'));
        this.cells.set('collatzEntry', new Cell('Collatz Graph'));
        
        // Link home to sample and collatz entries
        this.cells.get('home').getDown = () => this.cells.get('sampleEntry');
        this.cells.get('sampleEntry').getUp = () => this.cells.get('home');
        this.cells.get('sampleEntry').getRight = () => this.cells.get('collatzEntry');
        this.cells.get('collatzEntry').getLeft = () => this.cells.get('sampleEntry');
    }
    
    getCell(cellId) {
        return this.cells.get(cellId) || null;
    }
} 