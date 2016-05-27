var React = require('react');
var ReactDOM = require('react-dom');
var StatusChart = require('./status-chart.jsx');

var mainAttr = {
    title: "Competency Distribution: Priority 1",
    size: "large",
    data: [{
        label: "Strongly Disagree",
        value: 12},
        {
        label: "Disagree",
        value: 41},
        {
        label: "Agree",
        value: 67},
        {
        label: "Strongly Disagree",
        value: 50}
]};

var element = React.createElement(StatusChart, mainAttr);

ReactDOM.render(element, document.querySelector('.target'));
