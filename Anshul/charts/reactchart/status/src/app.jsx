var React = require('react');
var ReactDOM = require('react-dom');
var StatusBar = require('./status-bar.jsx');

var attr = {
    data: [{
        label: "Strongly Agree",
        value: 67
    },{
        label: "Agree",
        value: 95
    },{
        label: "Disagree",
        value: 45
    },{
        label: "Strongly Disagree",
        value: 19
    }],
    total: 250
};

var element = React.createElement(StatusBar, attr);

ReactDOM.render(element, document.querySelector('.target'));
