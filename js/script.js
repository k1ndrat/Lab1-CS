// import * as fs from "fs";

// read file
let inputFile = document.querySelector(".input-file");
let out = document.querySelector(".output");
let filetext;
let listOfSymbols;
let count = 0;
// let fs = require("fs");/

function findUnique(str) {
   // str = str.toLowerCase();
   str = str.split("");
   str = new Set(str);
   str = [...str].join("");
   return str;
}

function keepLettersOnly(str) {
   return str.replace(/[^\u0400-\u04FF]/g, "");
}

function quantity(entropy, textlength) {
   return (entropy * textlength) / 8;
}

function downloadStringAsFile(str, filename) {
   const blob = new Blob([str], { type: "text/plain" });
   const url = URL.createObjectURL(blob);
   const link = document.createElement("a");
   link.href = url;
   link.setAttribute("download", filename);
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
   URL.revokeObjectURL(url);
}

let out1 = document.querySelector(".output-1 .value");
let name1 = document.querySelector(".output-1 .name");
let out2 = document.querySelector(".output-2 .value");
let out3 = document.querySelector(".output-3 .value");
let out4 = document.querySelector(".output-4 .value");
let out5 = document.querySelector(".output-5 .value");
let out6 = document.querySelector(".output-6 .value");
let out7 = document.querySelector(".output-7 .value");
let isBase64 = document.querySelector("#createBASE64");

inputFile.onchange = function (event) {
   let fileList = inputFile.files;
   console.log(fileList[0]);
   let reader = new FileReader();
   reader.onload = function () {
      filetext = reader.result;
      filetext = filetext.replace(/\r/g, "");
      listOfSymbols = findUnique(filetext);
      console.log(listOfSymbols);
      H = 0;
      listOfSymbols.split("").forEach((element) => {
         p = countString(filetext, element) / String(filetext).length;
         H += p * Math.log2(p);
      });
      H *= -1;
      out2.innerText = H;
      out3.innerText = quantity(H, filetext.length);
      out4.innerText = fileList[0].size;
      out5.innerText = fileList[0].size * 8;
      out6.innerText = filetext.length;

      const encoder = new TextEncoder();
      const bytes = encoder.encode(filetext);
      let textBase64 = encodeToBase64(bytes);
      // out7.innerText = textBase64;
      if (isBase64.checked) {
         const fileName = "Base64-" + fileList[0].name;
         downloadStringAsFile(textBase64, fileName);
      }
   };
   reader.readAsText(fileList[0]);
};

// calc out1
let input = document.querySelector(".main-input");

function countString(str, letter) {
   let count = 0;
   for (let i = 0; i <= str.length; i++) {
      // if (str[i].toLowerCase() == letter.toLowerCase()) {
      //    count += 1;
      // }
      if (str[i] == letter) {
         count += 1;
      }
   }
   return count;
}

input.addEventListener("input", (event) => {
   if (filetext) {
      out1.innerText = countString(filetext, input.value) / filetext.length;
      name1.innerText = "Probability: ";
   } else {
      if (input.value) {
         out1.innerText = "Please choose a file!";
      } else {
         out1.innerText = "";
      }
      name1.innerText = "";
   }
});

function encodeToBase64(bytes) {
   const alphabet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   let output = "";
   let b = 0; // variable to store the 6-bit data blocks

   for (let i = 0; i < bytes.length; i += 3) {
      // Multiply by 252, then shift by 2 bits to get the first 6-bit byte
      b = (bytes[i] & 0xfc) >> 2;
      output += alphabet[b]; // Encode the first 6-bit byte and add it to the output string

      // Shift the last two bits of the first byte to the beginning of the 6-bit block
      b = (bytes[i] & 0x03) << 4;

      if (i + 1 < bytes.length) {
         // Take the last four bits of the second byte, shift them by 4 bits, and add to the current 6-bit block
         b |= (bytes[i + 1] & 0xf0) >> 4;
         output += alphabet[b]; // Encode the block and add it to the output string

         // Shift the last four bits of the second byte to the beginning of the next 6-bit block
         b = (bytes[i + 1] & 0x0f) << 2;

         if (i + 2 < bytes.length) {
            // Take the last two bits of the third byte, shift them by 6 bits, and add to the current 6-bit block
            b |= (bytes[i + 2] & 0xc0) >> 6;
            output += alphabet[b]; // Encode the block and add it to the output string

            // Take the last 6 bits of the third byte and add them to the next 6-bit block
            b = bytes[i + 2] & 0x3f;
            output += alphabet[b];
         } else {
            // If there are only 2 bytes left at the end, not 3
            output += alphabet[b];
            output += "=";
         }
      } else {
         // If there is only 1 byte left at the end, not 3
         output += alphabet[b];
         output += "==";
      }
   }
   return output;
}
