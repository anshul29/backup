var React = require('react');

module.exports = React.createClass({
    render: function() {
        return <div className="chart-index-item text-left">
            <font color = {this.props.color} ><i className="fa fa-circle" ></i></font> {this.props.label}<span className="index-value" style={{float: 'right'}}>{this.props.value}</span>
        </div>
    }
});
