var React = require('react');
var PDF = require('react-pdf');

module.exports = React.createClass({
  render: function() {
    return <PDF file="../../../documents/2015-16_LDJ Scales.pdf" page="2" />
  },
  _onDocumentCompleted: function(page, pages){
    this.setState({page: page, pages: pages});
  }
});
