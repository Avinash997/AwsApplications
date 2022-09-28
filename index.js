const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const dynamodb = new AWS.DynamoDB();

exports.handler = async (event, context) => {
    // console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        let recordsProcessed = event.Records.map( async (record) => {
            console.log('Stream record:', JSON.stringify(event));
            
            if(record.eventName == 'REMOVE') {
                let params = {
                    TableName: 'sls-notes-archive',
                    Item: record.dynamodb.OldImage
                };
                
                return await dynamodb.putItem(params).promise();
            }
        });
        
        await Promise.all(recordsProcessed);
        console.log(`Successfully processed ${event.Records.length} records.`);
        return `Successfully processed ${event.Records.length} records.`;
    } catch (err) {
        console.log("Error", err);
        throw err;
    }
};
