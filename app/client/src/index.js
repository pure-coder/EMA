import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import '../node_modules/dhtmlx-scheduler/codebase/dhtmlxscheduler_material2.css'
import 'axios';

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
