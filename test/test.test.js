/**
 * Created by dave 2017/07/20
 * 面包屑自动生成测试用例
 *
 */
import { BreadCrumbTool } from './../src/utils/createdBreadCumb';
import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

describe('面包屑生成类的测试', function () {
	const result1 = new BreadCrumbTool().handleCreate('/Search/Businesss');
	const result2 = new BreadCrumbTool().handleCreate('/Handle/Upload');
	const result3 = new BreadCrumbTool().handleCreate('/Employee/LeaveFlow');
	it('结果是一个数组,包含两个元素', function () {
		console.log(result1);
		console.log(result2);
		console.log(result3);
		assert.isArray(result1, 'result1 is a array?');
		assert.isArray(result2, 'result2 is a array?');
		assert.isArray(result3, 'result3 is a array?');
		// expect(flag).to.be.ok;
	});
});

