import { test, describe, expect } from 'bun:test';
import { usosService } from './usos';

describe('usos', () => {
	const service = usosService({
		get: function <R = unknown>(): Promise<R> {
			throw new Error('Function not implemented.');
		},
		post: function <R = unknown>(): Promise<R> {
			throw new Error('Function not implemented.');
		}
	});
	test('getCourses', async () => {
		const course = await service.getGroups('W04IST-SI0010L');

		expect(course).toMatchSnapshot();
	});
});
