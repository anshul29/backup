var React = require('react');
var CompetencyChart = require('./competency-chart.jsx');

var attr = {
    title: "Execution",
    chartData: [{
            value: 300,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
        },
        {
            value: 50,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Green"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Yellow"
    }],
    chartOptions: {
            segmentShowStroke : true,
            segmentStrokeColor : "#fff",
            segmentStrokeWidth : 2,
            percentageInnerCutout : 50,
            animationSteps : 100,
            animationEasing : "easeOutBounce"
    }
};

var element = React.createElement(CompetencyChart, attr);

React.render(element, document.querySelector('.target'));
