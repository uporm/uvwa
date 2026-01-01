import { ConnectionType } from '@/types/datasource.types'; // 模拟数据库链接数据

// 模拟数据库链接数据
let mockConnections: ConnectionType[] = [
  {
    id: '1',
    name: '主数据库',
    key: 'main_db',
    url: 'localhost:3306',
    username: 'root',
    password: '123456',
    type: 'mysql',
    createTime: '2024-01-01',
  },
  {
    id: '2',
    name: '缓存数据库',
    key: 'cache_db',
    url: 'localhost:6379',
    username: 'admin',
    password: 'redis123',
    type: 'redis',
    createTime: '2024-01-02',
  },
  {
    id: '3',
    name: 'PostgreSQL数据库',
    key: 'postgres_db',
    url: 'localhost:5432',
    username: 'postgres',
    password: 'postgres123',
    type: 'postgresql',
    createTime: '2024-01-03',
  },
];

export default {
  // 获取数据库链接列表
  'GET /api/datasource/connections': (req: any, res: any) => {
    setTimeout(() => {
      res.json({
        code: 200,
        data: mockConnections,
        message: 'success',
      });
    }, 300); // 模拟网络延迟
  },

  // 新增数据库链接
  'POST /api/datasource/connections': (req: any, res: any) => {
    const newConnection: ConnectionType = {
      ...req.body,
      id: Date.now().toString(),
      createTime: new Date().toISOString(),
    };

    mockConnections.push(newConnection);

    setTimeout(() => {
      res.json({
        code: 200,
        data: newConnection,
        message: '添加成功',
      });
    }, 200);
  },

  // 更新数据库链接
  'PUT /api/datasource/connections/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = mockConnections.findIndex((conn) => conn.id === id);

    if (index !== -1) {
      mockConnections[index] = {
        ...mockConnections[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      setTimeout(() => {
        res.json({
          code: 200,
          data: mockConnections[index],
          message: '更新成功',
        });
      }, 200);
    } else {
      res.status(404).json({
        code: 404,
        message: '数据库链接不存在',
      });
    }
  },

  // 删除数据库链接
  'DELETE /api/datasource/connections/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = mockConnections.findIndex((conn) => conn.id === id);

    if (index !== -1) {
      mockConnections.splice(index, 1);

      setTimeout(() => {
        res.json({
          code: 200,
          message: '删除成功',
        });
      }, 200);
    } else {
      res.status(404).json({
        code: 404,
        message: '数据库链接不存在',
      });
    }
  },
};
