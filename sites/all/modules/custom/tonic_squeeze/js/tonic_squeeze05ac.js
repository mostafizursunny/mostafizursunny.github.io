(function ($) {


    $('#member-msisdn').focusout(function () {

        if ($('.user-logged-in').length) {
            return false;
        }

        var msisdn = $('#member-msisdn').val();
        var payment_method = $("#payment-method").val();

        if (msisdn == "") {
            $('#bKash_button1').prop('disabled', true);

            $('.glyphicon-ok').hide("slow");
            $('.glyphicon-remove').hide("slow");
            $('#msisdn-feedback').parent().addClass("has-warning");
            $('#msisdn-feedback').parent().removeClass("has-success");
            return false;
        }

        if (msisdn !="" && !msisdn.match(/^01[3-9]\d{8}$/)){
            $('.bkash-weekly-submit .error').html("You have to enter only gp number.").slideDown("slow");
            $('.bkash-weekly-submit .success').html("").slideUp("slow");
            return false;
        } else {
            $('.bkash-weekly-submit .error').html("").slideUp("slow");
        }

        $.ajax({
            url: '/'+getLang()+'/checking-valid-mnp/'+msisdn+'?payment_method='+payment_method,
            beforeSend: function() { $("#squeeze-mnp").modal('show'); },
            complete: function() { $("#squeeze-mnp").modal('hide'); },
            type: 'POST',
            success: function (result) {

                if(result.error) {
                    $('.bkash-weekly-submit .error').html(result.message).slideDown("slow");
                    $('#payment-submit').prop('disabled', true);

                    $('.has-feedback .glyphicon-ok').hide("slow");
                    $('.has-feedback .glyphicon-remove').show("slow");
                    $('#msisdn-feedback').parent().addClass("has-warning");
                    $('#msisdn-feedback').parent().removeClass("has-success");
                    $('.bkash-weekly-submit .success').html("").slideUp("slow");
                    $('.bkash-weekly-submit .show-queue-message').html("").slideUp("slow");
                } else {
                    $('#payment-submit').prop('disabled', false).css('opacity', '1');
                    $('.bkash-weekly-submit .error').html("").slideUp("slow");

                    $('.has-feedback .glyphicon-ok').show("slow");
                    $('.has-feedback .glyphicon-remove').hide("slow");
                    $('#msisdn-feedback').addClass("has-success");
                    $('#msisdn-feedback').parent().removeClass("has-warning");

                    if ($('.squeeze-bkash-btn').length) {
                        $('#bKash_button1').prop('disabled', false).css('opacity', '1');
                    }

                    if (payment_method == "airtime") {
                        $('.bkash-weekly-submit .success').html(result.message).slideDown("slow");
                    }

                    if (result.queue == 1) {
                        $('.payment-queue-alert').modal('show');
                    }
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });

    })

    $('#resned-otp').click(function () {
        if ($('.user-logged-in').length) {
            return false;
        }

        var msisdn = $('#member-msisdn').val();
        var payment_method = $("#payment-method").val();

        if (msisdn == "") {
            $('#bKash_button1').prop('disabled', true);

            $('.glyphicon-ok').hide("slow");
            $('.glyphicon-remove').hide("slow");
            $('#msisdn-feedback').parent().addClass("has-warning");
            $('#msisdn-feedback').parent().removeClass("has-success");
            return false;
        }

        if (msisdn !="" && !msisdn.match(/^01[3-9]\d{8}$/)){
            $('.bkash-weekly-submit .error').html("You have to enter only gp number.").slideDown("slow");
            $('.bkash-weekly-submit .success').html("").slideUp("slow");
            return false;
        } else {
            $('.bkash-weekly-submit .error').html("").slideUp("slow");
        }

        $.ajax({
            url: '/'+getLang()+'/checking-valid-mnp/'+msisdn+'?payment_method='+payment_method,
            beforeSend: function() { $("#squeeze-resend-otp").modal('show'); },
            complete: function() { $("#squeeze-resend-otp").modal('hide'); },
            type: 'POST',
            success: function (result) {

                if(result.error) {
                    $('.bkash-weekly-submit .error').html(result.message).slideDown("slow");
                    $('#payment-submit').prop('disabled', true);

                    $('.has-feedback .glyphicon-ok').hide("slow");
                    $('.has-feedback .glyphicon-remove').show("slow");
                    $('#msisdn-feedback').parent().addClass("has-warning");
                    $('#msisdn-feedback').parent().removeClass("has-success");
                    $('.bkash-weekly-submit .success').html("").slideUp("slow");
                    $('.bkash-weekly-submit .show-queue-message').html("").slideUp("slow");
                } else {
                    $('#payment-submit').prop('disabled', false).css('opacity', '1');
                    $('.bkash-weekly-submit .error').html("").slideUp("slow");

                    $('.has-feedback .glyphicon-ok').show("slow");
                    $('.has-feedback .glyphicon-remove').hide("slow");
                    $('#msisdn-feedback').addClass("has-success");
                    $('#msisdn-feedback').parent().removeClass("has-warning");

                    if ($('.squeeze-bkash-btn').length) {
                        $('#bKash_button1').prop('disabled', false).css('opacity', '1');
                    }

                    if (payment_method == "airtime") {
                        $('.bkash-weekly-submit .success').html(result.message).slideDown("slow");
                    }

                    if (result.queue == 1) {
                        $('.payment-queue-alert').modal('show');
                    }
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });

    $('#payment-submit').click(function (e) {

        var  msisdn = $('#member-msisdn').val();
        var  verification_id = $('#member-nid').val();
        var  father_name = $('#member-father').val();

        if (msisdn == "") {
            $('.bkash-weekly-submit .error').html("All fields are required.").slideDown("slow");
            return false;
        }

        if (verification_id == "" && father_name == "") {
            $('.bkash-weekly-submit .error').html("NID or Father's name is required.").slideDown("slow");
            return false;
        }

        // Send campaign success if request from App
        if ($('#platform-source').length) {
            if ($('#platform-source').val() == "ANDROID_APP") {
                sendCampaignSuccessForAndroid(msisdn);
            }
            if ($('#platform-source').val() == "IOS_APP") {
                sendCampaignSuccessForIOS(msisdn);
            }
        }

        // Add a popup with a message
        $('#squeeze-modal').modal('show');

        bKash.reconfigure({
            paymentMode: 'checkout',
            paymentRequest: { amount: $('#campaign-amount').val(), product_code: $('#campaign-code').val(), sales_source: $('#sales-source').val()},
        });
    });

    $(document).on("click", '#payment-queue-confirmation, #payment-queue-cancel', function(e) {
        $('.payment-queue-alert').modal('hide');
    });

    $(document).on("click", '#credit-card-confirmation', function(e) {
        $('#credit-card-modal').modal('hide');
    });

})(jQuery);

function sendCampaignSuccessForAndroid(msisdn) {
    try {
        AndroidNative.campaignSuccess(msisdn);
    } catch (err) {
        console.log(err.message);
    }
}

function sendCampaignSuccessForIOS(msisdn) {
    try {
        window.webkit.messageHandlers.campaignSuccess.postMessage(JSON.stringify(msisdn));
    } catch (err) {
        console.log(err.message);
    }
}
