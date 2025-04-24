// pages/api/register.js

import mysql from 'mysql2';

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const promisePool = pool.promise();

// 处理 GET 请求，获取注册信息
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { name } = req.query;  // 获取查询参数

    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Name is required' });
    }

    try {
      // 执行查询：确保 name 作为字符串进行查询
      const [rows] = await promisePool.query(
        'SELECT id, name, password FROM login WHERE name = ?', // name 是字符串类型
        [name]
      );

      if (rows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      const user = rows[0]; // 获取查询结果中的第一个用户
      res.status(200).json({
        status: 'success',
        data: {
          id: user.id,        // id 是整数类型
          name: user.name,    // name 是字符串类型
          password: user.password, // 传递密码信息
        },
      });
    } catch (error) {
      console.error('Database error: ', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
}

