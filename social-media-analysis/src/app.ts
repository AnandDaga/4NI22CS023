import express from 'express';
const app = express();
import analyticsRoute from "./routes/usersRoute"

app.use('/user', analyticsRoute);

export default app;
