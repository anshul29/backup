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
          <div>
            {/*<header className="main-header" id="header">

            </header>*/}
            <div className="home-page" id="fullpage">

              <div className="section" id="login-page">
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
                    <div className = "div-login col-sm-12 col-md-12">
                      <a className="btn btn-default" href={this.state.loginUri} role="button"><i className="fa fa-google-plus"></i>Sign in with Google</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section" id="timeline-page">
                <header className="main-header">
                  teach for india
                  <span className = "sub-heading">journey</span>
                </header>
                {/*<div id="timeline-embed">
                </div>*/}

                <div className="timeline-frame">
                  <iframe src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=13I8qZXkMShT8lkg7zYcbMJVyXKAt5hbrU5Sgf_Df60o&font=Default&lang=en&initial_zoom=2&height=650' width='100%' height='650px' frameBorder='0' scrolling='no' className='wpcom-protected-iframe' webkitallowFullScreen mozallowFullScreen allowFullScreen></iframe>
                </div>

                {/*<div className="timeline-frame">
                  <iframe src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=13I8qZXkMShT8lkg7zYcbMJVyXKAt5hbrU5Sgf_Df60o&font=Default&lang=en&initial_zoom=2&height=650' width='100%' height='650' frameborder='0'></iframe>                </div>
              </div>*/}
              </div>

              {/*<div className="section">
                <header className="main-header">
                  teach for india
                  <span className = "sub-heading">timeline</span>
                </header>
                <div id="timeline-embed">
                </div>
              </div>*/}

              <div className="section fp-auto-height" id="footer-div">
                <footer className = "main-footer navbar-default navbar-bottom">
                  <p className="navbar-text pull-right">© 2016 Teach For India</p>
                </footer>
              </div>
            </div>
            {/*<footer className = "main-footer navbar-default navbar-fixed-bottom">
              <p className="navbar-text pull-right">© 2016 Teach For India</p>
            </footer>*/}

          </div>
        );
    }
});

module.exports = Login;
