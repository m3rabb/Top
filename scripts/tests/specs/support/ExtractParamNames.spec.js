describe("ExtractParamNames", function () {
  it("Answers a list of the parameter names from a function", function () {
    // eslint-disable-next-line
    function tester($Dog, Cat, _Bird, Mouse_, names, __moreNames) {}
    var names = "$Dog Cat _Bird Mouse_ names __moreNames".split(" ")
    expect( Tranya.ExtractParamNames(tester) ).toEqual( names )
  })
})
