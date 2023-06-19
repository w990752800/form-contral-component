import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Spin,
  Upload,
  UploadFile,
} from 'antd';
import React from 'react';

type Props = {
  grades: Array<Record<string, any>>;
  subjects: Array<Record<string, any>>;
  teachers: Array<Record<string, any>>;
  uploadImg: (file: File) => void;
  uploadImgLoading: boolean;
  onRemoveImgFile: (file: File) => void;
  fileList: UploadFile<any>[];
  handleUploadImgChange: (fileList: UploadFile<any>[]) => void;
  onFinish: (values: any) => void;
  courseType: string | null;
};
const CreateCourse: React.FC<Props> = ({
  grades,
  subjects,
  teachers,
  uploadImg,
  uploadImgLoading,
  onRemoveImgFile,
  fileList,
  handleUploadImgChange,
  onFinish,
  courseType,
}) => {
  const onFinishFailed = (errorInfo: any) => {};

  return (
    <Form
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={
        courseType === '1'
          ? {
              media_type: '1',
              grade_id: '20',
              from: '文语课堂',
            }
          : {}
      }
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      size="large"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入课程名称！' }]}
          >
            <Input
              maxLength={30}
              showCount
              allowClear
              placeholder="请输入课程名称"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="别名" name="alias">
            <Input
              maxLength={30}
              showCount
              allowClear
              placeholder="请输入课程别名"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="类型"
            name="media_type"
            rules={[{ required: true, message: '请选择课程类型！' }]}
          >
            <Radio.Group>
              <Radio value="1"> 视频 </Radio>
              {/* <Radio value="1"> 音频 </Radio> */}
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="年级"
            name="grade_id"
            rules={[{ required: true, message: '请选择年级！' }]}
          >
            <Select
              disabled={courseType === '1'}
              placeholder="请选择年级"
              allowClear
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
            >
              {grades.length &&
                grades.map((grade) => (
                  <Select.Option key={grade.id} value={grade.id}>
                    {grade.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="科目"
            name="subject_id"
            rules={[{ required: true, message: '请选择科目！' }]}
          >
            <Select
              placeholder="请选择科目"
              allowClear
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
            >
              {subjects.length &&
                subjects.map((subject) => (
                  <Select.Option key={subject.id} value={subject.id}>
                    {subject.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="老师"
            name="teacher_id"
            rules={[{ required: true, message: '请选择老师！' }]}
          >
            <Select
              placeholder="请选择老师"
              allowClear
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
            >
              {teachers.length &&
                teachers.map((teacher) => (
                  <Select.Option key={teacher.id} value={teacher.id}>
                    {teacher.teacher_name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="课程来源"
            name="from"
            rules={[{ required: true, message: '请选择课程来源！' }]}
          >
            <Select
              disabled={courseType === '1'}
              placeholder="请选择课程来源"
              allowClear
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
            >
              <Select.Option key="文语课堂" value="文语课堂">
                文语课堂
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="封面">
            <Spin spinning={uploadImgLoading}>
              <Upload
                fileList={fileList}
                listType="picture-card"
                // showUploadList={false}
                maxCount={1}
                // @ts-ignore
                onRemove={(file: File) => onRemoveImgFile(file)}
                onChange={({ file, fileList }) =>
                  handleUploadImgChange(fileList)
                }
                beforeUpload={async (file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error(`${file.name} 不是图片类型！`);
                    return false;
                  }

                  // const isLt2M = file.size / 1024 / 1024 < 2;

                  uploadImg(file);

                  return false;
                  // return isImage || Upload.LIST_IGNORE;
                }}
              >
                <PlusOutlined />
              </Upload>
            </Spin>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="简介" name="description">
            <Input.TextArea placeholder="请输入简介" rows={4} allowClear />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}></Row>
      <Row gutter={16}>
        <Col span={12}></Col>
        <Col span={12}></Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}></Col>
        <Col span={12}></Col>
      </Row>
      <Row>
        <Col
          span={24}
          style={{
            marginTop: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button type="primary" htmlType="submit" size="large">
            提交创建，下一步上传视频
          </Button>
        </Col>
      </Row>
      <Form.Item></Form.Item>
    </Form>
  );
};

export default CreateCourse;
