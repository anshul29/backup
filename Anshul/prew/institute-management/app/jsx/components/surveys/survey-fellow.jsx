var React = require('react');
var Question = require('../common/question');
var questionStore = require('../../stores/questionStore');
var surveyStore = require('../../stores/surveyStore');
var Link = require('react-router').Link;
var Tabs = require('react-simpletabs');
module.exports = React.createClass({
  getInitialState: function () {
    return {
      questionDetails:{},
      answerDetails:{}
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

  registerAnswer: function(questionNumber,answer) {
  //console.log(questionNumber + " " + answer)
  this.state.answerDetails[questionNumber] = answer;
console.log(JSON.stringify(this.state.answerDetails))
},

  surveySubmit: function (){
  surveyStore.dispatch({
    type: 'post',
    answerDetails: this.state.answerDetails,
    submit: true,
    questionSetId: '2016institute1Week1Survey'
  })
},
  render: function() {
    if(this.state.questionDetails && this.state.questionDetails.feedbackSet) {
        //  surveyStatus === 'open'? true : false
        console.log(JSON.stringify(this.state.questionDetails))
        // console.log(JSON.stringify(this.state.questionDetails.feedbackSet.question1.questionText))
        // console.log('List of questions ' + JSON.stringify(this.state.questionDetails.questionList))
        let questionArray
        var surveyData = this.state.questionDetails.feedbackSet
        var customOptions = []
        var self = this
        return <div>
                <Tabs tabActive={1} onBeforeChange={this.onBeforeChange} onAfterChange={this.onAfterChange} onMount={this.onMount}>

                  <Tabs.Panel title='Week One' className="tab-panel time">
                  { (function() {
                    if(this.state.questionDetails.state==='open') {
                      var self=this
                      questionArray = this.state.questionDetails.questionList.map(function(questionName,questionNumber) {
                      return <div>

                        <Question key={questionName} question={surveyData[questionName]} name={questionName}
                                  onAnswer={self.registerAnswer}  num={questionNumber+1}      />
                      </div>
                   })
                   return <div>
                           <div className="col-lg-8">
                             <div className="box box-primary">
                                <div className="box-header with-header">
                                  <h3 className="box-title survey-title">Self Assessment - Week 1</h3>
                                  {questionArray}
                                  <div className="survey-button text-center">
                                    <button type="submit" className="survey-submit btn btn-default" onClick={this.surveySubmit}>Submit Responses</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                    </div>
                 }
                   else if (this.state.questionDetails.state==='closed') {
                     return <div className="information-card col-lg-12">
                             <div className="alert alert-warning alert-dismissable">
                               <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                               <h4><i className="icon fa fa-info"></i> Closed</h4>
                                 Oops! You're late, the survey for this week is Closed!
                             </div>
                     </div>
                   }
                   else if (this.state.questionDetails.state==='submitted') {
                     return <div className="information-card col-lg-12">
                             <div className="alert alert-info alert-dismissable">
                               <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                               <h4><i className="icon fa fa-info"></i>Information</h4>
                                 This analysis is based on the data collected from Self Assessment surveys
                                 taken by Fellows in this Institue.
                             </div>
                             <div className="box box-primary">
                               <div className="box-header with-header">
                                 <h3 className="box-title survey-title">Analytics</h3>
                                 <p>We will show you analytics here!</p>
                              </div>
                            </div>
                      </div>
                   }
                }.bind(this)())
              }

                  </Tabs.Panel>
                    <Tabs.Panel title='Week Two'>
                    <div className="information-card col-lg-12">
                      <div className="alert alert-info alert-dismissable">
                        <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        <h4><i className="icon fa fa-info"></i>Self Assessment - Week 2</h4>
                          This will be available by the end of Week 2.
                      </div>
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel title='Week Three'>
                  <div className="information-card col-lg-12">
                    <div className="alert alert-info alert-dismissable">
                      <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                      <h4><i className="icon fa fa-info"></i>Self Assessment - Week 3</h4>
                      This will be available by the end of Week 3.
                    </div>
                  </div>
                  </Tabs.Panel>
                  <Tabs.Panel title='Week Four'>
                  <div className="information-card col-lg-12">
                    <div className="alert alert-info alert-dismissable">
                      <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                      <h4><i className="icon fa fa-info"></i>Self Assessment - Week 4</h4>
                      This will be available by the end of Week 4.
                    </div>
                  </div>
                  </Tabs.Panel>
                  <Tabs.Panel title='Week Five'>
                  <div className="information-card col-lg-12">
                    <div className="alert alert-info alert-dismissable">
                      <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                      <h4><i className="icon fa fa-info"></i>Self Assessment - Week 5</h4>
                      This will be available by the end of Week 5.
                    </div>
                  </div>
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
