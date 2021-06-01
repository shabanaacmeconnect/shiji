
var sgMail = require("@sendgrid/mail");
var request_module=require('request')
sgMail.setApiKey('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');
var from = "digital@marshal.ae";

function triggerEmail(dest, subject, message, bodyHtml) {
    if (bodyHtml === void 0) { bodyHtml = ""; }
    if (bodyHtml.length !='') {
        var msg = {
            to: dest,
            from: from,
            subject: subject,
            text: message,
            html: bodyHtml
        };
        sgMail.send(msg).then(function () { }, function (error) {
            // if (error.response) {
            //     console.log(error)
            //     console.log("error", "ERROR : " + error.response.body + " : " + dest);
            // }
        });
    }
    else {
        var msg = {
            to: dest,
            from: from,
            subject: subject,
            text: message
        };
        sgMail.send(msg).then(function () { }, function (error) {
            if (error.response) {
                console.log(error)
                console.log("error", "ERROR : " + error + " : " + dest);
            }
        });
    }
}

exports.triggerEmail = triggerEmail;
