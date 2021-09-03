import * as dynamoose from "dynamoose";

export default function () {
  if (process.env.ENV === "dev") {
    dynamoose.aws.ddb.local();
    return dynamoose;
  } else {
    //TODO: configure connection with AWS

    // dynamoose.aws.sdk.config.update({
    //   accessKeyId: "AKID",
    //   secretAccessKey: "SECRET",
    //   region: "us-east-1",
    // });
    return dynamoose;
  }
}
