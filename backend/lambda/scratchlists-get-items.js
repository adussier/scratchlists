const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    var params = {
        KeyConditionExpression: "username = :username",
        FilterExpression: ":task_status = task_status",
        ExpressionAttributeValues: {
            ":username": event["queryStringParameters"]['username'],
            ":task_status": event["queryStringParameters"]['task_status']
        },
        TableName: "Scratchlists"
    };

    let items = await dynamoDb
        .query(params)
        .promise();

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify(items),
        "isBase64Encoded": false
    };
};
