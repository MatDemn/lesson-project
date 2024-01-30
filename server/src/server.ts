import env from './utils/validateEnv';
import mongoose from "mongoose";
import app from "./app";  

mongoose.connect(env.MONGO_DB_CONNECTION_STRING).then(() => {
  app.listen(env.PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${env.PORT}`);
  });
})
.catch(console.error);
