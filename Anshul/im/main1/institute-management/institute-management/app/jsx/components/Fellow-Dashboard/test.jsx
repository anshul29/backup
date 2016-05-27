var React = require('react');
var userStore = require('../../stores/userStore');
var mainStore = require('../../stores/mainStore');

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
      return (
        <div>
      <body className="hold-transition skin-blue sidebar-mini">
        <div className="wrapper">
      <header className="main-header">
      AdminLTE
      <nav className="navbar navbar-static-top" role="navigation">
      <div className="navbar-custom-menu">
      <ul className="nav navbar-nav">
        <li className="dropdown messages-menu">
          <div className="dropdown-toggle" data-toggle="dropdown">
            <i className="fa fa-envelope-o"></i>
            <span className="label label-success">4</span>
          </div>
          <ul className="dropdown-menu">
            <li className="header">You have 4 messages</li>
            <li>
              <ul className="menu">
                <li>
                  <div>
                    <div className="pull-left">
                      <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User Image"/>
                    </div>
                    <h4>
                      Sender Name
                      <small><i className="fa fa-clock-o"></i> 5 mins</small>
                    </h4>
                    <p>Message Excerpt</p>
                  </div>
                </li>
                ...
              </ul>
            </li>
            <li className="footer"><div>See All Messages</div></li>
          </ul>
        </li>
        <li className="dropdown notifications-menu">
           <div className="dropdown-toggle" data-toggle="dropdown">
             <i className="fa fa-bell-o"></i>
             <span className="label label-warning">10</span>
           </div>
           <ul className="dropdown-menu">
             <li className="header">You have 10 notifications</li>
             <li>
             <ul className="menu">
                 <li>
                   <div>
                     <i className="ion ion-ios-people info"></i> Notification title
                   </div>
                 </li>
                 ...
               </ul>
             </li>
             <li className="footer"><div>View all</div></li>
           </ul>
         </li>
        </ul></div></nav></header>

      </div>
      </body></div>
    );
    }
  })
