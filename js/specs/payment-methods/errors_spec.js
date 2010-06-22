Screw.Unit(function () {
  describe('errors', function () {
    var errorStub = stub({}, 'create').and_return('error');
    var elementId = 'marvin';

    before(function () {
      macskeptic.errors.customize.error(errorStub);
      macskeptic.errors.clean();
    });
    
    describe('#on', function () {
      describe('when there is an error on the element', function () {
        before(function () {
          macskeptic.errors.add(elementId, 'i feel so depressed');
        });

        it('should list only one error', function () {
          expect(macskeptic.errors.on(elementId)).to(equal, ['error']);
        });
      });

      describe('when there are errors on the element', function () {
        before(function () {
          macskeptic.errors.add(elementId, 'i feel so depressed');
          macskeptic.errors.add(elementId, 'i feel even more depressed');
        });

        it('should list all the errors', function () {
          expect(macskeptic.errors.on(elementId)).to(equal, ['error', 'error']);
        });
      });

      describe('when there is no error on the element', function () {
        before(function () {
          macskeptic.errors.add(elementId + 'not', 'i feel so depressed');
          macskeptic.errors.add(elementId + 'me', 'i feel even more depressed');
        });

        it('should return an empty list', function () {
          expect(macskeptic.errors.on(elementId)).to(equal, []);
        });
      });
    });
  });
});
