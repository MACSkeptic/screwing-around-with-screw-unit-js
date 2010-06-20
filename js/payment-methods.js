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
macskeptic.paymentMethods = (function () {
  var api = {}, secret = {};

  return api;
});
