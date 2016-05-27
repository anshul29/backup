var React = require('react');

module.exports = React.createClass({
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
            <li className="active">Priotitized Competencies</li>
          </ol>
        </section>

        <section className="content">
        <div className="row">
          <div ClassName="col-md-6">
            <div ClassName="box box-primary">
              <div ClassName="box-header with-border">
                <h3 ClassName="box-title">Area Chart</h3>
                <div ClassName="box-tools pull-right">
                  <button ClassName="btn btn-box-tool" data-widget="collapse"><i ClassName="fa fa-minus"></i></button>
                  <button ClassName="btn btn-box-tool" data-widget="remove"><i ClassName="fa fa-times"></i></button>
                </div>
              </div>
              <div ClassName="box-body">
                <div ClassName="chart">
                  <canvas id="areaChart" style="height:250px"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div ClassName="col-md-6">
            <div ClassName="box box-info">
              <div ClassName="box-header with-border">
                <h3 ClassName="box-title">Line Chart</h3>
                <div ClassName="box-tools pull-right">
                  <button ClassName="btn btn-box-tool" data-widget="collapse"><i ClassName="fa fa-minus"></i></button>
                  <button ClassName="btn btn-box-tool" data-widget="remove"><i ClassName="fa fa-times"></i></button>
                </div>
              </div>
              <div ClassName="box-body">
                <div ClassName="chart">
                  <canvas id="lineChart" style="height:250px"></canvas>
                </div>
              </div>
            </div>

            <div ClassName="box box-success">
              <div ClassName="box-header with-border">
                <h3 ClassName="box-title">Bar Chart</h3>
                <div ClassName="box-tools pull-right">
                  <button ClassName="btn btn-box-tool" data-widget="collapse"><i ClassName="fa fa-minus"></i></button>
                  <button ClassName="btn btn-box-tool" data-widget="remove"><i ClassName="fa fa-times"></i></button>
                </div>
              </div>
              <div ClassName="box-body">
                <div ClassName="chart">
                  <canvas id="barChart" style="height:230px"></canvas>
                </div>
              </div>
          </div>
        </div>
        </div>
        </section>
        </div>

  </div>
}
})
