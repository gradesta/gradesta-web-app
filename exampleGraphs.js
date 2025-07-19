import { createCollatzGraph } from './collatzGraph.js';
import { Cell } from './Cell.js';

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
    cell1.getRight = () => home;
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

    
    return cell1; // Entry point is the 'Back to Home' cell
}

// Home graph with links to both example graphs
function createHomeGraph() {
    const home = new Cell('Home');
    const sampleEntry = new Cell('Sample Graph');
    const collatzEntry = new Cell('Collatz Graph');
    // Link home to sample and collatz entries
    home.getDown = () => sampleEntry;
    sampleEntry.getUp = () => home;
    sampleEntry.getDown = () => createSampleGraph(home);
    sampleEntry.getRight = () => collatzEntry;
    collatzEntry.getLeft = () => sampleEntry;
    return home;
}

// Create the graphs and link them
const home = createHomeGraph();

export { home as home_graph, Cell }; 