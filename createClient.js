import uuid from "uuid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const clientId = uuid.v1();

  const params = {
    TableName: "dev-recordme",
    // TODO add here expplanation
    // 'Item' contains the attributes of the Client item to be created
    // - 'PK': workspaceId
    // - 'SK': c+[new generated id]
    // - 'data': name of the client
    // - 'cId': c+[new generated id]
    // - 'createdAt': current Unix timestamp
    Item: {
      PK: data.workspaceId,
      SK: "c" + clientId,
      Data: data.name,
      cId: "c" + clientId,
      createdAt: Date.now()
    }
  };

  dynamoDb.put(params, (error, data) => {
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    // Return status code 500 on error
    if (error) {
      console.log(error);
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ status: false })
      };
      callback(null, response);
      return;
    }

    // Return status code 200 and the newly created item
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
}
