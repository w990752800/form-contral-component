import { Spin } from 'antd';
import React from 'react';
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
  } = useCourseTree({ id, getInit, courseDetail, updateCourseDetail });

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
        maxWidth: '1200px',
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

      <section>
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
        <br />
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
      </section>

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
