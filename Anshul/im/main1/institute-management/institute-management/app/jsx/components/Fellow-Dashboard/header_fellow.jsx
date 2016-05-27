var React = require('react');
var userStore = require('../../stores/userStore')
var mainStore = require('../../stores/mainStore')

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
      <li className="dropdown tasks-menu">
          <div className="dropdown-toggle" data-toggle="dropdown">
            <i className="fa fa-flag-o"></i>
            <span className="label label-danger">9</span>
          </div>
          <ul className="dropdown-menu">
            <li className="header">You have 9 tasks</li>
            <li>
              <ul className="menu">
                <li>
                  <div>
                    <h3>
                      Design some buttons
                      <small className="pull-right">20%</small>
                    </h3>
                    <div className="progress xs">
                      <div className="progress-bar progress-bar-aqua" style="width: 20%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                        <span className="sr-only">20% Complete</span>
                      </div>
                    </div>
                  </div>
                </li>
                ...
              </ul>
            </li>
            <li className="footer">
              <div>View all tasks</div>
            </li>
          </ul>
        </li>
        <li className="dropdown user user-menu">
          <div className="dropdown-toggle" data-toggle="dropdown">
            <img src="dist/img/user2-160x160.jpg" className="user-image" alt="User Image"/>
            <span className="hidden-xs">Alexander Pierce</span>
          </div>
          <ul className="dropdown-menu">
            <li className="user-header">
              <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User Image"/>
              <p>
                Alexander Pierce - Web Developer
                <small>Member since Nov. 2012</small>
              </p>
            </li>
            <li className="user-body">
              <div className="col-xs-4 text-center">
                <div>Followers</div>
              </div>
              <div className="col-xs-4 text-center">
                <div>Sales</div>
              </div>
              <div className="col-xs-4 text-center">
                <div>Friends</div>
              </div>
            </li>
            <li className="user-footer">
              <div className="pull-left">
                <div className="btn btn-default btn-flat">Profile</div>
              </div>
              <div className="pull-right">
                <div className="btn btn-default btn-flat">Sign out</div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</header>
          </div>
        );
        }
      })
