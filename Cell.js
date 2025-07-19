// Cell data structure with 4 directional neighbor functions and contents
class Cell {
    constructor(contents = "") {
        this.contents = contents;  // String contents of the cell
        // Neighbor functions (can be reassigned)
        this.getUp = () => null;
        this.getDown = () => null;
        this.getLeft = () => null;
        this.getRight = () => null;
    }
}

export { Cell }; 