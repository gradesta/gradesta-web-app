import { Cell } from './Cell.js';
import { HomeGraphProvider } from './homeGraph.js';
import { SampleGraphProvider } from './sampleGraph.js';
import { CollatzGraphProvider } from './collatzGraph.js';

// Create the graph providers
const homeProvider = new HomeGraphProvider();
const sampleProvider = new SampleGraphProvider(homeProvider.getCell('home'));
const collatzProvider = new CollatzGraphProvider(homeProvider.getCell('home'));

// Link the providers together
homeProvider.getCell('sampleEntry').getDown = () => sampleProvider.getCell('top');
homeProvider.getCell('collatzEntry').getDown = () => collatzProvider.getCell('1');

// Create a map of all graph providers
const graphProviders = new Map();
graphProviders.set('home', homeProvider);
graphProviders.set('sample', sampleProvider);
graphProviders.set('collatz', collatzProvider);

export { homeProvider, Cell, graphProviders }; 