Smoke = {
	print: function(v) {
		// use the jquery print plugin if it is available or fall back to toString();
		return (jQuery && jQuery.print) ? jQuery.print(v) : v.toString();
	},
	
	printArguments: function(args) {    
    var a = [];
    if (args === undefined) args = '';
    if ((args && args.callee) || (args instanceof Array)) {
      for(var i = 0; i < args.length; i++) {
        a.push(Smoke.print(args[i]));
      }      
    } else {
      // Workaround for jQuery.print returning "null" when called with an empty string.
      if (!args && (typeof args == 'string')) {
        a.push('');
      } else {
        a.push(Smoke.print(args));
      }
    }
		return '(' + a.join(', ') + ')';
	},
	
	argumentsToArray: function(args) {	  
    return Array.prototype.slice.call(args);
  },
  
  compare: function(a, b) {
    if (a === b) return true;
    if (typeof(a) != typeof(b)) return false;
    if (a instanceof Array) {
      if (b.length != a.length) return false;
      for (var i = 0; i < b.length; i++)
        if (!this.compare(a[i], b[i])) return false;
    } else if (a instanceof Object) {
      for (var key in a)
        if (!this.compare(a[key], b[key])) return false;
      for (var key in b)
        if (!this.compare(b[key], a[key])) return false;
    } else {
      return false;
    }
    return true;
	},
	
	compareArguments: function(a, b) {
	  return this.compare(Smoke.argumentsToArray(a), Smoke.argumentsToArray(b));
	}
};

// Overide these functions for custom pass/fail behaviours
Smoke.passed = function(mock){
	Smoke.passCount++;
};

Smoke.failed = function(mock, message){
	Smoke.failCount++;
	throw(message);
};

// Some helpers
Smoke.reset = function(){
	Smoke.mocks = Smoke.mocks || [];
	for(var i=0; i<Smoke.mocks.length; i++) { Smoke.mocks[i]._resetMocks(); }
	Smoke.mocks = [];
	Smoke.passCount = 0;
	Smoke.failCount = 0;
};
Smoke.reset();

Smoke.checkExpectations = function(){
	for(var i=0; i<Smoke.mocks.length; i++) { Smoke.mocks[i]._checkExpectations(); }
};

Smoke.Mock = function(originalObj) {
	var obj = originalObj || {} ;
	obj._expectations = {};
	obj._valuesBeforeMocking = {};

	obj.stub = function(attr){
		return new Smoke.Stub(this, attr);
	};
	
	obj.should_receive = function(attr){
		var expectation = new Smoke.Mock.Expectation(this, attr);
		this._expectations[attr] = (this._expectations[attr] || []).concat([expectation]);
		this._valuesBeforeMocking[attr] = this[attr];
		if(this._expectations[attr].length == 1) {
  		this[attr] = Smoke.Mock.Expectation.stub(this, attr);
		}
		return expectation;
	};

	obj.must_receive = function(attr) {
	  var expectation = obj.should_receive(attr);
	  expectation.at_least("once");
	  return expectation;
	};

	obj._checkExpectations = function(){
		for(var e in this._expectations) {
			var expectations = this._expectations[e];
			for(var i=0; i < expectations.length; i++) expectations[i].check();
		};
	};
	
	obj._resetMocks = function(){
		for(var attr in this._valuesBeforeMocking) {
			this[attr] = this._valuesBeforeMocking[attr];
    }
		
		delete this._valuesBeforeMocking;
		delete this._expectations;
		delete this._checkExpectations;
		delete this.stub;
		delete this.should_receive;
		delete this.must_receive;
		delete this._resetMocks;
	};

	Smoke.mocks.push(obj);
	return obj;
};

Smoke.MockFunction = function(original_function, name) {
  if (arguments.length < 2) {
    name = 'anonymous_function';
  }
  var mock = Smoke.Mock(function() {
    return arguments.callee[name].apply(this, arguments);
  });
  mock[name] = (original_function || new Function());
  mock.should_be_invoked = function() {
    return this.should_receive(name);
  };
  mock.must_be_invoked = function() {
    return this.should_receive(name).at_least("once");
  };
  return mock;
};

