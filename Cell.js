// Cell data structure with 4 directional neighbor functions and contents
class Cell {
    constructor(contents = "") {
        this.contents = contents;  // String contents of the cell
        // Neighbor functions (can be reassigned)
        this.getUp = () => null;
        this.getDown = () => null;
        this.getLeft = () => null;
        this.getRight = () => null;
        
        // Cache for neighbor results
        this._upCache = null;
        this._downCache = null;
        this._leftCache = null;
        this._rightCache = null;
    }
    
    // Cached versions of neighbor methods
    getUpCached() {
        if (this._upCache === null) {
            this._upCache = this.getUp();
        }
        return this._upCache;
    }
    
    getDownCached() {
        if (this._downCache === null) {
            this._downCache = this.getDown();
        }
        return this._downCache;
    }
    
    getLeftCached() {
        if (this._leftCache === null) {
            this._leftCache = this.getLeft();
        }
        return this._leftCache;
    }
    
    getRightCached() {
        if (this._rightCache === null) {
            this._rightCache = this.getRight();
        }
        return this._rightCache;
    }
    
    // Method to clear all caches (useful when neighbor functions change)
    clearCache() {
        this._upCache = null;
        this._downCache = null;
        this._leftCache = null;
        this._rightCache = null;
    }
}

export { Cell }; 