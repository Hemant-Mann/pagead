!function(){function e(){n=window.jQuery.noConflict(!0),t()}function t(){"use strict"
"undefined"==typeof window.$&&"undefined"!=typeof n&&(window.$=n),function(e,t){function n(){this.domain="clicks99.com",this.adunit=null,this.dm=null}n.prototype={get:function(e){var n=this
t.ajax({url:"//"+n.domain+"/campaign/serve?xapi=c99ads&callback=?",type:"GET",async:!0,jsonpCallback:"jsonCallback",contentType:"application/json",dataType:"jsonp"}).done(function(t){e.call(n,null,t)}).fail(function(t){e.call(n,t,null)})},replace:function(e,n){var r=this
if(3==e.nodeType){var o=t(e).text()
o=o.replace(/\s/g,""),0!=o.length&&isNaN()&&(o.length<=11?e.nodeValue="":e.nodeValue=n)}else 1==e.nodeType&&t(e).contents().each(function(){r.replace(this,n)})}}
var r=function(e,t){function n(){this.regions=[]}return n.prototype={treeDepth:function(e){for(var t=e.children(),n=0;t.length>0;)t=t.children(),n+=1
return n},_nodeIdentifier:function(e){var n=""
if(n+=e.prop("tagName"),e.attr("id")&&(n+="#"+e.attr("id").replace(/[0-9]+/g,"")),e.attr("class")){var r=e.attr("class").split(/\s+/)
r.length<=3&&(r.sort(),t.each(r,function(e,t){t=t.replace(/[0-9]+/g,""),n+="."+t}))}return n},_combComparison:function(e){for(var n={},r={},o=this,a=0,i=e.length;i>a;++a){var c=t(e[a]),l=c.prop("tagName")
if("SCRIPT"!=l&&"NAV"!=l&&"A"!=l){var d=o._nodeIdentifier(c)
"undefined"==typeof n[d]&&(n[d]=0),n[d]++,r[d]=a}}var u=!1
for(var d in n)if(n[d]>2){u=!0
var s=r[d],p=t(e[s])
o.regions.push(p)}return u},mdr:function(e){var n=this
if(n.treeDepth(e)>=3){var r=e.children()
n._combComparison(r)
for(var o=0,a=r.length;a>o;++o){var i=t(r[o]),c=i.prop("tagName")
"SCRIPT"!=c&&"NAV"!=c&&"A"!=c&&n.mdr(i)}}}},new n}(e,t),o=e.vNativeObject||"vnative",a=new n
a.dm=r,e[o]=a}(window,n),$(document).ready(function(){for(var e=$("body"),t=e.children(),n=window.vNativeObject||"vnative",r=window[n],o=r.dm,a={},i=0,c=t.length;c>i;++i){var l=$(t[i]),d=l.prop("tagName")
if("DIV"==d||"SECTION"==d||"ARTICLE"==d){var u=o.treeDepth(l)
Array.isArray(a[u])||(a[u]=[]),a[u].push(l)}}var s=Object.keys(a)
s=s.map(function(e){return Number(e)}),s.sort(function(e,t){return e-t})
for(var p=function(e,t){var n,r,o=[]
for(n=t.pop();e[n]&&e[n].length>0;)o.push(e[n].pop())
for(r=t.pop();e[r]&&e[r].length>0;)o.push(e[r].pop())
return o}(a,s),i=0,c=p.length;c>i;++i)o.mdr(p[i])
var f=o.regions
console.log(f)
var h={}
$.each(f,function(e,t){var n=t.parent().children().length,r=t.prop("tagName")
"SCRIPT"!=r&&"NAV"!=r&&"A"!=r&&(h[n]=t)}),s=Object.keys(h),s=s.map(function(e){return Number(e)}),s.sort(function(e,t){return e-t})
for(var l,i=0,v=-1;i<s.length;){var c=h[s[i]].find("a").text().length
c>v&&(v=c,l=h[s[i]]),i++}console.log(l),r.get(function(e,t){var n,r
if(!e){var o=l.clone().insertAfter(l)
n=o.find("a"),"undefined"!=typeof n&&n.attr("href",t._url),r=o.find("img"),r&&r.attr("src",t._image),console.log(o),o.css({"border-color":"#C1E0FF","border-width":"10px","border-style":"solid"}),o[0].scrollIntoView(),this.replace(o[0],t._title)}})})}var n
if(void 0===window.jQuery||window.jQuery.fn.jquery){var r=document.createElement("script")
r.setAttribute("type","text/javascript"),r.setAttribute("src","//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"),r.readyState?r.onreadystatechange=function(){("complete"==this.readyState||"loaded"==this.readyState)&&e()}:r.onload=e,(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(r)}else n=window.jQuery,t()}()
