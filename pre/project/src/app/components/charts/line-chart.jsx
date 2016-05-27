var React = require('react')
var LineChart = require('react-chartjs').Line;

module.exports = React.createClass({
    render: function() {

      var data = this.props.mainAttr
        // console.log(data.title)
      var chartData = data.data

      var chartOptions = {
          segmentShowStroke : true,
          segmentStrokeColor : "#fff",
          animationEasing : "easeOutBounce",
          responsive: true
      }
      // console.log(chartData)
      return (
        <div className="chart text-center">
        {/*<h3 >{data.title}</h3>*/}
          <LineChart data={chartData} options={chartOptions} />
        </div>
      )
    }
  })
