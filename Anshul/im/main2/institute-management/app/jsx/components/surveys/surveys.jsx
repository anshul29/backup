var React = require('react');
let userStore = require('../../stores/userStore');
let mainStore = require('../../stores/mainStore');
var SurveysFellow = require('./survey-fellow');
var SurveysPM = require('./surveys-pm');
var SurveysTnI = require('./surveys-tni');


module.exports = React.createClass({
  getInitialState: function () {
    return {
      userDetails:{}
    }
  },
  componentDidMount: function () {
    let userDetails = userStore.getState()
    if(userDetails)
      this.setState({
        userDetails: userDetails
      })
    else {
      mainStore.dispatch({
        type: 'check'
      })
      mainStore.subscribe(function () {
        let accessToken = mainStore.getState()
        if(accessToken) {
          this.setState({
            accessToken: mainStore.getState()
          })
          userStore.dispatch({type: 'check'})
          userStore.subscribe(function () {
            userDetails = userStore.getState()
            if(userDetails)
            {
              this.setState({
                userDetails: userDetails
              })
            }
          }.bind(this))
        }
      }.bind(this))
    }
  },

    render: function () {
      if(this.state.userDetails.role === 'fellow')
  		  return  <div className="content-wrapper">
                  {/*<section className="content-header">*/}
                    <SurveysFellow />
                  {/*</section>*/}
                </div>

      else if (this.state.userDetails.role === 'staff' && this.state.userDetails.lastName === 'PM')
        return  <div className="content-wrapper">
                  {/*<section className="content-header">*/}
                    <SurveysPM />
                  {/*</section>*/}
                </div>
      else
        return  <div className="content-wrapper">
                  {/*<section className="content-header">*/}
                    <SurveysTnI />
                  {/*</section>*/}
                </div>
    }
})
