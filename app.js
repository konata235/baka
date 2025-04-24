import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// 初始化
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.get('/api/books', (req, res) => {
  res.json([
    { id: 1, title: '凛の宝石魔术入门', author: '远坂凛' },
    { id: 2, title: '无限剑制解析', author: 'Archer' }
  ]);
});

// 兜底路由（SPA必须）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`サーバー起動！ http://localhost:${PORT}`));
