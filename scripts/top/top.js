// ### JS Hint global pragmas

/* global
  jasmine:false
*/
/* jshint
  maxerr:66, bitwise:true, curly:true, eqeqeq:true, forin:false,
  plusplus:false, noarg:true, nonew:true, latedef:true, regexp:true,
  noempty:false, lastsemic:true, immed:true, expr:true, eqnull:true,
  browser:true, jquery:true, devel:true, globalstrict:true,
  smarttabs:true, trailing:false, newcap:false, undef:true, unused:false,
  futurehostile:true
*/
// validthis:true

(function (global) {
  "use strict";

  function factory(require) {
    var RootOf           = Object.getPrototypeOf;
    var SpawnFrom        = Object.create;
    var IsArray          = Array.isArray;
    var Array_join       = Array.prototype.join;
    var Math_floor       = Math.floor;
    var Math_random      = Math.random;
    var DefineProperty   = Object.defineProperty;
    var PropertiesOf     = Object.keys;
    var BeImmutable      = Object.freeze;
    var Object_prototype = Object.prototype;
    var IsLocalProperty  = Object.hasOwnProperty;

    // var ParenthesesMatcher   = /\(|\)/;
    // var SelectorMatcher      = /[\w\$_!&]+/gi;
    var VowelMatcher         = /^[aeiou]/i;
    var ValidSelectorMatcher = /_*[a-z][\w$]*/;

    var _Base_root               = SpawnFrom(null);
    var   Stash_root             = SpawnFrom(_Base_root);
    var   _Top_root              = SpawnFrom(_Base_root);
    var     _Peel_root           = SpawnFrom(_Top_root);
    var     _Inner_root          = SpawnFrom(_Top_root);
    var       _Super_root        = SpawnFrom(_Inner_root);
    var       _Pulp_root         = SpawnFrom(_Inner_root);
    var         Primordial_root  = SpawnFrom(_Pulp_root);
    var           Nothing_root   = SpawnFrom(Primordial_root);
    var           Thing_root     = SpawnFrom(Primordial_root);
    var             Type_root    = SpawnFrom(Thing_root);

    // var _Default  ----> deal with super called whne there is noe

    // Implementation/Base/Default

    var Primordial, Nothing, Thing, Type, Context, Void;
    var HiddenConfiguration, LockedConfiguration, LockedHiddenConfiguration;
    var ConnectSubtype_ToSupertype;


    var HandleErrorsQuietly                = false;
    var IsProtectingAgainstObjectIntrusion = true;

    function _HandleErrorsQuietly(bool_) {
      return (arguments.length) ?
        (HandleErrorsQuietly = bool_) : HandleErrorsQuietly;
    }

    function _SignalError(target, message) {
      var error;

      if (HandleErrorsQuietly) {
        console.warn(message);
      } else {
        console.error(message);
        error = new Error(message);
        error.name = "TopError";
        error.target = target;
        throw error;
      }
      return null;
    }

    function _ConstructorError(constructor) {
      _SignalError(constructor.name,
        " is only for use with 'instanceof', it's not meant to be executed!");
    }

    function _Top ()        { _ConstructorError(_Top); }
    function _Inner ()      { _ConstructorError(_Inner); }
    function _Pulp ()       { _ConstructorError(_Pulp); }
    function _Peel ()       { _ConstructorError(_Peel); }
    function _Primordial () { _ConstructorError(_Primordial); }
    function _Thing ()      { _ConstructorError(_Thing); }

    _Top.prototype        = _Top_root;
    _Inner.prototype      = _Inner_root;
    _Pulp.prototype       = _Pulp_root;
    _Peel.prototype       = _Peel_root;
    _Primordial.prototype = Primordial_root;
    _Thing.prototype      = Thing_root;



    // #### Random Number Generation
    var RANDOM_MAX = 0xFFFFFFFFFFFF;
    var ZERO_PADDING = "0000000000000000";
    var MAX_UNIQUE_ID_LENGTH =
      (+new Date("2067-01-01") * RANDOM_MAX).toString(36).length;

    function RandomInt(max_min, max_) {
      var min, max;
      if (arguments.length <= 1) {
          min = 0, max = max_min;
      } else {
          min = max_min, max = max_;
      }
      return Math_floor(Math_random() * (max - min + 1)) + min;
    }

    function NewUniqueId(prefix_, seedDate__, seedValue__) {
      var prefix, seedDate, seedValue, id, zeros;
      prefix = prefix_ || "";
      seedDate = seedDate__ || Date.now();
      seedValue = seedValue__ || RandomInt(RANDOM_MAX);
      id = seedDate * seedValue;
      id = id.toString(36);
      zeros = ZERO_PADDING.slice(0, MAX_UNIQUE_ID_LENGTH - id.length);
      return prefix + zeros + id;
    }


    var KNIFE   = NewUniqueId("KNIFE");
    var SYRINGE = NewUniqueId("SYRINGE");


    function NewStash(spec_) {
      var stash, selectors, index, selector, value;

      stash = SpawnFrom(Stash_root);
      if (spec_) {
        if (IsProtectingAgainstObjectIntrusion && spec_ instanceof Object) {
          selectors = PropertiesOf(spec_);
          index = selectors.length;
          while (index--) {
            selector = selectors[index];
            value    = spec_[selector];
            if (value !== Object_prototype[selector] ||
                IsLocalProperty.call(spec_, selector)) {
              stash[selector] = spec_[selector];
            }
          }
        } else {
          for (selector in spec_) {
            stash[selector] = spec_[selector];
          }
        }
      }
      return stash;
    }


    function IsUpperCase(string) {
      return string.match(/^[A-Z]/);
    }

    function IsLowerCase(target) {
      return string.match(/^[a-z]/);
    }

    // function IsUpperCase(target) {
    //   return target.match && target.match(/^[A-Z]/);
    // }
    //
    // function IsLowerCase(target) {
    //   return target.match && target.match(/^[a-z]/);
    // }


    function IsValidMethodSelector(selector) {
      return ValidSelectorMatcher.test(selector);
    }

    // function IsAutoGeneratedSelector(selector) {
    //   return selector.indexOf("$") >= 0;
    // }
    //
    // function IsntAutoGeneratedSelector(selector) {
    //   return selector.indexOf("$") < 0;
    // }

    function IsPrivateSelector(selector) {
      return selector[0] === "_";
    }

    function IsPublicSelector(selector) {
      return selector[0] !== "_";
    }


    HiddenConfiguration = NewStash({
      writable: true,
      enumerable: false,
      configurable: false,
    });

    LockedConfiguration = NewStash({
      writable: false,
      enumerable: true,
      configurable: false,
    });

    LockedHiddenConfiguration = NewStash();


    function SetImmutableProperty(target, name, value, isHidden_) {
      var configurationRoot = isHidden_ ?
        LockedHiddenConfiguration : LockedConfiguration;
      var configuration = SpawnFrom(configurationRoot);
      configuration.value = value;
      DefineProperty(target, name, configuration);
      return target;
    }




    // function AsMemoizing(FactoryFunc) {
    //   var Repo = NewStash();
    //   return function (id) {
    //     return Repo[id] || (Repo[id] = FactoryFunc.apply(null, arguments));
    //   };
    // }

    // var SelectorMethodFor = AsMemoizing(function NewSelectorMethod(Name) {
    //   return function Selector() { return Name; };
    // });


    function NewUnimplementedHandler(Selector) {
      return function __Unimplemented(/* arguments */) {
        return this._NoSuchMethod(Selector, arguments);
      };
    }

    function NewSuperHandler(Selector) {
      return function __Super(/* arguments */) {
        var pulp, pulpMethod, target, superMethod;

        pulp = this.__$pulp;
        pulpMethod = pulp[Selector];
        target = pulp;

        do {
          target = target.__$root;
          superMethod = target[Selector];
        } while (superMethod === pulpMethod);

        return superMethod ?
          superMethod.apply(pulp, arguments) :
          pulp._NoSuchMethod(Selector, arguments);
      };
    }


    function NewDelegationHandler(Selector) {
      return function __Delegation(/* arguments */) {
        var target = this.__Pulp(KNIFE);
        var result = target[Selector].apply(target, arguments);
        return (result instanceof _Inner) ? result.__$peel : result;
      };
    }

    function ImproperPrivateAccessError() {
      return _SignalError(
        this, "Private method can only be called from within a pulp object!");
    }

    // function NewImproperPrivateAccessMethod(Selector) {
    //   return function improperPrivateAccessError() {
    //     return SignalError(
    //       this, "Private method #" + Selector +
    //         " can only be called from within a method!");
    //     };
    //   }
    // }

    function NewPulpAccessor(Target) {
      return SetImmutableProperty(
        function __Pulp(key, newTarget_) {
          if (key === KNIFE)   { return Target; }
          if (key === SYRINGE) { return (Target = newTarget_); }
          return this.privateAccessError();
        },
        "selector", "__Pulp", true);
    }


    function AddLazyProperty(root, installer) {
      var configuration = NewStash({
        writable: true,
        enumerable: false,
        configurable: true,
        get: installer
      });
      DefineProperty(root, installer.name, configuration);
    }


    AddLazyProperty(_Pulp_root, function __$peel() {
      var peel, _super;
      peel = SpawnFrom(_Peel_root);
      peel.__Pulp = NewPulpAccessor(this);
      peel.__$oid = this.__$oid;

      DefineProperty(this, "__$peel", HiddenConfiguration);
      this.__$peel = peel;
      this.__peel  = peel;

      _super = this._super;
      if (_super) {
        DefineProperty(_super, "__$peel", HiddenConfiguration);
        _super.__$peel = peel;
      }
      return BeImmutable(peel);
    });

    AddLazyProperty(_Super_root, function __$peel() {
      return this.__$pulp.__$peel;
    });

    AddLazyProperty(_Pulp_root, function _super() {
      // jshint shadow:true
      var _super, peel;
      _super = SpawnFrom(_Super_root);
      _super.__$pulp = this;

      DefineProperty(this, "_super", HiddenConfiguration);
      this._super = _super;

      peel = this.__peel;
      if (peel) {
        DefineProperty(_super, "__$peel", HiddenConfiguration);
        _super.__$peel = peel;
      }
      return _super;
    });

    AddLazyProperty(_Pulp_root, function __$oid() {
      DefineProperty(this, "__$oid", HiddenConfiguration);
      return (this.__$oid = NewUniqueId(this.TypeName()));
    });



    function _SetMethod_(root, name, method, isHidden_) {
      SetImmutableProperty(method, "selector", name, isHidden_);
      root[name] = method;
    }

    function EnsureDefaultMethodsFor(selector) {
      if (_Pulp_root[selector]) { return; }
      _SetMethod_(_Pulp_root , selector, NewUnimplementedHandler(selector), true);
      _SetMethod_(_Super_root, selector, NewSuperHandler(selector), true);
      var handler = IsPublicSelector(selector) ?
        NewDelegationHandler(selector) : ImproperPrivateAccessError;
      _SetMethod_(_Peel_root, selector, handler, true);
    }

    function SetMethod(root, method_name, method_) {
      var selector, method;
      if (typeof method_name === "string") {
        selector = method_name;
        method = method_;
      } else {
        selector = method_name.name;
        method = method_;
      }
      EnsureDefaultMethodsFor(selector);
      _SetMethod_(root, selector, method);
      return method;
    }

    // function Within_At_PutMethod(root, selector, method) {
    //   EnsureDefaultMethodsFor(selector);
    //   root[selector] = method;
    // }

    function AddMethod(root, method_name, method_) {
      var pulpMethod = SetMethod(root, method_name, method_);
			var selector$ = pulpMethod.selector + "$";

      // SetMethod As$Method_Named(pulpMethod, selector$); Handle this !!!
    }

    // function Within_At_Install(root, selector, pulpMethod) {
    //   if (IsValidMethodSelector(selector) &&
    //       IsntAutoGeneratedSelector(selector)) {
    //         return  Within_At_Install_(root, selector, pulpMethod);
    //   }
    //   return _SignalError("Selector must be lowecase and not end with $!");
    // }


    _SetMethod_(_Super_root, function __Pulp(key) { return this.__$pulp });

    _SetMethod_(_Pulp_root, function __Pulp(key) { return this; });


    AddMethod(_Peel_root, function IsIdentical(that) {
      return that instanceof _Pulp ? (this === that.__peel) : (this === that);
    });


    AddMethod(Primordial_root, function IsIdentical(that) {
      // return that.__Pulp ? (this.__peel === that) : (this === that);
      return that instanceof _Peel ? (this.__peel === that) : (this === that);
    });

    AddMethod(Primordial_root, function IsEqual(that) {
      return this.IsIdentical(that);
    });

    AddMethod(Primordial_root, function Type(key) { return this.__$type; });

    AddMethod(Primordial_root, function _NoSuchMethod(selector, args) {
      return _SignalError(this, "Receiver has no such method #"+ selector +"!");
    });


    AddMethod(Thing_root, function At_PutMethod(selector, method) {
      if (this.IsLocked()) { return this.LockedObjectError(); }
      AddMethod(this, selector, method);
      return this;
    });

    // function CreatePureGetter(Value) {
    //   return function () { return Value; };
    // }


    // Minimum metahierarchy methods

    Thing_root.At_PutMethod("AddMethod", function AddMethod(/* arguments */) {
      var index = -1;
      var count = arguments.length;
      var method;

      while (++index < count) {
        method = arguments[index];
        this.At_PutMethod(method.name, method);
      }
      return this;
    });

    Thing_root.AddMethod(function AddAlias(alias, original) {
      return this.At_PutMethod(alias, this[original]);
    });

    Thing_root.AddMethod(function _Init(name_) {
      // this._super._Init(arguments);
      if (name_ !== undefined) { this._name = name_; }
      return this;
    });

    Thing_root.AddMethod(function Extend(extensionAction) {
      var receiver, peel, pulp;
      if (extensionAction == null) { return this; }
      if (extensionAction.length) {
        peel = this.__$peel;
        if (this.__$isLocked) {
          receiver = peel;
          pulp = null;
        } else {
          receiver = pulp = this;
        }
        extensionAction.call(receiver, peel, pulp);
      } else {
        receiver = this.__$isLocked ? this.__$peel : this;
        extensionAction.call(receiver);
      }
      return this;
    });

    // function NewFauxConstructor(instanceRoot) {
    //   var constructor function () {
    //     _SignalError(this, "This function exists only for use with instanceof!");
    //   };
    //   constructor.prototype = instanceRoot;
    //   return constructor;
    // }

    Type_root.AddMethod(function _Init(name, supertype, instanceRoot) {
      this._super._Init(name);
      this._subtypes = NewStash();
      ConnectSubtype_ToSupertype(this, supertype);
      this._instanceRoot = instanceRoot;
      SetImmutableProperty(instanceRoot, "__$type", this        , true);
      SetImmutableProperty(instanceRoot, "__$root", instanceRoot, true);
      // SetHiddenImmutableProperty(
      //   instanceRoot, "__$rootConstructor", NewFauxConstructor(instanceRoot));

      // instanceRoot.At_PutMethod("Type", CreatePureGetter(this));
    });

    Type_root.AddMethod(function New(/* arguments */) {
      var instanceRoot = this._instanceRoot;
      var instance = SpawnFrom(instanceRoot);
      instanceRoot._Init.apply(instance, arguments);
      return instanceRoot;
    });

    Type_root.AddMethod(function AddInstanceMethod(namedFunction) {
      if (this.IsLocked()) { return this.LockedObjectError(); }
      this._instanceRoot.AddMethod(namedFunction);
      return this;
    });

    Type_root.AddAlias("AddIMethod", "AddInstanceMethod");

    Type_root.AddMethod(function AddInstanceAlias(alias, original) {
      if (this.IsLocked()) { return this.LockedObjectError(); }
      this._instanceRoot.AddAlias(alias, original);
      return this;
    });

    Type_root.AddAlias("AddIAlias", "AddInstanceAlias");


    (function Bootstrap_Core_Types() {
      ConnectSubtype_ToSupertype = function (_subtype, supertype) {
        _subtype._supertype = supertype;
      };

      Type_root._instanceRoot = Type_root;

      Primordial = Type_root.New("Primordial", null, Primordial_root);

      ConnectSubtype_ToSupertype = function (_subtype, supertype) {
        var _supertype = supertype.__Pulp(KNIFE);
        _subtype._supertype = supertype;
        _supertype._subtypes[_subtype.__$oid] = _subtype;
      };

      Nothing = Type_root.New("Nothing", Primordial, Nothing_root);
      Thing   = Type_root.New("Thing"  , Primordial, Thing_root);
      Type    = Type_root.New("Type"   , Thing     , Type_root );

      delete Type_root._instanceRoot;
    })();


    Void = Nothing.New("VOID");


    Primordial.AddMethod(function New() {
      return _SignalError(Primordial, "Abstract type cannot create instances!");
    });

    Nothing.AddMethod(function New() { return Void;});

    Type.AddMethod(function New(name, supertype_extend_, extend_) {
      var supertype, extensionAction, instanceRoot, type;

      if (IsLowerCase(name)) {
        return this.signalError("Type must have an uppercase name!");
      }
      if (typeof supertype_extend_ === "object") {
        supertype = supertype_extend_;
        extensionAction = extend_;
      } else {
        supertype = Thing;
        extensionAction = supertype_extend_;
      }

      instanceRoot = SpawnFrom(supertype._instanceRoot);
      type = this._super.New(name, supertype, instanceRoot);
      return type.Extend(extensionAction);
    });




    Thing.Extend(function () {
      this.AddIMethod(function IsLocked() { return this.__$isLocked || false; });

      this.AddIMethod(function Lock()     { this.__$isLocked = true; return this; });

      this.AddIMethod(function Yourself() { return this; });

      this.AddIMethod(function Name()     { return this._name; });

      this.AddIMethod(function TypeName() { return this.__$type._name; });

      this.AddIMethod(function Id()       { return this.__$id; });

      this.AddIMethod(function ToString() {
        var name = this.Name() || "";
        var typeName = this.TypeName();
        var prefix = typeName.match(VowelMatcher) ? "an " : "a ";
        return name !== undefined ?
          typeName + ":" + name : prefix + typeName;
      });

      this.AddIMethod(function Print() {
        return this.ToString();
      });

      this.AddIMethod(function SignalError(/* arguments */) {
        var message = Array_join(arguments, "");
        _SignalError(this, message);
        return this;
      });

      this.AddIMethod(function _NoSuchMethod(selector, args) {
        var message = this.Print() + " has no such method #" + selector + "!";
        return this.SignalError(message);
      });

      this.AddIMethod(function LockProperty(name) {
        DefineProperty(this, name, LockedConfiguration); /// !!!
        return this;
      });

      this.AddIMethod(function LockedObjectError() {
        return this.SignalError("Attempt to modify locked object!");
      });

      this.AddIMethod(function IsSame(that) {
        return this.Id() === that.Id();
      });

      this.AddIMethod(function KnownProperties(names_) {
        return arguments.length ?
          (this._knownProperties = names_.slice().sort(), this) :
          (this._knownProperties || []);
      });

      this.AddIMethod(function KnowProperty(name) {
        var names = this._knownProperties || (this._knownProperties = []);
        var index = names.length;
        while (index--) {
          if (names[index] === name) { return this; }
        }
        names.push(name);
        names.sort();
        return this;
      });

      this.AddIMethod(function UnknowProperty(name) {
        var names, index;
        if ((names = this._knownProperties)) {
          index = names.length;
          while (index--) {
            if (names[index] === name) {
              names.splice(index, 1);
              break;
            }
          }
        }
        return this;
      });

      this.AddIMethod(function ShallowCopy() {
        var copy, names, index, name;
        copy = this.Type().New();
        names = this._knownProperties;
        index = names.length;
        if (names) {
          while (index--) {
            name = names[index];
            copy[name] = this[name];
          }
        }
        return copy;
      });

      this.AddIMethod(function Copy() {
        return this.ShallowCopy();
      });

    });


    Type.Extend(function () {
      this.AddIMethod(function NewSubtype(name, extend_) {
        return Type.New(name, this, extend_);
      });

      this.AddIMethod(function Supertype() {
        return this._supertype;
      });

      this.AddIMethod(function Subtypes() {
        var subtypes, index, list, oid;

        subtypes = this._subtypes;
        index = 0;
        list = [];

        for (oid in subtypes) {
          list[index++] = subtypes[oid];
        }
        return list.sort();
      });

      this.AddIMethod(function AddSharedConstant(name, value) {
        var root = this._instanceRoot;
        if (root[name]) {
          return this.SignalError("Cannot overwrite shared constant: ", name, " !");
        }
        SetImmutableProperty(root, name, value);
        return this;
      });

      this.AddIMethod(function InstanceMethodAt(selector) {
        return this._instanceRoot[selector];
      });

      this.AddIAlias("IMethodAt", "InstanceMethodAt");


      this.AddIMethod(function KnownInstanceProperties(names_) {
        return (arguments.length) ?
          this._instanceRoot.KnownProperties(names_) :
          this._instanceRoot.KnownProperties();
      });

      this.AddIAlias("KnownIProperties", "KnownInstanceProperties");

      this.AddIMethod(function ShouldNotImplementError() {
        return this.signalError("Method should not be implemented!");
      });

      this.AddIMethod(function NotYetImplementedError() {
        return this.signalError("Method not yet implemented!");
      });

      this.AddIMethod(function NotYetTestedError() {
        return this.signalError("Method not yet tested!");
      });

      this.AddIMethod(function SubtypeResponsibilityError() {
        return this.signalError("Method should be implemented by this or subtype!");
      });
    });


    function As$Name(name) {
      return (name[0] === "$") ? name : "$" + name;
    }

    Context = Type.New("Context", function () {
      this.AddIMethod(function New(name, supercontext_) {
        if (IsLowerCase(name)) {
          return this.SignalError("Context must have an uppercase name!");
        }
        var supercontext = supercontext_ || null;
        if (supercontext && supercontext[As$Name(name)]) {
          return this.SignalError("Super context already contains name!");
        }
        var root = (supercontext === global) ? null : supercontext;
        var instance = SpawnFrom(root || this._instanceRoot);
        return instance._Init(name, supercontext, root);
      });

      this.AddIMethod(function _Init(name, supercontext, supercontext_) {
        this._super._Init(name);
        this._subcontexts = [];
        this._supercontext = supercontext;
        this.AddProperty(name, this);
        if (supercontext_) {
          var subcontexts = supercontext_._subcontexts;
          subcontexts.push(this);
          subcontexts.sort();
        }
      });

      this.AddIMethod(function Supercontext() { return this._supercontext; });

      this.AddIMethod(function Subcontexts() {
        return this._subcontexts.slice();
      });

      this.AddIMethod(function Lock() {
        if (this.IsLocked()) { return this; }
        return this.PropertiesDo(this.LockProperty);
        // return this._super.Lock();
      });

      this.AddIMethod(function PropertiesDo(action) {
        var name, names, index;
        names = PropertiesOf(this);
        index = names.length;
        while (index--) {
          name = names[index];
          if (name[0] === "$") {
            action.call(this, name, this[name]);
          }
        }
        return this;
      });

      this.AddIMethod(function AddProperty(name, value) {
        var $name = As$Name(name);
        if (IsLowerCase) {
          return this.SignalError("Property name ", name, " must be uppercase!");
        }
        if (this.IsLocked()) {
          if (this[$name]) {
            return this.SignalError("Cannot overwrite locked property: ", $name, " !");
          }
          return SetImmutableProperty(this, $name, value);
        }
        this[$name] = value;
        return this;
      });

      this.AddIMethod(function Add(/* arguments */) {
        var index, count, namedObject;
        index = -1;
        count = arguments.length;
        while (++index < count) {
          namedObject = arguments[index];
          this.AddProperty(namedObject.Name(), namedObject);
        }
        return this;
      });

      this.AddIMethod(function SetType(name, supertype_extend_, extend_) {
        var supertype, extensionAction, type;

        switch (typeof supertype_extend_) {
          case "string" :
            supertype = this[As$Name(supertype_extend_)];
            extensionAction = extend_;
            if (supertype == null) {
              this.SignalError("Can't find supertype: ", supertype_extend_, "!");
              return null;
            }
            break;
          case "object" :
            supertype = supertype_extend_;
            extensionAction = extend_;
            break;
          case "function" :
            extensionAction = supertype_extend_;
            break;
        }

        if ((type = this[As$Name(name)])) {
          if (supertype && supertype !== type._supertype) {
            this.SignalError("Type ", name, " exists with different supertype!");
            return null;
          }
        } else {
          type = Type.New(name, supertype);
          this.Add(type);
        }
        return type.Extend(extensionAction);
      });

      this.AddIMethod(function SetSubcontext(name, extend_) {
        return Context.New(name, this).Extend(extend_);
      });
    });

    return Context.New("Top", function () {
      this.Add(Thing, Nothing, Type, Context);
      this.AddMethod(NewStash, RootOf, SpawnFrom);
      this.AddMethod(IsArray, IsUpperCase);

      this.AddMethod(function IsPeel(target) {
        return target instanceof _Peel;
      });

      this.AddMethod(function IsPulp(target) {
        return target instanceof _Pulp;
      });
    });
  }

  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory);
  } else {
      // Browser globals
      global.Top = factory(global);
  }
})(this);



  // function ExecuteOn(method, receiver, arg1, arg2, arg3, allArgs) {
  //   switch (allArgs.length) {
  //     case 0 : return method.call(receiver);
  //     case 1 : return method.call(receiver, arg1);
  //     case 2 : return method.call(receiver, arg1, arg2);
  //     case 3 : return method.call(receiver, arg1, arg2, arg3);
  //   }
  //   var remainingArgs = Array_slice.call(allArgs, 1);
  //   return method.apply(receiver, remainingArgs);
  // }


  // Thing_root.addMethod(function perform(selector, arg_, arg__, arg___) {
  //   return ExecuteOn(this[selector], this, arg_, arg__, arg___, arguments);
  // });
  //
  // Thing_root.addMethod(function performWithArgs(selector, args) {
  //   return this[selector].apply(this, args);
  // });


  // Context.AddInstanceMethod(function At_IfPresent_IfAbsent(name, present, absent) {
  //   var $name = As$Name(name);
  //   var value = this[$name];
  //   return value ? present.call(this, value, $name) : absent.call(this, $name);
  // });
