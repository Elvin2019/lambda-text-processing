import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
const dictionary: { [key: string]: string[] } = require("./dictionary.json");

const getListOfWords = (input: string) => {
  const words = input.split(" ");
  return words;
};

const countWordsByType: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const input = event.body.input;
  const words = getListOfWords(input);
  const result: { [key: string]: number } = {};
  Object.entries(dictionary).forEach(([key, value]) => {
    result[key] = 0;
    words.forEach((word) => {
      if (value.includes(word)) {
        result[key]++;
      }
    });
  });
  const res = Object.entries(result)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  return formatJSONResponse({
    message: res,
    event,
  });
};

export const main = middyfy(countWordsByType);
