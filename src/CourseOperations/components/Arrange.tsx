import { RedoOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Button, Col, Row, Space, Spin, Tooltip, UploadFile } from 'antd';
import { DefaultOptionType } from 'antd/es/cascader';
import React, { useEffect } from 'react';
import CourseTree from './CourseTree';
import CourseUpload from './CourseUpload';

type Props = {
  onAddDir: (type: string, name?: string, id?: string) => void;
  onAddSub: (nodeData: any, type: string) => void;
  courseDetail: Record<string, any> | null;
  updateSubOrder: (nodeData: any, pos: number) => void;
  videoCategories: Array<Record<string, any>>;
  categoryValue: string[];
  videoCategoryChange: (val: any) => void;
  uploadVideo: (file: File) => void;
  selectedOptions: DefaultOptionType[];
  selectedOptionsChange: (val: any) => void;
  spaceType: '1' | '2';
  spaceTypeChange: (val: '1' | '2') => void;
  fileList: UploadFile<any>[];
  loadLessons: boolean;
  editUploadVideo: (file: File, id: string) => void;
  updateCourseDetail: () => void;
};
const Arrange: React.FC<Props> = ({
  onAddDir,
  onAddSub,
  courseDetail,
  updateSubOrder,
  videoCategories,
  categoryValue,
  videoCategoryChange,
  uploadVideo,
  selectedOptions,
  selectedOptionsChange,
  spaceType,
  spaceTypeChange,
  fileList,
  loadLessons,
  editUploadVideo,
  updateCourseDetail,
}) => {
  const [state, setState] = useSetState({
    newLessons: [],
  });

  useEffect(() => {
    if (courseDetail && courseDetail.lessons.length > 0) {
      const newLessons = courseDetail.lessons?.map((lesson: any) => {
        return {
          ...lesson,
          key: lesson.id,
          title: lesson.name,
          children: lesson.section?.map((sub: any) => {
            return {
              ...sub,
              key: sub.id,
              title: sub.name,
            };
          }),
        };
      });

      setState({
        newLessons,
      });
    }
  }, [courseDetail]);

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Space direction="vertical" className="w-full box-border">
          <div className=" text-lg ">目录编排区：</div>
          <div className="flex items-center justify-between">
            <span className=" text-red-700">
              *目录与小节可以上下调整顺序与结构哦，所有的修改自动保存
            </span>
            <Tooltip title="刷新目录">
              <Button
                className="ml-4"
                icon={<RedoOutlined />}
                type="text"
                onClick={() => {
                  if (!loadLessons) {
                    updateCourseDetail();
                  }
                }}
              ></Button>
            </Tooltip>
          </div>
          <div className="border rounded p-2 w-full box-border">
            <Spin spinning={loadLessons}>
              <CourseTree
                onAddDir={onAddDir}
                onAddSub={onAddSub}
                lessons={state.newLessons}
                updateSubOrder={updateSubOrder}
                editUploadVideo={editUploadVideo}
              />
            </Spin>
          </div>
        </Space>
      </Col>
      <Col span={12}>
        <Space direction="vertical" className="w-full pl-20 box-border">
          <div className=" text-lg ">上传区：</div>
          <CourseUpload
            videoCategories={videoCategories}
            categoryValue={categoryValue}
            videoCategoryChange={videoCategoryChange}
            uploadVideo={uploadVideo}
            selectedOptions={selectedOptions}
            selectedOptionsChange={selectedOptionsChange}
            spaceType={spaceType}
            spaceTypeChange={spaceTypeChange}
            fileList={fileList}
            lessons={state.newLessons}
          />
        </Space>
      </Col>
    </Row>
  );
};

export default Arrange;
