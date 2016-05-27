var React = require('react');

module.exports = React.createClass({
    render: function () {
  		return <div>
      <div className="content-wrapper">
        {/*<section className="content-header">
          <h1>
            Fellow Dashboard
            <small>Institue 1</small>
          </h1>
        </section>*/}

        {/*<section className="content">*/}

          <div className="timeline-bar row">
            <div className="line"></div>
            <div className="time col-xs-2 text-center">
              <i className="time-icon done fa fa-flag"></i>
              <span className="time-label">Welcome to the Institue</span>
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

            {/*<div className="timeline-bar row">
              <div className="line col-lg-11"></div>
              <div className="time col-sm-2 text-center">
                <i className="time-icon fa fa-flag"></i>
                <span className="time-label">Welcome to the Institue</span>
              </div>
              <div className="time col-sm-2">
                <i className="time-icon fa fa-flag"></i>
                <span className="time-label">Let the journey begin</span>
              </div>
              <div className="time col-sm-2">
                <i className="time-icon fa fa-flag"></i>
                <span className="time-label">You're on the path</span>
              </div>
              <div className="time col-sm-2">
                <i className="time-icon fa fa-flag"></i>
                <span className="time-label">You're on the path</span>
              </div>
              <div className="time col-sm-2">
                <i className="time-icon fa fa-flag"></i>
                <span className="time-label">You're on the path</span>
              </div>
              <div className="time col-sm-2">
                <i className="time-icon fa fa-flag"></i>
                <span className="time-label">Institue ends!</span>
              </div>
            </div>*/}
        {/*</section>*/}
      </div>

  </div>
}
})
