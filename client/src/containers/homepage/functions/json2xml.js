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

// function json2xml(o, tab) {
//    var toXml = function(v, name, ind) {
//       var xml = "";
//       if (v instanceof Array) {
//          for (var i=0, n=v.length; i<n; i++)
//             xml += ind + toXml(v[i], name, ind+"\t") + "\n";
//       }
//       else if (typeof(v) === "object") {
//          var hasChild = false;
//          xml += ind + "<" + name;
//          for (var m in v) {
//             if (m.charAt(0) === "@")
//                xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
//             else
//                hasChild = true;
//          }
//          xml += hasChild ? ">" : "/>";
//          if (hasChild) {
//             for (var k in v) {
//                if (k === "#text")
//                   xml += v[k];
//                else if (k === "#cdata")
//                   xml += "<![CDATA[" + v[k] + "]]>";
//                else if (k.charAt(0) !== "@")
//                   xml += toXml(v[k], k, ind+"\t");
//             }
//             xml += (xml.charAt(xml.length-1)==="\n"?ind:"") + "</" + name + ">";
//          }
//       }
//       else {
//          xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
//       }
//       return xml;
//    }, xml="";
//    for (var m in o)
//       xml += toXml(o[m], m, "");
//    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
// }

export default json2xml;