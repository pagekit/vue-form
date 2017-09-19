import Vue from 'vue';
import Utils, {get, set, evaluate} from '../src/util';

Utils(Vue);

let values = {
    abc: 'xyz',
    foo: {
        bar: 123
    }
};

describe('utils', () => {

    it('get: abc = xyz', () => {
        expect(get(values, 'abc')).toBe('xyz');
    });

    it('get: foo.bar = 123', () => {
        expect(get(values, 'foo.bar')).toBe(123);
    });

    it('get: nested.object = undefined', () => {
        expect(get(values, 'nested.object')).toBeUndefined();
    });

    it('set: nested.object = 5', () => {
        set(values,'nested.object', 5);
        expect(get(values, 'nested.object')).toBe(5);
    });

    it('set: nested.object.even.deeper = 10', () => {
        set(values, 'nested.object.even.deeper', 10);
        expect(get(values, 'nested.object.even.deeper')).toBe(10);
        expect(typeof get(values, 'nested.object')).toBe('object');
    });

    it('eval: a + b = 10',() => {
        expect(evaluate('a + b', {a: 5, b: 5})).toBe(10);
    });

    it('eval: a + b = invalid/false', () => {
        expect(evaluate('a + b', {a: 5})).toBe(false);
    });

});
