import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
var RadarChart = require('./charts/radar-chart.jsx');

export default class StudentCard extends React.Component {

  constructor(props) {
    super(props);
    this.handleExpandChange = this.handleExpandChange.bind(this)
    this.handleExpand = this.handleExpand.bind(this)

    this.state = {
      expanded: false,
      label: "View More",
    };
    console.log(this.state.label)
  }

  handleExpandChange (expanded) {
    this.setState({expanded: expanded, });
  };

  handleExpand () {
    this.setState({expanded: !this.state.expanded,});
  };

  handleLabel(expanded) {
    this.setState({label: "Minimise"})
  }



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
          subtitle="Grade 3"
          avatar="http://lorempixel.com/100/100/nature/"
          actAsExpander={true}
          showExpandableButton={true}
        />

        <hr className="divider"/>
        <CardText>
          
        </CardText>

        <CardTitle title="Card title" subtitle="Card subtitle" expandable={true} />
        <CardText expandable={true}>
          <RadarChart mainAttr={radarAttr} />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions>
          <FlatButton label={this.state.label} onTouchTap={this.handleExpand} />
        </CardActions>

      </Card>
    );
  }
}
