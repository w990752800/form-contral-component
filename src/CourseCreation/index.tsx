import { Spin } from 'antd';
import React from 'react';
import CreateCourse from './components/CreateCourse';
import useLoadFormData from './hooks/useLoadFormData';

type Props = {
  courseType: string;
  navgateToCourseOperations: (id: string, courseType?: string) => void;
};
const CourseCreation: React.FC<Props> = ({
  navgateToCourseOperations,
  courseType,
}) => {
  //   const navgateToCourseOperations = (id: string) => {
  // if (courseType === '1') {
  //   router.push(`/operations?id=${id}&courseType=1`);
  //   return;
  // }
  // router.push(`/operations?id=${id}`);
  //   };

  const {
    grades,
    subjects,
    teachers,
    loading,
    uploadImg,
    uploadImgLoading,
    onRemoveImgFile,
    fileList,
    handleUploadImgChange,
    onFinish,
  } = useLoadFormData({
    navgateToCourseOperations,
  });

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          minHeight: '300px',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto 20px',
        padding: ' 0 20px',
      }}
    >
      <h1
        style={{
          fontWeight: 'bold',
          fontSize: '20px',
          textAlign: 'center',
          padding: '20px 0',
        }}
      >
        上传视频新课程
      </h1>
      <CreateCourse
        grades={grades}
        subjects={subjects}
        teachers={teachers}
        uploadImg={uploadImg}
        uploadImgLoading={uploadImgLoading}
        onRemoveImgFile={onRemoveImgFile}
        fileList={fileList}
        handleUploadImgChange={handleUploadImgChange}
        onFinish={onFinish}
        courseType={courseType as string}
      />
    </div>
  );
};

export default CourseCreation;
