var React = require('react')
var Link = require('react-router').Link

var userStore = require('../../stores/userStore')
var mainStore = require('../../stores/mainStore')

module.exports = React.createClass({
    getInitialState: function () {
      return {
        userDetails: {}
      }
    },
    componentWillMount() {
       const script = document.createElement("script")
       script.src = "/public/dist/js/app.js"
       script.async = true
       document.body.appendChild(script)
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
  		return <div className="hold-transition skin-blue fixed sidebar-mini">
        <div className="wrapper">
          <header className="main-header">
          <a href="/" className="logo">
              <span className="logo-mini">PATH</span>
              <span className="logo-lg"><b>PATH</b> INSTITUTE</span>
          </a>
            <nav className="navbar navbar-static-top" role="navigation">
              <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span className="sr-only">Toggle navigation</span>
                </a>
              <div className="navbar-custom-menu">
                <ul className="nav navbar-nav">
                  <li className="dropdown user user-menu">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                      <span className="hidden-xs">{this.state.userDetails.displayName}</span>
                      <img src={this.state.userDetails.pictureURL} className="user-image" alt="User Image"/>
                    </a>
                  </li>
                  <li className="logout-button">
                  <Link to = '' onClick = {this.logout}>
                    <i className="fa fa-power-off"></i>
                  </Link>
                  </li>
                </ul>

              </div>
            </nav>
          </header>
          </div>
          </div>
        },

        logout: function () {
          mainStore.dispatch({type: 'logout'})
        }
})
