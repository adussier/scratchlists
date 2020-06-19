const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const stepFunctions = new AWS.StepFunctions()

exports.handler = async (event) => {
    const user_id = event["queryStringParameters"]['user_id'];
    const task_id = event["queryStringParameters"]['task_id'];

    // get task from database
    let params = {
        Key: {
            user_id: user_id,
            task_id: task_id
        },
        TableName: "Scratchlists"
    };
    let result = await dynamoDb
        .get(params)
        .promise();
    let task = result.Item;

    // cancel existing reminder (if set)
    if (task.reminder_id) {
        let params  = {
            cause: "Related task was updated",
            error: "Related task was updated",
            executionArn: task.reminder_id
        }

        await stepFunctions
            .stopExecution(params)
            .promise();
    }

    // delete task
    params = {
        Key: {
            "user_id": user_id,
            "task_id": task_id
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

