
$(document).ready(function () {

  const form = $("#beachContactForm");
  const alertBox = $("#formAlert");
  const submitButton = form.find(".beach-submit-btn");
function revealContactElements() {

    $(".contact-reveal").each(function () {

      const elementTop = $(this).offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();

      if (windowBottom > elementTop + 100) {
        $(this).addClass("active");
      }

    });

  }

  revealContactElements();

  $(window).on("scroll", revealContactElements);


     //VALIDATION FUNCTIONS
 

  function showError(field, message) {

    const group = field.closest(".form-group");

    group.addClass("has-error");
    group.find(".error-message").text(message);

  }


  function clearError(field) {

    const group = field.closest(".form-group");

    group.removeClass("has-error");
    group.find(".error-message").text("");

  }


  function validateEmail(email) {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

  }


  function validatePhone(phone) {

    const phonePattern =
      /^[0-9+\-\s()]{7,20}$/;

    return phonePattern.test(phone);

  }
  form.find("input, textarea").on("input change", function () {

    const field = $(this);

    if (field.val().trim() !== "") {
      clearError(field);
    }

    alertBox
      .removeClass("success error")
      .hide();

  });

    // FORM SUBMIT
 form.on("submit", function (event) {
     event.preventDefault();
   // Get Fields 

    const fullName = $("#fullName");
    const email = $("#email");
    const phone = $("#phone");
    const subject = $("#subject");
    const message = $("#message");
    // Reset

    form.find(".form-group").removeClass("has-error");
    form.find(".error-message").text("");

    alertBox
      .removeClass("success error")
      .hide();
     let isValid = true;
    // Full Name 

    if (fullName.val().trim().length < 2) {

      showError(
        fullName,
        "Please enter your full name."
      );

      isValid = false;

    }
    // Email 

    if (email.val().trim() === "") {

      showError(
        email,
        "Please enter your email address."
      );

      isValid = false;

    } else if (!validateEmail(email.val().trim())) {

      showError(
        email,
        "Please enter a valid email address."
      );

      isValid = false;

    }
  // Phone 

    if (phone.val().trim() === "") {

      showError(
        phone,
        "Please enter your phone number."
      );

      isValid = false;

    } else if (!validatePhone(phone.val().trim())) {

      showError(
        phone,
        "Please enter a valid phone number."
      );

      isValid = false;

    }
   // Subject 

    if (subject.val().trim().length < 3) {

      showError(
        subject,
        "Please enter a subject."
      );

      isValid = false;

    }
    // Message 

    if (message.val().trim().length < 10) {

      showError(
        message,
        "Message must contain at least 10 characters."
      );

      isValid = false;

    }
// Stop if invalid 

    if (!isValid) {

      alertBox
        .addClass("error")
        .html(
          '<i class="fa-solid fa-circle-exclamation"></i> ' +
          'Please correct the highlighted fields and try again.'
        )
        .fadeIn(250);

      // the shared popup names every field that still needs attention 
      if (window.BobForms) {
        const problems = [];
        form.find(".form-group.has-error").each(function () {
          const label = $(this).find("label").first().text().trim();
          const note = $(this).find(".error-message").first().text().trim();
          problems.push((label || "Field") + ": " + (note || "please check this."));
        });
        window.BobForms.notify("fix", "Message not sent",
          "Please fix these " + (problems.length || "highlighted") + " fields and press send again:",
          problems);
      }

      const firstError =
        form.find(".has-error").first();

      if (firstError.length) {

        $("html, body").animate(
          {
            scrollTop:
              firstError.offset().top - 120
          },
          500
        );

      }

      return;

    }

    submitButton.addClass("loading");

    const originalButtonText =
      submitButton.find(".btn-content span").text();

    submitButton.find(".btn-content span")
      .text("Sending...");

    submitButton.find(".btn-content i")
      .removeClass("fa-paper-plane")
      .addClass("fa-spinner fa-spin");


    setTimeout(function () {

      submitButton.removeClass("loading");

      submitButton.find(".btn-content span")
        .text(originalButtonText);

      submitButton.find(".btn-content i")
        .removeClass("fa-spinner fa-spin")
        .addClass("fa-paper-plane");


      alertBox
        .removeClass("error")
        .addClass("success")
        .html(
          '<i class="fa-solid fa-circle-check"></i> ' +
          'Thank you! Your message has been submitted successfully.'
        )
        .fadeIn(300);

      if (window.BobForms) {
        window.BobForms.notify("ok", "Message sent",
          "Thank you - your enquiry is with the team. A reply lands in your inbox within a working day.");
      }


      form[0].reset();


      setTimeout(function () {

        alertBox.fadeOut(400);

      }, 6000);


    }, 1400);

  });

});