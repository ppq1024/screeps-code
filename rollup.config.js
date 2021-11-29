import clear from 'rollup-plugin-clear'
import screeps from 'rollup-plugin-screeps'
import copy from 'rollup-plugin-copy'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

let config
if (!process.env.DEST) console.log("未指定目标, 代码将被编译但不会上传")
else if (!(config = require("./.secret.json")[process.env.DEST])) {
    throw new Error("无效目标，请检查 secret.json 中是否包含对应配置")
}

const pluginDeploy = config && config.copyPath ?
    copy({
        targets: [
            {
                src: 'dist/main.js',
                dest: config.copyPath
            },
            {
                src: 'dist/main.js.map',
                dest: config.copyPath,
                rename: name => name + '.map.js',
                transform: contents => `module.exports = ${contents.toString()};`
            }
        ],
        hook: 'writeBundle',
        verbose: true
    }) :
    screeps({ config, dryRun: !config })

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/main.js',
        format: 'cjs',
        sourcemap: true
    },
    plugins: [
        clear({ targets: ["dist"] }),
        resolve(),
        commonjs(),
        pluginDeploy
    ]
};
