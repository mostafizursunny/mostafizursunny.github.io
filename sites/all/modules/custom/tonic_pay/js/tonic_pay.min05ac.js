function dec2hex(e){return("0"+e.toString(16)).substr(-2)}function generateId(e){var n=new Uint8Array((e||40)/2);return window.crypto.getRandomValues(n),Array.from(n,dec2hex).join("")}jQuery(document).ready(function(){jQuery(document).on("click","#generate-app-key",function(e){jQuery("#edit-app-key").val(generateId())})});