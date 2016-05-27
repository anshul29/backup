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
                if(competency.competencyName === 'Brio')
                {
                  console.log(competency.competencyName)
                  return <div key = {competency.competencyName}>
                          <div className="box box-default">
                            <div className="box-header with-border">
                              <h3 className="box-title">Conversations on {competency.competencyName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-star"></i></h3>
                              {
                                (function (){
                                if(competency.conversation.length > 0)
                                  return <div>
                                  <div className="box-tools pull-right">
                                    <button className="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle"><i className="fa fa-comments"></i></button>
                                  </div>
                                  <div className="box-body">
                                  <div className="direct-chat-messages">
                                    <div className="direct-chat-msg">
                                      <div className="direct-chat-info clearfix">
                                        <span className="direct-chat-name pull-left">{competency.conversation[1].author.displayName}</span>
                                        <span className="direct-chat-timestamp pull-right">{competency.conversation[1].time}</span>
                                      </div>
                                      <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                                      <div className="direct-chat-text">
                                        {competency.conversation[1].comment}
                                      </div>
                                    </div>
                                    <div className="direct-chat-msg right">
                                      <div className="direct-chat-info clearfix">
                                        <span className="direct-chat-name pull-right">Sarah Bullock</span>
                                        <span className="direct-chat-timestamp pull-left">23 Jan 2:05 pm</span>
                                      </div>
                                      <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                                      <div className="direct-chat-text">
                                        You better believe it!
                                      </div>
                                    </div>
                                    <div className="direct-chat-msg">
                                      <div className="direct-chat-info clearfix">
                                        <span className="direct-chat-name pull-left">Alexander Pierce</span>
                                        <span className="direct-chat-timestamp pull-right">23 Jan 5:37 pm</span>
                                      </div>
                                      <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                                      <div className="direct-chat-text">
                                        Working with AdminLTE on a great new app! Wanna join?
                                      </div>
                                    </div>


                                    <div className="direct-chat-msg right">
                                      <div className="direct-chat-info clearfix">
                                        <span className="direct-chat-name pull-right">Sarah Bullock</span>
                                        <span className="direct-chat-timestamp pull-left">23 Jan 6:10 pm</span>
                                      </div>
                                      <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                                      <div className="direct-chat-text">
                                        I would love to.
                                      </div>
                                    </div>
                                  </div>
                                  </div>
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
