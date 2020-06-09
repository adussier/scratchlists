const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    var params = {
        Key: {
            "username": event["queryStringParameters"]['username'],
            "task_id": event["queryStringParameters"]['task_id']
        },
        TableName: "Scratchlists"
    };

    await dynamoDb
        .delete(params)
        .promise();

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": null,
        "isBase64Encoded": false
    };
};
