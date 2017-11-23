import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;
import aoaoBossTools from './../src/utils/util';

describe('枚举值转换函数测试', function () {
	it('性别枚举值转换,1对应输出男', () => {
		const result = aoaoBossTools.enumerationConversion(2);
		expect(result).to.equal('女');
	});

	it('性别枚举值转换,2对应输出女', () => {
		const result = aoaoBossTools.enumerationConversion(2);
		expect(result).to.equal('女');
	})
});
