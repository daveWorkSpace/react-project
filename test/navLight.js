import { BreadCrumbTool, NavLight } from './../src/utils/createdBreadCumb';
import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;
// const NavLight = BreadCrumbTool.NavLight;

describe('导航高亮显示', function () {
	const result = new NavLight().setKey('/Search/Business');
	console.log(new NavLight().setKey('/Search/Business'));
	it('高亮选择返回一个数字，类型为字符串,值为1', () => {
		expect(result).to.equal('1');
	})
});
