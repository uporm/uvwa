import { R } from '@/types/common.types';
import { message } from 'antd/lib';

export interface Q<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

export function makeQ<T>(initialData?: T): Q<T> {
  return { data: initialData ?? null, loading: false, error: null };
}

export async function run<T, Args extends any[]>(
  state: Q<T>,
  task: (...args: Args) => Promise<R<T>>,
  ...args: Args
): Promise<T | null> {
  state.loading = true;
  state.error = null;
  try {
    const result = await task(...args);

    // 判断 result 是 R 类型，检查 code 是否为 200
    if (result && typeof result === 'object' && 'code' in result) {
      if (result.code === 200) {
        // code 为 200 时，state.data 等于 R.data
        state.data = result.data || null;
        return result.data !== undefined ? result.data : null;
      } else {
        // code 不为 200 时，抛出异常并弹出 message
        const errorMessage = result.message || '请求失败';
        message.error(errorMessage);
        const error = new Error(errorMessage);
        state.error = error;
        throw error;
      }
    } else {
      // 如果不是 R 类型，按原来的逻辑处理
      state.data = result as any;
      return result as any;
    }
  } catch (err) {
    state.error = err;
    console.error('runAsync error:', err);

    // 如果错误对象有 message 属性，也弹出提示
    if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
      message.error(err.message);
    }

    throw err;
  } finally {
    state.loading = false;
  }
}
