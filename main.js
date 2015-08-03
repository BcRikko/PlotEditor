var plots = [''];
var index = 1;
var exportText = '';
var save = false;

Vue.component('plot', {
    template: '#plot-template',
    replace: true,
    props: ['plots'],
    ready: function (value) {
        var el = this.$el;

        Sortable.create(el, {
            draggable: 'li',
            onUpdate: function(e) {
                var oldPosition = e.item.getAttribute('data-id');
                var newPosition = this.toArray().indexOf(oldPosition);

                plots.splice(newPosition, 0, plots.splice(oldPosition, 1)[0]);
            }
        });          
    },
    methods: {
        remove: function(index) {
            plots.$remove(index);
        },
        shortcut: function (e, index) {
            // shift + ctrl
            if (e.$event.shiftKey && e.$event.ctrlKey) {
                switch (e.$event.keyCode) {
                    // up
                    case 38:
                        if (0 < index) {
                            plots.splice(index - 1, 0, plots.splice(index, 1)[0]);
                            document.getElementsByTagName('textarea')[index - 1].focus();
                        }
                        break;
                    // down
                    case 40:
                        var el = document.getElementsByTagName('textarea');
                        if (index < el.length - 1) {
                            plots.splice(index + 1, 0, plots.splice(index, 1)[0]);
                            document.getElementsByTagName('textarea')[index + 1].focus();
                        }
                        break;
                }
            }
            // ctrl
            else if (e.$event.ctrlKey) {
                switch (e.$event.keyCode) {
                    // enter
                    case 13:
                        main.add();
                        break;
                    // up
                    case 38:
                        if (0 < index) {
                            document.getElementsByTagName('textarea')[index - 1].focus();
                        }
                        break;
                    // down
                    case 40:
                        var el = document.getElementsByTagName('textarea');
                        if (index < el.length - 1) {
                            document.getElementsByTagName('textarea')[index + 1].focus();
                        }
                        break;
                    // del
                    case 46:
                        this.remove(index);
                        break;
                    // s
                    case 83:
                        main.export();
                        break;
                }
            }
        }
    }
});

var main = new Vue({
    el: '#plot-editor',
    data: {
        plots: plots,
        exportText: exportText,
        save: save
    },
    methods: {
        add: function() {
            plots.push('');
            
            setTimeout(function() {
                var e = document.getElementsByTagName('textarea');
                e[e.length - 1].focus();
            }, 100);

        },
        export: function() {
            this.exportText = '';
            var text = plots.join('\r\n\r\n');
            this.exportText = text;
            this.save = true;
        },
        reset: function() {
            if (confirm('プロットをリセットします。よろしいですか？')) {
                var len = plots.length;
                for (var i = 0; i < len; i++){
                    plots.$remove(0);
                }
            }
        }
    }
});

// Ctrl+Sの無効化
document.onkeydown = function () {
    if (event.keyCode == 83) { return false;} 
}