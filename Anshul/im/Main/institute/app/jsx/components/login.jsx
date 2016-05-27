var React = require('react')

var Login = React.createClass({
    render: function () {
        return (
            <div className = "loginPage">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                path <span className = "sub-heading">institute</span>
                            </a>
                        </div>
                    </div>
                </nav>

                <div className = "quote col-lg-4 col-lg-offset-4 text-justify">
                    <p>"Two roads diverged in a wood, and I—
                    I took the one less traveled by,
                    And that has made all the difference."</p>
                    <p className = "author text-right">-Robert Frost</p>
                </div>

                <div className = "login col-lg-4 col-lg-offset-4  text-center">
                    <a className="btn btn-default" href="{this.state.loginUri}" role="button"><i className="fa fa-google-plus"></i>Sign in with Google</a>
                </div>

                <div className = "footer col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">© 2016-Teach For India</div>

            </div>
        );
    }
});

module.exports = Login;
