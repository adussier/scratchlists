const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const stepFunctions = new AWS.StepFunctions()

exports.handler = async (event) => {

    // add created date for new items
    if (!event.created) {
        event.created = new Date().toISOString();
    }

    // set last updated date
    event.updated = new Date().toISOString();

    // cancel existing reminder if set
    if (event.reminder_id) {
        let params  = {
            cause: "Related task was updated",
            error: "Related task was updated",
            executionArn: event.reminder_id
        }

        await stepFunctions
            .stopExecution(params)
            .promise()
            .then(() => delete event.reminder_id);
    }

    // set reminder if due date
    if (event.due_date) {
        let input = {
            username: event.username,
            task_id: event.task_id,
            reminder_timestamp: new Date(event.due_date).toISOString()
        }

        let params = {
            stateMachineArn: "arn:aws:states:eu-central-1:622793554726:stateMachine:Scratchlists-TriggerReminder",
            input: JSON.stringify(input)
        }

        await stepFunctions
            .startExecution(params)
            .promise()
            .then(data => {
                event.reminder_id = data.executionArn;
            })
            .catch(err => console.log(err));
    }

    // update db
    const params = {
        TableName: "Scratchlists",
        Item: event
    }
    await dynamoDb
        .put(params)
        .promise()
        .then(res => res)
        .catch(err => err);
};
