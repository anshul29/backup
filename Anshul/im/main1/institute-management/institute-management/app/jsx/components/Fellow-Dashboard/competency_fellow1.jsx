var React = require('react');
let userStore = require('../../stores/userStore')
let mainStore = require('../../stores/mainStore')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      userDetails: {},
    }
  },
  componentDidMount: function () {
        userStore.dispatch({type: 'check'})
        userStore.subscribe(function () {
          let userDetails = userStore.getState()
          this.setState({
            userDetails: userDetails
          })
        }.bind(this))
  },
    render: function () {
  		return <div>
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            Fellow Dashboard
            <small>Institue 1</small>
          </h1>
          <ol className="breadcrumb">
            <li><i className="fa fa-dashboard"></i> Home</li>
          </ol>
        <section className="content">
        <div className="row">
        <div className="col-md-6">
          <div className="box box-default">
            <div className="box-header with-border">
              <i className="fa fa-bullhorn"></i>
              <h3 className="box-title">Competencies</h3>
            </div>
            <div className="box-body">
            <div className="callout callout-success">
                <h3>Planning</h3>
                <p>There is a problem that we need to fix. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.</p>
              </div>
              <div className="callout callout-success">
                <h3>Execution</h3>
                <p>Follow the steps to continue and learn.</p>
              </div>
              <div className="callout callout-info">
                <h3>BRIO</h3>
                <p>There is a problem that we need to fix. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.</p>
              </div>
              <div className="callout callout-info">
                <h3>Reflection</h3>
                <p>There is a problem that we need to fix. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="box box-default">
            <div className="box-header with-border">
        <div className="box box-warning direct-chat direct-chat-warning">
          <div className="box-header with-border">
            <h3 className="box-title">Conversations - Planning</h3>
            <div className="box-tools pull-right">
              <span data-toggle="tooltip" title="3 New Messages" className="badge bg-yellow">3</span>
              <button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
              <button className="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle"><i className="fa fa-comments"></i></button>
              <button className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times"></i></button>
            </div>
          </div>
          <div className="box-body">
            <div className="direct-chat-messages">
              <div className="direct-chat-msg">
                <div className="direct-chat-info clearfix">
                  <span className="direct-chat-name pull-left">Vaibhav Gupta</span>
                  <span className="direct-chat-timestamp pull-right">23 Jan 2:00 pm</span>
                </div>
                <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                <div className="direct-chat-text">
                  Is this template really for free? That's unbelievable!
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
            </div></div></div></div>
        </section>
        </section>

        </div>


  </div>
}
})
