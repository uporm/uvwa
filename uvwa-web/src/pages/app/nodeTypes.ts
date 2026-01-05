import FlowCaseNode from '@/pages/app/components/app-flow/components/nodes/FlowCaseNode';
import EditCaseAttribute from '@/pages/app/components/app-flow/components/nodes/FlowCaseNode/EditCaseAttribute';
import FlowCodeNode from '@/pages/app/components/app-flow/components/nodes/FlowCodeNode';
import EditCodeAttribute from '@/pages/app/components/app-flow/components/nodes/FlowCodeNode/EditCodeAttribute';
import FlowEndNode from '@/pages/app/components/app-flow/components/nodes/FlowEndNode';
import EditEndAttribute from '@/pages/app/components/app-flow/components/nodes/FlowEndNode/EditEndAttribute';
import FlowGroupStartNode from '@/pages/app/components/app-flow/components/nodes/FlowGroupStartNode';
import LoopBreakNode from '@/pages/app/components/app-flow/components/nodes/FlowLoopBreakNode';
import LoopContinueNode from '@/pages/app/components/app-flow/components/nodes/FlowLoopContinueNode';
import FlowLoopNode from '@/pages/app/components/app-flow/components/nodes/FlowLoopNode';
import EditLoopAttribute from '@/pages/app/components/app-flow/components/nodes/FlowLoopNode/EditLoopAttribute';
import FlowSqlNode from '@/pages/app/components/app-flow/components/nodes/FlowSqlNode';
import EditSqlAttribute from '@/pages/app/components/app-flow/components/nodes/FlowSqlNode/EditSqlAttribute';
import FlowSqlTransactionNode from '@/pages/app/components/app-flow/components/nodes/FlowSqlTransactionNode';
import EditSqlTransactionAttribute from '@/pages/app/components/app-flow/components/nodes/FlowSqlTransactionNode/EditSqlTransactionAttribute';
import FlowStartNode from '@/pages/app/components/app-flow/components/nodes/FlowStartNode';
import EditStartAttribute from '@/pages/app/components/app-flow/components/nodes/FlowStartNode/EditStartAttribute';
import {
  CaseNode,
  CodeNode,
  EndNode,
  LoopNode,
  FlowNodeDefine,
  FlowNode,
  NoteNode,
  SqlNode,
  SqlTransactionNode,
  StartNode,
  SubFlowNode,
} from '@/types/app.types'; // 节点类型 key 常量
import { ObjectType } from '@/types/common.types';
import { newId } from '@/utils/id';

// 节点类型 key 常量
export const NODE_TYPE = {
  START: 'start',
  END: 'end',
  GROUP_START: 'group-start',
  CASE: 'case',
  LOOP: 'loop',
  LOOP_CONTINUE: 'loop-continue',
  LOOP_BREAK: 'loop-break',
  CODE: 'code',
  SQL: 'sql',
  SQL_TRANSACTION: 'sql-transaction',
  SUBFLOW: 'subflow',
  ASSIGN: 'assign',
  NOTE: 'note',
} as const;

export const NodeDefineTypes: ObjectType<FlowNodeDefine> = {
  [NODE_TYPE.START]: {
    category: '输入&输出',
    icon: 'icon-start',
    renderComponent: FlowStartNode,
    attributeEditor: EditStartAttribute,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.START,
      position: { x: 0, y: 0 },
      width: 220,
      data: {
        title: '开始',
        input: [],
        group: false,
      },
    } as FlowNode<StartNode>,
  },
  [NODE_TYPE.END]: {
    category: '输入&输出',
    icon: 'icon-start',
    renderComponent: FlowEndNode,
    attributeEditor: EditEndAttribute,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.END,
      position: { x: 0, y: 0 },
      width: 220,
      data: {
        title: '结束',
        output: {
          type: 'vars',
          vars: [],
          isWrap: false,
          isText: false,
        },
        group: false,
      },
    } as FlowNode<EndNode>,
  },
  [NODE_TYPE.CASE]: {
    category: '业务逻辑',
    icon: 'icon-case',
    renderComponent: FlowCaseNode,
    attributeEditor: EditCaseAttribute,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.CASE,
      position: { x: 0, y: 0 },
      width: 250,
      data: {
        title: '条件分支',
        cases: [{ id: newId(), opr: 'and', conditions: [] }],
        group: false,
      },
    } as FlowNode<CaseNode>,
  },
  [NODE_TYPE.LOOP]: {
    category: '业务逻辑',
    icon: 'icon-loop',
    renderComponent: FlowLoopNode,
    attributeEditor: EditLoopAttribute,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.LOOP,
      position: { x: 0, y: 0 },
      width: 400,
      height: 200,
      data: {
        title: '循环',
        group: true,
        expanded: true,
      },
    } as FlowNode<LoopNode>,
  },
  [NODE_TYPE.GROUP_START]: {
    category: '业务逻辑',
    icon: 'icon-start',
    renderComponent: FlowGroupStartNode,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.GROUP_START,
      position: { x: 10, y: 50 },
      width: 30,
      height: 30,
      draggable: false,
      data: { group: false },
    } as FlowNode<any>,
  },
  [NODE_TYPE.LOOP_CONTINUE]: {
    category: '业务逻辑',
    icon: 'icon-continue',
    renderComponent: LoopContinueNode,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.LOOP_CONTINUE,
      position: { x: 0, y: 0 },
      width: 150,
      data: { title: '继续循环', group: false },
    } as FlowNode<any>,
  },
  [NODE_TYPE.LOOP_BREAK]: {
    category: '业务逻辑',
    icon: 'icon-break',
    renderComponent: LoopBreakNode,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.LOOP_BREAK,
      position: { x: 0, y: 0 },
      width: 150,
      data: { title: '终止循环', group: false },
    } as FlowNode<any>,
  },
  [NODE_TYPE.CODE]: {
    category: '业务逻辑',
    icon: 'icon-code',
    renderComponent: FlowCodeNode,
    attributeEditor: EditCodeAttribute,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.CODE,
      position: { x: 0, y: 0 },
      data: {
        title: '代码执行',
      },
    } as FlowNode<CodeNode>,
  },
  [NODE_TYPE.SQL]: {
    category: '数据库',
    icon: 'icon-sql',
    renderComponent: FlowSqlNode,
    attributeEditor: EditSqlAttribute,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.SQL,
      position: { x: 0, y: 0 },
      data: {
        title: 'SQL脚本',
      },
    } as FlowNode<SqlNode>,
  },
  [NODE_TYPE.SQL_TRANSACTION]: {
    category: '数据库',
    icon: 'icon-sql-transaction',
    renderComponent: FlowSqlTransactionNode,
    attributeEditor: EditSqlTransactionAttribute,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.SQL_TRANSACTION,
      position: { x: 0, y: 0 },
      width: 400,
      height: 200,
      data: {
        title: 'SQL事务',
        group: true,
        expanded: true,
      },
    } as FlowNode<SqlTransactionNode>,
  },
  [NODE_TYPE.SUBFLOW]: {
    category: '业务逻辑',
    icon: 'icon-subflow',
    renderComponent: FlowCodeNode,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.SUBFLOW,
      position: { x: 0, y: 0 },
      data: {
        title: '子流程',
      },
    } as FlowNode<SubFlowNode>,
  },
  [NODE_TYPE.ASSIGN]: {
    category: '业务逻辑',
    icon: 'icon-assign',
    renderComponent: FlowCodeNode,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.ASSIGN,
      position: { x: 0, y: 0 },
      data: {
        title: '变量赋值',
        group: false,
      },
    } as FlowNode<any>,
  },
};
