import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
var StatusChart = require('./charts/status-bar.jsx');

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

    var data = {
                data: [{
                    label: "Strongly Disagree",
                    value: 67
                },{
                    label: "Disagree",
                    value: 70
                },{
                    label: "Agree",
                    value: 30
                },{
                    label: "Strongly Agree",
                    value: 19
                }],
                total: 250
    }


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

          <StatusChart dataStatus={data} />
        </CardText>
        <CardMedia
          expandable={true}
          overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
        >
          <img src="http://lorempixel.com/600/337/nature/" />
        </CardMedia>
        <CardTitle title="Card title" subtitle="Card subtitle" expandable={true} />
        <CardText expandable={true}>
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