Smoke.Mock.Expectation = function(mock, attr) {
	this._mock = mock;
	this._attr = attr;
	this.callCount = 0;
	this.returnValue = undefined;
	this.callerArgs = undefined;
	this.hasReturnValue = false;
  this.minCount = undefined;
  this.maxCount = undefined;
  this.exactCount = undefined;
};

Smoke.Mock.Expectation.stub = function(mock, attr) {
  return function() {
    return function() {
      var matched, return_value, args = arguments;
      for (var i = 0; i < this.length; i++) {
        this[i].run(args) && (matched = true) && (return_value = this[i].returnValue);
    	  }
      if (!matched) {
        this[0].argumentMismatchError(args);
      }
      return return_value;
    }.apply(mock._expectations[attr], arguments);
  };
}; 


Smoke.Mock.Expectation.prototype = {
	exactly: function(count,type){
		// type isn't used for now, it's just syntax ;)
		this.exactCount = this.parseCount(count);
		return this;
	},
	at_most: function(count,type){
		this.maxCount = this.parseCount(count);
		return this;
	},
	at_least: function(count,type){
		this.minCount = this.parseCount(count);
		return this;
	},
	with_arguments: function(){
		this.callerArgs = arguments;
		return this;
	},
	run: function(args){
		if((this.callerArgs === undefined) || Smoke.compareArguments(args, this.callerArgs)) {
			return !!(this.callCount+=1);
		};
		return false;
	},
	and_return: function(v){
	  this.hasReturnValue = true;
		this.returnValue = v;
  },
	check: function(){
		(this.exactCount !== undefined) && this.checkExactCount();
		(this.minCount !== undefined) && this.checkMinCount();
		(this.maxCount !== undefined) && this.checkMaxCount();
	},
	checkExactCount: function(){
		if (this.exactCount === this.callCount) {
		  Smoke.passed(this);
		} else {
		  Smoke.failed(this, 'expected '+this.methodSignature()+' to be called exactly '+this.exactCount+" times but it got called "+this.callCount+' times');
		}
	},
	checkMinCount: function(){
		if (this.minCount <= this.callCount) {
		  Smoke.passed(this);
		} else {
		  Smoke.failed(this, 'expected '+this.methodSignature()+' to be called at least '+this.minCount+" times but it only got called "+this.callCount+' times');
		}
	},
	checkMaxCount: function(){
		if (this.maxCount >= this.callCount) {
		  Smoke.passed(this);
		} else {
		  Smoke.failed(this, 'expected '+this.methodSignature()+' to be called at most '+this.maxCount+" times but it actually got called "+this.callCount+' times');
		}
	},
	argumentMismatchError: function(args) {
	  Smoke.failed(this, 'expected ' + this._attr + ' with ' + Smoke.printArguments(this.callerArgs) + ' but received it with ' + Smoke.printArguments(args));
	},
	methodSignature: function(){
		return this._attr + Smoke.printArguments(this.callerArgs);
	},
	parseCount: function(c){
		switch(c){
			case 'once': 
				return 1;
			case 'twice':
				return 2;
			default:
        if (isNaN(Number(c))) {
          throw(new TypeError('Invalid Count:' + Smoke.print(c)));
        }
				return Number(c);
		}
	}
};

Smoke.Stub = function(obj,attr) {
	this.obj = obj;
	this.attribute = attr;
	this.and_return(this.defaultReturn);
};

Smoke.Stub.prototype = {
	defaultReturn: null, 
	property: function(p){
		this.property = p;
		this.and_set_to(this.defaultReturn);
		return this;
	},
	method: function(f){
		this.func = f;
		this.and_return(this.defaultReturn);
		return this;
	},
	and_return: function(v){
		this.obj[this.attribute] = function() {
			return v;
		};
		return this.obj;
	},
	and_set_to: function(v){
		this.obj[this.attribute] = v;
		return this.obj;
	}
};