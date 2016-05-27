var React = require('react');
var ReactDOM = require('react-dom');
var DistributionChart = require('./distribution-chart.jsx');

var maniAttr = {
    title: "Growth Tracker: Planning",
    size: "large",
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};



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
