// Cell data structure with 4 directional neighbor functions and content slots
class Cell {
    constructor({
        text = "",
        image = null, // base64 string or null
        audio = null, // base64 string or null
        file = null,  // base64 string or null
        cellId = null, // unique cell identifier
        provider = null // reference to the graph provider
    } = {}) {
        this.text = text;      // String contents of the cell
        this.image = image;    // Base64 image data
        this.audio = audio;    // Base64 audio data
        this.file = file;      // Base64 file data
        this.cellId = cellId;  // Unique cell identifier
        this.provider = provider; // Reference to the graph provider
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