var React = require('react');
var SurveyResponse = require('./survey-response-tni');

module.exports = React.createClass({

  render: function() {
    return <div>
        <div className="timeline-bar row">
            <div className="line"></div>
            <div className="time col-xs-2 text-center">
              <i className="time-icon done fa fa-flag"></i>
              <span className="time-label">Welcome to the Institute</span>
            </div>
            <div className="time col-xs-2">
              <i className="time-icon done next fa fa-flag"></i>
              <span className="time-label">Week 1</span>
            </div>
            <div className="time col-xs-2 offset">
              <i className="time-icon fa fa-flag"></i>
              <span className="time-label">Week 2</span>
            </div>
            <div className="time col-xs-2">
              <i className="time-icon fa fa-flag"></i>
              <span className="time-label">Week 3</span>
            </div>
            <div className="time col-xs-2">
              <i className="time-icon fa fa-flag"></i>
              <span className="time-label">Week 4</span>
            </div>
            <div className="time col-xs-2">
              <i className="time-icon last fa fa-flag"></i>
              <span className="time-label">Week 5</span>
            </div>
          </div>
          <br/>
         
        <SurveyResponse />
     
    </div>
  
  
}
});
