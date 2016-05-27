var React = require('react');
var Person = require('./person');
// let circleStore = require('../../stores/circleStore')
// let competencyStore = require('../../stores/competencyStore')

module.exports = React.createClass({

	propTypes: {
  		onSelection: React.PropTypes.func
	},

  	selectFellow: function(fellow){
		this.props.onSelection(fellow);
	},
  	
	render: function(){

		if(this.props.fellows && this.props.fellows.length > 0){
			var fellowList = this.props.fellows.map(fellow => (
				<li className={fellow.email === this.props.selectedFellowEmail? "item active":"item" } >
					<Person person={fellow} onSelection={this.selectFellow} />
				</li>
			));
		
			return 	<div className="row">
						<div className="box box-primary">
							<div className="box-header with-border" >
								<h3 className="box-title">My Learning Circle</h3>
								<div className="box-tools pull-right">
									<button type="button" className="btn btn-box-tool" data-widget="collapse" >
										<i className="fa fa-minus"></i>
									</button>	
								</div>
							</div>

							<div className="box-body" >
									<ul className="products-list product-list-in-box">{fellowList}
									</ul>
								</div>	
						</div>
					</div>
		}  // end of if
		else
			return <div></div>
	} // end of render

});