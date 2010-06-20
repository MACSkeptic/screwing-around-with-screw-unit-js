var Screw = (function($) {
  var screw = {
    Unit: function(fn) {
      var wrappedFn;
      if(fn.length == 0) {
        var contents = fn.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1];
        wrappedFn = new Function("matchers", "specifications",
        "with (specifications) { with (matchers) { " + contents + " } }"
        );
      } else {
        wrappedFn = function(matchers, specifications) {
          var screwContext = {};
          for(var method in matchers) {
            screwContext[method] = matchers[method];
          }
          for(var method in specifications) {
            screwContext[method] = specifications[method];
          }
          fn(screwContext);
        }
      }

      $(Screw).queue(function() {
        Screw.Specifications.context.push($('body > .describe'));
        wrappedFn.call(this, Screw.Matchers, Screw.Specifications);
        Screw.Specifications.context.pop();
        $(this).dequeue();
      });
    },

    Specifications: {
      context: [],

      describe: function(name, fn) {
        var describe = $('<li class="describe">')
          .append($('<h1 />').text(name))
          .append('<ol class="befores">')
          .append('<ul class="its">')
          .append('<ul class="describes">')
          .append('<ol class="afters">');

        this.context.push(describe);
        fn.call();
        this.context.pop();

        this.context[this.context.length-1]
          .children('.describes')
            .append(describe);
      },

      it: function(name, fn) {
        var it = $('<li class="it">')
          .append($('<h2 />').text(name))
          .data('screwunit.run', fn);

        this.context[this.context.length-1]
          .children('.its')
            .append(it);
      },

      before: function(fn) {
        var before = $('<li class="before"></li>')
          .data('screwunit.run', fn);

        this.context[this.context.length-1]
          .children('.befores')
            .append(before);
      },

      after: function(fn) {
        var after = $('<li class="after"></li>')
          .data('screwunit.run', fn);

        this.context[this.context.length-1]
          .children('.afters')
            .append(after);
      }
    }
  };

  $(screw).queue(function() { $(screw).trigger('loading') });
  $(window).load(function(){
    $('<div class="describe">')
      .append('<h3 class="status" />')
      .append('<ol class="befores">')
      .append('<ul class="describes">')
      .append('<ol class="afters">')
      .appendTo('body');
  
    $(screw).dequeue();
    $(screw).trigger('loaded');
  });
  
  return screw;
})(jQuery);

