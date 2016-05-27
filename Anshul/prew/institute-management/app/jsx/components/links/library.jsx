var React = require('react');
var profileStore = require('../../stores/profileStore')
var mainStore = require('../../stores/mainStore')
module.exports = React.createClass({
  getInitialState: function () {
    return {
      userDetails: {},
    }
  },
  componentDidMount: function () {
        profileStore.dispatch({type: 'check'})
        profileStore.subscribe(function () {
          let profileDetails = profileStore.getState()
          if(profileDetails)
            this.setState({
              profileDetails: profileDetails
            })
          }.bind(this))
  },
  render: function() {
    if(this.state.profileDetails) {
      console.log('In library '+this.state.profileDetails)
      return <div>
        <div className="content-wrapper">
          <iframe src={"http://teachforindia.force.com/LMSSearchBooks?id="+this.state.profileDetails} height="900px" width="100%" frameBorder="0"></iframe>
        </div>
     </div>
    }
    else {
      return <div>
      Please try to reload...
      </div>
    }
  }
})
