import { getAvailableVariables } from '@/pages/app/variables';
import { flowContentState } from '@/stores/app-flow.store';
import { Case, CaseNode, FlowEdge, FlowNode } from '@/types/app.types';
import { newId } from '@/utils/id';
import { PlusOutlined } from '@ant-design/icons';
import { Button, List } from 'antd';
import { useSnapshot } from 'valtio';
import EditCaseItem from './EditCaseItem';
import './styles.less';

interface EditCaseAttributeProps {
  node: FlowNode<CaseNode>;
  onChange: (node: FlowNode<CaseNode>) => void;
}

const EditCaseAttribute: React.FC<EditCaseAttributeProps> = ({ node, onChange }) => {
  // 获取流程状态和可用变量
  const flowContentSnap = useSnapshot(flowContentState);
  const availableVariables = getAvailableVariables(
    node.id,
    flowContentSnap.nodes as FlowNode<any>[],
    flowContentSnap.edges as FlowEdge<any>[],
  );

  const cases = node.data.cases || [];

  // 统一的节点数据更新函数
  const updateNodeData = (updatedCases: Case[]) => {
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        cases: updatedCases,
      },
    };
    onChange(updatedNode);
  };

  const handleAddCase = () => {
    const newCase: Case = {
      id: newId(),
      opr: 'and',
      conditions: [],
    };
    updateNodeData([...cases, newCase]);
  };

  const handleDeleteCase = (index: number) => {
    const updatedCases = cases.filter((_, i) => i !== index);
    updateNodeData(updatedCases);
  };

  const handleCaseChange = (index: number, updatedCase: Case) => {
    const updatedCases = [...cases];
    updatedCases[index] = updatedCase;
    updateNodeData(updatedCases);
  };

  const getCaseTitle = (index: number) => {
    return cases.length === 1 ? 'IF' : `CASE ${index + 1}`;
  };

  const canDeleteCase = cases.length > 1;

  return (
    <div>
      <List
        size="small"
        bordered={false}
        dataSource={cases}
        footer={
          <Button type="dashed" icon={<PlusOutlined />} className="addCaseButton" size="small" onClick={handleAddCase}>
            添加条件分支
          </Button>
        }
        renderItem={(caseItem: Case, index: number) => (
          <List.Item key={caseItem.id} className="caseListItem">
            <EditCaseItem
              value={caseItem}
              onChange={(updatedCase) => handleCaseChange(index, updatedCase)}
              title={getCaseTitle(index)}
              variablesWithNode={availableVariables}
              onDelete={canDeleteCase ? () => handleDeleteCase(index) : undefined}
            />
          </List.Item>
        )}
      />
      <div className="elseContainer">
        <strong>Else</strong>
        <div className="elseDescription">用于定义当 if 条件不满足时应执行的逻辑。</div>
      </div>
    </div>
  );
};

export default EditCaseAttribute;
