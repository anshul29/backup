import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

var RadarChart = require('../charts/radar-chart.jsx');


// var data = this.props.data;
module.exports = React.createClass({
  render: function () {

        // var defaultData = {
    //   labels: [],
    //   datasets: [
    //     {
    //       label: "Average Performance",
    //       fillColor: "rgba(220,220,220,0.2)",
    //       strokeColor: "rgba(220,220,220,1)",
    //       pointColor: "rgba(220,220,220,1)",
    //       pointStrokeColor: "#fff",
    //       pointHighlightFill: "#fff",
    //       pointHighlightStroke: "rgba(220,220,220,1)",
    //       data: []
    //     },
    //     {
    //       label: "Student Performance",
    //       fillColor: "rgba(151,187,205,0.2)",
    //       strokeColor: "rgba(151,187,205,1)",
    //       pointColor: "rgba(151,187,205,1)",
    //       pointStrokeColor: "#fff",
    //       pointHighlightFill: "#fff",
    //       pointHighlightStroke: "rgba(151,187,205,1)",
    //       data: []
    //     }
    //   ]
    // }

    var radarAttr = this.props.data;

    return (
      <Card>
        <CardHeader
          title="Student Strength"
          subtitle="Strength of student w.r.t. average student's strength"
        />
        <CardText>
          <div className="chart">
            <RadarChart mainAttr={radarAttr} />
          </div>
        </CardText>

      </Card>
    );

  }
})
