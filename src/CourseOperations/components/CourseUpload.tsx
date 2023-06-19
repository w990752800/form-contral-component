import { PlusOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import type { UploadProps } from 'antd';
import {
  Button,
  Cascader,
  message,
  Select,
  Space,
  Upload,
  UploadFile,
} from 'antd';
import { DefaultOptionType } from 'antd/es/cascader';
import { DataNode } from 'antd/es/tree';
import React, { useEffect } from 'react';
const { Dragger } = Upload;

function isVideo(file: File) {
  const videoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  return videoTypes.includes(file.type);
}

type Props = {
  videoCategories: Record<string, any>[];
  categoryValue: string[];
  videoCategoryChange: (val: any) => void;
  uploadVideo: (file: File, id?: string) => void;
  selectedOptions: DefaultOptionType[];
  selectedOptionsChange: (val: any) => void;
  spaceType: '1' | '2';
  spaceTypeChange: (val: '1' | '2') => void;
  fileList: UploadFile<any>[];
  lessons: DataNode[];
};
const CourseUpload: React.FC<Props> = ({
  videoCategories,
  categoryValue,
  videoCategoryChange,
  uploadVideo,
  selectedOptions,
  selectedOptionsChange,
  spaceType,
  spaceTypeChange,
  fileList,
  lessons,
}) => {
  const [state, setState] = useSetState<{
    type: number;
    noUploadSections: any[];
  }>({
    type: 1,
    noUploadSections: [],
  });

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: false,
    },
    beforeUpload: (file) => {
      const isVideo = file.type.includes('video/');

      if (!isVideo) {
        message.error(`${file.name} 不是一个video/mp4文件`);
        return false;
      }

      // 上传视频
      uploadVideo(file);

      return false;
      return isVideo || Upload.LIST_IGNORE;
    },
    onChange(info) {
      // const { status } = info.file;
      // if (status !== "uploading") {
      // }
      // if (status === "done") {
      //   message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === "error") {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    },
    onDrop(e) {},
  };

  useEffect(() => {
    const noUploadSections = lessons
      .map((lesson) => {
        const { children } = lesson;
        const noUploadItems =
          children && children.filter((item: any) => item.video_id === '0');
        return noUploadItems;
      })
      .flat(1);
    setState({
      noUploadSections,
    });
  }, [lessons]);

  return (
    <div className="w-full box-border">
      {state.type === 1 ? (
        <div className="w-full box-border flex  bg-yellow-100 px-20 items-center py-20 rounded box-border justify-round">
          <Space>
            <Select
              placeholder="选择空间"
              size="large"
              value={spaceType}
              onChange={spaceTypeChange}
              disabled
              options={[
                { value: '2', label: '空间2' },
                { value: '1', label: '空间1' },
              ]}
            />
            <Cascader
              fieldNames={{
                label: 'name',
                value: 'id',
                children: 'sub-category',
              }}
              showSearch
              options={videoCategories}
              disabled
              value={categoryValue}
              onChange={(val, selectedOptions) => {
                selectedOptionsChange(selectedOptions);
                videoCategoryChange(val);
              }}
              placeholder="选择CC保存分类"
              size="large"
              allowClear
            />
            <Button
              type="primary"
              onClick={() => {
                if (!categoryValue || categoryValue.length === 0) {
                  return message.warning('请选择CC保存分类');
                }
                setState({
                  type: -1,
                });
              }}
            >
              进入上传区
            </Button>
          </Space>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex w-full justify-between px-2 my-2 items-center bg-yellow-100 rounded">
            <div>
              保存CC分类：
              {selectedOptions.length &&
                selectedOptions.map((option) => option.name).join(' / ')}
            </div>
            <Button
              type="text"
              onClick={() => {
                setState({
                  type: 1,
                });
              }}
            >
              [切换]
            </Button>
          </div>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <PlusOutlined />
            </p>
            <Space direction="vertical">
              <div className=" text-left px-4">
                1、请将本地mp4拖放到这里，支持多个
              </div>
              <div className=" text-left px-4">
                2、被上传的视频，将自动当作新小节追加到左侧末尾
              </div>
              <div className=" text-left px-4">
                3、上传过程中请不要关闭本页面；上传完之后可以关闭（因为剩余后续处理是在云端完成的）
              </div>
            </Space>
          </Dragger>
          {state.noUploadSections.length ? (
            <div className="mt-6 mb-2 border border-dashed">
              <div className=" bg-yellow-100 p-2">
                ！有{state.noUploadSections.length}
                个空占位小节，请及时完成补充上传 ！
              </div>
              {lessons.map((lesson) => {
                const { children } = lesson;
                const noUploadItems =
                  children &&
                  children.filter((item: any) => item.video_id === '0');
                return (
                  noUploadItems &&
                  noUploadItems.map((nodeData: any) => (
                    <div
                      className="border my-2 mx-1 flex justify-between rounded"
                      key={nodeData.id}
                    >
                      <div
                        className="p-2 flex-1 relative truncate"
                        title={nodeData.name}
                      >
                        {nodeData.name}
                        <div
                          className=" absolute top-0 left-0  bottom-0 bg-green-400 opacity-30"
                          style={{
                            width: `${nodeData.process}%`,
                          }}
                        ></div>
                        {nodeData.process ? `（${nodeData.process}%）` : ''}
                      </div>
                      <div className=" border-l h-full box-border">
                        <Upload
                          showUploadList={false}
                          beforeUpload={(file) => {
                            const isVideo = file.type.includes('video/');

                            if (!isVideo) {
                              message.error(
                                `${file.name} 不是一个video/mp4文件`,
                              );
                              return false;
                            }

                            // 上传视频
                            uploadVideo(file, nodeData.id);

                            return false;
                            return isVideo || Upload.LIST_IGNORE;
                          }}
                        >
                          <Button type="link">上传 +</Button>
                        </Upload>
                      </div>
                    </div>
                  ))
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CourseUpload;
