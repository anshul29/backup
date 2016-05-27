import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import FontIcon from 'material-ui/FontIcon';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {yellow600,greenA700} from 'material-ui/styles/colors';

var basicData = require('../../../../json/basicData.json')

var TopListItem = require ('./top-card-list')
var TopListSubItem =require ('./list-sub-item')

const TopFixedCard = () => (
  <Card>
    <CardText className="top-card">
      <List className="location-div row">
        <TopListItem property="City" value={basicData[0].city} iconName="fa fa-map-marker" bgColor={yellow600}/>
        <TopListSubItem property="Community" value={basicData[0].community} iconName="fa fa-futbol-o" />
      </List>
      <hr />
      <List className="school-div row">
        <TopListItem property="School" value={basicData[1].school} iconName="fa fa-graduation-cap" bgColor={greenA700} />
        <TopListSubItem property="Type" value={basicData[1].type} iconName="fa fa-futbol-o" />
        <TopListSubItem property="Shift" value={basicData[1].shifty} iconName="fa fa-futbol-o" />
      </List>
      <hr />
      <List className="school-div row">
        <TopListItem className="col-sm-12"property="PM Name" value={basicData[2].pm} iconName="fa fa-futbol-o" src="http://i.imgur.com/DNEk9R5.jpg"/>
        <TopListItem property="Fellow 1" value={basicData[2].fellows[0].name} iconName="fa fa-futbol-o" src="http://i.imgur.com/xKBtyMI.jpg" />
        <TopListSubItem property="Employee ID" value={basicData[2].fellows[0].empId}  />
        <TopListSubItem property="FY" value={basicData[2].fellows[0].fy}  />
        <TopListItem property="Fellow 2" value={basicData[2].fellows[1].name} iconName="fa fa-futbol-o" src="http://i.imgur.com/Z2HuYaK.jpg"/>
        <TopListSubItem property="Employee ID" value={basicData[2].fellows[1].empId}  />
        <TopListSubItem property="FY" value={basicData[2].fellows[1].fy}  />
      </List>
    </CardText>
  </Card>
);

export default TopFixedCard;
