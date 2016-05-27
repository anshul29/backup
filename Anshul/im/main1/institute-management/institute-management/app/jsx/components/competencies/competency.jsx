var React = require('react');
var userStore = require('../../stores/userStore')
var mainStore = require('../../stores/mainStore')
let competencyStore = require('../../stores/competencyStore');

module.exports = React.createClass({
    getInitialState: function () {
      return {
        userDetails: {},
        competencies: [],

      }
    },
    componentDidMount: function () {
          userStore.dispatch({type: 'check'})
          userStore.subscribe(function () {
            let userDetails = userStore.getState()
            if(userDetails)
              this.setState({
                userDetails: userDetails
              })
            }.bind(this))
    },
    componentDidMount: function () {
          competencyStore.dispatch({type: 'check'})
          competencyStore.subscribe(function () {
            let competencies = competencyStore.getState()
            this.setState({
              competencies: competencies
            })
          }.bind(this))
    },
    render: function () {
  		return <div>
        <div className="box box-default">
        <div className="box-header with-border">
        { (function (){
        // Add priority condition here - if competency.priority === true, display the competency first
        //Else display them in the end. We will first find both the prioritized competencies and display them
          if(this.state.competencies && this.state.competencies.length > 0) {
            //console.log(this.state.competencies)
            let competencyArray = this.state.competencies.map(function(competency) {
              //console.log(competency)
                if(competency.priority)
                {
                  console.log(competency.priority)
                  return <div key = {competency.competencyName}>
                          <div className="box box-default">
                            <div className="box-header with-border">
                              <h3 className="box-title">{competency.competencyName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-star"></i></h3>
                              {
                                (function (){
                                if(competency.conversation.length > 0)
                                  return <div>
                                    <h4 className="box-body">{competency.conversation[competency.conversation.length - 1].comment}</h4>
                                  </div>
                                })()
                              }
      			                </div>
                          </div>
                        </div>
                }
                else {
                  return <div key = {competency.competencyName}>
                          <div className="box box-default">
                            <div className="box-header with-border">
                              <h3 className="box-title">{competency.competencyName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-star-o"></i></h3>
                              {
                                 (function (){
                                if(competency.conversation.length > 0)
                                  return <div>
                                    <h4 className="box-body">{competency.conversation[competency.conversation.length - 1].comment}</h4>
                                  </div>
                                })()
                              }
                            </div>
                          </div>
                        </div>
                }
              })
              return competencyArray
          }
          else {

          }
        }.bind(this))()}
  </div>
  <div className="box-body">

  </div>
</div>
</div>
}
})
