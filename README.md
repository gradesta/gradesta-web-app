# Gradesta Web: Cell Graph Visualizer

A simple interactive graph visualizer for exploring cell-based graphs in the browser. Includes example graphs (a sample graph and a Collatz conjecture graph) and supports keyboard navigation and editing.

## Features
- Visualize and navigate custom cell graphs
- Example graphs: sample stack/branch and Collatz conjecture (1–10)
- Keyboard controls: arrow keys to move, Enter to edit, Esc to exit edit mode
- Easily extensible with new graph types

## Getting Started

### 1. Install dependencies

```
npm install
```

### 2. Build the project

To bundle the JavaScript for static hosting:

```
npm run build
```

This creates `bundle.js` for use in the browser.

### 3. Develop with auto-rebuild

To automatically rebuild the bundle when you save files:

```
npm run watch
```

### 4. Serve locally (optional but recommended)

For best results, use a local server (e.g. [live-server](https://www.npmjs.com/package/live-server)):

```
npx live-server
```

Or use any other static file server.

## Usage
- Open `index.html` in your browser (preferably via a local server)
- Use the arrow keys to navigate between cells
- Press Enter to edit a cell's contents
- Press Esc to exit edit mode
- Use the "Home" cell to switch between example graphs

## Project Structure
- `script.js` – Main application logic and rendering
- `exampleGraphs.js` – Example graph definitions and cell structure
- `index.html` – Main HTML file
- `style.css` – Styles
- `bundle.js` – Bundled output (auto-generated)

## Customization
You can add new graphs or modify existing ones in `exampleGraphs.js`.
