var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({

    render: function() {
        var dataStatus = this.props.dataStatus
        var data = dataStatus.data;
        var style = [];
        var remaining;// = this.props.total
console.log(data)
        let total = 0;
        for(var i = 0; i < data.length; i++){
            data[i].name = data[i].label;

            // data[i].value = data[i].count;
            total += data[i].count;
            console.log(data[i].name)
            switch(data[i].name){
                case "Strongly Disagree": data[i].className = "progress-bar progress-bar-danger"; break;
                case "Disagree": data[i].className = "progress-bar progress-bar-warning"; break;
                case "Agree": data[i].className = "progress-bar progress-bar-info"; break;
                case "Strongly Agree": data[i].className = "progress-bar progress-bar-success"; break;
                default: data[i].className = "remaining progress-bar"; break;
            }
        }

        for(var i = 0; i < data.length; i++) {
            data[i].value = data[i].count*100 / total;

            data[i].style = {
                width: data[i].value + "%"
            }
            remaining -= data[i].count
        }

        var remainingPercent = remaining*100 / total;

        var distList = data.map(function(item, number) {
            return <div className={item.className} style={item.style}>
                        <span className="tooltiptext">{item.name}: {item.count} ({item.value}%)</span>
                    </div>
        });
console.log(data)
        return <div className="progress" style={{height: '10px'}}>
                    {distList}
                    <div className="remaining progress-bar" style={{width: (remainingPercent + "%") }}>
                        <span className="tooltiptext">Remaining: {remaining}</span>
                    </div>
                </div>
    }
});
