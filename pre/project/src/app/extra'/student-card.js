import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
var DistributionChart = require('./charts/distribution-chart.jsx');

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
    this.setState({expanded: expanded,});
  };

  handleExpand () {
    this.setState({expanded: !this.state.expanded, label: "Minimize",});
  };



  render() {

    var attr = {
      title: "Competency Distribution: Priority 1",
      size: "large",
      data: [{
          label: "Execution",
          value: 12 },
          {
          label: "Planning",
          value: 41},
          {
          label: "BRIO",
          value: 67},
          {
          label: "Reflection",
          value: 50}
  ]};


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
          <p>

          </p>
          <DistributionChart mainAttr={attr} />

        </CardText>
        <CardMedia
          expandable={true}
          overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
        >

        </CardMedia>
        <CardTitle title="Card title" subtitle="Card subtitle" expandable={true} />
        <CardText expandable={true}>
        
        </CardText>
        <CardActions>
          <FlatButton label={this.state.label} onTouchTap={this.handleExpand} />
        </CardActions>
      </Card>
    );
  }
}
