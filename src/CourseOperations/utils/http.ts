import { message } from 'antd';
import axios from 'axios';
import { API, getApi } from './request';

// 课程查询
export const requestCourse = async (id: string) => {
  try {
    const res = await axios.get(getApi(API.getCourseDetail(id)), {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 获取创建课程的基础数据
export const requestCourseBase = async () => {
  try {
    const res = await axios.get(getApi(API.getCourseBase), {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 获取qiniu的token
export const requestQiniuToken = async () => {
  try {
    const res = await axios.get(getApi(API.getUploadToken), {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return '';
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 上传文件
export const uploadFile = async (file: File, token: string, key: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);
    formData.append('key', key);

    const res = await axios({
      method: 'post',
      url: 'https://up.qbox.me',
      data: formData,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 创建课程
export const addCourse = async (data: any) => {
  try {
    const res = await axios.post(getApi(API.addCourse), data, {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 添加章节
export const addLesson = async (data: any) => {
  try {
    const res = await axios.post(getApi(API.addLesson), data, {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 添加小节
export const addSection = async (data: any) => {
  try {
    const res = await axios.post(getApi(API.addSection), data, {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 修改小节
export const updateSection = async (id: string, data: any) => {
  try {
    const res = await axios.post(getApi(API.updateSection(id)), data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// CC请求参数签名  type默认为1
export const requestCCSignature = async (data: any) => {
  try {
    const res = await axios.post(getApi(API.getCCQueryString), data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 获取视频分类
export const requestVideoCategory = async (data: any) => {
  try {
    const res = await axios.post(getApi(API.getCCVideoCategory), data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

//  创建CC视频上传信息
export const requestVideoUploadInfo = async (data: any) => {
  try {
    const res = await axios.post(getApi(API.createCCVideoInfo), data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 保存视频地址CCVID
export const saveVideoCCVID = async (data: {
  section_id: string;
  ccvid: string;
}) => {
  try {
    const res = await axios.post(getApi(API.saveVideoCCVID), data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 更新课程信息
export const requestUpdateCourse = async (id: string, data: any) => {
  try {
    const res = await axios.post(getApi(API.updateCourse(id)), data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};

// 目录修改
export const requestUpdateLesson = async (id: string, data: any) => {
  try {
    const res = await axios.post(getApi(API.updateLesson(id)), data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      message.error(res.statusText);
      return null;
    }
  } catch (error: any) {
    message.error(error.message);
  }
};
