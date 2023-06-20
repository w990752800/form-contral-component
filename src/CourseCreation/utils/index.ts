export const login = () => {
  // 清除所有cookie
  const keys = document.cookie.match(/[^ =;]+(?==)/g);
  if (keys) {
    for (let i = keys.length; i--; )
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
  }

  // 跳转到登录页
  window.location.href = '/p-edu/login';
};
