import { useSetState } from 'ahooks';
import { message } from 'antd';
import { useEffect } from 'react';
import {
  requestCourse,
  requestCourseBase,
  requestUpdateCourse,
} from '../utils/http';

const useLoadBase = ({ id }: any) => {
  const [state, setState] = useSetState({
    loadBaseData: true,
    courseDetail: null,
    grades: [],
    subjects: [],
    teachers: [],
    newLessons: [] as any,
    loadLessons: false,
    updateCourseDetailLoading: false,
  });

  const getCourse = async () => {
    try {
      const res = await requestCourse(id);
      if (res.status === 200) {
        const newLessons = res.data?.lessons?.map((lesson: any) => {
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
          courseDetail: res.data,
          newLessons,
        });
      } else {
        message.error(res.msg);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getCourseBase = async () => {
    try {
      const res = await requestCourseBase();
      if (res.status === 200) {
        setState({
          ...res.data,
        });
      } else {
        message.error(res.msg);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const init = async () => {
    setState({
      loadBaseData: true,
    });
    await Promise.all([getCourseBase(), getCourse()]);
    setState({
      loadBaseData: false,
    });
  };

  const updateCourseDetail = async (section_id = '', params = {}) => {
    setState({
      loadLessons: true,
    });

    if (section_id) {
      const { courseDetail } = state as any;
      const { lessons } = courseDetail;

      const newLessons = lessons.map((lesson: any) => {
        lesson.section = lesson.section.map((item: any) => {
          if (item.id == section_id) {
            return {
              ...item,
              ...params,
            };
          }
          return item;
        });
        return lesson;
      });

      setState({
        courseDetail: {
          ...courseDetail,
          lessons: [...newLessons],
        },
        // newLessons: [...newLessons],
      });
    } else {
      await getCourse();
    }

    setState({
      loadLessons: false,
    });
  };

  const updateCourse = async (id: string, val: Record<string, any>) => {
    setState({
      updateCourseDetailLoading: true,
    });
    try {
      const res = (await requestUpdateCourse(id, val)) as any;
      if (res.status === 200) {
        await getCourse();
      } else {
        message.error(res.msg);
      }
    } catch (error: any) {
      message.error(error.message);
    }
    setState({
      updateCourseDetailLoading: false,
    });
  };

  useEffect(() => {
    init();
  }, []);

  return {
    ...state,
    getInit: init,
    updateCourseDetail,
    updateCourse,
  };
};

export default useLoadBase;
