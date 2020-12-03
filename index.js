var aws = require("aws-sdk");
var ses = new aws.SES({
    region: "us-east-1"
});
var ddb = new aws.DynamoDB({
    apiVersion: '2012-08-10'
});

var docClient = new aws.DynamoDB.DocumentClient();


exports.handler = async (event) => {

    var message = JSON.parse(event.Records[0].Sns.Message);
    var put_params = {
        TableName: 'csye6225',
        Item: {
            'id': {
                S: event.Records[0].Sns.MessageId
            },
            'message': {
                S: message.message
            },
            'question_id': {
                S: message.question_id
            },
            'username': {
                S: message.username
            },
            'answer_id': {
                S: message.answer_id
            },
            'answer_text': {
                S: message.answer_text
            },
            'question_link': {
                S: message.question_link
            },
            'answer_link': {
                S: message.answer_link
            }

        }
    };


    var scan_params = {
        TableName: "csye6225",
        // ProjectionExpression: "#yr, title, info.rating",        
        ExpressionAttributeNames: {
            "#msg": "message",
            "#qid": "question_id",
            "#usr": "username",
            // "#aid": "answer_id",
            "#ans": "answer_text",
            "#qlink": "question_link"
            // "#alink": "answer_link",
        },
        ExpressionAttributeValues: {
            ':message': message.message,
            ':question_id': message.question_id,
            ':username': message.username,
            ':answer_text': message.answer_text,
            ':question_link': message.question_link
        },
        FilterExpression: "#msg = :message AND #qid = :question_id AND #usr = :username AND #ans = :answer_text AND #qlink = :question_link"
    };

    console.log('Message received from SNS:', message);
    let recipient = message.username;
    console.log('recipient=' + recipient);
    // console.log("Message type:");
    // console.log(typeof message);
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

    var scanData;
    try {
        scanData = await scanDynamo(scan_params);
        console.log("Query succeeded.");
        console.log(scanData);
    } catch (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    }

    if (scanData.Count == 0) { //Non-duplicate
        // send email
        var emailResponse;
        try {
            emailResponse = await sendSESemail(params);
            console.log("Email succeeded.");
            console.log(emailResponse);
        } catch (err) {
            console.error("Unable to send email. Error:", JSON.stringify(err, null, 2));
        }
    } else {
        // duplicate
        // don't send email
        console.log("Duplicate Entry found, not sending the email");
    }

    // Put email in dynamo regardless of duplication
    var putData;
    try {
        putData = await putDynamo(put_params);
        console.log("PUT Query succeeded.");
        console.log(putData);
    } catch (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    }



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

function scanDynamo(params) {
    return new Promise((resolve, reject) => {
        docClient.scan(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

function putDynamo(params) {
    return new Promise((resolve, reject) => {
        ddb.putItem(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

function sendSESemail(params) {
    return new Promise((resolve, reject) => {
        ses.sendEmail(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}