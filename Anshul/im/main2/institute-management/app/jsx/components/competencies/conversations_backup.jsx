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
              this.state.userDetails = userDetails;
          }.bind(this))

          competencyStore.dispatch({type: 'check'})
          competencyStore.subscribe(function () {
            let competencies = competencyStore.getState()
            if(competencies)
              this.state.competencies = competencies;
          }.bind(this))
    },

  render: function () {
        // Add priority condition here - if competency.priority === true, display the competency first
        //Else display them in the end. We will first find both the prioritized competencies and display them
      if(this.state.competencies && this.state.competencies.length > 0) {
            console.log(this.state.competencies)
        let competencyArray = this.state.competencies.map(function(competency) {
              //console.log(competency)
        if(competency.competencyName === 'Brio')
          {
                return <div key = {competency.competencyName}>
                     <div className="box box-info direct-chat direct-chat-danger">
                     <div className="box-header with-border">
                     <h3 className="box-title">Conversations on {competency.competencyName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-star"></i></h3>
                        {
                          (function () {
                            if(competency.conversation.length > 0)
                            return <div>
                            <div className="box-tools pull-right">
                            <button className="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle"><i className="fa fa-comments"></i></button>
                            </div>
                            <div class="box-body">
                            <div className="direct-chat-messages">
                            { (function ()
                                {

                                      let conversationArray = competency.conversation.map(function(converse) {
                                      if(converse.author.email === 'vaibhav.gupta2013@teachforindia.org')
                                      {
                                        return <div key = {converse.time} className="direct-chat-msg">
                                        <div className="direct-chat-info clearfix">
                                          <span className="direct-chat-name pull-left">{converse.author.displayName}</span>
                                          <span className="direct-chat-timestamp pull-right">{converse.time}</span>
                                        </div>
                                        <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                                        <div className="direct-chat-text">
                                          {converse.comment}
                                        </div>
                                      </div>
                                    }
                                    else if(converse.author.email === 'path.bot@teachforindia.org'){
                                      return <div key = {converse.time} className='box-footer box-comments'>
                                        <div className='box-comment'>
                                          <img className='img-circle img-sm' src='../../public/dist/img/path.png' alt='user image'/>
                                          <div className='comment-text'>

                                            {converse.comment}
                                            </div>
                                          </div>
                                        </div>
                                    }
                                    else {
                                      return <div key = {converse.time} className="direct-chat-msg right">
                                              <div className="direct-chat-info clearfix">
                                                <span className="direct-chat-name pull-right">{converse.author.displayName}</span>
                                                <span className="direct-chat-timestamp pull-left">{converse.time}</span>
                                              </div>
                                              <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                                              <div className="direct-chat-text">
                                                {converse.comment}
                                              </div>
                                          </div>
                                    }
                                  })
                                  return conversationArray
                                }.bind(this))()
                              }
                              </div> {/*End direct-chat-messages*/}
                              </div>{/*End box-body*/}
                              </div> //End Return Inside
                            }.bind(this))()
                              }
                              </div>
                              </div>
                              </div> //End Return Outside
                            }
                          })
                            return competencyArray
                }
              } //End Render Function
            }) //createClass End
