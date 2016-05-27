var React = require('react')
const config = require('../../../../server/configs/config');
const googleConfig = config.google;

var Login = React.createClass({
  getInitialState: function () {
    return {
      loginUri: 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id='+googleConfig.clientId+'&redirect_uri='+googleConfig.redirectUri,
      accessToken: null,
  		}
  	},
    render: function () {
        return (
            <div className="login-page">
              <div className="wrapper">
                <header className="main-header">
                  <a className="org-name" href="#">
                  path <span className = "sub-heading">institute</span>
                  </a>
                </header>
                <div className="container-fluid">
                  <div className="row">
                    <div className = "div-quote col-sm-4 col-sm-offset-4 text-justify">
                      <p>"Two roads diverged in a wood, and I—
                      I took the one less traveled by,
                      And that has made all the difference."</p>
                      <p className = "author text-right">-Robert Frost</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className = "div-login col-sm-4 col-sm-offset-4 col-xs-6 col-xs-offset-3">
                      <a className="btn btn-default " href={this.state.loginUri} role="button"><i className="fa fa-google-plus"></i>Sign in with Google</a>
                    </div>
                  </div>
                </div>
                <footer className = "main-footer navbar-default navbar-fixed-bottom">
                <p className="navbar-text pull-right">© 2016 Teach For India</p></footer>
              </div>
            </div>
        );
    }
});

module.exports = Login;
