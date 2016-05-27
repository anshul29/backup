var React = require('react');
let userStore = require('../../stores/userStore');
let mainStore = require('../../stores/mainStore');
let compAnalyticsStore = require('../../stores/compAnalyticsStore');
let cityStore = require('../../stores/cityStore');
var CityList = require('../common/city-list');
var CityPM = require('../common/city-pm');
var DistributionChart = require('../charts/distribution-chart');
var TestChart = require('../charts/test-chart');



module.exports = React.createClass({
  getInitialState: function () {
    return {
      priorityDistribution: [],
      strengthDistribution: [],
      cities: [],
      selectedCity:{},
      selectedPM:{}
    }
  },

  componentDidMount: function () {

    let filters = cityStore.getState()

    if(filters){ // if we have list of filters in cityStore, set in component state
      console.log('filters:'+JSON.stringify(filters))
      this.setState({
        cities: filters.city,
        pmArray: filters.programManagerEmail
      });
    } else { // if list of cities not found in cityStore, fire API to get list of cities first
      cityStore.dispatch({type: 'check', filterType:'competencyDistribution'})
      cityStore.subscribe(function () {
        filters = cityStore.getState();
        console.log(filters)
        this.setState({
              cities: filters.city,
              pmArray: filters.programManagerEmail
        });
      }.bind(this))      
    }

    // directly fire analytics query
    compAnalyticsStore.dispatch({type: 'check', city:this.state.selectedCity, pmEmail:this.state.selectedPM})
    compAnalyticsStore.subscribe(function () {
       // console.log(JSON.stringify(compAnalyticsStore.getState()))
      let response = compAnalyticsStore.getState()

      if(response)
        this.setState({
          priorityDistribution: response.priorities.distribution,
          strengthDistribution: response.strengths.distribution
        });
    }.bind(this));

  },
 
  selectCity: function(city) {
    console.log('in selectCity city='+city);
    this.setState({
      selectedCity: city
    })
    compAnalyticsStore.dispatch({type: 'check', city:city})
  },
 
  render: function () {
    if(this.state.priorityDistribution && this.state.priorityDistribution.length > 0)
    return <div>
      <div className="col-md-3">
          <CityList onSelection={this.selectCity} pmArray={this.state.pmArray} cities={this.state.cities} />
      </div>  
      <div className="col-md-4">
          <DistributionChart data={this.state.strengthDistribution} title="Prioritized Competencies" size="large"/>
      </div>
      <div className="col-md-4">
          <DistributionChart data={this.state.priorityDistribution} title="Strengths" size="large"/>
      </div>
    </div>
    else return <div></div>
  }
})
