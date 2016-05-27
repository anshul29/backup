var React = require('react');
var City = require('./city-pm');
// let cityStore = require('../stores/cityStore')

module.exports = React.createClass({

	propTypes: {
  		onSelection: React.PropTypes.func
	},

	getInitialState: function () {
	    return {
	      cities: [],
	    }
  	},

  	componentDidMount: function(){
  		this.state.cities = [
	  		{
	  			cityName: "Mumbai",
	  			pmList: ["Bhavi Doshi","Angie"]	
	  		},
	  		{
	  			cityName: "Pune",
	  			pmList: []
	  		},
	  		{
	  			cityName: "New Delhi",
	  			pmList: []
	  		},
	  		{
	  			cityName: "Chennai",
	  			pmList: []
	  		},
	  		{
	  			cityName: "Hyderabad",
	  			pmList: []
	  		},
	  		{
	  			cityName: "Ahmedabad",
	  			pmList: []
	  		},
	  		{
	  			cityName: "Bengaluru",
	  			pmList: []
	  		}
  		];
  	},

  	selectCity: function(city){
  		this.props.onSelection(city);
  	},
  	

	render: function(){
		// console.log('city-list='+JSON.stringify(this.props.cities))
		if(this.props.cities && this.props.cities.length > 0){

			var cityList = this.props.cities.map(city => (
				<City cityName={city} pmList={city.pmList} onSelection={this.selectCity} />
			));
		
			return 	<div className="col-md-4">
			<City cityName="National" />
					{cityList}
			</div>		

		} else 
			return <div className="col-md-4"><City cityName="National" />	</div>		
		
	}

});