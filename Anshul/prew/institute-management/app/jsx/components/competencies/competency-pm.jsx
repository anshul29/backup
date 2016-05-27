var React = require('react');
//var Editform = require('./editform');
// var userStore = require('../../stores/userStore')
// var mainStore = require('../../stores/mainStore')
let competencyStore = require('../../stores/competencyStore');

module.exports = React.createClass({

  propTypes: {
      onSelect: React.PropTypes.func,
      onUpdate: React.PropTypes.func
  },

  togglePriority: function(){
    // console.log('thumbs down clicked');
    let developmentState = this.props.competency.developmentState === 'priority'?'none':'priority';
    
    competencyStore.dispatch({
      type: 'prioritize',
      fellowEmail: this.props.fellow.email,
      competencyName: this.props.competency.competencyName,
      developmentState: developmentState
    })
  },

  toggleStrength: function(){
    // console.log('thumbs up clicked');
    let developmentState = this.props.competency.developmentState === 'strength'?'none':'strength';
    
    competencyStore.dispatch({
      type: 'prioritize',
      fellowEmail: this.props.fellow.email,
      competencyName: this.props.competency.competencyName,
      developmentState: developmentState
    })
  },

  render: function () {
    
    var competency = this.props.competency;
    var strengthClass, priorityClass, boxClass
    
    if(competency){
      
      strengthClass = competency.developmentState==='strength'?"fa fa-thumbs-up":"fa fa-thumbs-o-up";
      priorityClass = competency.developmentState==='priority'?"fa fa-circle priority":"fa fa-circle-o priority";
      // statusClass = competency.status === 'priority'?"fa fa-thumbs-up":competency.status === 'strength'?"fa thumbs-up";
      boxClass = competency.developmentState==='priority'?"box box-warning":competency.developmentState==='strength'?"box box-success":"box box-default";
      
      return  <div className="box-header with-border" key={competency.competencyName}
                onClick = {this.clickCompetency} className={boxClass} >
                  <div className="box-header with-border">
                    
                      <h3 className="box-title">{competency.competencyName} </h3>
                      <div className="box-title pull-right">
                        <a href="#"><i className={priorityClass} onClick = {this.togglePriority}></i></a>
                        &nbsp;
                        <a href="#"><i className={strengthClass} onClick = {this.toggleStrength}></i></a>
                      </div>
                      
                      <div>
                        {competency.description}
                      </div> 
                  </div>     
                  
              </div>
    } else {
        return <div></div>           
    }    
  }
});
