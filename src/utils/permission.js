/**
 * Created by dave 2017/5/1
 *
 * */
const permission = {
	isLogin() {
		const accountInfo = window.localStorage.getItem('AOAOBOSS');
		if(accountInfo!=undefined) {
			return true;
		}else {
			return false;
		}
	}
};
export default permission;
