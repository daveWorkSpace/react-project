# 权限方案详细介绍

> 题目: 权限方案的构成

> 作者: 乔亚军 (dave-qiao)

> 日期: 2017/10/23

> 目的: 为开发人员快速熟悉该项目中的整体权限构成

> 背景知识: 项目需求为不同的角色拥有不同的模块权限、功能权限、数据权限

> 原理: 导航动态加载、路由分配及重定向、页面功能filter、数据过滤、接口拦截[详细讲解](./roleFilter.md)

> 内容: 整理如下

## 1.登录权限
*  1.1 该系统针对于线下管理人员角色的不同做了登录限制（骑士不可登录PC端，其他角色可以）
*  1.2 根据isLogin分配路由（登录或者Index）

## 2.导航动态渲染
*  2.1 前提需要根据不同的角色设置不同的菜单导航数据
*  2.2 根据不同的角色加载不同的数据从而生成不同的导航菜单 
*  2.3 根据不同的角色加载不同的数据从而生成不同的导航菜单，目前数据是在前端配置，后期可改为从后端动态获取

## 3.路由模块分发
*  3.1 根据不同的角色设置不同的路由数据，形成不同的路由权限池。 
*  3.2 当路由发生变化时，会去对应的路由权限池中去寻找是否有当前路由的权限，有则加载对应模块，没有则加载404模块。 
*  3.3 需要注意的时router路由的生命周期，在对应的生命周期中去做相应的事。 

## 4.数据过滤
*  4.1 登录数据过滤的主要工作在后端，每次登录会根据当前登录的角色返回对应的登录信息
*  4.2 接口数据过滤，请求接口必传account_id，根据其字段后端会过滤出符合当前角色的数据
*  4.3 前端的数据过滤在于对返回的数据再次根据权限需求进行细节过滤

## 5.页面功能点filter
*  5.1 针对于用户（即角色）的增删改查，不同的角色拥有不同的读写权限，需要对其进行页面操作权限的filter
*  5.2 页面当中部分结构的过滤、根据其角色的不同有业务需求，需要展示不同的页面。
*  5.3 需要注意项目中对于相关状态的过滤（例如审批状态、员工状态）。
*  5.4 此处对具体功能进行filter时需要结合权限池。

## 6.接口的过滤
*  6.1 需要对不同的角色设置不同的接口权限池 // TODO 
*  6.2 目前后端已经在接口处限制，后期可以考虑是否需要添加上一条说讲述的。 
