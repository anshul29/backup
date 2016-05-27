var React = require('react')

let userStore = require('../../stores/userStore')
let mainStore = require('../../stores/mainStore')

var CompetenciesFellow = require('./competencies-fellow')
var CompetenciesPM = require('./competencies-pm')
var CompetenciesTnI = require('./competencies-tni')

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
  getComponent: function(){
    if(this.state.userDetails.role === 'fellow')
      return <CompetenciesFellow />
    else if (this.state.userDetails.role === 'staff' && this.state.userDetails.instituteRole === 'pm')   
      return <CompetenciesPM />
    else
      return <CompetenciesTnI />
  },
  render: function () {
    if(this.state.userDetails.role === 'fellow')
        return  <div className="content-wrapper">
                  <section className="content-header">
                    <CompetenciesFellow />
                  </section>
                </div>
      else if (this.state.userDetails.role === 'staff' && this.state.userDetails.instituteRole === 'pm')   
        return  <div className="content-wrapper">
                  <section className="content-header">
                    <CompetenciesPM />
                  </section>
               </div>
      else  if (this.state.userDetails.role === 'staff')
        return  <div className="content-wrapper">
                  <section className="content-header">
                    <CompetenciesTnI />
                  </section>
                </div>
      else
        return <div></div>
  }
})
