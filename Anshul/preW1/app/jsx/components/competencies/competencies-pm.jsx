var React = require('react');
let userStore = require('../../stores/userStore');
let mainStore = require('../../stores/mainStore');
let competencyStore = require('../../stores/competencyStore');
let circleStore = require('../../stores/circleStore')
var FellowList = require('../common/fellow-list');
var Competency = require('./competency-pm');
var Conversations = require('./conversations');


module.exports = React.createClass({
  getInitialState: function () {
    return {
      fellows: [],
      competencies: [],
      selectedFellow: {}
    }
  },
  componentDidMount: function () {
    let fellows = circleStore.getState()
    // console.log(fellows);
    if(fellows && fellows.length > 0){ 
      this.setState({
          fellows: fellows,
          selectedFellow: fellows[0]
      }) 
      let fellowEmail = fellows[0].email;
      competencyStore.dispatch({type: 'check',fellowEmail:fellowEmail})
      competencyStore.subscribe(function () {
        if(competencyStore.getState())
          this.setState({
            competencies: competencyStore.getState().competencies,
            conversation: competencyStore.getState().conversation
          })
      }.bind(this))
    }  
    else  {  
      circleStore.dispatch({type: 'get'})
      circleStore.subscribe(function () {
        fellows = circleStore.getState()
        // console.log(fellows);
        this.setState({
          fellows: fellows,
          selectedFellow: fellows[0]
        })
        let fellowEmail = this.state.selectedFellow?this.state.selectedFellow.email:null;
        competencyStore.dispatch({type: 'check',fellowEmail:fellowEmail})
        competencyStore.subscribe(function () {
          if(competencyStore.getState())
            this.setState({
              competencies: competencyStore.getState().competencies,
              conversation: competencyStore.getState().conversation
            })
        }.bind(this))
      }.bind(this))
        // console.log('in componentDidMount this.state.fellowEmail='+this.state.fellowEmail);
    }    
  },
  componentWillUnmount: function () {
    console.log("Unmounting competencies-pm-dashboard")
      this.setState({
        competencies: [],
        conversation: undefined,
        selectedFellow: {}
      })
  },  
  selectFellow: function(fellow) {
    // console.log('in selectFellow fellowEmail='+fellow.email);
     this.setState({
      selectedFellow: fellow,
      competencies: [],
      conversation: undefined,
    })
    competencyStore.dispatch({type: 'check', fellowEmail: fellow.email});
   
  },
  selectCompetency: function (competency){
    this.setState({
      selectedCompetency: competency
    })
  },
  refresh: function(){
    competencyStore.dispatch({type: 'check', fellowEmail: this.state.selectedFellow})
  },
  render: function () {

    let competenciesList; 

    if(this.state.competencies) {
        competenciesList = this.state.competencies.map(competency => (
          <Competency key={competency.competencyName} competency={competency} fellow={this.state.selectedFellow}
            onSelect={this.selectCompetency} onUpdate={this.refresh}/>
          
      ));
    }  

    return <div>
        <div className="col-md-3">
          <FellowList onSelection={this.selectFellow} fellows={this.state.fellows} selectedFellowEmail={this.state.selectedFellow.email}/>
        </div>  
        <div className="col-md-4">
          {competenciesList}
        </div>
        <div className="col-md-5">
          <Conversations conversation={this.state.conversation} fellow={this.state.selectedFellow} />
        </div>
      </div>
  }
})




