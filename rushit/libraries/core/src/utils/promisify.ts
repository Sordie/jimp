export default function promisify<T=any>(fun: any, ctx: any, ...args: any[]) {
  return new Promise<T>((resolve, reject) => {
    args.push((err: Error, data: any) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
    fun.bind(ctx)(...args);
  });
}
