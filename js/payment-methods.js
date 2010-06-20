"use strict";

$(function () {
  $("input[name='payment_method']").bind('change', function () {
    var that = $(this);
    (that.val() === 'credit_card') ?
      $("fieldset#fields_for_credit_card").slideDown() :
      $("fieldset#fields_for_credit_card").slideUp();
  });
  $("#radio_credit_card").attr("checked", "checked").trigger('change');
});

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

    api.numbersOnly = function (id) {
      return secret.test(id, /^\d+$/);
    };

    api.lettersOnly = function (id) {
      return secret.test(id, /^[a-zA-Z]+$/);
    };

    api.lettersAndSpacesOnly = function (id) {
      return secret.test(id, /^[a-zA-Z\s]+$/);
    };
  }());

  return api;
}());

macskeptic.paymentMethods = (function () {
  var api = {}, secret = {};
  return api;
});
