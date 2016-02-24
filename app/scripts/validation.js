
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
function changeType(x, type) {
if(x.prop("type") === type)
return x; //That was easy.
try {
return x.prop("type", type); //Stupid IE security will not allow this
} catch(e) {
//Try re-creating the element (yep... this sucks)
//jQuery has no html() method for the element, so we have to put into a div first
var html = $("<div>").append(x.clone()).html();
var regex = /type=(\")?([^\"\s]+)(\")?/; //matches type=text or type="text"
//If no match, we add the type attribute to the end; otherwise, we replace
var tmp = $(html.match(regex) == null ?
html.replace(">", ' type="' + type + '">') :
html.replace(regex, 'type="' + type + '"') );
//Copy data from old element
tmp.data("type", x.data("type"));
var myevents = x.data("events");
var i, j;
var cb = function(events) {
return function() {
//Bind all prior events
for(i in events)
{
var y = events[i];
for(j in y)
tmp.bind(i, y[j].handler);
}
};
}(myevents);
x.replaceWith(tmp);
setTimeout(cb, 0.1); //Wait a bit to call function
return tmp;
}
}
$(function() {

    $("#success .close").click(function(){
        $("#success").css("display", "none");
    });
     $("#createAccount").validate({
        focusCleanup: true,
        rules: {
            name: {
                required: true,
                minlength: 2,
                hasOnlyLetters: true
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
//                pwCheckLowerCase: true,
//                pwCheckUpperCase: true,
//                pwCheckHasDigit: true,
//                minlength: 5,
//                maxlength: 8
            },
            confirmpassword: {
                required: true,
                equalTo: "#accountPassword"
            }
        },
        messages: {
            name: {
                required: "<span class= 'en-txt'> Please specify your name.</span>",
                minlength: "<span class= 'en-txt'>Please write a longer name (at least 2 letters) to be credible.</span>",
                hasOnlyLetters: "Please write a real name. Only letters, ' and space are allowed."
            },
            email: {
                required: "<span class= 'en-txt'> Please enter your email address, so people can answer to your invitation.</span>",
                email: "<span class= 'en-txt'> Your email address must be in the format of name@domain.com.</span>"
            },
            password: {
                required: "You have to write a password."
            },
            confirmpassword: {
                required: "Sorry, You have to type again your password.",
                equalTo: "This is not the same as your first password. Please, type it again or change your first entry."
            }

        },
        // errorElement: "div",
        //errorLabelContainer: ".error-msg",
        errorPlacement: function(error, element) {
          var placement = $(element).data("error");
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
  $.validator.addMethod("hasOnlyLetters", function(value) {
    return /^[A-Za-z'\s]*$/.test(value);
    // has only letters, ' or space
  });
  $.validator.addMethod("pwCheckLowerCase", function(value) {
   return /[a-z]/.test(value); // has a lowercase letter
});

  $.validator.addMethod("pwCheckUpperCase", function(value) {
   return /[A-Z]/.test(value); // has an uppercase letter
});

  $.validator.addMethod("pwCheckHasDigit", function(value) {
   return /\d/.test(value); // has a digit
});
// CREDIT TO
//  http://www.webdesignerdepot.com/2012/01/password-strength-verification-with-jquery/
// changed valid to pass and invalid to fail  classes cause of validate function already uses   those
  $(".password-checklist").addClass("hidden");
  $("#accountPassword").keyup(function() {
    // set password variable
    var pswd = $(this).val();

    // validate -be longer than 5 characters
    if ( pswd.length < 5 ) {
      $("#minlength").removeClass("pass").addClass("fail");
      $("#accountPassword").removeClass("valid").addClass("error");
    }
     else {
      $("#minlength").removeClass("fail").addClass("pass");
      $("#accountPassword").removeClass("error").addClass("valid");
     }
    // validate - has one lowercase letter
    if (pswd.match(/[a-z]/)) {
      $("#letter").removeClass("fail").addClass("pass");
      $("#accountPassword").removeClass("error").addClass("valid");
    }
    else {
      $("#letter").removeClass("pass").addClass("fail");
      $("#accountPassword").removeClass("valid").addClass("error");
    }
    // validate - has one capital letter
    if (pswd.match(/[A-Z]/)) {
      $("#capital").removeClass("fail").addClass("pass");
      $("#accountPassword").removeClass("error").addClass("valid");
    }
    else {
      $("#capital").removeClass("pass").addClass("fail");
      $("#accountPassword").removeClass("valid").addClass("error");
    }
    // validate - has one number
    if (pswd.match(/\d/)) {
      $("#number").removeClass("fail").addClass("pass");
      $("#accountPassword").removeClass("error").addClass("valid");
    }
    else {
      $("#number").removeClass("pass").addClass("fail");
      $("#accountPassword").removeClass("valid").addClass("error");
    }
    // verify - shorter than 15 characters with minlength
    if (pswd.length > 15) {
      $("#maxlength").removeClass("pass").addClass("fail");
      $("#accountPassword").removeClass("valid").addClass("error");
    }
    else
      if (pswd.length > 5){
      $("#maxlength").removeClass("fail").addClass("pass");
      $("#accountPassword").removeClass("error").addClass("valid");
    }
    else {
      $("#maxlength").removeClass("pass").addClass("fail");
      $("#accountPassword").removeClass("valid").addClass("error");
    }

  }).focus(function() {
    // to prevent screen refresh
    if ($(".password-checklist").hasClass("hidden")) {
      $(".password-checklist").removeClass("hidden");
      $(".password-checklist").addClass("show");
      $("#passwordunmask").addClass("fitunmask");
    }
  }).blur(function() {
    $(".password-checklist").removeClass("show");
    $(".password-checklist").addClass("hidden");
    $("#passwordunmask").removeClass("fitunmask");
  });
$("#passwordunmask").focus(function(){
   if ($(".password-checklist").hasClass("hidden")) {
      $(".password-checklist").removeClass("hidden");
      $(".password-checklist").addClass("show");
      $("#passwordunmask").addClass("fitunmask");
    }
}).blur(function() {
  $(".password-checklist").removeClass("show");
  $(".password-checklist").addClass("hidden");
  $("#passwordunmask").removeClass("fitunmask");
});




// CREDIT TO
// http://www.jqueryscript.net/form/jQuery-Plugin-To-Mask-Unmask-Password-On-Demand.html
$(".unmask").on("click", function(){
  // CHANGED $(this).prev('input') TO $(this).siblings(".password") because of label error placement

if($(this).siblings(".password").attr("type") === "password")
changeType($(this).siblings(".password"), "text");

else
changeType($(this).siblings(".password"), "password");

return false;
});


});