Screw.Matchers = (function($) {
  return matchers = {
    expect: function(actual) {
      var funcname = function(f) {
          var s = f.toString().match(/function (\w*)/)[1];
          if ((s == null) || (s.length == 0)) return "anonymous";
          return s;
      };

      var stacktrace = function() {
          var s = "";
          for(var a = arguments.caller; a != null; a = a.caller) {
              s += funcname(a.callee) + "\n";
              if (a.caller == a) break;
          }
          return s;
      };

      return {
        to: function(matcher, expected, not) {
          var matched = matcher.match(expected, actual);
          if (not ? matched : !matched) {
            throw(matcher.failure_message(expected, actual, not));
          }
        },

        to_not: function(matcher, expected) {
          this.to(matcher, expected, true);
        }
      }
    },

    equal: {
      match: function(expected, actual) {
        if(expected == actual) return true;
        if(actual == undefined) return false;

        if (expected instanceof Array) {
          for (var i = 0; i < actual.length; i++)
            if (!Screw.Matchers.equal.match(expected[i], actual[i])) return false;
          return actual.length == expected.length;
        } else if (expected instanceof Object) {
          for (var key in expected)
            if (!this.match(expected[key], actual[key])) return false;
          for (var key in actual)
            if (!this.match(actual[key], expected[key])) return false;
          return true;
        }
        return false;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not equal ' : ' to equal ') + $.print(expected);
      }
    },

    be_gt: {
      match: function(expected, actual) {
        return actual > expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be greater than ' + $.print(expected);
      }
    },

    be_gte: {
      match: function(expected, actual) {
        return actual >= expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be greater than or equal to ' + $.print(expected);
      }
    },

    be_lt: {
      match: function(expected, actual) {
        return actual < expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be less than ' + $.print(expected);
      }
    },

    be_lte: {
      match: function(expected, actual) {
        return actual <= expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be less than or equal to ' + $.print(expected);
      }
    },

    match: {
      match: function(expected, actual) {
        if (expected.constructor == RegExp)
          return expected.exec(actual.toString());
        else
          return actual.indexOf(expected) > -1;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not match ' : ' to match ') + $.print(expected);
      }
    },

    be_empty: {
      match: function(expected, actual) {
        if (actual.length == undefined) throw(actual.toString() + " does not respond to length");

        return actual.length == 0;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be empty' : ' to be empty');
      }
    },

    be_blank: {
      match: function(expected, actual) {
        if (actual == undefined) return true;
        if (typeof(actual) == "string") actual = actual.replace(/^\s*(.*?)\s*$/, "$1");
        return Screw.Matchers.be_empty.match(expected, actual);
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be blank' : ' to be blank');
      }
    },

    have_length: {
      match: function(expected, actual) {
        if (actual.length == undefined) throw(actual.toString() + " does not respond to length");

        return actual.length == expected;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not' : ' to') + ' have length ' + expected;
      }
    },

    be_null: {
      match: function(expected, actual) {
        return actual == null;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be null' : ' to be null');
      }
    },

    be_undefined: {
      match: function(expected, actual) {
        return actual == undefined;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be undefined' : ' to be undefined');
      }
    },

    be_true: {
      match: function(expected, actual) {
        return actual;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be true' : ' to be true');
      }
    },

    be_false: {
      match: function(expected, actual) {
        return !actual;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be false' : ' to be false');
      }
    },

    match_html: {
      munge: function(mungee) {
        if (mungee instanceof jQuery) {
          mungee = mungee.html();
        } else if (typeof(mungee) == "string") {
          var span = document.createElement("span");
          span.innerHTML = mungee;
          mungee = span.innerHTML;
        }

        var regEx = /\sjQuery\d+=['"]\d+['"]/g;
        mungee = mungee.replace(regEx, "");

        return mungee;
      },

      match: function(expected, actual) {
        var trimmedExpected = this.munge(expected);
        var trimmedActual = this.munge(actual);
        return trimmedActual.indexOf(trimmedExpected) > -1;
      },

      failure_message: function(expected, actual, not) {
        var trimmedExpected = this.munge(expected);
        var trimmedActual = this.munge(actual);
        return 'expected ' + $.print(trimmedActual, { max_string: 300 }) +
               (not ? ' to not contain ' : ' to contain ') + $.print(trimmedExpected, { max_string: 300 });
      }
    },

    match_selector: {
      match: function(expected, actual) {
        if (!(actual instanceof jQuery)) {
          throw expected.toString() + " must be an instance of jQuery to match against a selector"
        }

        return actual.is(expected);
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not match selector ' : ' to match selector ') + expected;
      }
    },

    contain_selector: {
      match: function(expected, actual) {
        if (!(actual instanceof jQuery)) {
          throw expected.toString() + " must be an instance of jQuery to match against a selector"
        }

        return actual.find(expected).length > 0;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not contain selector ' : ' to contain selector ') + expected;
      }
    }
  }
})(jQuery);

(function($) {
  $(Screw)
    .bind('loaded', function() {    
      $('.describe, .it')
        .click(function() {
          document.location = location.href.split('?')[0] + '?' + $(this).fn('selector');
          return false;
        })
        .focus(function() {
          return $(this).addClass('focused');
        })
        .bind('scroll', function() {
          document.body.scrollTop = $(this).offset().top;
        });

      $('.it')
        .bind('enqueued', function() {
          $(this).addClass('enqueued');
        })
        .bind('running', function() {
          $(this).addClass('running');
        })
        .bind('passed', function() {
          $(this).addClass('passed');
        })
        .bind('failed', function(e, reason) {
          $(this)
            .addClass('failed')
            .append($('<p class="error">').text(reason.toString()));

          var file = reason.fileName || reason.sourceURL;
          var line = reason.lineNumber || reason.line;          
          if (file || line) {
            $(this).append($('<p class="error"></p>').text('line ' + line + ', ' + file));
          }
        });
    })
    .bind('before', function() {
      Screw.suite_start_time = new Date();
      $('.status').text('Running...');
    })
    .bind('after', function() {
      $('body .status').fn('display');
    });
})(jQuery);

(function($) {
  $(Screw).bind('loaded', function() {
    $('.status').fn({
      display: function() {
        $(this).html(
          $('.passed').length + $('.failed').length + ' test(s), ' + $('.failed').length + ' failure(s)<br />' +
          ((new Date() - Screw.suite_start_time)/1000.0).toString() + " seconds elapsed"
        );
      }
    });

    $('.describe').fn({
      parent: function() {
        return $(this).parent('.describes').parent('.describe');
      },
      
      run_befores: function() {
        $(this).fn('parent').fn('run_befores');
        $(this).children('.befores').children('.before').fn('run');
      },
      
      run_afters: function() {
        $(this).children('.afters').children('.after').fn('run');
        $(this).fn('parent').fn('run_afters');
      },
      
      enqueue: function() {
        $(this).children('.its').children('.it').fn('enqueue');
        $(this).children('.describes').children('.describe').fn('enqueue');
      },
      
      selector: function() {
        return $(this).fn('parent').fn('selector')
          + ' > .describes > .describe:eq(' + $(this).parent('.describes').children('.describe').index(this) + ')';
      }
    });
  
    $('body > .describe').fn({
      selector: function() { return 'body > .describe'; }
    });
    
    $('.it').fn({
      parent: function() {
        return $(this).parent('.its').parent('.describe');
      },
      
      run: function() {
        try {
          try {
            $(this).fn('parent').fn('run_befores');
            $(this).data('screwunit.run')();
          } finally {
            $(this).fn('parent').fn('run_afters');
          }
          $(this).trigger('passed');
        } catch(e) {
          $(this).trigger('failed', [e]);
        }
      },
      
      enqueue: function() {
        var self = $(this).trigger('enqueued');
        $(Screw)
          .queue(function() {
            self.fn('run');
            setTimeout(function() { $(Screw).dequeue(); }, 0);
          });
      },
      
      selector: function() {
        return $(this).fn('parent').fn('selector')
          + ' > .its > .it:eq(' + $(this).parent('.its').children('.it').index(this) + ')';
      }
    });
    
    $('body .before').fn({
      run: function() { $(this).data('screwunit.run')(); }
    }); 
  
    $('body .after').fn({
      run: function() {
        $(this).data('screwunit.run')(); }
    });

    $(Screw).trigger('before');
    var to_run = unescape(location.search.slice(1)) || 'body > .describe > .describes > .describe';
    $(to_run)
      .focus()
      .eq(0).trigger('scroll').end()
      .fn('enqueue');
    $(Screw).queue(function() { $(Screw).trigger('after') });
  });
})(jQuery);
