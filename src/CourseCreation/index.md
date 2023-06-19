# CourseCreation

课程创建

```jsx
import { CourseCreation } from 'gk-form-control';

export default () => (
  <CourseCreation
    courseType="1"
    navgateToCourseOperations={(id, courseType) => {
      // 跳转到编辑页面，id为课程id， courseType为1时，说明时文语课程专用创建
      console.log('id', id);
      console.log('courseType', courseType);
    }}
  />
);
```
