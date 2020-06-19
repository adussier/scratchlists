const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const stepFunctions = new AWS.StepFunctions()

exports.handler = async (task) => {
    // set dates
    if (!task.created) {
        task.created = new Date().toISOString();
    }
    task.updated = new Date().toISOString();

    // cancel existing reminder (if set)
    if (task.reminder_id) {
        let params  = {
            cause: "Related task was updated",
            error: "Related task was updated",
            executionArn: task.reminder_id
        }

        await stepFunctions
            .stopExecution(params)
            .promise()
            .then(() => delete task.reminder_id);
    }

    // set reminder (if due date)
    if (task.due_date) {
        // step function data input
        let input = {
            user_id: task.user_id,
            task_id: task.task_id,
            reminder_timestamp: new Date(task.due_date).toISOString()
        }

        // step function execution input
        let params = {
            stateMachineArn: "arn:aws:states:eu-central-1:622793554726:stateMachine:Scratchlists-TriggerReminder",
            input: JSON.stringify(input)
        }

        await stepFunctions
            .startExecution(params)
            .promise()
            .then(data => {
                task.reminder_id = data.executionArn;
            })
            .catch(err => console.log(err));
    }

    // update database
    const params = {
        TableName: "Scratchlists",
        Item: task
    }
    await dynamoDb
        .put(params)
        .promise()
        .then(res => res)
        .catch(err => err);
};
