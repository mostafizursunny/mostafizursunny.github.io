(function($) {

    Drupal.behaviors.tonic_diet_plan = {
        attach: function (context, settings) {

            $("#tonic-diet-plan-link-btn").click(function(e) {
                e.preventDefault();

                var uri = '?'+window.location.search.substring(1);
                var params = {
                    msisdn:getParameterByName('msisdn', uri),
                    name:getParameterByName('name', uri),
                    file:getParameterByName('file', uri)
                };
                var redirect_url = $(this).attr('href');

                $.ajax({
                    url: '/diet-plan-click-ajax',
                    beforeSend: function() { $(this).addClass('disabled');},
                    complete: function() { $(this).removeClass('disabled');},
                    method: 'POST',
                    dataType: 'json',
                    data: {diet_plan_clicked:'CLICKED', params:params, redirect_url:redirect_url},
                    success: function(result){
                        console.log(result['success']);
                        if (result['success']) {
                            window.location.href = redirect_url;
                        }
                    }
                });
            });

            return false;
        }
    };
})(jQuery);

/**
 * @param name
 * @param url
 * @returns {*}
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}