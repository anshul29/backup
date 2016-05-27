var React = require('react')

var userStore = require('../../stores/userStore')
var mainStore = require('../../stores/mainStore')
let competencyStore = require('../../stores/competencyStore')

var moment = require('moment')

module.exports = React.createClass({

    getInitialState: function () {
      return {
        userDetails: {},
        competencies: []
        //self: {},
      }
    },
    componentDidMount: function () {
      let userDetails = userStore.getState()
      if(userDetails)
        this.setState({
          userDetails: userDetails
        })
      else {
          userStore.dispatch({type: 'check'})
          userStore.subscribe(function () {
            this.setState({
              userDetails: userStore.getState()
            })
          }.bind(this))
        }
      },

    componentDidUpdate: function() {
      if(this.props.conversation){
        var convContainer = $('#convContainer') 
        console.log(convContainer[0]);
        if(convContainer && convContainer[0])
            convContainer.animate({ scrollTop: convContainer[0].scrollHeight }, 0);
      }
    },  

    addComment: function(event) {
      event.preventDefault()
    competencyStore.dispatch({
      type: 'post',
      comment: this.refs.NewComment.value,
      fellowEmail: this.props.fellow? this.props.fellow.email: null
    })
    this.refs.NewComment.value = ''
  },
    render: function () {
    //  moment.format();
      var timeFormat = 'ddd D MMM h:m a';
      if(this.props.conversation && this.state.userDetails)
      {
        //console.log('In Coversation outside function' + JSON.stringify(this.props.conversation))
    		return <div>
                <div className="box box-primary direct-chat direct-chat-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">Conversation</h3>
                      <div className="box-tools pull-right">
                        <button className="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle"><i className="fa fa-comments"></i></button>
                      </div>
                        <div className="box-body">
                          <div className="direct-chat-messages" id="convContainer">
                          {
                            (function ()  {
                              var self = this
                              //console.log('In Coversation' + JSON.stringify(this.props.conversation))
                              let conversationArray = this.props.conversation.map(function(converse,number) {
                              //console.log(converse)
                              // console.log('userDetails on conversation page' + self.state.userDetails.displayName)
                              if(converse.author.email === self.state.userDetails.email)
                              {
                                return <div key = {number} className="direct-chat-msg">
                                  <div className="direct-chat-info clearfix">
                                    <span className="direct-chat-name pull-left">{self.state.userDetails.displayName}</span>
                                    <span className="direct-chat-timestamp pull-right">{moment(converse.time).format(timeFormat)}</span>
                                  </div>
                                    <img className="direct-chat-img" src={self.state.userDetails.pictureURL} alt="message user image"/>
                                  <div className="direct-chat-text">
                                    {converse.comment}
                                  </div>
                                </div>
                              }
                              else if(converse.author.email === 'path.bot@teachforindia.org') {
                                return <div key = {number} className='box-footer box-comments'>
                                    <div className='box-comment'>
                                      <img className='img-circle img-sm' src='../../bot-icon.png' alt='user image'/>
                                      <div className='comment-text'>
                                        {converse.comment}
                                      </div>
                                    </div>
                                  </div>
                                }
                              else if(self.props.fellow) { // in case of PM dashboard, (selected) fellow will be passed to this component
                                return <div key = {number} className="direct-chat-msg right">
                                        <div className="direct-chat-info clearfix">
                                          <span className="direct-chat-name pull-right">{self.props.fellow.displayName}</span>
                                          <span className="direct-chat-timestamp pull-left">{moment(converse.time).format(timeFormat)}</span>
                                        </div>
                                        <img className="direct-chat-img" src={self.props.fellow.pictureURL} alt="message user image"/>
                                        <div className="direct-chat-text">
                                          {converse.comment}
                                        </div>
                                  </div>
                                }
                              else {
                                return <div key = {number} className="direct-chat-msg right">
                                        <div className="direct-chat-info clearfix">
                                          <span className="direct-chat-name pull-right">{converse.author.displayName}</span>
                                          <span className="direct-chat-timestamp pull-left">{moment(converse.time).format(timeFormat)}</span>
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
                              </div>
                            </div>
                          </div>
  			                </div>
                        <div className="box-footer">
                          <form onSubmit = {this.addComment}>
                            <div className="input-group">
                              <input type="text" name="message"  ref="NewComment" placeholder="Add your comments..." className="form-control"/>
                              <span className="input-group-btn">
                                <input type="submit" className="btn btn-primary btn-primary" value = 'Send'/>
                              </span>
                            </div>
                          </form>
                        </div>
                      </div>
                    }
                else {
                  return <div>
                  </div>
                  }
                }
              })
