var React = require('react')
var DistributionChart = require('./distribution-chart')
var StatusBar = require('./status-bar')

module.exports = React.createClass({
    render: function() {

        var dataStatus = {
            data: [{
                label: "Strongly Disagree",
                value: 67
            },{
                label: "Disagree",
                value: 70
            },{
                label: "Agree",
                value: 30
            },{
                label: "Strongly Agree",
                value: 19
            }],
            total: 250
        }

        var dataDistribution = [{
                label: "Execution",
                value: 12 },
                {
                label: "BRIO",
                value: 23},
                {
                label: "BRIO",
                value: 67},
                {
                label: "Reflection",
                value: 50}
            ]
        ;

        

        return <div>
                <StatusBar data={dataStatus} />
                <DistributionChart data={dataDistribution} />
        </div>
    }
});
