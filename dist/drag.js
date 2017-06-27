Drag = {
	init: function (options) {
		var obj = document.getElementById(options.selector);
		var root = document.getElementById(options.root) || document.body;
		if (!obj) return;
		//obj.onmousedown = this.start;
		obj.addEventListener('mousedown', this.start, false);
		obj.root = root;
		obj.onDragStart = options.dragStart || new Function();
		obj.onDrag = options.onDrag || new Function();
		obj.onDragEnd = options.onDragEnd || new Function();
	},
	start: function (e) { //此时的this是handler
		//if (this.onDragStart() == 'stop') return;
		this.onDragStart()
		var obj = this;
		e = e || Drag.fixEvent(window.event);
		this.x = e.clientX - this.offsetLeft;
		this.y = e.clientY - this.offsetTop;
		var clickY = e.clientY;

		this.bound = this.getBoundingClientRect();
		var bound = this.root.getBoundingClientRect();

		this.onmouseup = function (e) {
			e = e || Drag.fixEvent(window.event);
			this.root.onmousemove = null;
			this.onDragEnd(this);
		}
		this.root.onmousemove = function (e) {
			e = e || Drag.fixEvent(window.event);
			obj.style.transition = 'none';
			obj.style.position = 'fixed';
			//判断移动方向 可能有作用线
			var x_dir = '',
				y_dir = '';
			if (obj.move_x && obj.move_y) {
				if (e.clientX < obj.move_x) x_dir = 'left';
				if (e.clientX > obj.move_x) x_dir = 'right';
				if (e.clientY > obj.move_y) y_dir = 'down';
				if (e.clientY < obj.move_y) y_dir = 'up';
			}
			//存放当前坐标
			obj.move_x = e.clientX;
			obj.move_y = e.clientY;

			var obj_left = e.clientX - obj.x,
				obj_top = e.clientY - obj.y;
			if (obj_left > bound.left && obj_left < bound.right &&
				obj_top > bound.top && obj_top < bound.bottom) {
				obj.style.left = obj_left + "px";
				obj.style.top = obj_top + "px";
			}
			obj.onDrag();
		}
	},
	fixEvent: function (e) {
		e.pageX = e.clientX + document.documentElement.scrollLeft;
		e.pageY = e.clientY + document.documentElement.scrollTop;
		return e;
	}
}
