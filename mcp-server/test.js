 require("dotenv").config();
// const { execute } = require("./tools/searchTool.js");

// (async () => {
//   try {
//     const result = await execute({ query: "price of iphone 17 pro max" });
//     console.log(" Final Result:\n", result);
//   } catch (err) {
//     console.error(" Test Error:", err);
//   }
// })();


// require("dotenv").config();
// const { execute } = require("./tools/summarizeTool.js");

// (async () => {
//   const result = await execute({
//     query: "What is quantum computing",
//   });
//   console.log("\n Final Output:\n", result);
// })();


const { execute } = require("./tools/weatherTool");

(async () => {
  const result = await execute({ city: "Delhi" });
  console.log(result);
})();
