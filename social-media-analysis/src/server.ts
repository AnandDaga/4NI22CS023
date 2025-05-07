import userApp from './app';

const PORT = 4000;
userApp.listen(PORT, () => {
  console.log(`User Service is running at http://localhost:${PORT}`);
});
