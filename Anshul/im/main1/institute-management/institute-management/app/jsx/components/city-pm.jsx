var React = require('react');

module.exports = React.createClass({
	
	render: function(){
		if(this.props.pmList !== null && this.props.pmList !== undefined && this.props.pmList.length > 0){

			var list = this.props.pmList.map(function(pm){
				return <li className="item"> <div className="product-info product-title">{pm}</div></li>
			});

			return (
				<div className="row">
					<div className="col-md-6">
						<div className="box box-primary">
							<div className="box-header with-border">
								<h3 className="box-title">{this.props.cityName}</h3>
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
				</div>
			)	
		}	
		else
			return (
				<div className="row">
					<div className="col-md-6">
						<div className="box box-primary">
							<div className="box-header with-border">
								<h3 className="box-title">{this.props.cityName}</h3>
							</div>
						</div>
					</div>
				</div>
			)	
	}
});