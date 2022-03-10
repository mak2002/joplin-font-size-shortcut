!function(e){var t={};function o(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=2)}([function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=joplin},function(e,t,o){"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.ContentScriptType=t.SettingStorage=t.AppType=t.SettingItemType=t.ToolbarButtonLocation=t.isContextMenuItemLocation=t.MenuItemLocation=t.ModelType=t.ImportModuleOutputFormat=t.FileSystemItem=void 0,function(e){e.File="file",e.Directory="directory"}(t.FileSystemItem||(t.FileSystemItem={})),function(e){e.Markdown="md",e.Html="html"}(t.ImportModuleOutputFormat||(t.ImportModuleOutputFormat={})),function(e){e[e.Note=1]="Note",e[e.Folder=2]="Folder",e[e.Setting=3]="Setting",e[e.Resource=4]="Resource",e[e.Tag=5]="Tag",e[e.NoteTag=6]="NoteTag",e[e.Search=7]="Search",e[e.Alarm=8]="Alarm",e[e.MasterKey=9]="MasterKey",e[e.ItemChange=10]="ItemChange",e[e.NoteResource=11]="NoteResource",e[e.ResourceLocalState=12]="ResourceLocalState",e[e.Revision=13]="Revision",e[e.Migration=14]="Migration",e[e.SmartFilter=15]="SmartFilter",e[e.Command=16]="Command"}(t.ModelType||(t.ModelType={})),function(e){e.File="file",e.Edit="edit",e.View="view",e.Note="note",e.Tools="tools",e.Help="help",e.Context="context",e.NoteListContextMenu="noteListContextMenu",e.EditorContextMenu="editorContextMenu",e.FolderContextMenu="folderContextMenu",e.TagContextMenu="tagContextMenu"}(n=t.MenuItemLocation||(t.MenuItemLocation={})),t.isContextMenuItemLocation=function(e){return[n.Context,n.NoteListContextMenu,n.EditorContextMenu,n.FolderContextMenu,n.TagContextMenu].includes(e)},function(e){e.NoteToolbar="noteToolbar",e.EditorToolbar="editorToolbar"}(t.ToolbarButtonLocation||(t.ToolbarButtonLocation={})),function(e){e[e.Int=1]="Int",e[e.String=2]="String",e[e.Bool=3]="Bool",e[e.Array=4]="Array",e[e.Object=5]="Object",e[e.Button=6]="Button"}(t.SettingItemType||(t.SettingItemType={})),function(e){e.Desktop="desktop",e.Mobile="mobile",e.Cli="cli"}(t.AppType||(t.AppType={})),function(e){e[e.Database=1]="Database",e[e.File=2]="File"}(t.SettingStorage||(t.SettingStorage={})),function(e){e.MarkdownItPlugin="markdownItPlugin",e.CodeMirrorPlugin="codeMirrorPlugin"}(t.ContentScriptType||(t.ContentScriptType={}))},function(e,t,o){"use strict";var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,l){function r(e){try{a(n.next(e))}catch(e){l(e)}}function u(e){try{a(n.throw(e))}catch(e){l(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,u)}a((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=o(0),l=o(3);i.default.plugins.register({onStart:function(){return n(this,void 0,void 0,(function*(){yield l.setupPlugin()}))}})},function(e,t,o){"use strict";var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,l){function r(e){try{a(n.next(e))}catch(e){l(e)}}function u(e){try{a(n.throw(e))}catch(e){l(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,u)}a((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.setupPlugin=void 0;const i=o(0),l=o(1),r=o(1),u=i.default.require("fs-extra");t.setupPlugin=function(){return n(this,void 0,void 0,(function*(){const e=(yield i.default.plugins.installationDir())+"/note.css";let t;function o(e){return n(this,void 0,void 0,(function*(){return`.CodeMirror {\n            font-size: ${e}px;\n        }`}))}function a(o){return n(this,void 0,void 0,(function*(){const l=yield function(e){return n(this,void 0,void 0,(function*(){t+=e,console.log("customFontSize: ",t),yield i.default.settings.setValue("customFontSize",t);return`.CodeMirror {\n            font-size: ${t}px;\n        }`}))}(o);yield u.writeFile(e,l,"utf8"),yield i.default.window.loadChromeCssFile(e);let r=(yield i.default.workspace.selectedNote()).body;yield i.default.commands.execute("textSelectAll"),yield i.default.commands.execute("replaceSelection",r)}))}yield i.default.settings.registerSection("ShortCuts",{label:"Font Size Shortcut",iconName:"fas fa-palette",description:"Increase Font Size: Cmd/Ctrl + Shift + ]\nDecrease Font Size: Cmd/Ctrl + Shift + ["}),yield i.default.settings.registerSettings({customFontSize:{label:"Custom Font Size",type:l.SettingItemType.Int,section:"ShortCuts",value:t,public:!0},sessionOnly:{label:"Use Font Size for this session only?",type:l.SettingItemType.Bool,section:"ShortCuts",value:!0,public:!0}}),console.log("-----just testing-----"),yield i.default.commands.register({name:"increaseFontSize",label:"Increase Editor Font Size",iconName:"fas fa-plus-circle",execute:()=>n(this,void 0,void 0,(function*(){a(1)}))}),yield i.default.commands.register({name:"decreaseFontSize",label:"Decrease Editor Font Size",iconName:"fas fa-minus-circle",execute:()=>n(this,void 0,void 0,(function*(){a(-1)}))}),yield i.default.settings.onChange(t=>n(this,void 0,void 0,(function*(){console.log(t.keys);const n=yield i.default.settings.value(t.keys[0]),l=yield o(n);yield u.writeFile(e,l,"utf8"),yield i.default.window.loadChromeCssFile(e),console.log("value change: ",n,l)})));let s=yield i.default.settings.value("sessionOnly"),c=yield i.default.settings.globalValue("style.editor.fontSize");if(yield i.default.workspace.onNoteChange(l=>n(this,void 0,void 0,(function*(){console.log("-----Note change event-----",l);const n=yield o(t);yield u.writeFile(e,n,"utf8"),yield i.default.window.loadChromeCssFile(e)}))),s){yield i.default.settings.setValue("customFontSize",c),t=c;let n=yield o(c);yield u.writeFile(e,n,"utf8"),yield i.default.window.loadChromeCssFile(e),console.log("-----testing this function-----",c,n)}else{t=yield i.default.settings.value("customFontSize");let n=yield o(t);yield u.writeFile(e,n,"utf8"),yield i.default.window.loadChromeCssFile(e),console.log("-----testing this function-----",c,n)}console.log("-----isSessionOnly-----",s),yield i.default.views.toolbarButtons.create("increaseFontSizeButton","increaseFontSize",r.ToolbarButtonLocation.EditorToolbar),yield i.default.views.toolbarButtons.create("decreaseFontSizeButton","decreaseFontSize",r.ToolbarButtonLocation.EditorToolbar),yield i.default.views.menuItems.create("myMenuItem1","increaseFontSize",r.MenuItemLocation.Tools,{accelerator:"CmdOrCtrl+Shift+]"}),yield i.default.views.menuItems.create("myMenuItem2","decreaseFontSize",r.MenuItemLocation.Tools,{accelerator:"CmdOrCtrl+Shift+["})}))}}]);