在database里创建dbConfig.js格式如下：
var configure = {
    user: "XXX",
    host: "XXX",
    database: "XXX",
    password: "XXX",
    port: XXX,

    // 扩展属性
    max: 20, // 连接池最大连接数
    idleTimeoutMillis: 1000, // 连接最大空闲时间 3s
}
module.exports.configure = configure;

1.安装
npm install
2.启动服务
npm start
