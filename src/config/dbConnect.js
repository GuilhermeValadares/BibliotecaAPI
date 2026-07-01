// @ts-nocheck
import mongoose from "mongoose"

mongoose.connect(process.env.STRING_CONEXCAO_DB);

let db = mongoose.connection;

export default db
