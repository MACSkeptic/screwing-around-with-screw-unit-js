Screw.Unit(function () {

  describe('matchers', function () { 

    describe('#hasOnlyNumbers', function () {
      describe('when there are only numbers', function () {
        it('should return true', function () {
          expect(macskeptic.matchers.hasOnlyNumbers('1234567890')).to(be_true);
        });
      });  
      describe('when there are numbers and other characters', function () {
        it('should return false', function () {
          expect(macskeptic.matchers.hasOnlyNumbers('1234 567890')).to(be_false);
          expect(macskeptic.matchers.hasOnlyNumbers('1234!')).to(be_false);
          expect(macskeptic.matchers.hasOnlyNumbers('1234a')).to(be_false);
          expect(macskeptic.matchers.hasOnlyNumbers('a1234')).to(be_false);
        });
      });  
      describe('when there are only other characters', function () {
        it('should return false', function () {
          expect(macskeptic.matchers.hasOnlyNumbers('! a')).to(be_false);
        });
      });  
      describe('when there is no content', function () {
        it('should return true', function () {
          expect(macskeptic.matchers.hasOnlyNumbers('')).to(be_true);
        });
      });  
    });

    describe('#hasOnlyLetters', function () {
      describe('when there are only letters', function () {
        it('should return true', function () {
          expect(macskeptic.matchers.hasOnlyLetters('qwertyuiopasdfghjklzxcvbnm')).to(be_true);
          expect(macskeptic.matchers.hasOnlyLetters('QWERTYUIOPASDFGHJKLZXCVBNM')).to(be_true);
        });
      });  
      describe('when there are letters and other characters', function () {
        it('should return false', function () {
          expect(macskeptic.matchers.hasOnlyLetters('a ')).to(be_false);
          expect(macskeptic.matchers.hasOnlyLetters('1a')).to(be_false);
          expect(macskeptic.matchers.hasOnlyLetters('a1')).to(be_false);
          expect(macskeptic.matchers.hasOnlyLetters('a!')).to(be_false);
        });
      });  
      describe('when there are only other characters', function () {
        it('should return false', function () {
          expect(macskeptic.matchers.hasOnlyLetters('! 1')).to(be_false);
        });
      });  
      describe('when there is no content', function () {
        it('should return true', function () {
          expect(macskeptic.matchers.hasOnlyLetters('')).to(be_true);
        });
      });  
    });

    describe('#hasOnlyLettersAndSpaces', function () {
      describe('when there are only letters', function () {
        it('should return true', function () {
          expect(macskeptic.matchers.hasOnlyLettersAndSpaces('qwertyuiopasdfghjklzxcvbnm')).to(be_true);
          expect(macskeptic.matchers.hasOnlyLettersAndSpaces('QWERTYUIOPASDFGHJKLZXCVBNM')).to(be_true);
        });
      });  
      describe('when there are only spaces', function () {
        it('should return true', function () {
          expect(macskeptic.matchers.hasOnlyLettersAndSpaces('  ')).to(be_true);
        });
      });  
      describe('when there are only letters and spaces', function () {
        it('should return true', function () {
          expect(macskeptic.matchers.hasOnlyLettersAndSpaces('qwe rtyuio pasdf ghjklzxcvbnm')).to(be_true);
          expect(macskeptic.matchers.hasOnlyLettersAndSpaces('QWERTYU IOPASD FGHJ KLZXCVBNM')).to(be_true);
        });
      });  
      describe('when there are letters, spaces and other characters', function () {
        it('should return false', function () {
          expect(macskeptic.matchers.hasOnlyLettersAndSpaces('1a')).to(be_false);
          expect(macskeptic.matchers.hasOnlyLettersAndSpaces('a1')).to(be_false);
          expect(macskeptic.matchers.hasOnlyLettersAndSpaces('a!')).to(be_false);
        });
      });  
      describe('when there are only other characters', function () {
        it('should return false', function () {
          expect(macskeptic.matchers.hasOnlyLettersAndSpaces('!1')).to(be_false);
        });
      });  
      describe('when there is no content', function () {
        it('should return true', function () {
          expect(macskeptic.matchers.hasOnlyLettersAndSpaces('')).to(be_true);
        });
      });  
    });

    describe('#lengthIsAtLeast', function () {
      describe('when there is no content', function () {
        it('should return false if a length > 0 is provided', function () {
          expect(macskeptic.matchers.lengthIsAtLeast('', 1)).to(be_false);
          expect(macskeptic.matchers.lengthIsAtLeast('', 9042)).to(be_false);
        });
        it('should return true if 0 or no length is provided', function () {
          expect(macskeptic.matchers.lengthIsAtLeast('', 0)).to(be_true);
          expect(macskeptic.matchers.lengthIsAtLeast('', null)).to(be_true);
          expect(macskeptic.matchers.lengthIsAtLeast('', undefined)).to(be_true);
          expect(macskeptic.matchers.lengthIsAtLeast('')).to(be_true);
        });
      });
    });

  });

});
