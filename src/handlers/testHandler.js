import commonMiddleware from "../lib/commonMiddleware";
import db from "../lib/dbConnect";

export async function test() {
  const dynamoose = db();

  const CatModel = dynamoose.model("Cat", { id: Number, name: String });
  CatModel.create({ id: 1, random: "string" });

  const cat = await CatModel.get(1);

  return {
    statusCode: 200,
    body: JSON.stringify({ cat }),
  };
}

export const handler = commonMiddleware(test);
