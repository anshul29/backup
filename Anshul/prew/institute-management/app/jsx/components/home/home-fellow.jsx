var React = require('react');

module.exports = React.createClass({
    render: function () {
  		return <div>
      <div className="content-wrapper">

        <section className="content">

        <div className="row ">

          <div className="col-lg-12 academics-card">

            <div className="nav-tabs-custom">

              <ul className="nav nav-tabs pull-right">
                <li className="active"><a href="#revenue-chart" data-toggle="tab">S&L</a></li>
                <li><a href="#sales-chart" data-toggle="tab">Writing</a></li>
                <li><a href="#sales-chart" data-toggle="tab">RC</a></li>
                <li><a href="#sales-chart" data-toggle="tab">Maths</a></li>
                <li><a href="#sales-chart" data-toggle="tab">All</a></li>
                <li className="pull-left header"><i className="fa fa-inbox"></i> Academics</li>
              </ul>

              <div className="tab-content no-padding">
                <div className="chart tab-pane active" id="revenue-chart" style={{position: 'relative', height: '300px'}}>hi this is 2nd tab</div>
                <div className="chart tab-pane" id="sales-chart" style={{position: 'relative', height: '300px'}}>asdjhasj</div>
                <div className="chart tab-pane" id="sales-chart" style={{position: 'relative', height: '300px'}}>asdjhasj</div>
                <div className="chart tab-pane" id="sales-chart" style={{position: 'relative', height: '300px'}}>asdjhasj</div>
                <div className="chart tab-pane" id="sales-chart" style={{position: 'relative', height: '300px'}}>asdjhasj</div>
              </div>

            </div>
          </div>
        </div>
</section>
      </div>
  </div>
}
})
