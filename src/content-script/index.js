import preact, {render} from 'preact';
import App from './components/app';

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

render(<App/>, mountNode);
