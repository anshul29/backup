var React = require('react');

var DistributionChart = React.createClass({
    render: function() {
        var data = [
            {
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
            }
        ];

        window.onload = function() {
            var element = document.getElementById("dist-chart").getContext("2d");
            window.myPie = new Chart(element).Pie(data);
        }

        return <canvas className="dist-chart" >
        </canvas>
    }
});

module.exports = DistributionChart;
