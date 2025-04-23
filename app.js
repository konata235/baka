import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('🎉 魔法服务器启动成功！');
});

app.listen(4003, () => {
  console.log('运行在 http://localhost:4003');
});