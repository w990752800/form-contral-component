import { useSetState } from 'ahooks';
import { message } from 'antd';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  addCourse,
  requestCourseBase,
  requestQiniuToken,
  uploadFile,
} from '../utils/http';

const IMG_HOST = 'https://img.qiaoxuesi.com/';

const useLoadFormData = ({ navgateToCourseOperations }: any) => {
  const [state, setState] = useSetState({
    grades: [],
    subjects: [],
    teachers: [],
    loading: true,
    uploadImgLoading: false,
    fileList: [] as any,
  });

  const getCourseBase = async () => {
    const res = await requestCourseBase();
    if (res.status === 200) {
      setState({
        ...res.data,
      });
    } else {
      message.error(res.msg);
    }
  };

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
        setState({
          fileList: [
            {
              uid: data.key,
              name: data.key,
              status: 'done',
              url: IMG_HOST + data.key,
              thumbUrl: IMG_HOST + data.key,
            },
          ],
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

  const onRemoveImgFile = (file: File) => {
    setState({
      fileList: [],
    });
    // const index = fileList.indexOf(file);
    // const newFileList = fileList.slice();
    // newFileList.splice(index, 1);
    // setFileList(newFileList);
  };

  const handleUploadImgChange = (fileList: any) => {};

  const onFinish = async (values: any) => {
    const { fileList } = state;

    const title_pic = fileList.length ? fileList[0]?.name : '';

    const data = Object.assign(
      {
        marked_price: '5.00',
        status: '0', // 默认为0，不公开
      },
      values,
      { title_pic },
    );

    try {
      const res = await addCourse(data);
      if (res.status === 200) {
        message.success('创建成功');
        setState({
          fileList: [],
        });
        navgateToCourseOperations(res.data.id);
      } else {
        message.error(res.msg);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getCourseBase();
    setTimeout(() => {
      setState({
        loading: false,
      });
    }, 800);
  }, []);

  return {
    ...state,
    uploadImg,
    onRemoveImgFile,
    handleUploadImgChange,
    onFinish,
  };
};

export default useLoadFormData;
