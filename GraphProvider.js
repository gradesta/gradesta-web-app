import { Cell } from './Cell.js';

// Base class for graph providers
export class GraphProvider {
    constructor(name) {
        this.name = name;
    }
    
    // Abstract method that should be implemented by subclasses
    getCell(cellId) {
        throw new Error('getCell method must be implemented by subclass');
    }
} 