require('dotenv').config();
const _ = require('lodash')

var self = module.exports = {
  isMasterProcess: function() {
    if (_.has(process.env, 'NODE APP INSTANCE')) {
      return _.get(process.env, 'NODE APP INSTANCE') === '0';
    } else if (_.has(process.env, 'NODE_APP_INSTANCE')) {
      return _.get(process.env, 'NODE_APP_INSTANCE') === '0';
    } else {
      return cluster.isMaster;
    }
  },
}