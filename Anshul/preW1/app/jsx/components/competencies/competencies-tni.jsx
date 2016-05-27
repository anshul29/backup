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
      distribution: [],
      cities: [],
      selectedCity:{},
      selectedPM:{}
    }
  },

  componentDidMount: function () {

    let cities = cityStore.getState()

    if(cities){ // if we have list of cities in cityStore, set in component state
      console.log('cities:'+JSON.stringify(cities))
      this.setState({
        cities: cities
      });

      // directly fire analytics query
      compAnalyticsStore.dispatch({type: 'check', city:this.state.selectedCity, pmEmail:this.state.selectedPM})
      compAnalyticsStore.subscribe(function () {
         // console.log(JSON.stringify(compAnalyticsStore.getState()))
        let distribution = compAnalyticsStore.getState()
        this.setState({
          cities: cityStore.getState(),
          distribution: distribution
        })
      }.bind(this))

    } else { // if list of cities not found in cityStore, fire API to get list of cities first
      cityStore.dispatch({type: 'check'})
      cityStore.subscribe(function () {

        compAnalyticsStore.dispatch({type: 'check', city:this.state.selectedCity, pmEmail:this.state.selectedPM})
        compAnalyticsStore.subscribe(function () {
           // console.log(JSON.stringify(compAnalyticsStore.getState()))
          let distribution = compAnalyticsStore.getState()
          this.setState({
            cities: cityStore.getState(),
            distribution: distribution
          })
        }.bind(this))
      }.bind(this))
    }
  },
 
  selectCity: function(city) {
    console.log('in selectCity city='+city);
    this.setState({
      selectedCity: city
    })
    compAnalyticsStore.dispatch({type: 'check', city:city})
  },
 
  render: function () {
    if(this.state.distribution && this.state.distribution.length > 0)
    return <div>
      <CityList onSelection={this.selectCity} cities={this.state.cities} />
      <div className="col-md-6">
          <DistributionChart data={this.state.distribution} title="Competency Distribution" size="large"/>
       {  /*<TestChart />   */}
      </div>
    </div>
    else return <div></div>
  }
})
