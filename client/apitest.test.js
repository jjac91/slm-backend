const { apitest } = require("./apitest");

describe("geocode calls", function () {
    test("works", async function () {
        const resp =  await apitest()
          console.log(resp)
        expect(resp).toBeInstanceOf(Object)
      });
});

