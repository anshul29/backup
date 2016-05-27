var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({

    render: function() {

    var data = this.props.data.data
    var style = [];
    var remaining = this.props.data.total
    for(var i = 0; i < data.length; i++) {
        let value = data[i].value*100 / this.props.data.total
        style[i] = {
            width: value + "%"
        }
        remaining -= data[i].value
    }

    var remainingPercent = remaining*100 / this.props.data.total

    return <div className="progress" style={{height: '10px'}}>
                <div className="progress-bar progress-bar-danger progress-bar" style={style[0]}>
                    <span className="tooltiptext">{data[0].label}: {data[0].value}</span>
                </div>
                <div className="progress-bar progress-bar-warning progress-bar" style={style[1]}>
                    <span className="tooltiptext">{data[1].label}: {data[1].value}</span>
                </div>
                <div className="progress-bar progress-bar-info progress-bar" style={style[2]}>
                    <span className="tooltiptext">{data[2].label}: {data[2].value}</span>
                </div>
                <div className="progress-bar progress-bar-success progress-bar" style={style[3]}>
                    <span className="tooltiptext">{data[3].label}: {data[3].value}</span>
                </div>
                <div className="remaining progress-bar" style={{width: (remainingPercent + "%") }}>
                    <span className="tooltiptext">Remaining: {remaining}</span>
                </div>
            </div>
    }
});
