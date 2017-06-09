const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);

const assignServer = require('./assign-server');
const postLabWrite = require('./post-lab-write');
const postExecutionInvocation = require('./post-execution-invocation');

exports.assignServer = assignServer;
exports.postLabWrite = postLabWrite;
exports.postExecutionInvocation = postExecutionInvocation;
