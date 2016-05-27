import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';

var SubCardExpanded = require('../subcards/sub-card-expanded')
var SubCard = require('../subcards/sub-card_.jsx')
var RadarChart = require('../charts/radar-chart.jsx');
var TopListItem = require ('./top-card-list')
var studentData = require('../../../../json/studentData.json')

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

    var acadSum = []

    for (var prop in studentData.academics) {

      var rObj = {}
      rObj.label = studentData.academics[prop].title ;
      rObj.data = studentData.academics[prop].data[studentData.academics[prop].data.length - 1].data;

      acadSum.push(rObj);
    }

    return (
      <Card className="student-card green-bg" expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          className="student-card-head"
          title={<p className="student-name">{studentData.name}</p>}
          subtitle={<span className="name-sub-text"><span className="gender">{studentData.gender}</span> <span>{studentData.grade}</span></span>}
          avatar="http://i.imgur.com/V9lQyzu.jpg"
        />
        <hr className="top-hr green-bg"/>
        <CardText className="green-bg">
          <div className="student-sub-div">
            <p>Years of Intervention: <span className="right-text">{(studentData.interventionYears) + " Years"}</span></p>
            <p>Number of instructional hours received per week: <span className="right-text">{(studentData.instructionalHours) + " Hours"}</span></p>
            <p>Parent Interaction: <span className="right-text">{(studentData.parentInteraction) + "%"}</span></p>
            <p>Number of days absent in this year: <span className="right-text">{(studentData.absentDays) + " Days"}</span></p>
          </div>
          <hr className="green-bg"/>
        </CardText>
        <CardTitle className="green-bg"><p className="sub-heading">Recent Achievements</p></CardTitle>
        <CardText className="green-bg">
          <div className="student-sub-div">
            <p className="sub-text"><span className="ach-icon"><i className="fa fa-star"></i></span><span className="padding-left">{studentData.achievements[0]}</span></p>
            <p className="sub-text"><span className="ach-icon"><i className="fa fa-star"></i></span><span className="padding-left">{studentData.achievements[1]}</span></p>
          </div>
        <hr className="green-bg"/>
        </CardText>

        <CardTitle
          className="green-bg"
          actAsExpander={true}
          showExpandableButton={true}
        ><p className="sub-heading">Academics Summary || {studentData.currentYear}</p></CardTitle>

        <CardText className="green-bg"
        >
          <div className="student-sub-div green-bg row">

            <p className="col-xs-3 sub-text">{acadSum[0].label}:<span className="float-right">{acadSum[0].data}</span></p>
            <p className="col-xs-3 sub-text">{acadSum[1].label}:<span className="float-right">{acadSum[1].data}</span></p>
            <p className="col-xs-3 sub-text">{acadSum[2].label}:<span className="float-right">{acadSum[2].data}</span></p>
            <p className="col-xs-3 sub-text">{acadSum[3].label}:<span className="float-right">{acadSum[3].data}</span></p>

          </div>
        </CardText>
        <CardText className="green-bg" expandable={true}>
          <SubCardExpanded data={acadSum} />
          <SubCard title={studentData.academics.sub1.title} data={studentData.academics.sub1} />
          <SubCard title={studentData.academics.sub2.title} data={studentData.academics.sub2}/>
          <SubCard title={studentData.academics.sub3.title} data={studentData.academics.sub3}/>
          <SubCard title={studentData.academics.sub4.title} data={studentData.academics.sub4}/>
        </CardText>
      </Card>
    );
  }
}
