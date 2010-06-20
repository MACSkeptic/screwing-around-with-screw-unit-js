"use strict";

var macskeptic = {awesomenessLevel: 9042};

macskeptic.helpers = {
  reduce: function (collection, seed, step) {
    var result = seed;
    $.each(collection, function (i, element) { result = step(result, element); });
    return result;
  }
};

macskeptic.messages = {
  hasOnlyLetters: 'must have only letters',
  hasOnlyNumbers: 'must have only numbers',
  hasOnlyLettersAndSpaces: 'must have only letters and spaces',
  lengthIsAtLeast: function (minimum) {
    return 'must have at least ' + minimum + ' characters';
  }
};

macskeptic.doom = (function () {
  var api = {}, secret = {}, dependencies = {};

  (function initializeDefaultDependencies() {
    dependencies.query = jQuery;
  }());

  (function definePrivateMethods() {
  }());

  (function definePublicApi() {
    api.customize = {
      query: function (query) {
        dependencies.query = query;
      }
    };

    api.query = function (selector) {
      return dependencies.query(selector);
    };

    api.bind = function (selector, eventName, callback) {
      api.query(selector).bind(eventName, callback);
    };

    api.elementById = function  (id) {
      return api.query('#' + id);
    };

    api.valueById = function (id) {
      return api.elementById(id).val();
    };

    api.labelForId = function (id) {
      return api.query('label[for="'+id+'"]');
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

  (function setupDefaultDependencies() {
    dependencies.error = macskeptic.error; 
    dependencies.helpers = macskeptic.helpers; 
  }());

  (function definePrivateMethods() {
    secret.countAllErrors = function () {
      return dependencies.helpers.reduce(secret.all, 0, function (sum, current) {
        return sum + current.length;
      });
    };
  }());

  (function definePublicApi() {
    api.customize = {
      helpers: function (helpers) {
        dependencies.helpers = helpers;
      },
      error: function (error) {
        dependencies.error = error;
      }
    };

    api.on = function (id) {
      return secret.all[id] || api.clear(id);
    };

    api.haveOccurredOn = function (id) {
      return api.count(id) > 0;
    };

    api.haveOccurred = function (id) {
      return api.haveOccurredOn(id);
    };

    api.count = function (id) {
      return id ? api.on(id).length : secret.countAllErrors();
    };

    api.add = function (id, message) {
      api.on(id).push(dependencies.error.create(id, message));
    };

    api.clear = function (id) {
      if (id) {
        return (secret.all[id] = []);
      } else {
        secret.all = {};
      }
    };
  }());

  return api;
}());

macskeptic.matchers = (function () {
  var api = {}, secret = {}, dependencies = {}; 

  (function definePublicApi() {
    api.hasOnlyNumbers = function (content) {
      return !content || /^\d+$/.test(content);
    };

    api.hasOnlyLetters = function (content) {
      return !content || /^[a-zA-Z]+$/.test(content);
    };

    api.hasOnlyLettersAndSpaces = function (content) {
      return !content || /^[a-zA-Z\s]+$/.test(content);
    };

    api.lengthIsAtLeast = function (content, minimum) {
      return content && content.length >= minimum;
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

    secret.validateFieldByIdUsingMatcher = function (id, matcher) {
      $.each(matcher, function (name, customParameters) {
        if (!dependencies.matchers[name](secret.val(id), customParameters)) {
          var message = dependencies.messages[name];
          dependencies.errors.add(
            id, 
            $.isFunction(message) ? message(customParameters) : message);
        }
      });
    };

    secret.validateFieldByIdUsingMatchers = function (id, matchers) {
      $.each(matchers ? secret.toArray(matchers) : secret.all[id], function(i, matcher) {
        if ($.isPlainObject(matcher)) {
          secret.validateFieldByIdUsingMatcher(id, matcher); 
        } else {
          var simpleMatcher = {};
          simpleMatcher[matcher] = matcher;
          secret.validateFieldByIdUsingMatcher(id, simpleMatcher); 
        }
      });
    };
  }());

  (function definePublicApi() {
    api.customize = {
      doom: function (doom) {
        dependencies.doom = doom;
      },
      errors: function (errors) {
        dependencies.errors = errors;
      },
      matchers: function (matchers) {
        dependencies.matchers = matchers;
      },
      messages: function (messagess) {
        dependencies.messages = messages;
      }
    };

    api.enlist = function (id, matchers)  {
      secret.all[id] = secret.toArray(matchers);
    };

    api.validate = function (id, matchers) {
      if (id) {
        secret.validateFieldByIdUsingMatchers(id, matchers); 
      } else {
        $.each(secret.all, api.validate);
      }
    };
  }());

  return api;
}());

macskeptic.paymentMethods = (function () {
  var api = {}, secret = {}, dependencies = {};

  (function setupDefaultDependencies() {
    dependencies.validator = macskeptic.validator;
    dependencies.doom = macskeptic.doom;
  }());

  (function definePrivateMethods() {
    secret.setupEvents = function () {
      dependencies.doom.bind("input[name='payment_method']", 'change', function () {
        var that = dependencies.doom.query(this);
        var element = dependencies.doom.elementById('fields_for_credit_card');
        (that.val() === 'credit_card') ?  element.slideDown() : element.slideUp();
      });
    };

    secret.setupValidations = function () {
      dependencies.validator.enlist('number', 'hasOnlyNumbers');
      dependencies.validator.enlist(
        'name', 
        ['hasOnlyLettersAndSpaces', {lengthIsAtLeast: 3} ]);
    };
  }());

  (function definePublicApi() {
    api.customize = {
      validator: function (validator) {
        dependencies.validator = validator;
      },
      doom: function (doom) {
        dependencies.doom = doom;
      }
    };

    api.initialize = function () {
      secret.setupEvents();
      secret.setupValidations();
    };
  }());

  return api;
}());

// this should be deleted
$(function () {
  macskeptic.paymentMethods.initialize();
  macskeptic.validator.validate();
  
  $("#radio_credit_card").attr("checked", "checked").trigger('change');
});
