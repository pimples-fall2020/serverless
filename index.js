exports.handler = async (event) => {
    // TODO implement
    var message = event.Records[0].Sns.Message;
    console.log('Message received from SNS:', message);
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            msg: "Message received from SNS",
            data: message
        }),
    };
    console.log("this is a log");
    console.log(JSON.stringify(event));
    return response;
};
