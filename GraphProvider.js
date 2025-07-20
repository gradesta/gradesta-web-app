import { Cell } from './Cell.js';

// Base class for graph providers
export class GraphProvider {
    constructor(name) {
        this.name = name;
        this.listeners = new Set();
    }
    // Observer pattern
    addListener(listener) {
        this.listeners.add(listener);
    }
    removeListener(listener) {
        this.listeners.delete(listener);
    }
    notifyListeners() {
        for (const listener of this.listeners) {
            if (typeof listener === 'function') {
                listener();
            } else if (listener && typeof listener.onGraphProviderUpdate === 'function') {
                listener.onGraphProviderUpdate();
            }
        }
    }
    // Abstract method that should be implemented by subclasses
    getCell(cellId) {
        throw new Error('getCell method must be implemented by subclass');
    }
} 