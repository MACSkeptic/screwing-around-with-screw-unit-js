"use strict";

var macskeptic = {awesomenessLevel: 9042};

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
    api.elementById = function  (id) {
      return secret.query('#' + id);
    };

    api.valueById = function (id) {
      return api.elementById(id).val();
    };
  }());

  return api;
}());

macskeptic.validators = (function () {
  var api = {}, secret = {}, dependencies = {}; 

  (function initializeDefaultDependencies() {
    dependencies.doom = macskeptic.doom;
  }());

  (function definePrivateMethods() {
    secret.val = function (id) {
      return dependencies.doom.valueById(id);
    };

    secret.test = function (id, regex) {
      return regex.test(secret.val(id));
    };
  }());

  (function definePublicApi() {
    api.customize = {
      doom: function (doom) {
        dependencies.doom = doom;
      }
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
