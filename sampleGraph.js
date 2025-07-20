import { Cell } from './Cell.js';
import { GraphProvider } from './GraphProvider.js';

// Sample Graph Provider
export class SampleGraphProvider extends GraphProvider {
    constructor(home) {
        super('sample');
        this.home = home;
        this.cells = new Map();
        this.initializeCells();
    }
    
    initializeCells() {
        // Create all cells
        this.cells.set('top', new Cell({ text: "Top", cellId: 'top', provider: this }));
        this.cells.set('second', new Cell({ text: "Second", cellId: 'second', provider: this }));
        this.cells.set('third', new Cell({ text: "Third", cellId: 'third', provider: this }));
        this.cells.set('fourth', new Cell({ text: "Fourth", cellId: 'fourth', provider: this }));
        this.cells.set('bottom', new Cell({ text: "Bottom", cellId: 'bottom', provider: this }));
        this.cells.set('leftBranch', new Cell({ text: "Left Branch", cellId: 'leftBranch', provider: this }));
        this.cells.set('rightBranch', new Cell({ text: "Right Branch", cellId: 'rightBranch', provider: this }));
        this.cells.set('leftLeaf', new Cell({ text: "Left Leaf", cellId: 'leftLeaf', provider: this }));
        this.cells.set('rightLeftLeaf', new Cell({ text: "Right Left Leaf", cellId: 'rightLeftLeaf', provider: this }));
        this.cells.set('rightLeaf', new Cell({ text: "Right Leaf", cellId: 'rightLeaf', provider: this }));
        
        // Connect main stack vertically
        this.cells.get('top').getDown = () => this.cells.get('second');
        this.cells.get('top').getRight = () => this.home;
        this.cells.get('second').getUp = () => this.cells.get('top');
        this.cells.get('second').getDown = () => this.cells.get('third');
        this.cells.get('third').getUp = () => this.cells.get('second');
        this.cells.get('third').getDown = () => this.cells.get('fourth');
        this.cells.get('fourth').getUp = () => this.cells.get('third');
        this.cells.get('fourth').getDown = () => this.cells.get('bottom');
        this.cells.get('bottom').getUp = () => this.cells.get('fourth');
        
        // Add left/right connections
        this.cells.get('second').getLeft = () => this.cells.get('leftBranch');
        this.cells.get('leftBranch').getRight = () => this.cells.get('second');
        this.cells.get('leftBranch').getDown = () => this.cells.get('leftLeaf');
        this.cells.get('leftLeaf').getUp = () => this.cells.get('leftBranch');
        this.cells.get('leftLeaf').getRight = () => this.cells.get('rightLeftLeaf');
        this.cells.get('rightLeftLeaf').getLeft = () => this.cells.get('leftLeaf');
        
        this.cells.get('third').getRight = () => this.cells.get('rightBranch');
        this.cells.get('rightBranch').getLeft = () => this.cells.get('third');
        this.cells.get('rightBranch').getDown = () => this.cells.get('rightLeaf');
        this.cells.get('rightLeaf').getUp = () => this.cells.get('rightBranch');
    }
    
    getCell(cellId) {
        return this.cells.get(cellId) || null;
    }
}

// Legacy factory function for backward compatibility
export function createSampleGraph(home) {
    const sampleGraph = new SampleGraphProvider(home);
    return sampleGraph.getCell('top');
} 