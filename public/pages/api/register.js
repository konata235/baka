
import mysql from 'mysql2';

const dbConfig = {
  host: process.env.DB_HOST,  // 从环境变量中获取数据库主机地址
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username } = req.query;  // 从查询参数中获取 username

    if (!username) {
      return res.status(400).json({ status: 'error', message: 'Username is required' });
    }

    try {
      // 查询数据库获取用户信息
      const [rows] = await promisePool.query(
        'SELECT name, id, password FROM login WHERE username = ?',
        [username]
      );

      if (rows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      // 返回查询到的用户信息
      const user = rows[0];
      res.status(200).json({
        status: 'success',
        data: {
          username: user.username,
          email: user.email,
          password_hash: user.password_hash,  // 返回的是加密后的密码
        }
      });
    } catch (error) {
      // 错误处理
      res.status(500).json({ status: 'error', message: error.message });
    }
  } else {
    // 如果不是 GET 请求，返回 405 Method Not Allowed
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
}
