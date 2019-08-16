import uuid from "uuid";
import * as dynamoDbLib from './libs/dynamodb-lib'
import { failure, success } from './libs/response-lib'


export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const projectId = uuid.v1();

  const params = {
    TransactItems: [{
      Put: {
        TableName : 'dev-recordme',
        // TODO add here expplanation
        // 'Item' contains the attributes of the workspace item to be created
        // - 'PK': user identities are federated through the
        //             Cognito Identity Pool, we will use the identity id
        //             as the user id of the authenticated user
        // - 'noteId': a unique uuid
        // - 'content': parsed from request body
        // - 'attachment': parsed from request body
        // - 'createdAt': current Unix timestamp
        Item: {
          PK: data.workspaceId,
          SK: "p" + projectId,
          Data: data.name,
          pId: "p" + projectId,
          cId: data.clientId,
          createdAt: Date.now()
        },
      }
    },{
      Put: {
        TableName : 'dev-recordme',
        // TODO add here expplanation
        // 'Item' contains the attributes of the workspace item to be created
        // - 'PK': user identities are federated through the
        //             Cognito Identity Pool, we will use the identity id
        //             as the user id of the authenticated user
        // - 'noteId': a unique uuid
        // - 'content': parsed from request body
        // - 'attachment': parsed from request body
        // - 'createdAt': current Unix timestamp
        Item: {
          PK: data.clientId,
          SK: "p" + projectId,
          Data: data.name,
          pId: "p" + projectId,
          cId: data.clientId,
          wId: data.workspaceId,
          createdAt: Date.now()
        },
      }
    }]
  };

  try {
    await dynamoDbLib.call("transactWrite", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }

  // dynamoDb.transactWrite(params, (error, data) => {
  //   // Set response headers to enable CORS (Cross-Origin Resource Sharing)
  //   const headers = {
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Credentials": true
  //   };
  //
  //   // Return status code 500 on error
  //   if (error) {
  //     const response = {
  //       statusCode: 500,
  //       headers: headers,
  //       body: JSON.stringify({ status: false })
  //     };
  //     callback(null, response);
  //     return;
  //   }
  //
  //   // Return status code 200 and the newly created item
  //   const response = {
  //     statusCode: 200,
  //     headers: headers,
  //     body: JSON.stringify(params.Item)
  //   };
  //   callback(null, response);
  // });
}
