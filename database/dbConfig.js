var configure = {
    user: "postgres",
    host: "mapeditor.momenta.works",
    database: "map_data_origin",
    password: "zuojingwei",
    port: 5432,

    // 扩展属性
    max: 20, // 连接池最大连接数
    idleTimeoutMillis: 1000, // 连接最大空闲时间 3s
}

module.exports.configure = configure;