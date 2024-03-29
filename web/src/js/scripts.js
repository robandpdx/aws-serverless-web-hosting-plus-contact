//
// Scripts
// 

function sendData(token) {
    $.post(formUrl, JSON.stringify({
     website: document.location.hostname,
     name: $("#contactForm input[id='name']").val(),
     email: $("#contactForm input[id='email']").val(),
     phone: $("#contactForm input[id='phone']").val(),
     message: $("#contactForm textarea[id='message']").val(),
     'g-recaptcha-response': token
   }), function (data) {
      $("#submitSuccessMessage").removeClass("d-none");
      $("#contactForm input[id='name']").val('');
      $("#contactForm input[id='email']").val('');
      $("#contactForm input[id='phone']").val('');
      $("#contactForm textarea[id='message']").val('');
    }, 'json');
}
  
function validate(event) {
    var form = document.getElementById('contactForm');
    var valid = form.checkValidity();
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');
    if (valid === true) {
        $("#contactForm button").hide();
        grecaptcha.execute();
    }
}

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 72,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    var element = document.getElementById('submitButton');
  if (element != null) {
    element.onclick = validate;
  };

});
