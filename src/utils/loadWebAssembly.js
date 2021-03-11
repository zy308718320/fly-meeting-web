export default (filename, imports = {}) => fetch(filename)
  .then((response) => response.arrayBuffer())
  .then((buffer) => {
    // eslint-disable-next-line no-param-reassign
    imports.env = imports.env || {};
    Object.assign(imports.env, {
      memoryBase: 0,
      tableBase: 0,
      memory: new WebAssembly.Memory({ initial: 10, maximum: 100 }),
      table: new WebAssembly.Table({ initial: 10, element: 'anyfunc' }),
      exp: Math.exp,
    });
    // const mod = new WebAssembly.Module(buffer);
    return WebAssembly.instantiate(buffer, imports);
  })
  .then((results) => results.instance);
