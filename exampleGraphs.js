import { Cell } from './Cell.js';
import { HomeGraphProvider } from './homeGraph.js';
import { SampleGraphProvider } from './sampleGraph.js';
import { CollatzGraphProvider } from './collatzGraph.js';
import { WebsocketGraphProvider } from './websocketGraphProvider.js';
// Create the graph providers
const homeProvider = new HomeGraphProvider();
const sampleProvider = new SampleGraphProvider(homeProvider.getCell('home'));
const collatzProvider = new CollatzGraphProvider(homeProvider.getCell('home'));
const fileBrowserProvider = new WebsocketGraphProvider('filebrowser', 'ws://0.0.0.0:8000/ws');
// Link the providers together
homeProvider.getCell('sampleEntry').getDown = () => sampleProvider.getCell('top');
homeProvider.getCell('collatzEntry').getDown = () => collatzProvider.getCell('1');
homeProvider.getCell('fileBrowserEntry').getDown = () => fileBrowserProvider.getCell('file:///');
// Create a map of all graph providers
const graphProviders = new Map();
graphProviders.set('home', homeProvider);
graphProviders.set('sample', sampleProvider);
graphProviders.set('collatz', collatzProvider);
graphProviders.set('filebrowser', fileBrowserProvider);
export { homeProvider, Cell, graphProviders }; 