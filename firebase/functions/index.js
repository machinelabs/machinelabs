const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);

const setHasCachedRun = require('./has-cached-run');
const assignServer = require('./assign-server');

exports.setHasCachedRun = setHasCachedRun;
exports.assignServer = assignServer;