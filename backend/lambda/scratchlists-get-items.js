const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // database query parameters
    var params = {
        KeyConditionExpression: "user_id = :user_id",
        FilterExpression: ":task_status = task_status",
        ExpressionAttributeValues: {
            ":user_id": event["queryStringParameters"]['user_id'],
            ":task_status": event["queryStringParameters"]['task_status']
        },
        TableName: "Scratchlists"
    };

    // query database
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
