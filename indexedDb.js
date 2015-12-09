var IndexedDb = (function() {
	if ('indexedDB' in window) {

		var db;
		/**
		 * 创建indexedDB实例
		 * @param {string} name db名字
		 * @param {array} store 仓库名字
		 * @param {function}  onSuccess 添加成功回调函数
		 */
		var IndexedDb = function(name, store, onSuccess) {
			this.name = name;
			this.store = store;
			this.onSuccess = onSuccess;
			this.open();
		};

		/**
		 * 打开或创建db
		 */
		IndexedDb.prototype.open = function() {
			var openRequest = indexedDB.open(this.name);
			openRequest.onupgradeneeded = openUpgradeneeded.bind(this);
			openRequest.onsuccess = openSuccess.bind(this);
		};

		/**
		 * 关闭db
		 */
		IndexedDb.prototype.close = function() {
			db.close();
		};

		/**
		 * 添加数据
		 * @param {string} store 仓库名
		 * @param {array} data  添加的数据
		 * @param {function} func  添加成功回调函数
		 * @param {string} type  操作类型
		 */
		IndexedDb.prototype.add = function(store, data, func, type) {
			type = type || 'readwrite';
			var transaction = db.transaction([store], type),
				objectStore = transaction.objectStore(store),
				i = 0,
				len = data.length;

			for (; i < len; i++) {
				var request = objectStore.add(data[i], data[i].id);
				request.onerror = function(e) {
					console.log("Error", e.target.error.name);
				};

				if (func && i === len - 1) {
					request.onsuccess = function(e) {
						func.apply(this, [e]);
					}.bind(this);
				}
			}
		};

		/**
		 * 读取数据
		 * @param {string} store 仓库名
		 * @param {array} key   读取的数据键名
		 * @param {function} func  读取成功回调函数
		 * @param {string} type  操作类型
		 */
		IndexedDb.prototype.get = function(store, key, func, type) {
			type = type || 'readonly';
			var transaction = db.transaction([store], type),
				objectStore = transaction.objectStore(store);
			var request = objectStore.get(key);

			request.onerror = function(e) {
				console.log("Error", e.target.error.name);
			};

			request.onsuccess = function(e) {
				var res = e.target.result;
				if (func) {
					func.apply(this, [res]);
				}

				return res;
			}.bind(this);


		};

		/**
		 * 更新数据
		 * @param {string} store 仓库名
		 * @param {array} data  更新的数据
		 * @param {function} func  添加成功回调函数
		 * @param {string} type  操作类型
		 */
		IndexedDb.prototype.put = function(store, data, func, type) {
			type = type || 'readwrite';
			var transaction = db.transaction([store], type),
				objectStore = transaction.objectStore(store),
				i = 0,
				len = data.length;

			for (; i < len; i++) {
				var request = objectStore.put(data[i], data[i].id);
				request.onerror = function(e) {
					console.log("Error", e.target.error.name);
				};

				if (func && i === len - 1) {
					request.onsuccess = function(e) {
						func.apply(this, [e]);
					}.bind(this);
				}
			}
		};

		/**
		 * 删除数据
		 * @param {string} store 仓库名
		 * @param {array} key  删除的数据键名
		 * @param {function} func  读取成功回调函数
		 * @param {string} type  操作类型
		 */
		IndexedDb.prototype.delete = function(store, key, func, type) {
			type = type || 'readwrite';
			var transaction = db.transaction([store], type),
				objectStore = transaction.objectStore(store);
			var request = objectStore.delete(key);

			request.onerror = function(e) {
				console.log("Error", e.target.error.name);
			};

			if (func) {
				request.onsuccess = function() {
					func.apply(this);
				}.bind(this);
			}
		};

		/**
		 * 读取全部数据
		 * @param {string} store 仓库名
		 * @param {function} func  读取成功回调函数
		 */
		IndexedDb.prototype.getAll = function(store, func) {
			var type = 'readonly',
				transaction = db.transaction([store], type),
				objectStore = transaction.objectStore(store),
				cursor = objectStore.openCursor(),
				res = [];


			cursor.onsuccess = function(e) {
				var result = e.target.result;
				if (result) {
					res.push(result.value)
					result.continue();
				} else if (func) {
					func.apply(this, [res]);
				}
			}.bind(this);

		};

		/**
		 * 删除全部数据
		 * @param {string} store 仓库名
		 * @param {function} func  删除成功回调函数
		 */
		IndexedDb.prototype.deleteAll = function(store, func) {
			var type = 'readonly',
				transaction = db.transaction([store], type),
				objectStore = transaction.objectStore(store),
				cursor = objectStore.openCursor(),
				res = [];

			cursor.onsuccess = function(e) {
				var result = e.target.result;
				if (result) {
					this.delete(store, result.key);
					result.continue();
				} else if (func) {
					func.apply(this);
				}
			}.bind(this);

		};

		function openUpgradeneeded(e) {
			db = e.target.result;
			for (var i = 0, max = this.store.length; i < max; i++) {
				if (!db.objectStoreNames.contains(this.store[i].name)) {
					if (this.store[i].key) {
						db.createObjectStore(this.store[i].name, {
							keyPath: this.store[i].key
						});
					} else {
						db.createObjectStore(this.store[i].name);
					}
				}
			}
		};

		function openSuccess(e) {
			db = e.target.result;
			if (this.onSuccess) {
				this.onSuccess.apply(this, [e]);
			}
			return db;
		}

		return IndexedDb;
	} else {
		aler('浏览器不支持indexedDb');
	}
})();
