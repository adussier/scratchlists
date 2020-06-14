const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const ses = new AWS.SES({region: 'eu-central-1'});

exports.handler = async (event) => {

    // get user
    const user = await cognito.adminGetUser({
      UserPoolId: "eu-central-1_GeUWgPTca",
      Username: event.username,
    }).promise()
    const email = user.UserAttributes.filter(a => a.Name === "email")[0].Value;

    // get task
    let params = {
        Key: {
            username: event.username,
            task_id: event.task_id
        },
        TableName: "Scratchlists"
    };
    let result = await dynamoDb
        .get(params)
        .promise();
    let task = result.Item;

    // email parameters
    let emailParams = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Text: {
                    Data: "Task description: " + task.task_description
                }
            },
            Subject: {
                Data: "[Scratchlists] Reminder for task \"" + task.task_label + "\""
            }
        },
        Source: "amel.dussier@gmail.com"
    };

    // send email
    await ses
        .sendEmail(emailParams)
        .promise()
        .then(res => res)
        .catch(err => err);
};
