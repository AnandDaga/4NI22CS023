import express from 'express';
const app = express();
import analyticsRoute from "./routes/usersRoute"
import postsRoutes from "./routes/postRoute"

app.use('/user', analyticsRoute);
app.use('/posts', postsRoutes);


export default app;
