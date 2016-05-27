import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

var LineChart = require('../charts/line-chart.jsx');


module.exports = React.createClass({
  render: function () {

    var lineData = this.props.data

    var lineAttr = {
      data: {
        labels : [],
        datasets : [
          {
            label: "Average Growth",
            fillColor : "rgba(220,220,220,0.2)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(220,220,220,1)",
            data : []
          },
          {
            label: "Student's Growth",
            fillColor : "rgba(42,172,193,0.2)",
            strokeColor : "rgba(42,172,193,1)",
            pointColor : "rgba(42,172,193,1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(42,172,193,1)",
            data : []
          }
        ]
      }
    };

    for (var i = 0; i < lineData.data.length; i++) {
      lineAttr.data.labels[i] = lineData.data[i].label ;
      if (this.props.title === ("Maths" || "maths" || "MATHS")) {
        lineAttr.data.datasets[0].data[i] = (Math.random()*10 + 40).toFixed(2) ;
        lineAttr.data.datasets[1].data[i] = lineData.data[i].data ;
      }
      else {
        lineAttr.data.datasets[0].data[i] = (Math.random()*1 + 1.5).toFixed(2) ;
        lineAttr.data.datasets[1].data[i] = lineData.data[i].data ;
      }
    }

    return (
      <Card>
        <CardHeader
          className="aca-title"
          title={this.props.title}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <p className="sub-text">Student growth in {this.props.title} w.r.t. average</p>
          <LineChart mainAttr={lineAttr} />
        </CardText>
      </Card>
    );
  }
})
