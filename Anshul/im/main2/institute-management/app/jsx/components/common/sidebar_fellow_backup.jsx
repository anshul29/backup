<div className="hold-transition skin-blue sidebar-mini">

    <aside className="main-sidebar">
      <section className="sidebar">
        <div className="user-panel">
          <div className="pull-left image">
            <img src={this.state.userDetails.pictureURL} className="img-circle" alt="User Image"/>
          </div>
          <div className="pull-left info">
            <p>{this.state.userDetails.displayName}</p>
            <i className="fa fa-circle text-success"></i> Online
          </div>
        </div>
        <form action="#" method="get" className="sidebar-form">
          <div className="input-group">
            <input type="text" name="q" className="form-control" placeholder="Search..."/>
            <span className="input-group-btn">
              <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i></button>
            </span>
          </div>
        </form>
        <ul className="sidebar-menu">
          <li className="header">MAIN NAVIGATION</li>
          <li className="active treeview">
              <i className="fa fa-dashboard"></i> <span>Home</span>
          </li>
          <li className="treeview">
              <i className="fa fa-files-o"></i>
              <span>Progress Tracker</span>
              <span className="label label-primary pull-right"></span>
            <ul className="treeview-menu">

            </ul>
          </li>
          <li>
              <i className="fa fa-calendar"></i> <span>Calendar</span>
              <small className="label pull-right bg-red">3</small>
          </li>
          <li className="treeview">
              <i className="fa fa-pie-chart"></i>
              <span>Survey</span>
          </li>
          <li className="treeview">
              <i className="fa fa-book"></i>
              <span>Library</span>
          </li>
          <li className="treeview">
              <i className="fa fa-edit"></i> <span>Resources</span>
          </li>
          <li className="treeview">
              <i className="fa fa-table"></i> <span>Emergency Contact</span>
          </li>
        </ul>
      </section>
    </aside>

    <div className="control-sidebar-bg"></div>
</div>





----- prioritized-competencies

{(function (self) {
   if(true) {
      return <div>
      <h3 className="box-title">Planning &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-star"></i></h3>
      </div>
    }
    else {
      return <div>
      <h3 className="box-title">Planning &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-star-o"></i></h3>
      </div>
    }
    })(this)}



-----------

{ (function (){
// Add priority condition here - if competency.priority === true, display the competency first
//Else display them in the end. We will first find both the prioritized competencies and display them
  if(this.state.competencies && this.state.competencies.length > 0) {
    //console.log(this.state.competencies)
    let competencyArray = this.state.competencies.map(function(competency) {
      console.log(competency.competencyName)
        if(competency.competencyName == 'Brio')
        {
          //console.log(competency.competencyName === 'Planning')
          return <div key = {competency.competencyName}>
                    <h3 className="box-title">{competency.competencyName}</h3>
                    <div className="box-tools pull-right">
                      <button className="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle"><i className="fa fa-comments"></i></button>
                    </div>
                  <div className="box-body">
                    <div className="direct-chat-messages">
                      <div className="direct-chat-msg">
                        <div className="direct-chat-info clearfix">
                          <span className="direct-chat-name pull-left">Vaibhav Gupta</span>
                          <span className="direct-chat-timestamp pull-right">23 Jan 2:00 pm</span>
                        </div>
                        <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                        <div className="direct-chat-text">
                          Is this template really for free? That's unbelievable!
                        </div>
                      </div>
                      <div className="direct-chat-msg right">
                        <div className="direct-chat-info clearfix">
                          <span className="direct-chat-name pull-right">Sarah Bullock</span>
                          <span className="direct-chat-timestamp pull-left">23 Jan 2:05 pm</span>
                        </div>
                        <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                        <div className="direct-chat-text">
                          You better believe it!
                        </div>
                      </div>
                      <div className="direct-chat-msg">
                        <div className="direct-chat-info clearfix">
                          <span className="direct-chat-name pull-left">Alexander Pierce</span>
                          <span className="direct-chat-timestamp pull-right">23 Jan 5:37 pm</span>
                        </div>
                        <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                        <div className="direct-chat-text">
                          Working with AdminLTE on a great new app! Wanna join?
                        </div>
                      </div>


                      <div className="direct-chat-msg right">
                        <div className="direct-chat-info clearfix">
                          <span className="direct-chat-name pull-right">Sarah Bullock</span>
                          <span className="direct-chat-timestamp pull-left">23 Jan 6:10 pm</span>
                        </div>
                        <img className="direct-chat-img" src="../../public/dist/img/mario.jpg" alt="message user image"/>
                        <div className="direct-chat-text">
                          I would love to.
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                  }
                })
                return competencyArray;
              }})
            }
