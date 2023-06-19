import { useSetState } from 'ahooks';
import { message } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import {
  addLesson,
  addSection,
  requestUpdateLesson,
  requestVideoCategory,
  requestVideoUploadInfo,
  saveVideoCCVID,
  updateSection,
} from '../utils/http';

const useCourseTree = ({
  id,
  getInit,
  courseDetail,
  updateCourseDetail,
}: any) => {
  const [state, setState] = useSetState<Record<string, any>>({
    addDirOpen: false,
    addSubOpen: false,
    addDirConfirmLoading: false,
    currentLessonId: '',
    addSubCfonfirmLoading: false,
    videoCategories: [],
    categoryValue: [],
    selectedOptions: [],
    spaceType: '2',
    fileList: [],
    noUploadVideos: [],
    editDir: '',
    editName: '',
    editDirId: '',
    // ----
    editSub: '',
    editSubData: null,
  });

  //   =======新增目录弹窗=======
  const onAddDirOk = async (name: string) => {
    if (!name) return message.error('请输入目录名称');
    setState({
      addDirConfirmLoading: true,
    });
    if (state.editDir === 'add') {
      try {
        const res = await addLesson({
          course_id: id,
          name,
          sort_no: '100', // 单个的，值随便设置
          status: 1,
          is_public: 1,
        });
        if (res.status === 200) {
          message.success('新增目录成功');
          // getInit();
          updateCourseDetail();
        } else {
          message.error(res.msg);
        }
      } catch (error: any) {
        message.error(error.message);
      }
    } else {
      try {
        const res = await requestUpdateLesson(state.editDirId, {
          name,
        });
        if (res.status === 200) {
          message.success('目录编辑成功');
          // getInit();
          updateCourseDetail();
        } else {
          message.error(res.msg);
        }
      } catch (error: any) {
        message.error(error.message);
      }
    }

    setState({
      addDirOpen: false,
      addDirConfirmLoading: false,
    });
  };
  const onAddDirCancel = () => {
    setState({
      addDirOpen: false,
    });
  };
  const onAddDir = (type: string, name = '', id = '') => {
    setState({
      addDirOpen: true,
      editDir: type,
      editName: name,
      editDirId: id,
    });
  };
  //   =======新增小节弹窗=======
  const onAddSubOk = async (val: string) => {
    if (!val.trim()) return message.error('请输入小节名称');

    setState({
      addSubCfonfirmLoading: true,
    });

    if (state.editSub === 'add') {
      const { section } = courseDetail.lessons.find(
        (lesson: { id: string }) => lesson.id === state.currentLessonId,
      );

      const lastSection = section[section.length - 1];

      const sort_no = lastSection ? lastSection.sort_no + 1 : 0;

      const vals = val.split('\n').map((val, index) => {
        return {
          lesson_id: state.currentLessonId,
          name: val,
          sort_no: sort_no + index,
        };
      });

      try {
        const res = await addSection(vals);
        if (res.status === 200) {
          message.success('新增小节成功');
          // getInit();
          updateCourseDetail();
        } else {
          message.error(res.msg);
        }
      } catch (error: any) {
        message.error(error.message);
      }
    } else {
      try {
        const res = await updateSection(state.editSubData.id, {
          name: val,
        });
        if (res.status === 200) {
          message.success('小节名称修改成功');
          // getInit();
          updateCourseDetail();
        } else {
          message.error(res.msg);
        }
      } catch (error: any) {
        message.error(error.message);
      }
    }

    setState({
      addSubOpen: false,
      addSubCfonfirmLoading: false,
    });
  };
  const onAddSubCancel = () => {
    setState({
      addSubOpen: false,
    });
  };
  const onAddSub = (nodeData: any, type: string) => {
    setState({
      addSubOpen: true,
      currentLessonId: nodeData.id,
      editSub: type,
      editSubData: nodeData,
    });
  };

  const updateSubOrder = async (nodeData: any, pos: number) => {
    const { dragNode, node, dropPosition, dropToGap } = nodeData;

    try {
      const res = await updateSection(dragNode.id, {
        lesson_id: node.lesson_id || node.id,
        sort_index: pos,
      });

      if (res.status === 200) {
        message.success('更新成功');
        // getInit();
        updateCourseDetail();
      } else {
        message.error(res.msg);
      }
    } catch (error: any) {
      message.error(error.message);
    }

    // setState({
    //   addSubOpen: true,
    //   currentLessonId: nodeData.id,
    // });
  };

  // 获取视频分类
  const getVideoCategory = async (val = state.spaceType) => {
    setState(() => ({
      videoCategories: [],
      categoryValue: [],
      selectedOptions: [],
    }));
    try {
      const res = await requestVideoCategory({
        type: val,
      });
      if (res.status === 200) {
        setState({
          videoCategories: res.data.result.categories,
          categoryValue: ['61D88664C00E63A3'], // 默认选中文语课堂视频
          selectedOptions: [
            {
              name: '文语课堂视频',
              id: '61D88664C00E63A3',
            },
          ],
        });
      } else {
        message.error(res.msg);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const videoCategoryChange = (val: string[]) => {
    setState({
      categoryValue: val,
    });
  };

  const selectedOptionsChange = (val: string[]) => {
    setState({
      selectedOptions: val,
    });
  };

  const getNoUploadVideo = () => {
    const noUploadVideos =
      courseDetail &&
      courseDetail.lessons
        .map((lesson: any) => {
          return lesson.section.filter((item: any) => {
            if (item.video_id === '0') {
              return item;
            }
          });
        })
        .flat(Infinity);

    setState({
      noUploadVideos,
    });
  };

  const createSection = async (fileName: string) => {
    const index = fileName.lastIndexOf('.');
    const name = index !== -1 ? fileName.slice(0, index) : fileName;

    if (!courseDetail.lessons.length) {
      // 创建章节
      const {
        data: { newData },
      } = await addLesson({
        course_id: courseDetail.id,
        name: '新章节',
        sort_no: '0',
        is_public: 1,
        status: 1,
      });

      // 创建小节
      const {
        data: { newData: newLessons },
      } = await addSection([
        {
          lesson_id: newData[0].id,
          name,
          sort_no: '0',
        },
      ]);
      return newLessons[0].id;
    } else {
      // 获取到最后一个章节
      const lastLesson = courseDetail.lessons[courseDetail.lessons.length - 1];
      if (!lastLesson.section.length) {
        // 创建小节
        const {
          data: { newData },
        } = await addSection([
          {
            lesson_id: lastLesson.id,
            name,
            sort_no: '0',
          },
        ]);
        return newData[0].id;
      } else {
        // 获取最后一个小节的排序
        const { sort_no } = lastLesson.section[lastLesson.section.length - 1];
        // 创建小节
        const {
          data: { newData },
        } = await addSection([
          {
            lesson_id: lastLesson.id,
            name,
            sort_no: Number(sort_no) + 1,
          },
        ]);
        return newData[0].id;
      }
    }
  };

  const uploadVideo = async (file: File, id = '') => {
    const section_id = id || (await createSection(file.name));

    const categoryid = state.categoryValue[state.categoryValue.length - 1];
    const params = {
      title: file.name,
      categoryid,
      filename: file.name,
      filesize: file.size,
      httpsflag: 1,
    };

    // console.log('1. 获取视频上传信息');

    const {
      data: {
        result: { uploadinfo },
      },
      status,
      msg,
    } = await requestVideoUploadInfo({
      type: state.spaceType,
      params,
    });

    if (status !== 200) return message.error(msg);

    const { metaurl, userid, videoid, servicetype, chunkurl } = uploadinfo;

    if (!id) {
      state.fileList = [
        ...state.fileList,
        {
          uid: videoid,
          name: file.name,
          status: 'uploading',
          percent: 0,
          size: file.size,
        },
      ];
      setState(() => ({
        fileList: state.fileList,
      }));
    }

    // console.log('2. 查询该条文件的上传状态及断点位置');

    const metaDetail = await axios.get(metaurl, {
      params: {
        uid: userid,
        ccvid: videoid,
        filename: file.name,
        filesize: file.size,
        servicetype,
      },
    });

    // console.log('3. 发送文件块，直到文件数据全部发送');

    const CHUNK_SIZE = 4 * 1024 * 1024; // 每个分块的大小为 4MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE); // 计算总共需要分成多少块
    let currentChunk = 0; // 当前上传的块数

    while (currentChunk < totalChunks) {
      const start = currentChunk * CHUNK_SIZE; // 计算当前块的起始位置
      const end = Math.min(start + CHUNK_SIZE, file.size); // 计算当前块的结束位置

      const chunk = file.slice(start, end); // 截取当前块的数据

      const formData = new FormData(); // 创建表单对象
      formData.append('file', chunk); // 将当前块的数据添加到表单中
      // formData.append("totalChunks", totalChunks as any); // 添加总块数信息
      // formData.append("currentChunk", (currentChunk + 1) as any); // 添加当前块数信息

      const response = await axios.post(
        chunkurl + '?ccvid=' + videoid,
        formData,
        {
          headers: {
            'Content-Range': `bytes ${start}-${end - 1}/${file.size}`,
          },
        },
      ); // 发送 POST 请求

      if (response.data.result === 1) {
        // 获取未上传视频的小节
        await saveVideoCCVID({
          ccvid: videoid,
          section_id,
        });
        message.success('上传成功');
        await updateCourseDetail();

        state.fileList = state.fileList.map((item: any) => {
          if (item.uid === videoid) {
            return {
              ...item,
              status: 'done',
              percent: 100,
            };
          }
          return item;
        });
        setState(() => ({
          fileList: state.fileList,
        }));
      } else {
        await updateCourseDetail(section_id, {
          process: Math.ceil((response.data.received / file.size) * 100),
        });

        state.fileList = state.fileList.map((item: any) => {
          if (item.uid === videoid) {
            return {
              ...item,
              status: 'uploading',
              percent: Math.ceil((response.data.received / file.size) * 100),
            };
          }
          return item;
        });
        setState(() => ({
          fileList: state.fileList,
        }));
      }

      currentChunk++;
    }
  };

  const spaceTypeChange = (val: '1' | '2') => {
    setState((prev) => ({
      spaceType: val,
    }));
    getVideoCategory(val);
  };

  const editUploadVideo = (file: File, id: string) => {
    uploadVideo(file, id);
  };

  useEffect(() => {
    getVideoCategory();
  }, []);

  // useEffect(() => {
  //   if (courseDetail) {
  //     getNoUploadVideo();
  //   }
  // }, [courseDetail]);

  return {
    onAddDir,
    addDirOpen: state.addDirOpen,
    onAddDirOk,
    onAddDirCancel,
    addDirConfirmLoading: state.addDirConfirmLoading,
    // ----------
    addSubOpen: state.addSubOpen,
    onAddSubOk,
    onAddSubCancel,
    onAddSub,
    addSubCfonfirmLoading: state.addSubCfonfirmLoading,

    updateSubOrder,
    videoCategories: state.videoCategories,
    categoryValue: state.categoryValue,
    videoCategoryChange,
    uploadVideo,
    selectedOptions: state.selectedOptions,
    selectedOptionsChange,
    spaceType: state.spaceType,
    spaceTypeChange,
    fileList: state.fileList,
    editDir: state.editDir,
    editName: state.editName,

    editSubData: state.editSubData,
    editSub: state.editSub,

    editUploadVideo,
  };
};

export default useCourseTree;
