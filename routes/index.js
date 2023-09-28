const express = require('express');
const videoRoute = require('./videoRoute');

const router = express.Router();

const defaultRoutes = [
	
	{
		path: '/recording',
		route: videoRoute,
	},
	
];


defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
