import CaseNode from '@/pages/app/components/app-flow/components/nodes/CaseNode';
import EditCaseAttribute from '@/pages/app/components/app-flow/components/nodes/CaseNode/EditCaseAttribute';
import CodeNode from '@/pages/app/components/app-flow/components/nodes/CodeNode';
import EditCodeAttribute from '@/pages/app/components/app-flow/components/nodes/CodeNode/EditCodeAttribute';
import CommentNode from '@/pages/app/components/app-flow/components/nodes/CommentNode';
import EndNode from '@/pages/app/components/app-flow/components/nodes/EndNode';
import EditEndAttribute from '@/pages/app/components/app-flow/components/nodes/EndNode/EditEndAttribute';
import GroupStartNode from '@/pages/app/components/app-flow/components/nodes/GroupStartNode';
import LoopBreakNode from '@/pages/app/components/app-flow/components/nodes/LoopBreakNode';
import LoopContinueNode from '@/pages/app/components/app-flow/components/nodes/LoopContinueNode';
import LoopNode from '@/pages/app/components/app-flow/components/nodes/LoopNode';
import EditLoopAttribute from '@/pages/app/components/app-flow/components/nodes/LoopNode/EditLoopAttribute';
import SqlNode from '@/pages/app/components/app-flow/components/nodes/SqlNode';
import EditSqlAttribute from '@/pages/app/components/app-flow/components/nodes/SqlNode/EditSqlAttribute';
import SqlTransactionNode from '@/pages/app/components/app-flow/components/nodes/SqlTransactionNode';
import EditSqlTransactionAttribute from '@/pages/app/components/app-flow/components/nodes/SqlTransactionNode/EditSqlTransactionAttribute';
import StartNode from '@/pages/app/components/app-flow/components/nodes/StartNode';
import EditStartAttribute from '@/pages/app/components/app-flow/components/nodes/StartNode/EditStartAttribute';
import {
  CaseNodeType,
  CodeNodeType,
  EndNodeType,
  LoopNodeType,
  NodeDefineType,
  NodeType,
  NoteNodeType,
  SqlNodeType,
  SqlTransactionNodeType,
  StartNodeType,
  SubFlowNodeType,
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

export const NodeDefineTypes: ObjectType<NodeDefineType> = {
  [NODE_TYPE.START]: {
    category: '输入&输出',
    icon: 'icon-start',
    renderComponent: StartNode,
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
    } as NodeType<StartNodeType>,
  },
  [NODE_TYPE.END]: {
    category: '输入&输出',
    icon: 'icon-start',
    renderComponent: EndNode,
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
    } as NodeType<EndNodeType>,
  },
  [NODE_TYPE.CASE]: {
    category: '业务逻辑',
    icon: 'icon-case',
    renderComponent: CaseNode,
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
    } as NodeType<CaseNodeType>,
  },
  [NODE_TYPE.LOOP]: {
    category: '业务逻辑',
    icon: 'icon-loop',
    renderComponent: LoopNode,
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
    } as NodeType<LoopNodeType>,
  },
  [NODE_TYPE.GROUP_START]: {
    category: '业务逻辑',
    icon: 'icon-start',
    renderComponent: GroupStartNode,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.GROUP_START,
      position: { x: 10, y: 50 },
      width: 30,
      height: 30,
      draggable: false,
      data: { group: false },
    } as NodeType<any>,
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
    } as NodeType<any>,
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
    } as NodeType<any>,
  },
  [NODE_TYPE.CODE]: {
    category: '业务逻辑',
    icon: 'icon-code',
    renderComponent: CodeNode,
    attributeEditor: EditCodeAttribute,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.CODE,
      position: { x: 0, y: 0 },
      data: {
        title: '代码执行',
      },
    } as NodeType<CodeNodeType>,
  },
  [NODE_TYPE.SQL]: {
    category: '数据库',
    icon: 'icon-sql',
    renderComponent: SqlNode,
    attributeEditor: EditSqlAttribute,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.SQL,
      position: { x: 0, y: 0 },
      data: {
        title: 'SQL脚本',
      },
    } as NodeType<SqlNodeType>,
  },
  [NODE_TYPE.SQL_TRANSACTION]: {
    category: '数据库',
    icon: 'icon-sql-transaction',
    renderComponent: SqlTransactionNode,
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
    } as NodeType<SqlTransactionNodeType>,
  },
  [NODE_TYPE.SUBFLOW]: {
    category: '业务逻辑',
    icon: 'icon-subflow',
    renderComponent: CodeNode,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.SUBFLOW,
      position: { x: 0, y: 0 },
      data: {
        title: '子流程',
      },
    } as NodeType<SubFlowNodeType>,
  },
  [NODE_TYPE.ASSIGN]: {
    category: '业务逻辑',
    icon: 'icon-assign',
    renderComponent: CodeNode,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.ASSIGN,
      position: { x: 0, y: 0 },
      data: {
        title: '变量赋值',
        group: false,
      },
    } as NodeType<any>,
  },
  [NODE_TYPE.NOTE]: {
    category: '其他',
    icon: 'icon-file',
    renderComponent: CommentNode,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.NOTE,
      position: { x: 0, y: 0 },
      width: 200,
      height: 80,
      data: {
        title: '注释',
        content: '请输入注释内容...',
      },
    } as NodeType<NoteNodeType>,
  },
};
