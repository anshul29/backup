var React = require('react');
var Question = require('../common/question');
var questionStore = require('../../stores/questionStore');
var Link = require('react-router').Link;
var Tabs = require('react-simpletabs');
module.exports = React.createClass({
  getInitialState: function () {
    return {
      questionDetails:{}
    }
  },
  componentDidMount: function () {
    questionStore.dispatch({type: 'check'})
    questionStore.subscribe(function () {
    let questionDetails = questionStore.getState()
    if(questionDetails)
      this.setState({
        questionDetails: questionDetails
        })
    }.bind(this))
  },
  onMount: function(selectedIndex, $selectedPanel, $selectedTabMenu) {
    console.log('on mount, showing tab ' + selectedIndex);
  },
  onBeforeChange: function(selectedIndex, $selectedPanel, $selectedTabMenu) {
    console.log('before the tab ' + selectedIndex);
  },
  onAfterChange: function(selectedIndex, $selectedPanel, $selectedTabMenu) {
    console.log('after the tab ' + selectedIndex);
  },
  surveySubmit: function() {
    console.log('in selectedOption')
  },
  render: function() {
    if(this.state.questionDetails && this.state.questionDetails.feedbackSet) {
    // console.log(JSON.stringify(this.state.questionDetails))
    // console.log(JSON.stringify(this.state.questionDetails.feedbackSet.question1.questionText))
    // console.log('List of questions ' + JSON.stringify(this.state.questionDetails.questionList))

    let questionArray
    var surveyData = this.state.questionDetails.feedbackSet
    var customOptions = []
    var self = this

    return <div>
      <Tabs tabActive={1} onBeforeChange={this.onBeforeChange} onAfterChange={this.onAfterChange} onMount={this.onMount}>
        <Tabs.Panel title='Week One'>
        { (function() {
            questionArray = this.state.questionDetails.questionList.map(function(questionName,questionNumber) {
        //      console.log('in Loop ' + questionName)
            return <div>
              <Question key={questionName} question={surveyData[questionName]} num={questionNumber}/>
            </div>
         })
         return questionArray
      }.bind(this)())
    }
        </Tabs.Panel>
        <Tabs.Panel title='Week Two'>
          <h2>Week 2 Survey</h2>
        </Tabs.Panel>
        <Tabs.Panel title='Week Three'>
          <h2>Week 3 Survey</h2>
        </Tabs.Panel>
      </Tabs>
      
    </div>
  }
  else {
    return <div>
    </div>
  }
}
});
