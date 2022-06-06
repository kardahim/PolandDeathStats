/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/

function json2xml(obj) {
   var xml = '';
   for (var prop in obj) {
     xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
     if (obj[prop] instanceof Array) {
       for (var array in obj[prop]) {
         xml += "<" + prop + ">";
         xml += json2xml(new Object(obj[prop][array]));
         xml += "</" + prop + ">";
       }
     } else if (typeof obj[prop] == "object") {
       xml += json2xml(new Object(obj[prop]));
     } else {
       xml += obj[prop];
     }
     xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
   }
   var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
   return xml
 }
 
export default json2xml;