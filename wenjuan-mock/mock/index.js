const text = require("./test");
const question = require("./question");
const user = require("./user");
const stat = require("./stat");
const answer = require("./answer");
const mockList = [...text, ...question, ...user, ...stat, ...answer];
module.exports = mockList;
