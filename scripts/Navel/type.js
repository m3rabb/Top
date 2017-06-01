_Type.addImmediate(function _nextIID() {
  return ++this._iidCount
})

_Type.addLazyProperty(function id() {
  return `${this.name},${this.oid}`
})


_Type.addLazyProperty(function formalName() {
  const context = this.context
  const prefix = context ? context.id + "@" : ""
  return `${prefix}${this.name}`
})






_Type.addMethod(function asPermeable() {
  const type$inner   = this[$INNER]
  const type$outer   = type$inner[$OUTER]
  const blanker      = type$inner._blanker

  const type$inner_  = SpawnFrom(type$inner)
  const type$outer_  = SpawnFrom(type$outer)
  const typeName_    = type$inner.name + "_"
  const func_        = MakeVacuousConstructor(typeName_)
  const permeability = type$inner.isPermeable ? Permeable : Impermeable

  const type$pulp_ = PreInitType(func_, type$inner_, type$outer_, permeability)

  type$inner_._blanker = NewBlanker({super: blanker, permeability: Permeable})

  type$pulp_._initCoreIdentity(name)
  type$pulp_.addSharedProperty("isPermeable", true)

  DefineProperty(type$inner, "asPermeable", InvisibleConfiguration)
  return (this.asPermeable = type$inner_[$RIND])
}, BASIC_IMMEDIATE)


_Type.addMethod(function asImpermeable() {
  const $inner       = this[$INNER]
  const permeability = $inner._blanker.permeability
  const primary      = (permeability === Impermeable) ? $inner : RootOf($inner)

  DefineProperty(primary, "asImpermeable", InvisibleConfiguration)
  return (primary[$PULP].asImpermeable = primary[$RIND])
}, BASIC_IMMEDIATE)



_Type.addMethod(function methodAt(selector) {
  const value = this._blanker.$root$inner[selector]
  if (typeof value !== "function") { return null }

  const marker = InterMap.get(value)
  return marker.isMethod ? marker[$RIND] : null
})

_Type.addMethod(function addAlias(aliasName, name_method) {
  const sourceMethod = name_method.isMethod ?
    name_method : this.methodAt(name_method)
  if (sourceMethod == null) {
    SignalError(this[$RIND], `Can't find method '${name_method}' to alias!!`)
  }
  return this.addMethod(aliasName, sourceMethod.handler, sourceMethod.mode)
})

_Type.addAlias("basicNew", "new")
_Type.addAlias("removeMethod", "removeSharedProperty")

_Type.addMethod(function newAsFact(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  let instance = this.new(...args)
  if (instance.id == null) { instance.beImmutable }
  return instance
})


// Type.addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)
