const AWS = require("aws-sdk");

export default function(req, res) {
    const params = req['params'];
    const id = req.query.id;

    res.send(params);

    let invoice;
    const docClient = new AWS.DynamoDB.DocumentClient();
    const docParams = {
        TableName : "invoices",
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames:{
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": id
        }
    };

    docClient.query(docParams, (err, data) => {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            const items = data['Items'];
            if (items.length < 1) {
                const e = {"error": true, "msg": "not found"};
                console.log("invoice not found: " + id);
                return res.status(400).end(JSON.stringify(e))
            }
            const invoice = items[0];
            console.log("invoice found");
            return res.status(200).end(JSON.stringify(invoice))
        }
    });
}