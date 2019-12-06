/*
 * @Author: Aiden
 * @Date: 2019-12-06 16:14:55
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-06 16:21:42
 */

module.exports = function generateReadme (pkg) {
  return [
    `# ${pkg.name}`,
    `## ${pkg.description}`,
    `> ${pkg.description}。`,
    '## 开发配置',
    '',
    '端口号：8115',
    '',
    'nginx配置中，在鹰眼域名server下添加如下配置：',
    '',
    '```',
    '',
    '# 项目名称',
    '',
    'location /falcon {',
    '',
    '    proxy_pass http://127.0.0.1:8115/falcon;',
    '',
    '}',
    '',
    '```',
  ].join('\n')
}
