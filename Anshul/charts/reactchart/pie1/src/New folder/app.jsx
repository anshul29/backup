var React = require('react');
var DistributionChart = require('./distribution-chart.jsx');

var element = React.createElement(DistributionChart);
React.render(element, document.querySelector('.target'));
