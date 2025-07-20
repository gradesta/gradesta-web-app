import { Cell } from './Cell.js';
import { GraphProvider } from './GraphProvider.js';

// Collatz Graph Provider
export class CollatzGraphProvider extends GraphProvider {
    constructor(home) {
        super('collatz');
        this.home = home;
    }
    
    getCell(cellId) {
        const number = parseInt(cellId);
        if (isNaN(number) || number <= 0) {
            return null;
        }

        var cell = new Cell({ text: number.toString() });
        if (number == 1) {
            cell.getUp = () => this.home;
        }
        if (number % 2 == 0) {
            cell.getUp = () => this.getCell((number / 2).toString());
        }
        cell.getDown = () => this.getCell((number * 2).toString());
        // add a right cell if (number - 1) /3 is an integer and odd
        if ((number - 1) % 3 == 0 && (number - 1) / 3 % 2 == 1) {
            cell.getRight = () => this.getCell(((number - 1) / 3).toString());
        }
        // if number is odd then add a left cell if number*3 + 1 is an integer
        if (number % 2 == 1) {
            cell.getLeft = () => this.getCell((number*3 + 1).toString());
        }
        return cell;
    }
}

// Legacy factory function for backward compatibility
export function createCollatzGraph(home) {
    const collatzGraph = new CollatzGraphProvider(home);
    return collatzGraph.getCell('1');
}
