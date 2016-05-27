var React = require('react');

module.exports = React.createClass({

    handleHover: function() {
        this.setState({
            show: !this.state.show,
            height: !this.state.height,
            width: !this.state.width,
            hover: !this.state.hover
        })
    },
    getInitialState: function() {
        return {
            show: false,
            height: false,
            width: false,
            hover: false
         }
    },
    render: function() {

    var style = [];
    var remaining = this.props.total
    for(var i = 0; i < this.props.data.length; i++) {
        let value = this.props.data[i].value*100 / this.props.total
        style[i] = {
            width: value + "%"
        }
        remaining -= this.props.data[i].value
    }
    console.log(this.state.show)
    console.log(this.props.data[1].value)

    return <div className="progress"  onMouseOver={this.handleHover} onMouseOut={this.handleHover}
    style={{height: (this.state.height ? "20px" : "10px" ), width: (this.state.width ? "100%" : "50%" ) }} >
        <span className="remaining-value" style={{display: (this.state.show ? "" : "none")}}>{remaining}</span>
        <div className={"progress-bar progress-bar-info progress-bar" + (this.state.hover ? "-striped active" : "")} style={style[0]}>
            <span className="status-value" style={{display: (this.state.show ? "" : "none")}}>{this.props.data[0].value}</span>
            <span className="sr-only"></span>
        </div>
        <div className={"progress-bar progress-bar-success progress-bar" + (this.state.hover ? "-striped active" : "")} style={style[1]}>
            <span className="status-value" style={{display: (this.state.show ? "" : "none")}}>{this.props.data[1].value}</span>
            <span className="sr-only"></span>
        </div>
        <div className={"progress-bar progress-bar-warning progress-bar" + (this.state.hover ? "-striped active" : "")} style={style[2]}>
            <span className="status-value" style={{display: (this.state.show ? "" : "none")}}>{this.props.data[2].value}</span>
            <span className="sr-only"></span>
        </div>
        <div className={"progress-bar progress-bar-danger progress-bar" + (this.state.hover ? "-striped active" : "")} style={style[3]}>
            <span className="status-value" style={{display: (this.state.show ? "" : "none")}}>{this.props.data[3].value}</span>
            <span className="sr-only"></span>
        </div>
    </div>
}
});
