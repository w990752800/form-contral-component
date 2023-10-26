import { RedoOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Button, Space, Spin, Tooltip, UploadFile } from 'antd';
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
    if (courseDetail) {
      if (courseDetail.lessons.length > 0) {
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
      } else {
        setState({
          newLessons: [],
        });
      }
    }
  }, [courseDetail]);

  return (
    <div style={{ display: 'flex' }}>
      <Space
        direction="vertical"
        className="box-border"
        style={{ width: '550px' }}
      >
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
              updateCourseDetail={updateCourseDetail}
            />
          </Spin>
        </div>
      </Space>

      <Space
        direction="vertical"
        className="pl-20 box-border"
        style={{ width: '450px' }}
      >
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
    </div>
  );
};

export default Arrange;
