# Variance Server
VarianceServer是一个为HTTP设计的反向代理服务器。它可以用于对各种HTTP站点的反向代理，如个人博客、
小型站点、程序文档等。VarianceServer也可以用于为其他的App进行反向代理（如Rails服务、Nodejs服务
和Python的服务等）。

这个设计方便开发者对流量和冗余性进行配额，同时可以通过在页面中插入识别代码来阻止或定位对站点的攻击。

需要注意的是，VarianceServer不提供以下的反向代理功能：
- 加密和SSL加速
- 负载均衡
- 缓存静态内容
- 减速上传
- 外网发布

## Setup 
在配置文件中配置希望反向代理到的 HOST信息，服务器即会转发流量到该服务器。VarianceServer会在请求中
插入动态内容来降低攻击威胁。


