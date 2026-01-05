
let workspaces = [
  {
    id: '1',
    name: '默认工作空间',
    description: '系统默认创建的工作空间',
    selected: true,
  },
  {
    id: '2',
    name: '开发环境',
    description: '用于开发测试的工作空间',
    selected: false,
  },
];

export default {
  'GET /api/uvwa/workspaces': (req: any, res: any) => {
    res.json({
      code: 200,
      data: workspaces,
      message: 'success',
    });
  },

  'POST /api/uvwa/workspaces': (req: any, res: any) => {
    const { name, description } = req.body;
    const newWorkspace = {
      id: String(workspaces.length + 1),
      name,
      description,
      selected: false,
    };
    workspaces.push(newWorkspace);
    res.json({
      code: 200,
      data: newWorkspace,
      message: 'success',
    });
  },

  'PUT /api/uvwa/workspaces/:workspaceId/current': (req: any, res: any) => {
    const { workspaceId } = req.params;
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      workspaces.forEach((w) => (w.selected = false));
      workspace.selected = true;
      res.json({
        code: 200,
        data: null,
        message: 'success',
      });
    } else {
      res.json({
        code: 404,
        data: null,
        message: 'Workspace not found',
      });
    }
  },
};
