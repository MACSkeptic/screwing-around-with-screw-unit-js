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

    describe('#[has|have]Occurred[On]', function () {
      describe('when there is an error on one element', function () {
        before(function () {
          macskeptic.errors.add(elementId, 'i feel so depressed');
        });

        it('should return true for the given element', function () {
          expect(macskeptic.errors.hasOccurred(elementId)).to(be_true);
        });

        it('should return true for other elements', function () {
          expect(macskeptic.errors.hasOccurredOn(elementId + 'not')).to(be_false);
          expect(macskeptic.errors.haveOccurredOn(elementId + 'on')).to(be_false);
          expect(macskeptic.errors.haveOccurred(elementId + 'me')).to(be_false);
        });

        it('should return true if no element is given', function () {
          expect(macskeptic.errors.hasOccurred()).to(be_true);
        });
      });
      describe('when there are no errors', function () {
        it('should return false if no element is given', function () {
          expect(macskeptic.errors.haveOccurred()).to(be_false);
        });

        it('should return true if any element is given', function () {
          expect(macskeptic.errors.haveOccurredOn(elementId)).to(be_false);
          expect(macskeptic.errors.haveOccurredOn('foo' + elementId)).to(be_false);
        });
      });
    });
  });
});
