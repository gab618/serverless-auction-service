import * as fileType from "file-type";
import { v4 as uuid } from "uuid";
import * as AWS from "aws-sdk";

const s3 = new AWS.S3();

const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    if (!body || !body.image || !body.mime) {
      return {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
        statusCode: 400,
        body: JSON.stringify({ message: "incorrect body on request" }),
      };
    }

    if (!allowedMimes.includes(body.mime)) {
      return {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
        statusCode: 400,
        body: JSON.stringify({ message: "mime is not allowed" }),
      };
    }

    let imageData = body.image;
    if (body.image.substr(0, 7) === "base64,") {
      imageData = body.image.substr(7, body.image.length);
    }

    const buffer = Buffer.from(imageData, "base64");
    const fileInfo = await fileType.fromBuffer(buffer);
    const detectedExt = fileInfo.ext;
    const detectedMime = fileInfo.mime;

    if (detectedMime !== body.mime) {
      return Responses._400({ message: "mime types dont match" });
    }

    const name = uuid();
    const key = `${name}.${detectedExt}`;

    console.log(`writing image to bucket called ${key}`);

    await s3
      .putObject({
        Body: buffer,
        Key: key,
        ContentType: body.mime,
        Bucket: process.env.imageUploadBucket,
        ACL: "public-read",
      })
      .promise();

    const url = `https://${process.env.imageUploadBucket}.s3-${process.env.region}.amazonaws.com/${key}`;
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 201,
      body: JSON.stringify({ imgURL: url }),
    };
  } catch (error) {
    console.log("error", error);

    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 500,
      body: JSON.stringify({ message: "failed to upload image" }),
    };
  }
};
