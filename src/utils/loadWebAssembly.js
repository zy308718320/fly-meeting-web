export default (filename, imports = {}) => fetch(filename)
  .then((response) => response.arrayBuffer())
  .then((buffer) => {
    // eslint-disable-next-line no-param-reassign
    imports.env = imports.env || {};
    Object.assign(imports.env, {
      memoryBase: 0,
      tableBase: 0,
      memory: new WebAssembly.Memory({ initial: 256 }),
      table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
    });
    return WebAssembly.instantiate(buffer, imports);
  })
  .then((results) => results.instance);
