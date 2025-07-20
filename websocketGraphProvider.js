import { Cell } from './Cell.js';
import { GraphProvider } from './GraphProvider.js';

export class WebsocketGraphProvider extends GraphProvider {
    constructor(name, wsUrl) {
        super(name);
        this.wsUrl = wsUrl;
        this.ws = null;
        this.lastCellData = new Map(); // Only for last response per cellId
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(this.wsUrl.replace(/^@/, ''));
        this.ws.onmessage = (event) => {
            let data;
            try {
                data = JSON.parse(event.data);
                console.log('received response', JSON.stringify(data));
            } catch (e) {
                return;
            }
            if (data['cell-id']) {
                const cellId = data['cell-id'];
                if (this.lastCellData.has(cellId)) {
                    // Update the existing cell in place using cellFromResponse
                    const cell = this.lastCellData.get(cellId);
                    this.cellFromResponse(data, cell);
                } else {
                    // Store a new cell if not present
                    this.lastCellData.set(cellId, this.cellFromResponse(data));
                }
                console.log('lastCellData', this.lastCellData);
                this.notifyListeners(); // Trigger re-render
            }
        };
        this.ws.onclose = () => {
            setTimeout(() => this.connect(), 1000); // reconnect
        };
    }

    getCell(cellId) {
        // Always request from websocket
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ get: cellId }));
            console.log('sent request', JSON.stringify({ get: cellId }));
        } else {
            // Wait for connection
            const trySend = () => {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify({ get: cellId }));
                    console.log('sent request', JSON.stringify({ get: cellId }));
                } else {
                    console.log('waiting for connection');
                    setTimeout(trySend, 200);
                }
            };
            trySend();
        }
        console.log('lastCellData', this.lastCellData);
        // If we have a response, return the real cell, else return a skeleton
        if (this.lastCellData.has(cellId)) {
            return this.lastCellData.get(cellId);
        }
        // Create and store a persistent loading cell
        const loadingCell = new Cell({ text: 'Loading...', image: null, audio: null, file: null, cellId, provider: this });
        this.lastCellData.set(cellId, loadingCell);
        return loadingCell;
    }

    cellFromResponse(data, existingCell) {
        const cell = existingCell || new Cell({
            text: data.text || '',
            image: data.image || null,
            audio: data.audio || null,
            file: data.file || null,
            cellId: data['cell-id'] || null,
            provider: this
        });
        // Update content
        cell.text = data.text || '';
        cell.image = data.image || null;
        cell.audio = data.audio || null;
        cell.file = data.file || null;
        // Store neighbor IDs
        cell.upId = data.up || null;
        cell.downId = data.down || null;
        cell.leftId = data.left || null;
        cell.rightId = data.right || null;
        // Provide explicit neighbor fetch methods
        cell.getUp = () => cell.upId ? this.getCell(cell.upId) : undefined;
        cell.getDown = () => cell.downId ? this.getCell(cell.downId) : undefined;
        cell.getLeft = () => cell.leftId ? this.getCell(cell.leftId) : undefined;
        cell.getRight = () => cell.rightId ? this.getCell(cell.rightId) : undefined;
        return cell;
    }
} 