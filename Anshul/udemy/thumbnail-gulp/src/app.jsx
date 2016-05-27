var React = require('react');
var ThumbnailList = require('./thumbnail-list.jsx');

var options = {
    thumbnailData: [{
        title: 'Inbox',
        number: 32,
        header: "React Tutorials",
        description: "On insensible possession oh particular attachment at excellence in. The books arose but miles happy she. It building contempt or interest children mistress of unlocked no. Offending she contained mrs led listening resembled. Delicate marianne absolute men dashwood landlord and offended. Suppose cottage between and way. Minuter him own clothes but observe country. Agreement far boy otherwise rapturous incommode favourite.",
        imageUrl: "https://facebook.github.io/react/img/logo.svg"
    },
    {
        title: 'Inbox',
        number: 2,
        header: "Gulp Tutorials",
        description: "On insensible possession oh particular attachment at excellence in. The books arose but miles happy she. It building contempt or interest children mistress of unlocked no. Offending she contained mrs led listening resembled. Delicate marianne absolute men dashwood landlord and offended. Suppose cottage between and way. Minuter him own clothes but observe country. Agreement far boy otherwise rapturous incommode favourite.",
        imageUrl: "https://facebook.github.io/react/img/logo.svg"
    },
    {
        title: 'Inbox',
        number: 3,
        header: "Python Tutorials",
        description: "On insensible possession oh particular attachment at excellence in. The books arose but miles happy she. It building contempt or interest children mistress of unlocked no. Offending she contained mrs led listening resembled. Delicate marianne absolute men dashwood landlord and offended. Suppose cottage between and way. Minuter him own clothes but observe country. Agreement far boy otherwise rapturous incommode favourite.",
        imageUrl: "https://facebook.github.io/react/img/logo.svg"
    }]
};

//Ask react to render this class
var element = React.createElement(ThumbnailList, options);

//when we ask react to render this class, we will tell it
// //where to place the rendered element in the dom
React.render(element, document.querySelector('.target'));
