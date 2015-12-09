# indexedDb-demo
一个简单的indexedDb插件及它的简单应用

## 插件indexedDb的用法

### 实例化indexedDb对象

        var indexedDb = new IndexedDb(dbName, store, callback)

dbName是DB的名字，如果没有则会新建  
store是DB中的仓库，类似于数据库中的表，支持同时创建多个仓库，使用数组存放多个仓库对象,name指定仓库名

        store = [
            {name: 'person'},
            {name: 'teachers'},
            {name: 'students'}
        ]
callback创建成功回调函数

### 添加数据

        IndexedDb.add(storeName, data, callback)

支持添加多个数据,每个数据有指定唯一的id

        data = [
            {
                name: jackson,
                age: 24,
                id: 1
            },
            {
                name: mack,
                age: 22,
                id: 2
            }
        ]

### 读取数据

            IndexedDb.get(storeName, id, callback)

id是仓库中数据的唯一标识

### 更新数据

            IndexedDb.put(storeName, data, callback)

支持更新多个数据

### 删除数据

            IndexedDb.delete(storeName, id, callback)

### 读取全部数据

            IndexedDb.addAll(storeName, callback)

### 删除全部数据

            IndexedDb.deleteAll(storeName, callback)
