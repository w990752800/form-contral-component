import { PlusOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import {
  Col,
  Input,
  message,
  Radio,
  Row,
  Select,
  Spin,
  Upload,
  UploadFile,
} from 'antd';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { requestQiniuToken, uploadFile } from '../utils/http';
import { IMG_HOST } from '../utils/request';

type Props = {
  detail: Record<string, any> | null;
  grades: Array<Record<string, any>>;
  subjects: Array<Record<string, any>>;
  teachers: Array<Record<string, any>>;
  updateCourse: (id: string, values: any) => void;
  updateCourseDetailLoading: boolean;
  courseType: string | null;
};
const CourseDetail: React.FC<Props> = ({
  detail,
  grades,
  subjects,
  teachers,
  updateCourse,
  updateCourseDetailLoading,
  courseType,
}) => {
  const [state, setState] = useSetState({
    name: '',
    alias: '',
    grade_id: '',
    subject_id: '',
    teacher_id: '',
    public_range: '',
    // 上传图片
    uploadImgLoading: false,
    fileList: [] as UploadFile[],
  });

  const uploadImg = async (file: File) => {
    // 上传文件
    setState({
      uploadImgLoading: true,
    });
    try {
      const res = await requestQiniuToken();
      if (res.status === 200) {
        const token = res.data.uptoken;
        const key = uuidv4() + '.' + file.name.split('.')?.[1];

        const data = await uploadFile(file, token, key);

        await updateCourse(detail?.id, {
          title_pic: data.key,
        });
      } else {
        message.error(res.msg);
      }
    } catch (error: any) {
      message.error(error.message);
    }

    setState({
      uploadImgLoading: false,
    });
  };

  function isImage(file: File) {
    return (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif'
    );
  }

  useEffect(() => {
    if (detail) {
      setState({
        name: detail.name,
        alias: detail.alias,
        grade_id: detail.grade_id,
        subject_id: detail.subject_id,
        teacher_id: detail.teacher_id,
        public_range:
          detail.marked_price && Number(detail.marked_price) > 0 ? '2' : '1',
        fileList: detail.title_pic
          ? [
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: `${IMG_HOST}${detail.title_pic}`,
              },
            ]
          : [],
      });
    }
  }, [detail]);

  return (
    <Spin spinning={updateCourseDetailLoading}>
      <Row gutter={[16, 16]} style={{ width: '550px', marginRight: '20px' }}>
        <Col span={24}>
          <div className="flex">
            <div className="w-80"> </div>
            <h3 className="text-lg">课程编辑区：</h3>
          </div>
        </Col>
        <Col span={24}>
          <div className="flex items-center">
            <label className="w-80 text-right">名称：</label>
            <Input
              value={state.name}
              className=" flex-1 overflow-hidden"
              size="large"
              maxLength={20}
              showCount
              onChange={(e) => {
                setState({
                  name: e.target.value,
                });
              }}
              onBlur={() => {
                if (state.name === detail?.name) return;
                if (!state.name) {
                  setState({
                    name: detail?.name,
                  });
                  return message.error('名称不能为空');
                }
                updateCourse(detail?.id, {
                  name: state.name,
                });
              }}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="flex items-center">
            <label className="w-80 text-right">别名：</label>
            <Input
              value={state.alias}
              className=" flex-1 overflow-hidden"
              size="large"
              maxLength={20}
              showCount
              onChange={(e) => {
                setState({
                  alias: e.target.value,
                });
              }}
              onBlur={() => {
                if (state.alias === detail?.alias) return;
                updateCourse(detail?.id, {
                  alias: state.alias,
                });
              }}
            />
          </div>
        </Col>
        <Col span={24}>
          <div
            className="flex items-center"
            style={{
              marginBottom: 20,
            }}
          >
            <label className="w-80 text-right">类型：</label>
            <Radio.Group size="large" value={detail?.course_type || ''}>
              <Radio value="1" className="text-base">
                视频
              </Radio>
            </Radio.Group>
          </div>
          <div
            className="flex items-center"
            style={{
              marginBottom: 20,
            }}
          >
            <label className="w-80 text-right">发布范围：</label>
            <Select
              className="flex-1 overflow-hidden"
              size="large"
              value={state.public_range}
              onChange={(value) => {
                setState({
                  public_range: value,
                });
                updateCourse(detail?.id, {
                  public_range: value,
                });
              }}
            >
              <Select.Option key="2" value="2">
                需授权
              </Select.Option>
              <Select.Option key="1" value="1">
                公开
              </Select.Option>
            </Select>
          </div>
          <div
            className="flex items-center"
            style={{
              marginBottom: 20,
            }}
          >
            <label className="w-80 text-right">老师：</label>
            <Select
              className="flex-1 overflow-hidden"
              size="large"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                if (!option) return false;
                if (!option.children) return false;
                return (
                  (option.children as unknown as string)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                );
              }}
              value={state.teacher_id}
              onChange={(value) => {
                setState({
                  teacher_id: value,
                });
                updateCourse(detail?.id, {
                  teacher_id: value,
                });
              }}
            >
              {teachers.length &&
                teachers.map((teacher) => (
                  <Select.Option key={teacher.id} value={teacher.id}>
                    {teacher.teacher_name}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <div
            className="flex items-center"
            style={{
              marginBottom: 20,
            }}
          >
            <label className="w-80 text-right">年级/课目：</label>
            <div className="flex-1 flex items-center">
              <Select
                disabled={courseType === '1'}
                className="flex-1 overflow-hidden mr-10"
                size="large"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (!option) return false;
                  if (!option.children) return false;
                  return (
                    (option.children as unknown as string)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                value={state.grade_id}
                onChange={(value) => {
                  setState({
                    grade_id: value,
                  });
                  updateCourse(detail?.id, {
                    grade_id: value,
                  });
                }}
              >
                {grades.length &&
                  grades.map((grade) => (
                    <Select.Option key={grade.id} value={grade.id}>
                      {grade.name}
                    </Select.Option>
                  ))}
              </Select>
              <Select
                className="flex-1 overflow-hidden"
                size="large"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (!option) return false;
                  if (!option.children) return false;
                  return (
                    (option.children as unknown as string)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                value={state.subject_id}
                onChange={(value) => {
                  setState({
                    subject_id: value,
                  });
                  updateCourse(detail?.id, {
                    subject_id: value,
                  });
                }}
              >
                {subjects.length &&
                  subjects.map((subject) => (
                    <Select.Option key={subject.id} value={subject.id}>
                      {subject.name}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-80 text-right">来源：</label>
            <span className="  text-base ">{detail?.from || ''}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className="flex">
            <label className="w-80 text-right">封面：</label>
            <Spin spinning={state.uploadImgLoading}>
              <Upload
                fileList={state.fileList}
                listType="picture-card"
                // showUploadList={false}
                maxCount={1}
                // @ts-ignore
                onRemove={(file: File) => {
                  updateCourse(detail?.id, {
                    title_pic: '',
                  });
                }}
                beforeUpload={async (file) => {
                  const isImg = isImage(file);
                  if (!isImg) {
                    message.error('只支持上传 JPG/PNG/GIF 格式的图片！');
                    return false;
                  }

                  // const isLt2M = file.size / 1024 / 1024 < 2;

                  await uploadImg(file);

                  return false;
                }}
              >
                <div>
                  <PlusOutlined />
                  {/* <div className="mt-2 px-2">封面图</div> */}
                </div>
              </Upload>
            </Spin>
          </div>
        </Col>
      </Row>
    </Spin>
  );
};

export default CourseDetail;
