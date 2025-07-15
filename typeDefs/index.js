import { mergeTypeDefs } from "@graphql-tools/merge";

import userTypeDef from "./user.typeDef.js";
import transactionType from "./transaction.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([userTypeDef,transactionType]);

export default mergedTypeDefs;