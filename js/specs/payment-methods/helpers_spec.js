Screw.Unit(function () {

  describe('helpers', function () {

    describe('#reduce', function () {
      it('should reduce an array', function () {
        expect(macskeptic.helpers.reduce([1,2,3,4], -5, function (sum, curr) { 
            return sum + curr; 
        })).to(equal, 5);
      });
      it('should reduce an object', function () {
        expect(macskeptic.helpers.reduce({o:1, tw:2, th:3, fo:4}, -5, function (sum, curr) { 
            return sum + curr; 
        })).to(equal, 5);
      });
    });

  });

});
