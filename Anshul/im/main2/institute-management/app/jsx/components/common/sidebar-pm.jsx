var React = require('react');
var userStore = require('../../stores/userStore')
var mainStore = require('../../stores/mainStore')

module.exports = React.createClass({
    getInitialState: function () {
      return {
        userDetails: {},
      }
    },
    componentDidMount: function () {
          userStore.dispatch({type: 'check'})
          userStore.subscribe(function () {
            let userDetails = userStore.getState()
            if(userDetails)
              this.setState({
                userDetails: userDetails
              })
            }.bind(this))
    },
    render: function () {
  		return <div>
      <aside className="main-sidebar">
        <section className="sidebar">
          <div className="user-panel">
            <div className="pull-left image">
              <img src={this.state.userDetails.pictureURL} className="img-circle" alt="User Image"/>
            </div>
            <div className="pull-left info">
            <p>{this.state.userDetails.displayName}</p>
            <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className="header">MAIN NAVIGATION</li>
          <li className="active treeview">
            <a href="#">
              <i className="fa fa-dashboard"></i> <span>Home</span>
            </a>

          </li>
          <li className="treeview">
            <a href="#">
              <i className="fa fa-files-o"></i>
              <span>Competencies</span>
              <span className="label label-primary pull-right"></span>
            </a>
            <ul className="treeview-menu">
              <li><a href=""><i className="fa fa-circle-o"></i> Vaibhav Gupta</a></li>
              <li><a href=""><i className="fa fa-circle-o"></i> Hitesh Rawtani</a></li>
              <li><a href=""><i className="fa fa-circle-o"></i> Gauraang Bhartiya</a></li>
              <li><a href=""><i className="fa fa-circle-o"></i> Anshul Mann</a></li>
            </ul>
          </li>
          <li>
            <a href="">
              <i className="fa fa-calendar"></i> <span>Calendar</span>
              <small className="label pull-right bg-red">3</small>
            </a>
          </li>            <li className="treeview">
            <a href="#">
              <i className="fa fa-pie-chart"></i>
              <span>Survey</span>
            </a>
            <ul className="treeview-menu">
              <li><a href=""><i className="fa fa-circle-o"></i> Vaibhav Gupta</a></li>
              <li><a href=""><i className="fa fa-circle-o"></i> Hitesh Rawtani</a></li>
              <li><a href=""><i className="fa fa-circle-o"></i> Gauraang Bhartiya</a></li>
              <li><a href=""><i className="fa fa-circle-o"></i> Anshul Mann</a></li>
            </ul>
          </li>
          <li className="treeview">
            <a href="#">
              <i className="fa fa-book"></i>
              <span>Library</span>
            </a>
          </li>
          <li className="treeview">
            <a href="#">
              <i className="fa fa-edit"></i> <span>Resources</span>
            </a>
          </li>
          <li className="treeview">
            <a href="#">
              <i className="fa fa-table"></i> <span>Emergency Contact</span>
            </a>
          </li>
        </ul>
      </section>
    </aside>
      </div>
  				}
})
