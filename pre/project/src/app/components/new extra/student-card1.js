import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';

var StudentTabs = require('../tabs/student-tabs').default
var RadarChart = require('../charts/radar-chart.jsx');

export default class StudentCard extends React.Component {

  constructor(props) {
    super(props);
    this.handleExpandChange = this.handleExpandChange.bind(this);
    this.state = {
      expanded: false,
    };
  }

  handleExpandChange (expanded)  {
    this.setState({expanded: expanded});
  };

  render() {

    var radarAttr = {
      title: "Academics",
      data: {
        labels: ["Maths", "Writing", "RC", "S&L"],
    		datasets: [
    			{
    				label: "Average Performance",
    				fillColor: "rgba(220,220,220,0.2)",
    				strokeColor: "rgba(220,220,220,1)",
    				pointColor: "rgba(220,220,220,1)",
    				pointStrokeColor: "#fff",
    				pointHighlightFill: "#fff",
    				pointHighlightStroke: "rgba(220,220,220,1)",
    				data: [65,59,90,81]
    			},
    			{
    				label: "Student Performance",
    				fillColor: "rgba(151,187,205,0.2)",
    				strokeColor: "rgba(151,187,205,1)",
    				pointColor: "rgba(151,187,205,1)",
    				pointStrokeColor: "#fff",
    				pointHighlightFill: "#fff",
    				pointHighlightStroke: "rgba(151,187,205,1)",
    				data: [28,48,40,19]
    			}
    		]
      }
    };

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title="Amrita"
          subtitle={<p><span>3rd Standard</span> <span className="gender">Female</span></p>}
          avatar="http://lorempixel.com/100/100/nature/"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <hr />
        {/*<RadarChart mainAttr={radarAttr} />*/}
        <CardText>

          <div className="student-sub-div">
            <p>Year 2015</p>
            <span>RC: 1.4</span>
            <span>Maths: 2.3</span>
            <span>Writing: 3.5</span>
            <span>S&L: 2.4</span>
          </div>
          <hr />
          <div className="Achievements">
            <p>Year 2015</p>
            <span>RC: 1.4</span>
            <span>Maths: 2.3</span>
            <span>Writing: 3.5</span>
            <span>S&L: 2.4</span>

          </div>
          <hr />
        </CardText>
        <CardTitle title="Card title" subtitle="Card subtitle" expandable={true} />
        <CardText expandable={true}>
        <StudentTabs />
        </CardText>

      </Card>
    );
  }
}
