var React = require('react');
var PieChart = require('react-chartjs').Pie;
var Index = require('./index.jsx');

module.exports = React.createClass({
    render: function() {
        var colorSet = [
            {
                color:"#00464A",
                highlight: "#05494F"
            },{
                color:"#F09900",
                highlight: "#F7A90A"
            },{
                color:"#F7464A",
                highlight: "#FA4A4F"
            },{
                color:"#12AD78",
                highlight: "#1FB098"
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
        // console.log(this.props.mainAttr)
        var mainAttr = this.props.mainAttr
        var chartData = mainAttr.data;

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

        if (mainAttr.size == "large") {
            return  <div className="chart-title text-center">
            <h4>{mainAttr.title}</h4>
                <PieChart data={chartData} options={chartOptions} />
                <Index data={chartData} />
                    {/*    <Index data={chartData} />  */}
            </div>
        }
        else {
            return  <div className="chart-title text-center"> {mainAttr.title}
                <PieChart data={chartData} options={chartOptions} />
            </div>
        }
    }
});
