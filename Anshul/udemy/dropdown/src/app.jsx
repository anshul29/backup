var React = require('react');
var ReactDOM = require('react-dom');
var Dropdown = require('./dropdown.jsx');

var options = {
    title: 'Choose a desert',
    items: [
        'Apple Pie',
        'Peach Cobbler',
        'Coconut Cream Pie'
    ]
};

//Ask react to render this class
var element = React.createElement(Dropdown, options);

//when we ask react to render this class, we will tell it
// //where to place the rendered element in the dom
ReactDOM.render(element, document.querySelector('.target'));
