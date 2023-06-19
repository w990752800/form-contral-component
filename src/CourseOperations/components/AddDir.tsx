import { useSetState } from 'ahooks';
import { Input, Modal, Space } from 'antd';
import React, { useEffect } from 'react';

type Props = {
  open: boolean;
  onOk: (val: string) => void;
  onCancel: () => void;
  addDirConfirmLoading: boolean;
  editDir: string;
  editName: string;
};
const AddDir: React.FC<Props> = ({
  open,
  onOk,
  onCancel,
  addDirConfirmLoading,
  editDir,
  editName,
}) => {
  const [state, setState] = useSetState({
    name: '',
  });

  useEffect(() => {
    if (!open) {
      setState({
        name: '',
      });
    } else {
      setState({
        name: editDir === 'add' ? '' : editName,
      });
    }
  }, [open, editName]);

  return (
    <Modal
      title={editDir === 'add' ? '添加新目录' : '编辑'}
      visible={open}
      onOk={() => onOk(state.name)}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
      confirmLoading={addDirConfirmLoading}
    >
      <div>
        <Space direction="vertical" className="w-full">
          <label>名称：</label>
          <Input
            value={state.name}
            onChange={(e) =>
              setState({
                name: e.target.value.trim(),
              })
            }
          ></Input>
        </Space>
      </div>
    </Modal>
  );
};

export default AddDir;
