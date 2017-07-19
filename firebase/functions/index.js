const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);

const assignServer = require('./assign-server');
const postLabWrite = require('./post-lab-write');
const postExecutionWrite = require('./post-execution-write');


exports.assignServer = assignServer;
exports.postLabWrite = postLabWrite;
exports.postExecutionWrite = postExecutionWrite;
