var React = require('react')
var RadarChart = require('react-chartjs').Radar;

module.exports = React.createClass({
    render: function() {

      var data = this.props.mainAttr

      var defaultData = {
        labels: [],
        datasets: [
          {
            label: "Average Performance",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
          },
          {
            label: "Student Performance",
            fillColor: "rgba(42,172,193,0.2)",
            strokeColor: "rgba(42,172,193,1)",
            pointColor: "rgba(42,172,193,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(42,172,193,1)",
            data: []
          }
        ]
      }

      var radarData = defaultData;
      for (var i = 0; i < data.length; i ++) {
        radarData.labels[i] = data[i].label
        if (radarData.labels[i] === ("Maths" || "maths" || "MATHS")) {
          radarData.datasets[0].data[i] = (Math.random()*4 + 1).toFixed(2)
            radarData.datasets[1].data[i] = data[i].data/20
        }
        else {
          radarData.datasets[0].data[i] = (Math.random()*4 + 1).toFixed(2)
          radarData.datasets[1].data[i] = data[i].data
        }

      }

      var chartOptions = {
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        animationEasing : "easeOutBounce",
        responsive: true
      }

      return (
        <div className="chart text-center">
          <RadarChart data={radarData} options={chartOptions} />
        </div>
      )
    }
  })
