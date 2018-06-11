"use strict";var pData={general:{},parameters:[],paths:[],statuses:[],errors:[]},errors={general:[],parameters:[],paths:[],statuses:[],exceptions:[]},jsdata="",naming="lowerCamel",statuscodes={get:{success:"200|204|206",mandatory:["400","401","403","404","405","406","410","429","431","500","503"],optional:["408","414","416","426","451","501","502","504"]},post:{success:"200|201|202|204",mandatory:["400","401","403","404","405","406","410","411","413","415","429","431","500","503"],optional:["408","409","412","417","426","428","451","501","502","504"]},put:{success:"200|201|202|204",mandatory:["400","401","403","404","405","406","409","410","411","413","415","429","431","500","503"],optional:["408","412","417","426","428","451","501","502","504"]},delete:{success:"200|202|204",mandatory:["400","401","403","404","405","406","409","410","415","429","431","500","503"],optional:["408","412","414","417","426","451","501","502","504"]}},getProps=function(o,n){var h=[];return Object.keys(n).forEach(function(e,r){var t="object",a=[];if(o&&a.push(o),a.push(e),n[e].type&&(t=n[e].type),n[e].hasOwnProperty("items"))if(n[e].items.hasOwnProperty("$ref")){var s=n[e].items.$ref;getProps(a.join("."),jsdata.schemas[s].properties).forEach(function(e,r){a.push(e),h.push(e)})}else n[e].items.hasOwnProperty("type")&&h.push(a.join(".")+","+n[e].items.type);else if(n[e].hasOwnProperty("$ref")){s=n[e].$ref;getProps(a.join("."),jsdata.schemas[s].properties).forEach(function(e,r){a.push(e),h.push(e)})}else n[e].hasOwnProperty("type")?h.push(a.join(".")+","+n[e].type):h.push(a.join(".")+","+t)}),h},getCsvFileType=function(e){var r=2+(e.lastIndexOf("-")-1>>>0),t=1+(e.lastIndexOf(".")-1>>>0);return e.slice(r,t)},createErrorObj=function(e,r,t){var a={};return a.name=e,a.msg=t,a.level=r,a},createStatusObj=function(e,r,t){var a={};return a.path=e,a.method=r,a.statuses=t,a},checkBasePath=function(){var e=[],r="";e.push(pData.general.basePath),checkPathStructure("basePath",e),(pData.general.basePath.match(/v[0-9]/g)||[]).length||(r="basePath should have version string (v[0-9], e.g. v1)",errors.paths.push(createErrorObj(pData.general.basePath,"error",r)))},checkResources=function(e){e.forEach(function(e,r){var t=e.replace(/^[/]+|[/]$/,"").split("/"),a=t[t.length-1],s=t[t.length-2],o="";a.match(/^{.*}$/)&&"s"!=s[s.length-1]&&(o="collections ("+s+") must be plural",errors.paths.push(createErrorObj(e,"error",o))),a.match(/create|make|delete|update|get|del|remove/i)&&(o="resource must be a noun",errors.paths.push(createErrorObj(e,"error",o))),"lowerCamel"===naming?/^[A-Z_-]+|[_-]+/.test(a)&&(o="resource must be lowerCamel case",errors.paths.push(createErrorObj(e,"error",o))):"UpperCamel"===naming?a.match(/^[a-z_-]+|[_-]+/)&&(o="resource must be UpperCamel case",errors.paths.push(createErrorObj(e,"error",o))):"snake"===naming&&0==a.match(/[_]/)&&(o="resource must be in snake_case",errors.paths.push(createErrorObj(e,"warning",o)))})},checkPathStructure=function(s,e){e.forEach(function(e,r){var t="",a=e.replace(/\/|{|}/g,"");e.match(/\/\//)&&(t=s+" can not have double forward slash",errors.paths.push(createErrorObj(e,"error",t))),a!=encodeURIComponent(a)&&(t=s+" can not have reserved characters",errors.paths.push(createErrorObj(e,"error",t))),(e.match(/\//g)||[]).length||(t=s+" should have at least one forward slash",errors.paths.push(createErrorObj(e,"warning",t))),"/"!=e[0]&&(t=s+" should have leading forward slash",errors.paths.push(createErrorObj(e,"error",t))),"/"===e[e.length-1]&&(t=s+" should not have forward slash at end of path",errors.paths.push(createErrorObj(e,"warning",t)))})},checkStatusCodes=function(c){c.forEach(function(e,t){var r="",a="",s={},o=c[t].method.toLowerCase();"post"===o&&c[t].statuses.indexOf("201")<0&&(r="POST for <u>creating</u> resources should return HTTP status code of 201",r+=" (only show: "+c[t].statuses.join(",")+")",a=c[t].method.toUpperCase()+" "+c[t].path,s=createErrorObj(a,"warning",r),errors.statuses.push(s));var n=[];statuscodes[o].mandatory.forEach(function(e,r){c[t].statuses.indexOf(e)&&n.push(e)}),0<n.length&&(r="missing mandatory HTTP status codes: "+n.join(", "),a=c[t].method.toUpperCase()+" "+c[t].path,s=createErrorObj(a,"error",r),errors.statuses.push(s));var h=[];statuscodes[o].optional.forEach(function(e,r){c[t].statuses.indexOf(e)&&h.push(e)}),0<h.length&&(r="missing optional HTTP status codes (verify if codes are needed): "+h.join(", "),a=c[t].method.toUpperCase()+" "+c[t].path,s=createErrorObj(a,"warning",r),errors.statuses.push(s))})},getErrors=function(e){return errors[e]},getData=function(e){return pData[e]},clearData=function(){pData={general:{},parameters:[],paths:[],statuses:[],errors:[]},errors={general:[],parameters:[],paths:[],statuses:[],exceptions:[]},jsdata=""},loadCsv=function(e,r){var t=r.split("\n"),a=t[0].split(",");t.splice(1).forEach(function(e){e.split(",").forEach(function(e,r){console.log(a[r]+" = "+e)})})},loadJson=function(e){var s=JSON.parse(e);pData.general.basePath=s.basePath,pData.general.host=s.host,Object.keys(s.paths).forEach(function(a,e){pData.paths[e]=a,Object.keys(s.paths[a]).forEach(function(e,r){var t=[];Object.keys(s.paths[a][e].responses).forEach(function(e,r){t.push(e)}),pData.statuses.push(createStatusObj(a,e,t))}),getProps("",pData.paths[e]).forEach(function(e,r){})})};