var React = require('react');
var LineChart = require("react-chartjs").Line;
var Index = require('./index.jsx');

module.exports = React.createClass({
    render: function() {
        var colorSet = [
            {
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
            },{
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ];

        var chartData = this.props.datasets;

        for(var i = 0; i < chartData.length; i++){
            chartData[i].fillColor = colorSet[i].fillColor;
            chartData[i].strokeColor = colorSet[i].strokeColor;
            chartData[i].highlightFill = colorSet[i].highlightFill;
            chartData[i].highlightStroke = colorSet[i].highlightStroke;
        };

        var chartOptions = {
            segmentShowStroke : true,
            segmentStrokeColor : "#fff",
            animationEasing : "easeOutBounce",
            responsive: true
        };

        if (this.props.size == "large") {
            return  <div className="chart-title text-center"> {this.props.title}
                <LineChart data={chartData} options={chartOptions} />
                <Index data={chartData} />
                    {/*    <Index data={chartData} />  */}
            </div>
        }
        else {
            return  <div className="chart-title text-center"> {this.props.title}
                <LineChart data={chartData} options={chartOptions} />
            </div>
        }
    }
});
