var React = require('react')

let userStore = require('../../stores/userStore')
let mainStore = require('../../stores/mainStore')
let competencyStore = require('../../stores/competencyStore')

var Competency = require('./competency-fellow')
var Conversations = require('./conversations')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      competencies: [],
      selectedCompetency: {}
    }
  },
  componentDidMount: function () {
        competencyStore.dispatch({type: 'check'})
        competencyStore.subscribe(function () {
          let competencies = competencyStore.getState().competencies
          let conversation = competencyStore.getState().conversation
          if(competencies)
            this.setState({
              competencies: competencies
          })
          if(conversation)
            this.setState({
              conversation: conversation
          })

          console.log(JSON.stringify(competencies))

          if(this.selectedCompetency == null)
            this.setState({
              selectedCompetency: competencies[0]
          })
        //  console.log(this.state.competencies[0].competencyName)

        }.bind(this))
  },
  selectCompetency: function (competency){
  //  console.log('In Competency Fellow : ' + JSON.stringify(competency))
    this.setState({
      selectedCompetency: competency
    })

  },
    render: function () {
      let competencyArray
      //console.log(this.state.competencies)
      if(this.state.competencies && this.state.competencies.length > 0) {
      //  console.log('Inside If')
        competencyArray = this.state.competencies.map(competency => (
          <Competency key={competency.competencyName} competency={competency} onSelect={this.selectCompetency}/>
          )
        )
      }
  		return <div>
                <div className="alert alert-info alert-dismissable">
                  <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                  <h4><i className="icon fa fa-info"></i> The Leadership Development Journey!</h4>
                    Student Vision Scale - What edvidence do I have to evaluate my classroom at this level? <br />
                    Commitments Scale - How have my actions and mindsets impacted my classroom outcomes?<br />
                    Leadership Competencies - Which of these competencies do I need to work on to grow and have a greater impact on student outcomes?<br />
                    Opportunities - What opportunities can I leverage to build these competencies?
                </div>
                <div className="col-md-6">
                  {competencyArray}
                </div>
                <div className="col-md-6">
                  <Conversations conversation={this.state.conversation}/>
                </div>
              </div>
    }
})
