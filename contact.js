function sendData(token) {
  $.post(formUrl, JSON.stringify({
   website: document.location.hostname,
   name: $("#contact-us-form input[name='name']").val(),
   email: $("#contact-us-form input[name='email']").val(),
   phone: $("#contact-us-form input[name='phone']").val(),
   message: $("#contact-us-form textarea[name='message']").val(),
   'g-recaptcha-response': token
 }), function (data) {
    $(".sending").hide();
    $(".thanks").show();
    $("#contact-us-form").removeClass("was-validated");
    $("#contact-us-form input[name='name']").val('');
    $("#contact-us-form input[name='email']").val('');
    $("#contact-us-form input[name='phone']").val('');
    $("#contact-us-form textarea[name='message']").val('');
  }, 'json');
}

function validate(event) {
  var form = document.getElementById('contact-us-form');
  var valid = form.checkValidity();
  event.preventDefault();
  event.stopPropagation();
  form.classList.add('was-validated');
  if (valid === true) {
    $("#contactForm button").classList.add("d-none");
    grecaptcha.execute();
  }
}

function onload() {
  var element = document.getElementById('submit');
  if (element != null) {
    element.onclick = validate;
  };
}

$(document).ready(onload);
