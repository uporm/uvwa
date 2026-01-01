export default {
  // 获取工作流列表
  'GET /api/flows': (req: any, res: any) => {
    res.json({
      code: 200,
      msg: '',
      data: [
        {
          id: 'flow001',
          name: '用户注册流程',
          description: '处理用户注册的完整流程',
          tags: ['用户', '注册'],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:45:00Z',
          status: 'published',
          nodeCount: 5,
        },
        {
          id: 'flow002',
          name: '订单处理流程',
          description: '电商订单的处理和状态更新',
          createdAt: '2024-01-18T09:15:00Z',
          updatedAt: '2024-01-22T16:20:00Z',
          status: 'draft',
          nodeCount: 8,
        },
        {
          id: 'flow003',
          name: '数据同步流程',
          description: '定期同步外部数据源',
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-01-25T11:30:00Z',
          status: 'published',
          nodeCount: 3,
        },
        {
          id: 'flow004',
          name: '邮件通知流程',
          description: '自动发送各类邮件通知',
          createdAt: '2024-01-12T14:20:00Z',
          updatedAt: '2024-01-12T14:20:00Z',
          status: 'archived',
          nodeCount: 4,
        },
      ],
    });
  },

  // 获取工作流目录树
  'GET /api/flows/folders': (req: any, res: any) => {
    res.json({
      code: 200,
      msg: '',
      data: [
        {
          id: 'folder-1',
          name: '默认目录',
          children: [
            { id: 'folder-1-0', name: '风控系统' },
            { id: 'folder-1-1', name: '发票' },
          ],
        },
        {
          id: 'folder-2',
          name: '测试环境',
          children: [
            { id: 'folder-2-0', name: '风控系统' },
            { id: 'folder-2-1', name: '易账阁' },
          ],
        },
      ],
    });
  },

  // 重命名工作流目录（mock）
  'PUT /api/flows/folders': (req: any, res: any) => {
    const { id, name } = req.body || {};
    if (!id || !name) {
      res.status(400).json({ code: 400, msg: '参数错误', data: null });
      return;
    }
    res.json({ code: 200, msg: '重命名成功', data: { id, name } });
  },

  // 新建工作流目录（mock）
  'POST /api/flows/folders': (req: any, res: any) => {
    const { parentId, name } = req.body || {};
    if (!name) {
      res.status(400).json({ code: 400, msg: '名称不能为空', data: null });
      return;
    }
    const newId = `folder-${Date.now()}`;
    // 这里不维护内存树，仅返回创建成功的节点信息，前端自行更新树结构
    res.json({
      code: 200,
      msg: '创建成功',
      data: { id: newId, name, parentId },
    });
  },

  // 删除工作流目录（mock）
  'DELETE /api/flows/folders': (req: any, res: any) => {
    const id = (req.query && req.query.id) || (req.body && req.body.id);
    if (!id) {
      res.status(400).json({ code: 400, msg: '缺少目录ID', data: null });
      return;
    }
    // 简单返回删除成功，前端自行从树中移除
    res.json({ code: 200, msg: '删除成功', data: null });
  },

  // 移动工作流目录（mock）
  'PUT /api/flows/folders/move': (req: any, res: any) => {
    const { id, parentId, index } = req.body || {};
    if (!id) {
      res.status(400).json({ code: 400, msg: '缺少目录ID', data: null });
      return;
    }
    // 这里不维护内存树，仅返回移动成功的信息，前端自行更新树结构
    res.json({ code: 200, msg: '移动成功', data: { id, parentId, index } });
  },

  // 获取工作流详情
  'GET /api/flows/detail': (req: any, res: any) => {
    const { id } = req.query;

    const flows: any = {
      flow001: {
        id: 'flow001',
        name: '用户注册流程',
        description: '处理用户注册的完整流程',
        tags: ['用户管理', '注册'],
        updatedTime: '2024-01-15 10:30:00',
        nodes: [
          {
            id: 'start001',
            type: 'start',
            position: { x: 100, y: 100 },
            width: 220,
            data: {
              title: '开始',
              input: [
                {
                  name: 'username',
                  type: 'STRING',
                  id: 'input001',
                  rules: [{ type: 'required', message: '用户名必填' }],
                },
                {
                  name: 'email',
                  type: 'STRING',
                  id: 'input002',
                  rules: [{ type: 'required', message: '邮箱必填' }],
                },
              ],
            },
          },
          {
            id: 'code001',
            type: 'code',
            position: { x: 100, y: 300 },
            width: 220,
            data: {
              title: '验证用户信息',
              language: 'javascript',
              content:
                "// 验证用户信息\nif (!username || !email) {\n  throw new Error('用户信息不完整');\n}\nreturn { valid: true };",
              input: [
                { name: 'username', type: 'STRING', id: 'code_input001' },
                { name: 'email', type: 'STRING', id: 'code_input002' },
              ],
              output: [{ name: 'valid', type: 'BOOLEAN', id: 'code_output001' }],
            },
          },
          {
            id: 'end001',
            type: 'end',
            position: { x: 100, y: 500 },
            width: 220,
            data: {
              title: '结束',
              output: {
                vars: [{ name: 'userId', type: 'STRING', id: 'end_output001' }],
                rCode: 200,
                rMessage: '注册成功',
              },
            },
          },
        ],
        edges: [
          { id: 'edge001', source: 'start001', target: 'code001' },
          { id: 'edge002', source: 'code001', target: 'end001' },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
      },
      flow002: {
        id: 'flow002',
        name: '订单处理流程',
        description: '处理订单的业务流程',
        tags: ['订单处理', '业务流程'],
        updatedTime: '2024-01-16 14:20:00',
        nodes: [
          {
            id: 'start002',
            type: 'start',
            position: { x: 150, y: 50 },
            width: 220,
            data: {
              title: '订单开始',
              input: [
                { name: 'orderId', type: 'STRING', id: 'order_input001' },
                { name: 'amount', type: 'DECIMAL', id: 'order_input002' },
              ],
            },
          },
          {
            id: 'case001',
            type: 'case',
            position: { x: 150, y: 250 },
            width: 220,
            data: {
              title: '订单金额判断',
              cases: [
                {
                  id: 'case001_1',
                  opr: 'and',
                  conditions: [{ varId: 'order_input002', opr: '>', value: '100' }],
                },
                {
                  id: 'case001_2',
                  opr: 'and',
                  conditions: [{ varId: 'order_input002', opr: '<=', value: '100' }],
                },
              ],
            },
          },
          {
            id: 'end002',
            type: 'end',
            position: { x: 150, y: 450 },
            width: 220,
            data: {
              title: '订单完成',
              output: {
                vars: [{ name: 'status', type: 'STRING', id: 'order_output001' }],
                rCode: 200,
                rMessage: '订单处理完成',
              },
            },
          },
        ],
        edges: [
          { id: 'edge003', source: 'start002', target: 'case001' },
          { id: 'edge004', source: 'case001', target: 'end002' },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
      },
    };

    res.json({
      code: 200,
      msg: '',
      data: flows[id] || flows['flow001'],
    });
  },

  // 创建新工作流
  'POST /api/flows': (req: any, res: any) => {
    const { name, description } = req.body;
    const newFlow = {
      id: `flow_${Date.now()}`,
      name: name || '新工作流',
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      nodeCount: 0,
    };

    res.json({
      code: 200,
      msg: '创建成功',
      data: newFlow,
    });
  },

  // 更新工作流标签
  'PUT /api/flows/tags': (req: any, res: any) => {
    const { id, tags } = req.body;

    console.log('Mock API called - Update app tags:', { id, tags });

    // 模拟根据ID返回不同的flow数据
    const flowData: Record<string, any> = {
      flow001: {
        id: 'flow001',
        name: '用户注册流程',
        description: '处理用户注册的完整流程',
        tags: tags || [],
        updatedTime: new Date().toISOString(),
      },
      flow002: {
        id: 'flow002',
        name: '订单处理流程',
        description: '电商订单的处理和状态更新',
        tags: tags || [],
        updatedTime: new Date().toISOString(),
      },
      flow003: {
        id: 'flow003',
        name: '数据同步流程',
        description: '定期同步外部数据源',
        tags: tags || [],
        updatedTime: new Date().toISOString(),
      },
      flow004: {
        id: 'flow004',
        name: '邮件通知流程',
        description: '自动发送各类邮件通知',
        tags: tags || [],
        updatedTime: new Date().toISOString(),
      },
    };

    // 如果找到对应的flow，返回更新后的数据
    if (flowData[id]) {
      res.json({
        code: 200,
        msg: '标签更新成功',
        data: flowData[id],
      });
      return;
    }

    // 如果没找到对应的flow，返回通用数据
    res.json({
      code: 200,
      msg: '标签更新成功',
      data: {
        id,
        name: '工作流',
        description: '工作流描述',
        tags: tags || [],
        updatedTime: new Date().toISOString(),
      },
    });
  },

  // 更新工作流
  'PUT /api/flows': (req: any, res: any) => {
    const { id, name, description, nodes, edges } = req.body;

    const updatedFlow = {
      id: id,
      name: name || '更新的工作流',
      description: description || '',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: new Date().toISOString(),
      status: 'draft',
      nodeCount: nodes ? nodes.length : 0,
    };

    res.json({
      code: 200,
      msg: '更新成功',
      data: updatedFlow,
    });
  },

  // 删除工作流
  'DELETE /api/flows': (req: any, res: any) => {
    const { id } = req.query;

    res.json({
      code: 200,
      msg: `工作流 ${id} 删除成功`,
      data: null,
    });
  },

  // 复制工作流
  'POST /api/flows/duplicate': (req: any, res: any) => {
    const { id, name } = req.body;

    const duplicatedFlow = {
      id: `flow_${Date.now()}_copy`,
      name: name || `${id} 的副本`,
      description: '复制的工作流',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      nodeCount: 3,
    };

    res.json({
      code: 200,
      msg: '复制成功',
      data: duplicatedFlow,
    });
  },

  // 获取标签列表
  'GET /api/flows/tags': {
    code: 200,
    msg: '',
    data: [
      '开发用于纳税模板',
      '工具',
      '柳叶云',
      '三好学生',
      '用户管理',
      '订单处理',
      '数据同步',
      '邮件通知',
      '支付流程',
      '库存管理',
    ],
  },
};
