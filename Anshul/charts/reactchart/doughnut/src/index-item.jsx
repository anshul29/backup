var React = require('react');

module.exports = React.createClass({
    render: function() {
        return <div className="text-left">
            <font color = {this.props.color} ><i className="fa fa-circle" ></i></font> {this.props.label}
        </div>
    }
});
