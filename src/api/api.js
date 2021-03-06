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
// 获取菜单信息
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
// 添加、根据角色id修改角色
const role = '/role';
// 获取角色权限状态树
const roleSetAuthority = '/menu/menuTreeListByRoleId';
// 设置角色权限树
const roleSavePermission = '/role/savePermisson';
// 添加、修改、删除部门
const dept = '/dept';
// 添加&修改菜单
const menu = '/menu';
// 获取字典列表（可搜索）
const dictList = '/dict/list';
// 添加字典信息
const dict = '/dict';
// 添加&修改栏目
const channel = '/channel';
// 添加&修改文章
const article = '/article';
// 上传图片
const file = '/file';
// 获取文章列表
const articleList = '/article/list';
// 获取文件信息
const fileMgrList = '/fileMgr/list';
// 下载图片
const fileDownload = '/file/download';
// 图片静态地址
const publicImg = 'http://39.101.217.150:8086/statics/'
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
    getRoleList,
    role,
    dept,
    roleSetAuthority,
    roleSavePermission,
    menu,
    dictList,
    dict,
    channel,
    article,
    file,
    articleList,
    fileMgrList,
    fileDownload,
    publicImg
}
  