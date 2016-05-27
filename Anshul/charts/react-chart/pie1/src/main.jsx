var React = require('react');
var ReactDOM = require('react-dom');
var List = require('./components/List.jsx');
var LineChart = require("react-chartjs").Line;

var chartData = {
    
}
var MyComponent = React.createClass({
  render: function() {
    return <LineChart data={this.props.chartData} options={this.props.chartOptions}/>
  }
});

// ReactDOM.render(<List />, document.getElementById('ingredients'));
ReactDOM.render(<LineChart />);
