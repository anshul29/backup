var React = require('react');
var IndexItem = require('./index-item.jsx');

module.exports = React.createClass({
    render: function() {
        var list = this.props.data.map(function(indexProps){
            return <IndexItem {...indexProps} />
        });

        return  <div className="text-center"> {list} </div>
    }
});
