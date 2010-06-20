"use strict";

var macskeptic = {awesomenessLevel: 9042};

macskeptic.messages = {
  hasOnlyLetters: 'must have only letters',
  hasOnlyNumbers: 'must have only numbers',
  hasOnlyLettersAndSpaces: 'must have only letters and spaces'
};

macskeptic.doom = (function () {
  var api = {}, secret = {}, dependencies = {};

  (function initializeDefaultDependencies() {
    dependencies.query = jQuery;
  }());

  (function definePrivateMethods() {
    secret.query = function (selector) {
      return dependencies.query(selector);
    };
  }());

  (function definePublicApi() {
    api.customize = {
      query: function (query) {
        dependencies.query = query;
      }
    };

    api.elementById = function  (id) {
      return secret.query('#' + id);
    };

    api.valueById = function (id) {
      return api.elementById(id).val();
    };

    api.labelForId = function (id) {
      return secret.query('label[for="'+id+'"]');
    };

    api.textOfLabelForId = function (id) {
      return api.labelForId(id).text();
    };

    api.dataForId = function (id, key, value) {
      return value ?
        api.elementById(id).data(key, value) :
        api.elementById(id).data(key);
    };
  }());

  return api;
}());

macskeptic.error = (function () {
  var api = {}, secret = {}, dependencies = {};

  (function initializeDefaultDependencies() {
    dependencies.doom = macskeptic.doom;
  }());

  (function definePublicApi() {
    api.customize = {
      doom: function (doom) {
        dependencies.doom = doom;
      }
    };

    api.create = function (id, message) {
      return {
        on: id,
        message: message,
        description: function () {
          return dependencies.doom.textOfLabelForId(id) + ' ' + message;
        }
      };
    };
  }());

  return api;
}());

macskeptic.errors = (function () {
  var api = {}, secret = {}, dependencies = {};

  secret.all = {};

  (function definePrivateMethods() {
  }());

  (function definePublicApi() {
    api.on = function (id) {
      return (secret.all[id] = secret.all[id] || []);
    };

    api.add = function (id, message) {
      api.on(id).push(macskeptic.error.create(id, message));
    };

    api.clear = function () {
      secret.all = {};
    };
  }());

  return api;
}());

macskeptic.matchers = (function () {
  var api = {}, secret = {}, dependencies = {}; 

  (function definePublicApi() {
    api.hasOnlyNumbers = function (content) {
      return /^\d+$/.test(content);
    };

    api.hasOnlyLetters = function (content) {
      return /^[a-zA-Z]+$/.test(content);
    };

    api.hasOnlyLettersAndSpaces = function (content) {
      return /^[a-zA-Z\s]+$/.test(content);
    };
  }());

  return api;
}());

macskeptic.validator = (function () {
  var api = {}, secret = {}, dependencies = {}; 

  secret.all = {};

  (function initializeDefaultDependencies() {
    dependencies.doom = macskeptic.doom;
    dependencies.errors = macskeptic.errors;
    dependencies.matchers = macskeptic.matchers;
    dependencies.messages = macskeptic.messages;
  }());

  (function definePrivateMethods() {
    secret.val = function (id) {
      return dependencies.doom.valueById(id);
    };

    secret.toArray = function (o) {
      return $.isArray(o) ? o : [o];
    };
  }());

  (function definePublicApi() {
    api.customize = {
      doom: function (doom) {
        dependencies.doom = doom;
      },
      errors: function (errors) {
        dependencies.errors = errors;
      }
    };

    api.enlist = function (id, matchers)  {
      secret.all[id] = secret.toArray(matchers);
    };

    api.validate = function (id, desiredMatchers) {
      if (id) {
        var matchers = desiredMatchers || secret.all[id];
        $.each(matchers, function(i, matcher) {
          if (!dependencies.matchers[matcher](secret.val(id))) {
            dependencies.errors.add(id, dependencies.messages[matcher]);
          }
        });
      } else {
        $.each(secret.all, api.validate);
      }
    };
  }());

  return api;
}());

macskeptic.paymentMethods = (function () {
  var api = {}, secret = {};

  (function definePrivateMethods() {
    secret.setupEvents = function () {
      $("input[name='payment_method']").bind('change', function () {
        var that = $(this);
        (that.val() === 'credit_card') ?
          $("fieldset#fields_for_credit_card").slideDown() :
          $("fieldset#fields_for_credit_card").slideUp();
      });
    };
  }());

  (function definePublicApi() {
    api.initialize = function () {
      secret.setupEvents();
    };
  }());

  return api;
}());

$(function () {
  macskeptic.paymentMethods.initialize();
  $("#radio_credit_card").attr("checked", "checked").trigger('change');
});
