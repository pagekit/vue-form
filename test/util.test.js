import Utils,{get,set,evaluate} from '../src/util';
import Vue from 'vue';

Utils(Vue);


let base = {}

describe('utils', function () {

    it('get: base.nested.object === undefined', () => {
        expect(get(base,'nested.object')).toBeUndefined;
    });

    it('set: base.nested.object = 5', () => {
        set(base,'nested.object', 5);
        expect(get(base,'nested.object' )).toBe(5);
    });


    it('set: base.nested.object.even.deeper = 10', () => {
        set(base,'nested.object.even.deeper', 10);
        expect(get(base,'nested.object.even.deeper')).toBe(10);
    });

    it('get: typeof base.nested.object === "object"',()=>{
        expect(typeof get(base,'nested.object')).toBe('object');
    })


    it('eval: a + b = 10',() => {
        expect(evaluate('a + b',{a:5,b:5})).toBe(10);
    });

    it('eval: a + b = invalid/false', () => {
        expect(evaluate('a + b',{a:5})).toBe(false);
        
    })

});