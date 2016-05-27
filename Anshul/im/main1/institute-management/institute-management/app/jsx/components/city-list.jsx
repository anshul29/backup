var React = require('react');
var City = require('./city-pm');
// let cityStore = require('../stores/cityStore')

module.exports = React.createClass({

	getInitialState: function () {
	    return {
	      cities: [],
	    }
  	},

  	componentDidMount: function(){
  		this.state.cities = [
	  		{
	  			cityName: "Mumbai",
	  			pmList: ["Sruthi Krishnan","Bhavi Doshi","Elgiva","Bhavi Doshi","Nallika","Angie","Sahana"]	
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
  	
	render: function(){

		if(this.state.cities !== null){
			var cityList = this.state.cities.map(function(city){
				return <City cityName={city.cityName} pmList={city.pmList} />
				
			});
		
			return (
				<div className="content-wrapper">
					<section className="content">
						<City cityName="National" />
						{cityList}
					</section>
				</div>		
			)
		} else {
			return (
				<div className="content-wrapper">
					<section className="content">
						<City cityName="National" />
					</section>
				</div>		
			)		
		}	
	}

});