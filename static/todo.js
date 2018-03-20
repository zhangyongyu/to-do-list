

// TODO API
// 获取所有 todo
var apiTodoAll = function(callback) {
    var path = '/api/todo/all'
    ajax('GET', path, '', callback)
}

// 增加一个 todo
var apiTodoAdd = function(form, callback) {
    var path = '/api/todo/add'
    ajax('POST', path, form, callback)
}

// 删除点击 todo
var apiTodoDelete = function(form, callback) {
    var path = '/api/todo/delete'
    ajax('POST', path, form, callback)
	log(form)
}

// 更新点击todo
var apiTodoUpdate = function(form, callback) {
    var path = '/api/todo/update'
    ajax('POST', path, form, callback)
	log(form)
}

//将时间戳转换为格式
function timetrans(date){
    var date = new Date(date*1000);//如果date为10位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
}


// TODO DOM
var todoTemplate = function(todo) {
	var str_time = timetrans(todo.updated_time)
    var t = `
        <div class="todo-cell">
            <span style="font-size: 1.2em">${todo.task}</span>
            <button class="todo-delete pure-button button-small" todo_id='${todo.id}'>删除 <i class="fa fa-trash"></i></button>
            <button class="todo-edit pure-button button-small" todo_id='${todo.id}'>编辑 <i class="fa fa-edit"></i></button>
            <div style="font-size:0.8em;color:#8A8A8A;">${str_time}</div>
            <div class='line'></div>
        </div>

    `
    return t
}

var insertTodo = function(todo) {
    var todoCell = todoTemplate(todo)
    // 插入 todo-list
    var todoList = e('.todo-list')
    todoList.insertAdjacentHTML('beforeend', todoCell)
}

var loadTodos = function() {
    // 调用 ajax api 来载入数据
    apiTodoAll(function(r) {
        console.log('load all', r)
        // 解析为 数组
        var todos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < todos.length; i++) {
            var todo = todos[i]
            insertTodo(todo)
        }
    })
}

var bindEventTodoAdd = function() {
	// ajax访问api，实现不刷新加载todo内容
    var b = e('#id-button-add')
    // 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-todo')
        var task = input.value
		input.value = ''
        log('click add', task, )
        var form = {
            task: task,
        }
        apiTodoAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var todo = JSON.parse(r)
            insertTodo(todo)
        })
    })
	

	//利用事件冒泡捕获触发，
	var todoList = e('.todo-list')
	 // ajax访问api，实现不刷新删除todo内容
	 // 事件响应函数会被传入一个参数, 就是事件本身
	 todoList.addEventListener('click', function(event){
		 // log('click todolist', event)
		 // 我们可以通过 event.target 来得到被点击的元素
		 var self = event.target
		 // log('被点击的元素是', self)
		 // 通过比较被点击元素的 class 来判断元素是否是我们想要的
		 // classList 属性保存了元素的所有 class
		 // 在 HTML 中, 一个元素可以有多个 class, 用空格分开
		 // log(self.classList)
		 // 判断是否拥有某个 class
		 if (self.classList.contains('todo-delete')) {
			 
			 log('点到了 删除按钮')
			 todo_id = self.getAttribute('todo_id')
			 var form = {
				id: todo_id,
			 }
			 apiTodoDelete(form, function(r) {	
				log(r)
				self.parentElement.remove()
			})

		 } 
		 else {
			 // log('点击的不是删除按钮)
		 }
	 })

	// 点击编辑按钮后，弹出更新内容提交
	 todoList.addEventListener('click', function(event){
		 var self = event.target
		 if (self.classList.contains('todo-edit')) {
			 var todo_id = self.getAttribute('todo_id')
			 var update_form = `

                <div class='pure-form' style="vertical-align: middle;">
				    <input id='id-input-todo' todo_id=${todo_id} style="display:inline;">
				    <button id='id-button-add' class="todo-update pure-button pure-button-primary" style="display:inline;margin-left: -4px">更新</button>
			    </div>
			 `
			 self.insertAdjacentHTML('afterEnd', update_form)
		 }
	 })
	 
	 // ajax访问api，实现不刷新更新todo内容
	 todoList.addEventListener('click', function(event){
		 var self = event.target
		 if (self.classList.contains('todo-update')) {
			 var input = self.previousSibling.previousSibling
			 var todo_id = input.getAttribute('todo_id')
			 var task = input.value
			 var form = {
				id: todo_id,
				task: task,
			 }
			 
			 apiTodoUpdate(form, function(r) {	
				var todo = JSON.parse(r)
				var a = self.parentNode.parentNode.getElementsByTagName('span')[0]
				a.innerHTML = todo.task
                // 删除更新界面
				self.parentNode.innerHTML = ''
			})
		 }
	})
}

var bindEvents = function() {
    bindEventTodoAdd()
}



var __main = function() {
    bindEvents()
    loadTodos()
}

__main()