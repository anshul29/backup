// var React = require('react');
// var DistributionChart = require('./distribution-chart.jsx');
// //
// // var attr = {
// //     title: "Execution",
// //     chartData: [{
// //             value: 300,
// //             color:"#F7464A",
// //             highlight: "#FF5A5E",
// //             label: "Red"
// //         },
// //         {
// //             value: 50,
// //             color: "#46BFBD",
// //             highlight: "#5AD3D1",
// //             label: "Green"
// //         },
// //         {
// //             value: 100,
// //             color: "#FDB45C",
// //             highlight: "#FFC870",
// //             label: "Yellow"
// //     }],
// //     chartOptions: {
// //             segmentShowStroke : true,
// //             segmentStrokeColor : "#fff",
// //             segmentStrokeWidth : 2,
// //             percentageInnerCutout : 50,
// //             animationSteps : 100,
// //             animationEasing : "easeOutBounce"
// //     }
// // };
//
// var element = React.createElement(DistributionChart);
//
// React.render(element, document.querySelector('.target'));




var React = require('react');
var PieChart = require('react-chartjs').Pie;

var DistributionChart = React.createClass({
    render: function() {
        var chartData = [{
                value: 300,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Red"
            },{
                value: 50,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Green"
            },{
                value: 100,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Yellow"
        }];

        var chartOptions = {
                segmentShowStroke : true,
                segmentStrokeColor : "#fff",
                segmentStrokeWidth : 2,
                percentageInnerCutout : 50
        };

        return <PieChart data={chartData} options={chartOptions} width="650px" height="300px" />
        }
});

var element = <PieChart data={chartData} options={chartOptions} width="650px" height="300px" />

React.render(element, document.querySelector('.target'));
