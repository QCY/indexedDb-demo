window.onload = function() {
    var unit = {
        getById: function(id) {
            return document.getElementById(id);
        }
    }

    var elements = {
        btnConfirm: unit.getById('btn-confirm'),
        btnDeleteAll: unit.getById('delete-all'),
        nameField: unit.getById('name'),
        ageField: unit.getById('age'),
        sexField: unit.getById('sex'),
        tbody: unit.getById('table-body')
    },
    indexedDb = null;

    var init = function() {
        var store = [
            {name: 'person'}
        ];

        indexedDb = new IndexedDb('dbName', store, renderData);

        elements.btnConfirm.onclick = function() {
            var personData = [
                {
                    name: elements.nameField.value.trim(),
                    age: elements.ageField.value.trim(),
                    sex: elements.sexField.value.trim(),
                    id: new Date().getTime()
                }
            ]
            indexedDb.add('person', personData, renderData);
        };

        elements.btnDeleteAll.onclick = function() {
            indexedDb.deleteAll('person', renderData);
        };

        elements.tbody.onclick = function(e) {
            if(e.target.className === 'btn-delete') {
                var id = e.target.parentNode.data;
                indexedDb.delete('person', id, renderData);
            }
        };
    };

    var renderData = function() {
        indexedDb.getAll('person', onGetSuccess);
    };

    var onGetSuccess = function(data) {
        elements.tbody.innerHTML = '';
        var i = 0,
            len = data.length;
        for(; i < len; i++) {
            renderList(data[i]);
        }
    };

    var renderList = function(object) {
        var tr = document.createElement('tr');
        object.operate = 'delete';
        for(var name in object) {
            if(name !== 'id') {
                var td = document.createElement('td');
                if(name === 'operate') {
                    td.className = 'btn-delete';
                }
                td.innerHTML = object[name];
                tr.appendChild(td);
            }
        }
        tr.data = object.id;
        elements.tbody.appendChild(tr);
    };

    init();

}
