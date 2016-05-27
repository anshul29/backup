var React = require('react')
var Link = require('react-router').Link

module.exports = React.createClass({

	render: function(){
		var itemClass = this.props.active? "treeview active":"treeview"
		return 	<li className={itemClass}>
					<Link to={this.props.item.url?this.props.item.url:'/'}>
						<i className={this.props.item.iconClass}></i>
						<span>{this.props.item.name}</span>
						<span className="label label-primary pull-right"></span>
						<small className="label pull-right bg-red">{this.props.item.count}</small>
					</Link>
				</li>
	}
})

