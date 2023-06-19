export const HTTP = 'https://www.gankao.com';
export const TEST_HTTP = 'https://www.gankaotest2.com';

export const IMG_HOST = 'https://img.qiaoxuesi.com/';

export const API = {
  getCourseBase: '/courseAdmin/getCourseBase',
  getUploadToken: '/courseAdmin/getUploadToken',
  addCourse: '/courseAdmin/createCourse',
  getCourseDetail: (id: string) => `/courseAdmin/getCourseInfo/${id}`,
  addLesson: '/courseAdmin/addLesson',
  addSection: '/courseAdmin/addSection',
  updateSection: (id: string) => `/courseAdmin/updateSection/${id}`,
  getCCQueryString: '/courseAdmin/getCCQueryString',
  getCCVideoCategory: '/courseAdmin/getCCVideoCategory',
  createCCVideoInfo: '/courseAdmin/createCCVideoInfo',
  saveVideoCCVID: '/courseAdmin/saveVideo',
  updateCourse: (id: string) => `/courseAdmin/updateCourse/${id}`,
  updateLesson: (id: string) => `/courseAdmin/updateLesson/${id}`,
};

export const getHttp = () => HTTP;
// process.env.APP_ENV === "production" ? HTTP : TEST_HTTP;

export const getApi = (api: string) => {
  return getHttp() + api;
};
