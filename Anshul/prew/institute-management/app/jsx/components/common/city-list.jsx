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
		var cityList;
		if(this.props.cities && this.props.cities.length > 0)
			cityList = this.props.cities.map(city => (
				<City cityName={city} pmList={this.props.pmArray[city]} onSelection={this.selectCity} />
			));
		
		return 	<div>
			<City cityName="National" />
			{cityList}
		</div>	
				
	}

});