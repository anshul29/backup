import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

var RadarChart = require('../charts/radar-chart.jsx');


// var data = this.props.data;
module.exports = React.createClass({
  render: function () {

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
