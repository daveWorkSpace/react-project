import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;
import aoaoBossTools from './../src/utils/util';

describe('读取本地数据', function () {
	it('输入为不存在的属性，应该拦住错误并且告诉错误原因', () => {
		const result = aoaoBossTools.readDataFromLocal('region');
		// const result = aoaoBossTools.readDataFromLocal('region');
		console.log(result);
		expect(result).to.equal('未找到');
	});

});
