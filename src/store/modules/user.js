export default{
    state:{
        info:[],
        MenuList:[]

    },
    mutations:{
        setInfo(state,data){
            state.info = data.data.data;
        },
        setMenuList(state,data){
            state.MenuList = data;
        }
    }
}