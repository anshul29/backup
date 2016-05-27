import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';

var RadarChart = require('../charts/radar-chart.jsx');

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
};

export default class StudentTabs extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange (value) {
    this.setState({
      slideIndex: value,
    });
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
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          <Tab label="All" value={0} />
          <Tab label="Maths" value={1} />
          <Tab label="RC" value={2} />
          <Tab label="Writing" value={3} />
          <Tab label="S&L" value={4} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div>
            <h2 style={styles.headline}>Tabs with slide effect</h2>
            Swipe to see the next slide.<br /><RadarChart mainAttr={radarAttr} />
          </div>
          <div style={styles.slide}>
            <RadarChart mainAttr={radarAttr} />
          </div>
          <div style={styles.slide}>
            <RadarChart mainAttr={radarAttr} />
          </div>
          <div>
            <RadarChart mainAttr={radarAttr} />
          </div>
        </SwipeableViews>
      </div>
    );
  }
}
