"use strict";

$(function () {
  $("input[name='payment_method']").change(function () {
    var that = $(this);
    (that.val() === 'credit_card') ?
      $("fieldset#fields_for_credit_card").removeClass("hidden") :
      $("fieldset#fields_for_credit_card").addClass("hidden");
  });
});
