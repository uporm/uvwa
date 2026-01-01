let currentWorkspace: WorkspaceType = {
  id: '1',
  name: '默认工作空间',
};

export default {
  'GET /api/upflow/workspaces': {
    code: 200,
    data: [
      {
        id: '1',
        name: '默认工作空间',
      },
      {
        id: '2',
        name: '开发环境',
      },
    ],
    message: 'success',
  },

  'GET /api/upflow/workspaces/current': (req: any, res: any) => {
    res.json({
      code: 200,
      data: currentWorkspace,
      message: 'success',
    });
  },

  'PUT /api/upflow/workspaces/:workspaceId': (req: any, res: any) => {
    const { workspaceId } = req.params;
    currentWorkspace = { id: workspaceId, name: `工作空间 ${workspaceId}` };
    res.json({
      code: 200,
      data: null,
      message: 'success',
    });
  },
};
