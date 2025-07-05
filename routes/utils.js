// utils.js
function collectEndpoints(router) {
    const endpoints = [];

    // Mengumpulkan informasi dari setiap rute yang telah didefinisisi
    router.stack.forEach(layer => {
        if (layer.route) {
            const { path, methods } = layer.route;
            const method = Object.keys(methods)[0];
            const params = layer.route.stack[0].params || [];

            endpoints.push({
                path: path,
                method: method.toUpperCase(),
                params: params.map(param => param.name)
            });
        }
    });

    return endpoints;
}

module.exports = {
    collectEndpoints
};
