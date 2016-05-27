var React = require('react');
let userStore = require('../../stores/userStore');
let mainStore = require('../../stores/mainStore');
let competencyStore = require('../../stores/competencyStore');
var Competency = require('./competency');
var Conversations = require('./conversations');


module.exports = React.createClass({
  getInitialState: function () {
    return {
      competencies: [],
    }
  },
  componentDidMount: function () {
        competencyStore.dispatch({type: 'check'})
        competencyStore.subscribe(function () {
          let competencies = competencyStore.getState()
          this.setState({
            competencies: competencies
          })
        }.bind(this))
  },
    render: function () {
  		return <div>
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            Fellow Dashboard
            <small>Institue 1</small>
          </h1>
          <ol className="breadcrumb">
            <li><i className="fa fa-dashboard"></i> Home</li>
          </ol>
        <section className="content">
        <div className="row">
        <div className="col-md-6">
          <Competency />

        </div>
        <div className="col-md-6">
          <div className="box box-default">
            <div className="box-header with-border">
        <div className="box box-warning direct-chat direct-chat-warning">
          <div className="box-header with-border">
          <Conversations />

            </div>
            </div>
            </div></div></div></div>
        </section>
        </section>

        </div>


  </div>
}
})
