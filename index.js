var aws = require("aws-sdk");
var ses = new aws.SES({
    region: "us-east-1"
});
exports.handler = async (event) => {
    // TODO implement
    var message = JSON.parse(event.Records[0].Sns.Message);
    console.log('Message received from SNS:', message);
    let recipient = message.username;
    console.log('recipient='+recipient);
    console.log("Message type:");
    console.log(typeof message);
    var params = {
        Destination: {
            ToAddresses: [recipient],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `<h2>CSYE6225 WEBAPP NOTIFICATION</h2>
                    Hi ${recipient}, <br> 
                    This is a notification for the activity: ${message.message} <br> <br>
                    Please find the details below: <br>
                    <ul>
                    <li>Question id: ${message.question_id}</li>
                    <li>Username: ${message.username}</li>
                    <li>Answer id: ${message.answer_id}</li>
                    <li>Answer text: ${message.answer_text}</li>
                    <li>Question link: ${message.question_link}</li>
                    <li>Answer link: ${message.answer_link}</li>
                  </ul> 
                  <hr>
                  <footer>
                    <p>Note: This notification system uses AWS SES, SNS and Lambda Function<br>
                    <a href="https://github.com/pimples-fall2020">Source Code (For member-access only)</a></p> <br>
                    Thank You!
                </footer>`
                },
            },

            Subject: {
                Data: "CSYE6225 Webapp Activity"
            },
        },
        Source: "pimple.s@northeastern.edu",
    };

    return ses.sendEmail(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred 
        } else {
            console.log("Email sent from lambda!")
            console.log(data); // successful response
        }
        /*
        data = {
         MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
        }
        */
    }).promise();

    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify({
    //         msg: "Message received from SNS",
    //         data: message
    //     }),
    // };
    // console.log("this is a log");
    // console.log(JSON.stringify(event));
    // return response;
};