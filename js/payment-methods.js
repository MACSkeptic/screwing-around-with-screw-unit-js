"use strict";

$(function () {
  $("input[name='payment_method']").bind('change', function () {
    var that = $(this);
    (that.val() === 'credit_card') ?
      $("fieldset#fields_for_credit_card").removeClass("hidden") :
      $("fieldset#fields_for_credit_card").addClass("hidden");
  });
  $("#radio_credit_card").attr("checked", "checked").trigger('change');
});
