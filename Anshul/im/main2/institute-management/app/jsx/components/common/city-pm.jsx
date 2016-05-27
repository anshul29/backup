var React = require('react');

module.exports = React.createClass({

	propTypes: {
  		onSelection: React.PropTypes.func
	},

	selectCity: function(){
		this.props.onSelection(this.props.cityName);
	},
	
	render: function(){
		//console.log(this.props.cityName)
		if(this.props.pmList !== null && this.props.pmList !== undefined && this.props.pmList.length > 0){

			var list = this.props.pmList.map(function(pm){
				return <li className="item"> <div>{pm}</div></li>
			});

			return (
				<div className="row">
					
						<div className="box box-primary">
							<div className="box-header with-border" onClick={this.selectCity}>
								<a href='#'><h3 className="box-title" >{this.props.cityName}</h3></a>
								<div className="box-tools pull-right">
									<button type="button" className="btn btn-box-tool" data-widget="collapse" >
										<i className="fa fa-minus"></i>
									</button>	
								</div>
							</div>
							<div className="box-body">
								<ul className="products-list product-list-in-box">{list}</ul>
							</div>	
						</div>
					
				</div>
			)	
		}	
		else
			return (
				<div className="row">
					
						<div className="box box-primary">
							<div className="box-header with-border">
								<a href='#'><h3 className="box-title" onClick={this.selectCity}>{this.props.cityName}</h3></a>
							</div>
						</div>
					
				</div>
			)	
	}
});