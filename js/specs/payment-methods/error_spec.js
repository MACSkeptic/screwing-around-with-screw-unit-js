Screw.Unit(function () {
  describe('error', function () {
    var doomMock = mock(macskeptic.doom);
    var idOfError = 'fortyTwo';
    var messageOfError = 'how much is 9 times 7 ?';
    var createdError = null;

    before(function () {
      macskeptic.error.customize.doom(doomMock);
      createdError = macskeptic.error.create(idOfError, messageOfError);
    });

    describe('when an error is created', function () {
      it('should know on which field the error has occcured', function () {
        expect(createdError.on).to(equal, idOfError);
      });

      it('should have the error message stored', function () {
        expect(createdError.message).to(equal, messageOfError);
      });
    });

    describe('when composing a description', function () {
      var labelContent = 'is this the question?';
      
      before(function () {
        doomMock.
          should_receive('textOfLabelForId').
          with_arguments(idOfError).
          and_return(labelContent);
      });

      it('should be based on the value of the content of the label and the message', function () {
        expect(createdError.description()).to(equal, labelContent + ' ' + messageOfError);
      });
    });
  });
});
