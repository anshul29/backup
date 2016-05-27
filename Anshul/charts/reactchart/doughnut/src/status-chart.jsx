var React = require('react');
var DoughnutChart = require("react-chartjs").Doughnut;
var Index = require('./index.jsx');

module.exports = React.createClass({
    render: function() {
        var colorSet = [
            {
                color:"#D32F2F",
                highlight: "#E53935"
            },{
                color:"#FFA000",
                highlight: "#FFB300"
            },{
                color:"#00C853",
                highlight: "#00E676"
            },{
                color:"#00E5FF",
                highlight: "#18FFFF"
            },{
                color:"#F7464A",
                highlight: "#FF5A5E"
            },{
                color:"#F7464A",
                highlight: "#FF5A5E"
            },{
                color:"#F7464A",
                highlight: "#FF5A5E"
            },{
                color:"#F7464A",
                highlight: "#FF5A5E"
            },{
                color:"#F7464A",
                highlight: "#FF5A5E"
            },{
                color:"#F7464A",
                highlight: "#FF5A5E"
            }
        ];

        var chartData = this.props.data;

        for(var i = 0; i < chartData.length; i++){
            chartData[i].color = colorSet[i].color;
            chartData[i].highlight = colorSet[i].highlight;
        };

        var chartOptions = {
            segmentShowStroke : true,
            segmentStrokeColor : "#fff",
            animationEasing : "easeOutBounce",
            responsive: true
        };

        // var weightedAvg = function() {
        //     for (var i = 0; i < chartData.length; i++){
        //         var weightedSum += chartData[i].value * (i+1);
        //     }
        //
        //     chartData.map(function(props){
        //          var x = props.value/>
        // }



        return  <div className="chart-title text-center"> {this.props.title}
            <DoughnutChart data={chartData} options={chartOptions} />
        </div>
    }
});
