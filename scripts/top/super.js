

Thing_root.addMethod = function addMethod(func) {
  var selector = func.name;
  var existingFunc = this[selector];
  if (existingFunc) {
    this["_super_" + selector] = existingFunc;
  }
  this[selector] = func;
  return this;
};


  Type_root.addMethod(function eachSubtype(actionBlock) {
    !!!!
    var name, subcontexts;
    subcontexts = this._Subcontexts;
    for (name in subcontexts) {
      actionBlock.call(this, subcontexts[name]);
    }
    return this;
  });



//=============//

function Super(target) {
  this._Target = target;
}

Thing_root.addMethod(function init(/* arguments */) {
  this.super = new Super(this)
  return this;
});


this.super.name();


//================//


Type.addMethod(function newInstance(name, supertype_) {
  var supertype, instanceRoot;
  if (!isUpperCase(name)) {
    return this.signalError("Type must have an uppercase name!");
  }
  supertype = supertype_ || Thing;
  instanceRoot = SpawnFrom(supertype._InstanceRoot);
  return this.superPerform("newInstance", name, supertype, instanceRoot);
  return this._super_newInstance(name, supertype, instanceRoot);
});


function CreateSuperHandler(Selector) {
  return function (/* arguments */) { // _super
    return RootOf(this)[Selector].apply(this, arguments);
  }
}

function EnsureDefaultHandlers(selector) {
  var defaultHandler, superSelector;
  defaultHandler = Implementation_root[selector];
  if (!defaultHandler) {
    superSelector = "_super_" + selector;
    Implementation_root[selector] = CreateUnimplementedHandler(selector);
    Implementation_root[superSelector] = CreateSuperHandler(selector);
  }
}
