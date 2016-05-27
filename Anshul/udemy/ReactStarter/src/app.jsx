var React = require('react');
var ReactDOM = require('react-dom');
var Reactfire = require('reactfire')
var Firebase = require('firebase')
// var rootUrl = 'https://udemy-tuts.firebaseio.com/'
var rootUrl = 'https://blistering-torch-428.firebaseio.com/'

var Hello = React.createClass({
  mixins: [Reactfire],
  getInitialState: function() {
    return {
      studentData: {}
    }
  },
  componentWillMount: function() {
    this.bindAsObject(new Firebase(rootUrl + 'studentData/'), 'studentData');
  },

  render: function() {
    console.log(this.state.studentData)
    var data = this.state.studentData
    return <h1 className="red">
      Firebase {data.name}
    </h1>
  }
});

var element = React.createElement(Hello, {});
ReactDOM.render(element, document.querySelector('.container'));
