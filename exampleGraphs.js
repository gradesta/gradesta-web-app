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

// Collatz graph generator for numbers 1-10
function createCollatzGraph(home) {
    const cells = new Map();
    // Create cells for numbers 1-10
    for (let i = 1; i <= 10; i++) {
        cells.set(i, new Cell(`Collatz: ${i}`));
    }
    // Link each cell to its Collatz next step
    for (let i = 2; i <= 10; i++) {
        const next = i % 2 === 0 ? i / 2 : 3 * i + 1;
        if (cells.has(next)) {
            cells.get(i).getDown = () => cells.get(next);
        } else {
            // If next is out of range, link to 1 if possible
            if (cells.has(1)) {
                cells.get(i).getDown = () => cells.get(1);
            }
        }
    }
    // Add a 'Back to Home' cell
    const backToHome = new Cell('Back to Home');
    backToHome.getDown = () => cells.get(1);
    cells.get(1).getUp = () => backToHome;
    backToHome.getUp = () => home;
    return backToHome; // Entry point is the 'Back to Home' cell
}

// Sample graph with 5 cells in a stack with some left/right connections
function createSampleGraph(home) {
    // Create 5 cells
    const cell1 = new Cell("Top");
    const cell2 = new Cell("Second");
    const cell3 = new Cell("Third");
    const cell4 = new Cell("Fourth");
    const cell5 = new Cell("Bottom");
    
    // Create left and right branch cells
    const leftBranch = new Cell("Left Branch");
    const rightBranch = new Cell("Right Branch");
    const leftLeaf = new Cell("Left Leaf");
    const rightLeftLeaf = new Cell("Right Left Leaf");
    const rightLeaf = new Cell("Right Leaf");
    
    // Connect main stack vertically (using neighbor functions)
    cell1.getDown = () => cell2;
    cell2.getUp = () => cell1;
    cell2.getDown = () => cell3;
    cell3.getUp = () => cell2;
    cell3.getDown = () => cell4;
    cell4.getUp = () => cell3;
    cell4.getDown = () => cell5;
    cell5.getUp = () => cell4;
    
    // Add left/right connections (using neighbor functions)
    cell2.getLeft = () => leftBranch;
    leftBranch.getRight = () => cell2;
    leftBranch.getDown = () => leftLeaf;
    leftLeaf.getUp = () => leftBranch;
    leftLeaf.getRight = () => rightLeftLeaf;
    rightLeftLeaf.getLeft = () => leftLeaf;
    
    cell3.getRight = () => rightBranch;
    rightBranch.getLeft = () => cell3;
    rightBranch.getDown = () => rightLeaf;
    rightLeaf.getUp = () => rightBranch;
    
    // Add a 'Back to Home' cell
    const backToHome = new Cell('Back to Home');
    backToHome.getDown = () => cell1;
    cell1.getUp = () => backToHome;
    backToHome.getUp = () => home;
    
    return backToHome; // Entry point is the 'Back to Home' cell
}

// Home graph with links to both example graphs
function createHomeGraph() {
    const home = new Cell('Home');
    const sampleEntry = new Cell('Sample Graph');
    const collatzEntry = new Cell('Collatz Graph');
    // Link home to sample and collatz entries
    home.getDown = () => sampleEntry;
    sampleEntry.getUp = () => home;
    sampleEntry.getDown = () => null;
    sampleEntry.getRight = () => collatzEntry;
    collatzEntry.getLeft = () => sampleEntry;
    collatzEntry.getUp = () => home;
    // Link sample and collatz entries to their respective graphs
    // We'll set these after creating the graphs to avoid circular dependency
    return { home, sampleEntry, collatzEntry };
}

// Create the graphs and link them
const { home, sampleEntry, collatzEntry } = createHomeGraph();
const sample_graph = createSampleGraph(home);
const collatz_graph = createCollatzGraph(home);
sampleEntry.getDown = () => sample_graph;
collatzEntry.getDown = () => collatz_graph;

export { home as home_graph, collatz_graph, Cell }; 