var React = require('react');
var PieChart = require("react-chartjs").Pie;

module.exports = React.createClass({
    render: function() {
        

        return  <div className="chart-title text-center"> {this.props.title}
                <PieChart data={chartData} options={chartOptions} width={} height={} />
        </div>
  }
});
