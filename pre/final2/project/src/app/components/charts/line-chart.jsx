var React = require('react')
var LineChart = require('react-chartjs').Line;

module.exports = React.createClass({
    render: function() {

      var data = this.props.mainAttr
      var chartData = data.data

      var chartOptions = {
          segmentShowStroke : true,
          segmentStrokeColor : "#fff",
          animationEasing : "easeOutBounce",
          responsive: true
      }

      return (
        <div className="chart text-center">
          <LineChart data={chartData} options={chartOptions} />
        </div>
      )
    }
  })
