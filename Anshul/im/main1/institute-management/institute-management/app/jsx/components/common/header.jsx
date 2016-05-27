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
            if(userDetails)
              this.setState({
                userDetails: userDetails
              })
            }.bind(this))
    },
    render: function () {
  		return <div>
      <div className="hold-transition skin-blue sidebar-mini">
        <div className="wrapper">
          <header className="main-header">
          <a href="index.html" className="logo">
              <span className="logo-mini"><b>T</b>FI</span>
              <span className="logo-lg"><b>Teach For India</b></span>
          </a>
            <nav className="navbar navbar-static-top" role="navigation">
              <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span className="sr-only">Toggle navigation</span>
                </a>
              <div className="navbar-custom-menu">
                <ul className="nav navbar-nav">
                  <li className="dropdown messages-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                      <i className="fa fa-envelope-o"></i>
                      <span className="label label-success">4</span>
                    </a>
                      </li>
                  <li className="dropdown notifications-menu">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                      <i className="fa fa-bell-o"></i>
                      <span className="label label-warning">10</span>
                  </a>
                  </li>
                  <li className="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                      <img src={this.state.userDetails.pictureURL} className="user-image" alt="User Image"/>
                      <span className="hidden-xs">{this.state.userDetails.role}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          </div>
          </div></div>
        }
})
