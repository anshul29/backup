var React = require('react');
var ReactDOM = require('react-dom');
var DistributionChart = require('./distribution-chart.jsx');

var mainAttr = {
    title: "Competency Distribution: Priority 1",
    size: "large",
    data: [{
        label: "Execution",
        value: 12 },
        {
        label: "Planning",
        value: 41},
        {
        label: "BRIO",
        value: 67},
        {
        label: "Reflection",
        value: 50}
]};

var element = React.createElement(DistributionChart, mainAttr);

ReactDOM.render(element, document.querySelector('.target'));
