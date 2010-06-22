Screw.Unit(function () {
  describe('errors', function () {
    var errorMock = mock(macskeptic.error);

    before(function () {
      macskeptic.errors.customize.error(errorMock);
    });
  });
});
