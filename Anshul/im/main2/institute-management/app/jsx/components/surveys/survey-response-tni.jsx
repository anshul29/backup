var React = require('react')
var StatusBar = require('../charts/status-bar');
var CityList = require('../common/city-list');
var cityStore = require('../../stores/cityStore');
var surveyAnalyticsStore = require('../../stores/surveyAnalyticsStore');


module.exports = React.createClass({
  propTypes: {
      onAnswer: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      distributionData: {},
      cities: [],
      selectedCity:{},
      selectedPM:{}
    }
  },
  componentDidMount: function () {
    let filters = cityStore.getState()

    if(filters){ // if we have list of cities in cityStore, set in component state
      console.log('filters:'+JSON.stringify(filters))
      this.setState({
        cities: filters.city,
        pmArray: filters.programManagerEmail
      });
     } else { // if list of cities not found in cityStore, fire API to get list of cities first
      cityStore.dispatch({type: 'check', filterType:'feedbackDistribution'})
      cityStore.subscribe(function () {
        filters = cityStore.getState()
        if(filters)
          this.setState({
            cities: filters.city,
            pmArray: filters.programManagerEmail
          })
      }.bind(this));
    }    
      
    // directly fire analytics query
    surveyAnalyticsStore.dispatch({type: 'check', questionSetId: '2016institute1Week1Survey'
      //, city:this.state.selectedCity, pmEmail:this.state.selectedPM
    })
    surveyAnalyticsStore.subscribe(function () {
       // console.log(JSON.stringify(surveyAnalyticsStore.getState()))
      let distributionData = surveyAnalyticsStore.getState()
      this.setState({
        distributionData: distributionData
      })
    }.bind(this));

  },
  render: function() {

    var dataStatus = {
            data: [{
                label: "Strongly Disagree",
                value: 67
            },{
                label: "Disagree",
                value: 70
            },{
                label: "Agree",
                value: 30
            },{
                label: "Strongly Agree",
                value: 19
            }],
            total: 250
        }

    var responseList;
    // console.log(this.state.distributionData)
    if( this.state.distributionData.distributionList &&  this.state.distributionData.distributionList.length>0) {
        
        var distributionData = this.state.distributionData
        responseList = this.state.distributionData.distributionList.map(function(questionName,questionNumber) {
                return <div className="box box-body box-tools">
                  <div key={questionName}>{questionNumber+1}.&nbsp;{distributionData[questionName].questionText} </div>
                  <br/>
                  <StatusBar data={distributionData[questionName].distribution} />
                </div>
        });
    }   

    /* <div className="col-md-8 box box-body box-tools">
      <div className="box box-primary box-body box-tools">
        <div className="box-body box-tools">
          <div >
              1. Whassup?
            
          </div>
          <br/>
          <div>
              <StatusBar  data={dataStatus} />
          </div>
        </div>
      </div>
     </div>  */             

    return <div>
      <div className="col-md-3">
        <CityList onSelection={this.selectCity} pmArray={this.state.pmArray} cities={this.state.cities} /> 
      </div>  
      <div className="col-md-9">
        {responseList}
      </div>  
    </div>
  }
})
