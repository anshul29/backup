var React = require('react')

var Login = React.createClass({
  getInitialState: function () {
  		return {
  			loginUri: 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=712119106205-emhvi7pjqqrpq07ibqssqh2plqgf9qa6.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fgoauthcallback&approval_prompt=force',
  			accessToken: null,
  		}
  	},
    render: function () {
        return (
            <div className = "loginPage">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                path <span className = "sub-heading">institute</span>
                            </a>
                        </div>
                    </div>
                </nav>

                <div className = "quote col-lg-4 col-lg-offset-4 text-justify">
                    <p>"Two roads diverged in a wood, and I—
                    I took the one less traveled by,
                    And that has made all the difference."</p>
                    <p className = "author text-right">-Robert Frost</p>
                </div>

                <div className = "login col-lg-4 col-lg-offset-4  text-center">
                    <a className="btn btn-default" href={this.state.loginUri} role="button"><i className="fa fa-google-plus"></i>Sign in with Google</a>
                </div>

                <div className = "footer col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">© 2016-Teach For India</div>

            </div>
        );
    }
});

module.exports = Login;
