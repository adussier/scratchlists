const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    if (!event.created) {
        event.created = new Date().toISOString();
    }

    event.updated = new Date().toISOString();

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
