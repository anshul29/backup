var React = require('react')
const config = require('../../../../server/configs/config')
var SectionsContainer = require('react-fullpage').SectionsContainer
var Section = require('react-fullpage').Section
var Header = require('react-fullpage').Header
var Footer = require('react-fullpage').Footer

const googleConfig = config.google

var Login = React.createClass({
  getInitialState: function () {
    return {
      loginUri: 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id='+googleConfig.clientId+'&redirect_uri='+googleConfig.redirectUri,
      accessToken: null
    }
  },

  render: function() {
    let options = {
      sectionClassName:     'section',
      anchors:              ['login', 'timeline'],
      verticalAlign:        true,
      horizontalAlign:      true,
      sectionPaddingTop:    '0px',
      sectionPaddingBottom: '0px',
      arrowNavigation:      false,
      navigation:           false,
      autoScrolling:        false
    }
    return (
      <div id="home-page">

        <Header>
          {/*<a href="#sectionOne">Section One</a>
          <a href="#sectionTwo">Section Two</a>
          <a href="#sectionThree">Section Three</a>*/}
        </Header>

        <SectionsContainer className="container" {...options}>

          <Section className="custom-section" id="login-page" verticalAlign="true">
            <header className="main-header">
              <a className="org-name" href="#">
              path <span className = "sub-heading">institute</span>
              </a>
            </header>
            <div className = "div-quote col-sm-4 col-sm-offset-4 text-justify">
              <p>"Two roads diverged in a wood, and
              I took the one less traveled by,
              And that has made all the difference."</p>
              <p className = "author text-right">-Robert Frost</p>
            </div>
            <div className = "div-login text-center">
                <a className="btn btn-default " href={this.state.loginUri} role="button"><i className="fa fa-google-plus"></i>Sign in with Google</a>
            </div>
            <div className="div-down text-center">
                <a href="#timeline" className="down-button"><i className="fa fa-chevron-down"></i></a>
            </div>
          </Section>
          <Section id="timeline-page" color="#EFEFEF">
              {/*<a href="">Dcoumentation</a>
              <a href="">Example Source</a>
              <a href="">About</a>*/}
                <div className="div-down text-center">
                    <a href="#login" className="down-button"><i className="fa fa-chevron-up"></i></a>
                </div>
              <header className="main-header text-center">
                teach for india
                <span className = "sub-heading"> journey</span>
              </header>
              {/*<div id="timeline-embed">
              </div>*/}

              <div className="timeline-frame">
                <iframe src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=13I8qZXkMShT8lkg7zYcbMJVyXKAt5hbrU5Sgf_Df60o&font=Default&lang=en&initial_zoom=2' width='100%' frameBorder='0' scrolling='no' className='wpcom-protected-iframe' webkitallowFullScreen mozallowFullScreen allowFullScreen></iframe>
              </div>
          </Section>
          {/*<Section className="section fp-auto-height">
            <p className="navbar-text pull-right">© 2016 Teach For India</p>
          </Section>*/}

        </SectionsContainer>
{/*
        <div id="footer-div">
          <footer className = "main-footer">
          <p className="navbar-text pull-right">© 2016 Teach For India</p></footer>
        </div>*/}

      </div>
    )
  }
})

module.exports = Login
