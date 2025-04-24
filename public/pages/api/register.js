import mysql from 'mysql2';

// 从环境变量中获取数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // 最大连接数
  queueLimit: 0         // 没有限制等待队列
};

// 创建 MySQL 连接池
const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise(); // 使用 Promise 版本的连接池

// 处理用户查询的 API 路由
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { name } = req.query;  // 从查询参数获取 name

    // 验证是否提供了 name 参数
    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Name is required' });
    }

    try {
      // 使用连接池查询数据库
      const [rows] = await promisePool.query(
        'SELECT id, name, password FROM login WHERE name = ?',
        [name]
      );

      // 如果没有找到用户，返回 404 错误
      if (rows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      // 返回查询到的用户信息
      const user = rows[0];
      res.status(200).json({
        status: 'success',
        data: {
          id: user.id,
          name: user.name,
          password: user.password, // 返回的是加密后的密码
        }
      });
    } catch (error) {
      // 捕获数据库查询错误
      res.status(500).json({ status: 'error', message: error.message });
    }
  } else {
    // 如果不是 GET 请求，返回 Method Not Allowed 错误
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
}
