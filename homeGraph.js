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
        this.cells.set('home', new Cell({ text: 'Home', cellId: 'home', provider: this }));
        this.cells.set('sampleEntry', new Cell({ text: 'Sample Graph', cellId: 'sampleEntry', provider: this }));
        this.cells.set('collatzEntry', new Cell({ text: 'Collatz Graph', cellId: 'collatzEntry', provider: this }));
        this.cells.set('fileBrowserEntry', new Cell({ text: 'File Browser', cellId: 'fileBrowserEntry', provider: this }));
        // Link home to sample, collatz, and file browser entries
        this.cells.get('home').getDown = () => this.cells.get('sampleEntry');
        this.cells.get('sampleEntry').getUp = () => this.cells.get('home');
        this.cells.get('sampleEntry').getRight = () => this.cells.get('collatzEntry');
        this.cells.get('collatzEntry').getLeft = () => this.cells.get('sampleEntry');
        this.cells.get('collatzEntry').getRight = () => this.cells.get('fileBrowserEntry');
        this.cells.get('fileBrowserEntry').getLeft = () => this.cells.get('collatzEntry');
    }
    
    getCell(cellId) {
        return this.cells.get(cellId) || null;
    }
} 