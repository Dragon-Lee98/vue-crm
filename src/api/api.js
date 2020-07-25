// 服务器地址
const http = 'http://39.101.217.150:8086';
// 登录地址
const login = '/account/login';
// 获取菜单地址
const listForRouter = '/menu/listForRouter';
// 用户信息地址
const info = '/account/info';
// 修改密码地址
const updatePwd = '/account/updatePwd';
// 获取首页文章数量
const articlebychannel = '/article/articlebychannel';
// 获取首页分类信息
const articlelist = '/channel/list';
// 获取功能操作信息
const menulist = '/menu/list';
// 获取用户列表
const userList = '/user/list';
// 获取部门信息
const deptList = '/dept/list';
// 添加用户
const user = '/user';
// 获取角色信息
const roleTreeList = '/role/roleTreeListByIdUser';
// 设置角色信息
const setRole = '/user/setRole';
// 获取角色列表（可搜索）
const getRoleList = '/role/list';
export {
    http,
    login,
    listForRouter,
    info,
    updatePwd,
    articlebychannel,
    articlelist,
    menulist,
    userList,
    deptList,
    user,
    roleTreeList,
    setRole,
    getRoleList
}
  