
/*
CREDIT TO https://gist.github.com/ajtroxell/6731408
*/


/*
jQuery.validator.addMethod('answercheck', function (value, element) {
        return this.optional(element) || /^\bcat\b$/.test(value);
    }, "type the correct answer -_-");
*/



// validate form
"use strict";

$(function() {

    $("#success .close").click(function(){
        $("#success").css("display", "none");
    });
    $("#createAccount").validate({
        focusCleanup: true,
        rules: {
            accountName: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                pwCheckLowerCase: true,
                pwCheckUpperCase: true,
                pwCheckHasDigit: true,
                minlength: 5,
                maxlength: 8
            },
            message: {
                required: true,
                minlength: 10
            }

        },
        messages: {
            accountName: {
                required: "<span class= 'en-txt'> Please specify your name.</span>",
                minlength: "<span class= 'en-txt'>Please write a longer name (at least 2 letters) to be credible.</span>"
            },
            email: {
                required: "<span class= 'en-txt'> Please enter your email address, so people can answer to your invitation.</span>",
                email: "<span class= 'en-txt'> Your email address must be in the format of name@domain.com.</span>"
            },
            password: {
                required: "<div class= 'en-txt'>You have to write a password.</div>",
                pwCheckLowerCase: "<span class='err-checkmark' ></span>",
                pwCheckUpperCase: "UPPERCASE",
                pwCheckHasDigit: "digit",
                minlength: "min length",
                maxlength: "maxlentght"
            }

        },
        // errorElement: "div",
        //errorLabelContainer: ".error-msg",
        errorPlacement: function(error, element) {
          var placement = $(element).data("error");
          if (element.attr("name") === "password")
              error.insertBefore(".password-checklist li");
          if (placement)
            $(placement).appendTo(error);
          else error.insertAfter(element);
        },
        submitHandler: function(form) {
            // setup some local variables
        var $form = $(form);
        // let's select and cache all the fields
        var $inputs = $form.find("input, select, button, textarea");
        // serialize the data in the form
        var serializedData = $form.serialize();

        // let's disable the inputs for the duration of the ajax request
        $inputs.prop("disabled", true);

        // fire off the request

        var request = $.ajax({
            url: "process.php",
            type: "post",
            data: serializedData
        });

        // callback handler that will be called on success
        // request.done(function (response, textStatus, jqXHR)
        request.done(function () {
           $("#success").html('<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">×</button><span class="en-txt">Your message has been sent successfully. Thank you for contacting me. I will be in touch with you very soon.</span></div>');
            $form[0].reset();
        });

        // callback handler that will be called on failure
        // request.fail(function (jqXHR,
        // textStatus, errorThrown) {


            // log the error to the console
//            console.error(
//                "The following error occured: " + textStatus, errorThrown);
       // });

        // callback handler that will be called regardless
        // if the request failed or succeeded
        request.always(function () {
            // reenable the inputs
            $inputs.prop("disabled", false);
        });

    }

        });

    // CREDIT TO http://stackoverflow.com/questions/18746234/jquery-validate-plugin-password-check-minimum-requirements-regex?rq=1
    $.validator.addMethod("pwCheckLowerCase", function(value) {
   return /[a-z]/.test(value); // has a lowercase letter
});

    $.validator.addMethod("pwCheckUpperCase", function(value) {
   return /[A-Z]/.test(value); // has an uppercase letter
});

    $.validator.addMethod("pwCheckHasDigit", function(value) {
   return /\d/.test(value); // has a digit
});


});
