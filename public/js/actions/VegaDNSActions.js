var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');

var VegaDNSActions = {
  login: function(email, password) {
    AppDispatcher.dispatch({
      actionType: VegaDNSConstants.LOGIN,
      email: email,
      password: password
    });
  },
  logout: function() {
    AppDispatcher.dispatch({
      actionType: VegaDNSConstants.LOGOUT
    });
  }
};

module.exports = VegaDNSActions;
