var React = require('react');
var userStore = require('../../stores/userStore')
var mainStore = require('../../stores/mainStore')
module.exports = React.createClass({
  render: function() {
    return <div>
    <div className="content-wrapper">
      <section className="content-header">
        <h1>
          Fellow Dashboard
          <small>Institue 1</small>
        </h1>
        <ol className="breadcrumb">
          <li><i className="fa fa-dashboard"></i> Home</li>
          <li><i className="fa fa-book"></i> Library</li>
        </ol>
      <section className="content">
      <div className="row">
      <div className="col-md-6">

  <iframe src="https://sites.google.com/a/teachforindia.org/ecosystem/institute" height="500px" width="950px"></iframe>
  </div>
  </div>
  </section>
  </section>
  </div>
  </div>
  }
})
