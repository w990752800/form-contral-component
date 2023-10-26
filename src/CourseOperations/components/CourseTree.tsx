import {
  DeleteOutlined,
  ExclamationCircleFilled,
  FormOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Tooltip, Tree, Upload, message } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';
import { requestDeleteLesson, requestDeleteSection } from '../utils/http';

const { confirm } = Modal;

type Props = {
  onAddDir: (type: string, name?: string, id?: string) => void;
  onAddSub: (nodeData: any, type: string) => void;
  lessons: DataNode[];
  updateSubOrder: (nodeData: any, pos: number) => void;
  editUploadVideo: (file: File, id: string) => void;
  updateCourseDetail: () => void;
};

const CourseTree: React.FC<Props> = ({
  onAddDir,
  onAddSub,
  lessons,
  updateSubOrder,
  editUploadVideo,
  updateCourseDetail,
}) => {
  const [gData, setGData] = useState<any[]>([]);

  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  // 判断是否为前两级节点
  const isTopTwoLevelNode = (sourceNode: any, targetNode: any) => {
    if (!sourceNode.lesson_id) return false;
    // if (targetNode && !targetNode.dragOverGapBottom) return false;

    return true;
  };

  const onDrop: TreeProps['onDrop'] = (info: any) => {
    const { dragNode, node, dropToGap } = info;

    // @ts-ignore
    if (!dropToGap && node.lesson_id) return;

    if (isTopTwoLevelNode(dragNode, node)) {
      // 可以拖拽
      // console.log('可以拖拽');
    } else {
      // 不可拖拽
      // console.log('不可拖拽');
      return;
    }

    // if (!(node as any).lesson_id) return;

    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: any[],
      key: React.Key,
      callback: (node: any, i: number, data: any[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };

    const data = [...gData];

    // Find dragObject
    let dragObj: any;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        // console.log('===1');
        updateSubOrder(info, 0);
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        // console.log('===2');
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: any[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        // console.log('===3');
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }

      // console.log('===4', ar);
      const position = ar.findIndex((item) => item.id === dragNode.id);
      updateSubOrder(info, position);
    }

    // 更新小节顺序
    // if (!node.lesson_id) {
    //   updateSubOrder(info, 0);
    // } else {
    //   updateSubOrder(info, Number(dropPos[dropPos.length - 1]) + 1);
    // }

    setGData([...data]);
  };

  const renderNodeDataStatus = (nodeData: any) => {
    if (!nodeData.lesson_id) return;
    if (nodeData.process)
      return (
        <span className="text-xs text-blue-700">
          （视频源1:上传中__{nodeData.process + '%'}）
        </span>
      );
    if (nodeData.videoqiniu) {
      if (nodeData.videoqiniu.type === '1') {
        return (
          <span className="text-xs text-gray-400">（视频源2:同步中）</span>
        );
      }

      if (nodeData.videoqiniu.qiniuvideouploads) {
        const statusText = {
          '-4': '获取视频原片地址失败',
          '-2': '同步失败',
          '-1': '上线前预存',
          '0': '正在上传',
          '1': '已上传',
          '2': '已同步',
        };
        const status = nodeData.videoqiniu.qiniuvideouploads[0].status as
          | '-4'
          | '-2'
          | '-1'
          | '0'
          | '1'
          | '2';
        return (
          <span className="text-xs text-blue-700">
            （视频源2:{statusText[status] || '未知状态'}）
          </span>
        );
      }
    } else {
      if (nodeData.video_id === '0') {
        return (
          <span className="text-xs text-gray-400">（视频源1:未上传）</span>
        );
      } else {
        return (
          <span className="text-xs text-lime-600">（视频源2:待同步）</span>
        );
      }
    }
  };

  const renderVideoLink = (nodeData: any) => {
    if (nodeData.video_id !== '0' && nodeData.video_look_url) {
      return (
        <Tooltip title="预览">
          <Button
            size="small"
            type="link"
            icon={<PlayCircleOutlined />}
            target="_blank"
            href={nodeData.video_look_url}
            onClick={(e) => e.stopPropagation()}
          ></Button>
        </Tooltip>
      );
    }
    return null;
  };

  const onDelDir = (id: string) => {
    confirm({
      title: '提示！',
      icon: <ExclamationCircleFilled />,
      content: '确定删除此目录？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await requestDeleteLesson(id);
          if (res.status === 200) {
            message.success('删除成功！');
            updateCourseDetail();
          } else {
            message.error(res.msg);
          }
        } catch (error: any) {
          message.error(error.message);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const onDelSub = (id: string) => {
    confirm({
      title: '提示！',
      icon: <ExclamationCircleFilled />,
      content: '确定删除此小节？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await requestDeleteSection(id);
          if (res.status === 200) {
            message.success('删除成功！');
            updateCourseDetail();
          } else {
            message.error(res.msg);
          }
        } catch (error: any) {
          message.error(error.message);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    setGData([...lessons]);
  }, [lessons]);

  return (
    <Space
      direction="vertical"
      className=" box-border"
      style={{
        width: '550px',
      }}
    >
      <Tree
        allowDrop={(data: any) => {
          if (!data.dragNode.lesson_id) {
            // message.info("目录不能移动！");
            return false;
          }
          if (data.dropPosition < 0) return false;
          return true;
        }}
        autoExpandParent={true}
        defaultExpandAll={true}
        showLine={true}
        className="draggable-tree box-border"
        //   defaultExpandedKeys={expandedKeys}
        draggable
        blockNode
        // onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={gData}
        // @ts-ignore
        titleRender={(nodeData: any) => {
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button block type="text" className="text-left">
                {nodeData.title.length > 10
                  ? nodeData.title.slice(0, 10) + '...'
                  : nodeData.title}
                {nodeData.lesson_id && nodeData.video_id !== '0' && (
                  <span className=" mx-1 text-xs text-cyan-600">
                    (视频源1:已上传)
                  </span>
                )}

                {renderNodeDataStatus(nodeData)}
              </Button>
              <Space>
                <Tooltip title="编辑">
                  <Button
                    type="text"
                    size="small"
                    icon={<FormOutlined />}
                    onClick={() =>
                      !nodeData.lesson_id
                        ? onAddDir('edit', nodeData.name, nodeData.id)
                        : onAddSub(nodeData, 'edit')
                    }
                  ></Button>
                </Tooltip>

                {nodeData.lesson_id && (
                  <Tooltip title="上传替换视频">
                    <Upload
                      showUploadList={false}
                      beforeUpload={(file) => {
                        const isVideo = file.type.includes('video/');

                        if (!isVideo) {
                          message.error(`${file.name} 不是一个video/mp4文件`);
                          return false;
                        }

                        // 上传视频
                        editUploadVideo(file, nodeData.id);

                        return false;
                        return isVideo || Upload.LIST_IGNORE;
                      }}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<UploadOutlined />}
                      ></Button>
                    </Upload>
                  </Tooltip>
                )}

                {/* <Button
                    size="small"
                    type="text"
                    icon={<UndoOutlined />}
                  ></Button> */}
                {!nodeData.lesson_id && (
                  <Tooltip title="追加子节空占位">
                    <Button
                      size="small"
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={() => onAddSub(nodeData, 'add')}
                    ></Button>
                  </Tooltip>
                )}
                {renderVideoLink(nodeData)}

                <Tooltip title="删除">
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      !nodeData.lesson_id
                        ? onDelDir(nodeData.id)
                        : onDelSub(nodeData.id)
                    }
                  ></Button>
                </Tooltip>
              </Space>
            </div>
          );
        }}
      />
      <Button onClick={() => onAddDir('add')}>+ 新目录</Button>
      {/* <Button onClick={onAddSub}>+ 追加子节空占位</Button> */}
    </Space>
  );
};

export default CourseTree;
