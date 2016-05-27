var React = require('react');
var IndexItem = require('./chart-index-item');

module.exports = React.createClass({
    render: function() {
        var list = this.props.dataIndex.map(function(indexProps){
            return <IndexItem {...indexProps} />
        });
        return <div className="box-footer no-padding"> {list} </div>
    }
});
