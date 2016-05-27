var React = require('react');
var PieChart = require('react-chartjs').Pie;
var Index = require('./chart-index');

module.exports = React.createClass({
    render: function() {

        var defaultColorSet = [
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
                highlight: "#F05A5E"
            },{
                color:"#F7464A",
                highlight: "#0F505E"
            },{
                color:"#F7464A",
                highlight: "#F45A5E"
            },{
                color:"#F7464A",
                highlight: "#555A9E"
            },{
                color:"#F7464A",
                highlight: "#123A5E"
            },{
                color:"#F7464A",
                highlight: "#765A5E"
            }
        ];

        var options = {
            segmentShowStroke : true,
            segmentStrokeColor : "#fff",
            animationEasing : "easeOutBounce",
            responsive: true
        };

        // console.log(JSON.stringify(this.props));

        var chartData = this.props.data;

        if(chartData && chartData.length > 0){

            for(var i = 0; i < chartData.length; i++){
                // if(!chartData[i].label && chartData[i].name)
                    chartData[i].label = chartData[i].name;
                // if(!chartData[i].value && chartData[i].count)
                    chartData[i].value = chartData[i].count;
                chartData[i].color = defaultColorSet[i].color;
                chartData[i].highlight = defaultColorSet[i].highlight;
            };


            if (this.props.size == "large") {
                return  <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">{this.props.title}</h3>
                                <br/>
                                <PieChart data={chartData} options={options} />
                                <Index dataIndex={chartData} />
                            </div>
                        </div>
            }
            else {
                return  <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">{this.props.title}</h3>

                                <PieChart data={chartData} options={options} />
                            </div>
                        </div>
            }
        } else {
            return <div> </div>
            
        }
    }
});
