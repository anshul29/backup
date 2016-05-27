import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main';// Our custom react component

// var Server = require('./server')

// var url = 'mongodb://localhost:27017/student';
// console.log(this.props.data)
injectTapEventPlugin();
ReactDOM.render(<Main />, document.getElementById('app'));
