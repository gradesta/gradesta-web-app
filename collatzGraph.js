import { Cell } from './Cell.js';

// Lazy Collatz graph generator
class LazyCollatzGraph {
    constructor(home) {
        this.home = home;
    }
    
    // Get or create a cell for a given number
    getCell(number) {
        if (number <= 0) {
            return null;
        }

        var cell = new Cell(number.toString());
        if (number == 1) {
            cell.getUp = () => this.home;
        }
        if (number % 2 == 0) {
            cell.getUp = () => this.getCell(number / 2);
        }
        cell.getDown = () => this.getCell(number * 2);
        // add a right cell if (number - 1) /3 is an integer and odd
        if ((number - 1) % 3 == 0 && (number - 1) / 3 % 2 == 1) {
            cell.getRight = () => this.getCell((number - 1) / 3);
        }
        // if number is odd then add a left cell if number*3 + 1 is an integer
        if (number % 2 == 1) {
            cell.getLeft = () => this.getCell(number*3 + 1);
        }
        return cell;
    }
}

// Factory function to create a Collatz graph
export function createCollatzGraph(home) {
    const collatzGraph = new LazyCollatzGraph(home);
    return collatzGraph.getCell(1);
}
