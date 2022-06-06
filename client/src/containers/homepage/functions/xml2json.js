// /*	This work is licensed under Creative Commons GNU LGPL License.

// 	License: http://creativecommons.org/licenses/LGPL/2.1/
//    Version: 0.9
// 	Author:  Stefan Goessner/2006
// 	Web:     http://goessner.net/ 
// */
// function xml2json(xml) {
//    const json = {};
//     for (const res of xml.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
//         const key = res[1] || res[3];
//         const value = res[2] && xml2json(res[2]);
//         json[key] = ((value && Object.keys(value).length) ? value : res[2]) || null;

//     }
//     return json;
//  }

// export default xml2json;