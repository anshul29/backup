var React = require('react')
var DistributionChart = require('./distribution-chart')
var StatusBar = require('./status-bar')

module.exports = React.createClass({
    render: function() {

        var data = [{
            
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
            }
        ];

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
                <StatusBar data={dataStatus} total="250" />
                <DistributionChart data={dataDistribution} />
        </div>
    }
});
