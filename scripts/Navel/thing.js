


// _Type.addMethod(function _resetId(newId_) {
//   // delete this[$PRIOR_IDS]
//   this.id = (newId_ !== undefined) ? newId : this.oid
// })
// Move to the safer version of the RelaxedMethodPorosity after mutable copy methods defined

// mutableCopyExcept
// mutableCopy
// asMutable
// asMutableCopy

// Thing.addMethod(_basicSet)

// Thing.addMethod("_hasOwn", HasOwnProperty)








_Thing.addImmediate(function oid() {
  return `${this.iid}.${this.type.formalName}`
  // `${type.name}<${NewUniqueId()}>`
})

_Thing.addLazyProperty(function uid() {
  return this._hasOwn("guid") ? this.guid : `<${NewUniqueId()}>`
})






_Thing.addAssigner("id", function _setId(newId_) {
  const existingId = this.id
  var   newId

  if (newId_ === undefined) {
    if (existingId !== undefined) { return existingId }
    newId = this.oid
  }
  else { newId = newId_ }

  if (existingId !== undefined) {
    const priorIds = this[$PRIOR_IDS] || (this[$PRIOR_IDS] = [])
    priorIds[priorIds.length] = existingId
  }
  return newId
})


_Thing.addAssigner("name", "_setName")

_Thing.addMethod(function _init(spec_) {
  if (spec_) {
    var id   = spec_.id
    var name = spec_.name
  }
  id   && (this.id   = id)
  name && (this.name = name)
  return this
})


_Thing.addMethod(function _setImmutable(inPlace, visited = new WeakMap()) {
  var next, property, value, $value, barrier
  const $inner = this[$INNER]
  const $outer = $inner[$OUTER]

  visited.set($rind, $rind)

  if ($inner._setPropertiesImmutable) {
    $pulp._setPropertiesImmutable(inPlace, visited)
  }
  else {
    const $rind      = $inner[$RIND]
    const properties =
      $inner[KNOWN_PROPERTIES] || SetKnownProperties($inner, SET_OUTER_TOO)

    next = properties.length
    while (next--) {
      property = properties[next]
      if (property[0] !== "_")                          { continue }

      value = $inner[property]
      if (typeof value !== "object" || value === null)  { continue }
      if (value === $rind)                              { continue }
      if (value[IS_IMMUTABLE] || value.id != null)      { continue }
      if (visited.get(value))                           { continue }

      $value = InterMap.get(value)
      if (inPlace) {
        if ($value) { $value[$PULP]._setImmutable(true, visited) }
        else        { BeImmutableObject(value, true, visited)    }
      }
      else {
        $inner[property] = ($value) ?
          $Copy($value, true, visited)[$RIND] : CopyObject(value, true, visited)
      }
    }
  }

  barrier               = new ImmutableInner($inner)
  $inner[$PULP]         = new Proxy($inner, barrier)
  $inner[$MAIN_BARRIER] = barrier
  $outer[IS_IMMUTABLE]  = $inner[IS_IMMUTABLE] = true
  Frost($outer)
  return this

}, BASIC_SELF_METHOD)



// _Thing.addMethod(function addOwnMethod(method_namedFunc__name, func__, mode___) {
//   const $inner   = this[$INNER]
//   const method   = AsMethod(method_namedFunc__name, func__, mode___)
//   const selector = method.name
//   const methods  = $inner[OWN_METHODS]|| ($inner[OWN_METHODS] = SpawnFrom(null))
//   const supers   = $inner[$SUPERS]    || ($inner[$SUPERS]     = SpawnFrom(null))
//   SetMethod($inner, method)
//   methods[selector] = method
//   delete supers[selector]
//   // delete getters
//   return this
// })
//
// _Thing.addMethod(function addOwnImmediate(...namedFunc_name__handler) {
//   return this.addOwnMethod(...namedFunc_name__handler, IMMEDIATE)
// })
//
// _Thing.addMethod(function addOwnLazyProperty(...namedFunc_name__handler) {
//   return this.addOwnMethod(...namedFunc_name__handler, LAZY_INSTALLER)
// })

// _Thing.addSMethod(function addOMethod(method_func__name, func_) {
//   const type = method_func__name.type
//   const method = type && type.is(Method) ?
//     method_func__name : Method.new(method_func__name, func__)
//   const selector = method.name
//   const methods = (this[INSTANCE_METHODS] ||
//     this[INSTANCE_METHODS] = { __proto__ : null })
//   methods[selector] = method
//   this[selector] = method.handler
//   return this
// })


// _Thing.addMethod(function _noSuchProperty(property) {
//   return SOME VALUE | this._signalError(this.oid)
// })

// _Thing.addMethod(function _setCopyId() {
//    if it has a way to make a new id then set it,
//    otherwise if mutable, no id, and if immutable set id to ""

//   return this._setId(this.oid)
// })



// _Thing.addMethod(function _postInit() {
//   this.id = this.oid
//   return this
// })

// _Thing.addMethod(function _setPropertiesImmutable(inPlace, visited) {
//   this.id = this.oid
//   return this
// })

// _Thing.addMethod(function _initFrom_(_source, propertiesBeImmutable, visited, exceptProperty_) {
//   this.id = this.oid
//   return this
// })


// Obsolete and unnecessary
// Thing.addMethod(function _quietGet(property) {
//   const descriptor = PropertyDescriptor(this, property)
//   return descriptor.value
// })
