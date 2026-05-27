const Mock = require("mockjs");

const Random = Mock.Random;

module.exports = [
  {
    // Get user info. Only return a user when a token is present.
    url: "/api/user/info",
    method: "get",
    response(ctx) {
      const authorization = ctx.headers.authorization || "";
      const token = authorization.replace("Bearer ", "").trim();

      if (!token) {
        return {
          errno: 100,
          msg: "未登录",
        };
      }

      return {
        errno: 0,
        data: {
          username: Random.title(),
          nickname: Random.cname(),
        },
      };
    },
  },
  {
    // Register
    url: "/api/user/register",
    method: "post",
    response() {
      return {
        errno: 0,
      };
    },
  },
  {
    // Login
    url: "/api/user/login",
    method: "post",
    response() {
      return {
        errno: 0,
        data: {
          token: Random.word(20),
        },
      };
    },
  },
];
