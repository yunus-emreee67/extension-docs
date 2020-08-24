!function(t){var e={};function o(s){if(e[s])return e[s].exports;var i=e[s]={i:s,l:!1,exports:{}};return t[s].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=t,o.c=e,o.d=function(t,e,s){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(o.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)o.d(s,i,function(e){return t[e]}.bind(null,i));return s},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0)}([function(t,e,o){"use strict";o.r(e);var s={el:"#app",name:"DocsIndex",data(){return _.merge({modalDraft:!1,categories:!1,posts:!1,config:{filter:this.$session.get("documents.filter",{order:"priority asc",limit:50})},pages:0,count:"",selected:[],categorySortable:!1},window.$data)},mixins:[o(1)],created(){this.setCategorySortable(),this.resource=this.$resource("admin/docs/api{/id}")},mounted(){const t=this;UIkit.util.on(".docs-category","moved",(function(e){t.setCategorySortable(),t.priorityCheck(t.categorySortable)})),this.$watch("config.page",this.load,{immediate:!0})},watch:{"config.filter":{handler(t){this.config.page?this.config.page=0:this.load(),this.$session.set("documents.filter",t)},deep:!0}},computed:{categoryOptions(){const t=_.map(this.categories,(t,e)=>({text:t.title,value:t.id}));return[{label:this.$trans("Filter by"),options:t}]},draftCategory:()=>({id:null,title:null,slug:null,status:3,roles:[]}),orderByCategories:function(){return this.categories}},methods:{load(){this.resource.query({filter:this.config.filter,page:this.config.page}).then(t=>{const{data:e}=t;this.$set(this,"posts",e.posts),this.$set(this,"pages",e.pages),this.$set(this,"count",e.count),this.$set(this,"selected",[])}).catch(t=>{this.$notify(t.bodyText,"danger")})},setCategorySortable(){this.categorySortable=document.getElementsByClassName("docs-category")[0].children},deleteCategory(t){this.$http.get("admin/docs/api/bulkcategorydelete",{params:{id:t}}).then(t=>{location.reload()}).catch(t=>{this.$notify(t.data,"danger")})},saveCategory(t,e=!1){this.$http.post("admin/docs/api/savecategory",{category:t,id:t.id}).then(o=>{t.id||location.reload(),e&&location.reload()}).catch(t=>{this.$notify(t.bodyText,"danger")})},priorityCheck(t){for(const e in t)if(t.hasOwnProperty(e)){const o=t[e].id;this.categories[o].priority=parseInt(e),this.saveCategory(this.categories[o])}},openModal(t){this.modalDraft=t,this.$refs.modal.open(),UIkit.util.on(this.$refs.modal.modal.$el,"hide",this.onClose)},close(){this.modalDraft=this.draftCategory,this.scrollToEnd(),this.$refs.modal.close()},scrollToEnd(){let t=this.$el.querySelector(".pk-pre");t&&t.scrollHeight&&(t.scrollTop=t.scrollHeight)},onClose(){this.modalDraft=this.draftCategory},status(t){const e=this.getSelected();e.forEach(e=>{e.status=t}),this.resource.save({id:"bulk"},{posts:e}).then((function(){this.load(),this.$notify("Posts saved.")}))},remove(){this.resource.delete({id:"bulk"},{ids:this.selected}).then((function(){this.load(),this.$notify("Posts deleted.")}))},getSelected(){return this.posts.filter((function(t){return-1!==this.selected.indexOf(t.id)}),this)}}};e.default=s,Vue.ready(s)},function(t,e){t.exports={data:()=>({postsSortable:!1}),created(){this.setPostsSortable()},mounted(){const t=this;UIkit.util.on(".list-post","moved",(function(e){t.setPostsSortable(),t.priorityCheckPosts(t.postsSortable)}))},methods:{setPostsSortable(){this.postsSortable=document.getElementsByClassName("list-post")[0].children},priorityCheckPosts(t){for(const e in t)if(t.hasOwnProperty(e)){const o=t[e].id;this.posts[o].priority=parseInt(e),this.savePosts(this.posts[o])}},savePosts(t,e=!1){this.$http.post("admin/docs/api/save",{data:t,id:t.id}).then(t=>{}).catch(t=>{this.$notify(t.bodyText,"danger")})}}}}]);