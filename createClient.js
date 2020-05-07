import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
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

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
