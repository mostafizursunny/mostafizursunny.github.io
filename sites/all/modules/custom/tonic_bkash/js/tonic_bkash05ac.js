(function ($) {

    var campaign_payment_uri = "";
    var product_code = "";
    var sales_source = $('#sales-source').val();
    var bkash_msisdn = $('#bkash-msisdn').val();
    var paymentConfig= {
        createCheckoutURL: "/bkash-create-payment",
        executeCheckoutURL: "/bkash-execute-payment",
    };

    if (findGetParameter('utm_campaign_code') != null) {
        product_code = findGetParameter('utm_campaign_code');
    } else {
        product_code = $('input[name=mmb_campaign_code]:checked').val();
    }

    $(document).on("click", '#bKash_button', function(event) {

        campaign_payment_uri = $('#campaign-payment-uri').val();

    });

    bKash.init({

        paymentMode: 'checkout',

        paymentRequest: { amount: get_campaign_price(), product_code: product_code, sales_source: sales_source, msisdn: bkash_msisdn },


        createRequest: function (request) {

            console.log("Request Data: ");
            // console.log(request);

            $.ajax({
                url: '/'+get_language()+paymentConfig.createCheckoutURL+"?amount="+request.amount+"&msisdn="+request.msisdn,
                type: 'GET',
                contentType: 'application/json',
                success: function (data) {

                    data = JSON.parse(data);

                    if (data && data.paymentID != null) {

                        paymentID = data.paymentID;
                        productCode = request.product_code;
                        salesSource = request.sales_source;
                        msisdn = request.msisdn;

                        bKash.create().onSuccess(data);
                    } else {
                        bKash.create().onError();
                    }
                },
                error: function () {
                    bKash.create().onError();
                }
            });

        },
        executeRequestOnAuthorization: function () {

            $.ajax({
                url: '/'+get_language()+paymentConfig.executeCheckoutURL+"?paymentID="+paymentID+"&utm_campaign_code="+productCode+"&ss="+salesSource+"&campaign_payment_uri="+campaign_payment_uri+"&msisdn="+msisdn,
                type: 'GET',
                contentType: 'application/json',
                success: function (data) {

                    // if (data && data.paymentID != null) {
                    if (data && data.destination != null) {
                        window.location.href = data.destination; //your success page

                    } else {
                        // bKash.execute().onError();
                        window.location.href = data.error_destination; //your success page
                    }
                },
                error: function () {
                    bKash.execute().onError();
                }
            });
        }
    });

})(jQuery);

function get_language(){
    var ur = window.location.href;
    var ref = document.referrer;
    var match = ur.match('bn|en');

    if(match)
        return match;
    else{
        var  rmatch = ref.match(/\/(bn|en)\//i);
        if(rmatch)
            return rmatch[1];
        else
            return $('html').attr('lang');
    }
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function get_campaign_price() {
    return $('#campaign-amount').val();
}
