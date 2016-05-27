var React = require('react');

module.exports = React.createClass({

	propTypes: {
  		onSelection: React.PropTypes.func
	},
	
	handleClick: function(){
		this.props.onSelection(this.props.person);
	},

	render: function(){
		return <a href="#"><div onClick={this.handleClick}>
					<div className="product-img"><img className="img-circle" 
							src={this.props.person.pictureURL?this.props.person.pictureURL:'https://lh3.googleusercontent.com/--5LUkkkJC04/AAAAAAAAAAI/AAAAAAAAAAA/Qxg8_KBM6hc/photo.jpg'} /></div>
					<div className="product-info box-title">{this.props.person.displayName}</div>
		</div></a>	
	}
});

