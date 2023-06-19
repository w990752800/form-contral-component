import { useSetState } from 'ahooks';
import { Input, Modal } from 'antd';
import React, { useEffect } from 'react';

type Props = {
  open: boolean;
  onOk: (val: string) => void;
  onCancel: () => void;
  addSubCfonfirmLoading: boolean;
  editSubData: Record<string, any> | null;
  editSub: string;
};
const AddSub: React.FC<Props> = ({
  open,
  onOk,
  onCancel,
  addSubCfonfirmLoading,
  editSubData,
  editSub,
}) => {
  const [state, setState] = useSetState({
    name: '',
  });

  useEffect(() => {
    if (editSub === 'edit') {
      setState({
        name: editSubData?.name || '',
      });
    } else {
      setState({
        name: '',
      });
    }
  }, [editSub, editSubData]);

  return (
    <Modal
      title={editSub === 'add' ? '请输入占位的小节名称，一行一个：' : '编辑'}
      visible={open}
      onOk={() => onOk(state.name)}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
      confirmLoading={addSubCfonfirmLoading}
    >
      <div>
        <Input.TextArea
          rows={4}
          value={state.name}
          onChange={(e) =>
            setState({
              name: e.target.value,
            })
          }
        ></Input.TextArea>
      </div>
    </Modal>
  );
};

export default AddSub;
