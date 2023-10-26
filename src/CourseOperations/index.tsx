import { Spin } from 'antd';
import React, { useEffect } from 'react';
import AddDir from './components/AddDir';
import AddSub from './components/AddSub';
import Arrange from './components/Arrange';
import CourseDetail from './components/CourseDetail';
import useCourseTree from './hooks/useCourseTree';
import useLoadBase from './hooks/useLoadBase';
import './index.less';
type Props = {
  id: string;
  courseType?: string;
  title: string;
};
const CourseOperations: React.FC<Props> = ({ id, courseType = '', title }) => {
  const {
    loadBaseData,
    courseDetail,
    grades,
    subjects,
    teachers,
    getInit,
    updateCourseDetail,
    newLessons,
    loadLessons,
    updateCourse,
    updateCourseDetailLoading,
  } = useLoadBase({
    id,
  });

  const {
    onAddDir,
    addDirOpen,
    onAddDirOk,
    onAddDirCancel,
    addSubOpen,
    onAddSubOk,
    onAddSubCancel,
    onAddSub,
    addDirConfirmLoading,
    addSubCfonfirmLoading,
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
    editDir,
    editName,

    editSubData,
    editSub,

    editUploadVideo,
    setState,
  } = useCourseTree({ id, getInit, courseDetail, updateCourseDetail });

  useEffect(() => {
    if (courseDetail) {
      if (courseDetail && (courseDetail as any).from === '文语课堂') {
        setState({
          categoryValue: ['61D88664C00E63A3'], // 默认选中文语课堂视频
          selectedOptions: [
            {
              name: '文语课堂视频',
              id: '61D88664C00E63A3',
            },
          ],
        });
      } else {
        setState({
          categoryValue: ['E70A042C1C19E1B9', 'C4E945B3C77608CD'], // 默认选中文语课堂视频
          selectedOptions: [
            {
              name: '自习室自制课程',
              id: 'E70A042C1C19E1B9',
            },
            {
              name: 'sroom-9000001',
              id: 'C4E945B3C77608CD',
            },
          ],
        });
      }
    }
  }, [courseDetail]);

  if (loadBaseData)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: '300px',
        }}
      >
        <Spin size="large"></Spin>
      </div>
    );

  return (
    <div
      style={{
        margin: '0 auto 20px',
        padding: '0 20px',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '30px',
          fontWeight: 'bold',
          color: '#333',
          padding: '20px 0',
        }}
      >
        {title}
      </h1>
      <div
        style={{
          display: 'flex',
        }}
      >
        <CourseDetail
          detail={courseDetail}
          grades={grades}
          subjects={subjects}
          teachers={teachers}
          updateCourse={updateCourse}
          updateCourseDetailLoading={updateCourseDetailLoading}
          courseType={courseType}
        />
        {/* 目录编排 */}
        <Arrange
          onAddDir={onAddDir}
          onAddSub={onAddSub}
          courseDetail={courseDetail}
          updateSubOrder={updateSubOrder}
          videoCategories={videoCategories}
          categoryValue={categoryValue}
          videoCategoryChange={videoCategoryChange}
          uploadVideo={uploadVideo}
          selectedOptions={selectedOptions}
          selectedOptionsChange={selectedOptionsChange}
          spaceType={spaceType}
          spaceTypeChange={spaceTypeChange}
          fileList={fileList}
          loadLessons={loadLessons}
          editUploadVideo={editUploadVideo}
          updateCourseDetail={updateCourseDetail}
        />
      </div>

      <AddDir
        open={addDirOpen}
        onOk={onAddDirOk}
        onCancel={onAddDirCancel}
        addDirConfirmLoading={addDirConfirmLoading}
        editDir={editDir}
        editName={editName}
      />
      <AddSub
        open={addSubOpen}
        onOk={onAddSubOk}
        onCancel={onAddSubCancel}
        addSubCfonfirmLoading={addSubCfonfirmLoading}
        editSubData={editSubData}
        editSub={editSub}
      />
    </div>
  );
};

export default CourseOperations;
