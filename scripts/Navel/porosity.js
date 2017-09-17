ObjectSauce(function (
  $ASSIGNERS, $DELETE_ALL_PROPERTIES, $DELETE_IMMUTABILITY,$IMMEDIATES, $INNER,
  $IS_DEFINITION, $OUTER, $OUTER_WRAPPER, $PULP, $RIND, $ROOT, $SUPERS,
  IMMEDIATE, IMPLEMENTATION, IS_IMMUTABLE, NO_SUPER, _DURABLES,
  AlwaysFalse, AlwaysNull, InSetProperty, InterMap, SpawnFrom, _$Copy, _HasOwn,
  AssignmentOfUndefinedError, AttemptSetOnSuperError,
  DirectAssignmentFromOutsideError, DisallowedDeleteError,
  PrivateAccessFromOutsideError,
  _OSauce
) {
  "use strict"

  // UNTESTED
  const DefaultBarrier = {
    __proto__      : null       ,
    getPrototypeOf : AlwaysNull ,
    setPrototypeOf : AlwaysFalse,
    defineProperty : AlwaysFalse,
    deleteProperty : AlwaysFalse,
    // isExtensible   : AlwaysFalse,
    // preventExtensions ???
  }

  function OuterBarrier() {}

  const OuterBarrier_prototype = OuterBarrier.prototype = SpawnFrom(DefaultBarrier)
  const Impermeable = new OuterBarrier()


  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  OuterBarrier_prototype.set = function set($target, selector, value, target) {
    return DirectAssignmentFromOutsideError(target) || false
  }


  // getOwnPropertyDescriptor ($target, selector) {
  //   switch (selector[0]) {
  //     case "_"       : return $target._externalPrivateRead(selector) || undefined
  //     // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
  //     case undefined : return undefined
  //   }
  //   return PropertyDescriptor($target, selector)
  // },

  // ownKeys ($target) { },


  OuterBarrier_prototype.get = function get($target, selector, target) {
    const value = $target[selector]
    if (value !== undefined) { return value }

    const _$method_outer = $target[$IMMEDIATES][selector]
    if (_$method_outer) { return _$method_outer.call(target) }
    if (selector in $target) { return null }

    const firstChar = (selector.charAt) ? selector[0] : selector.toString()[7]
    const _$target  = InterMap.get(target)

    if (firstChar === "_") {
      const _privateAccessFromOutside = _$target._privateAccessFromOutside
      return (_privateAccessFromOutside) ?
        _privateAccessFromOutside.call(_$target[$PULP], selector) :
        PrivateAccessFromOutsideError(target, selector)
    }
    return _$target._unknownProperty.call(_$target[$PULP], selector)
  }


  OuterBarrier_prototype.has = function has($target, selector) {
    // const firstChar = (typeof selector === "symbol") ?
    //   selector.toString()[7] : selector[0]

    switch (selector[0]) {
      case undefined : return null  // Effectively answers a shrug
      case "_"       :
        return PrivateAccessFromOutsideError($target[$RIND], selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      default        : return (selector in $target)
    }
  }


  OuterBarrier_prototype.basicGet    = OuterBarrier_prototype.get
  OuterBarrier_prototype.basicHas    = OuterBarrier_prototype.has



  // UNTESTED
  function InnerBarrier() {}

  const InnerBarrier_prototype = SpawnFrom(DefaultBarrier)
  InnerBarrier.prototype = InnerBarrier_prototype


  InnerBarrier_prototype.get = function get(_$target, selector, _target) {
    const value = _$target[selector]
    if (value !== undefined) { return value }

    const $method_inner = _$target[$IMMEDIATES][selector]
    if ($method_inner) { return $method_inner.call(_target) }
    if (selector in _$target) { return null }

    return _$target._unknownProperty.call(_target, selector)
  }


  InnerBarrier_prototype.has = function has(_$target, selector) {
    return (selector in _$target)
  }


  InnerBarrier_prototype.set = function set(_$source, selector, value, _source) {
    const assigner    = _$source[$ASSIGNERS][selector]
    var   _$target    = _$source
    var   isImmutable = _$source[IS_IMMUTABLE]

    if (assigner) {
      if (typeof assigner !== "function") { selector = assigner } // symbol
      else {                                                      // handler
        // The assigner might cause a write, invalidating the target $inner.
        value       = assigner.call(_source, value)
        _$target    = _source[$INNER]        // Re-get the (possibly new) $inner
        isImmutable = _$target[IS_IMMUTABLE] // See if assigner caused new copy
      }
    }

    const existing = _$target[selector]
    if (existing === _$target[$ROOT][selector]) {
      // Existing value has either never been set, or the current value has been
      // set to the same value as its root's value. The 2nd case is less likely.


      if (value === existing) {
        if (value === undefined) {
          return AssignmentOfUndefinedError(_source, selector)
        }
        if (_HasOwn.call(_$target, selector))         { return true }
        if (isImmutable && _$source.type.isImmutable) { return true }
        // Else, target is mutable, and new value matches inherited shared value
      }
      else if (existing === undefined  && !isImmutable) {
        delete _$target[_DURABLES] // Invalidate durables because new property
      }
    }
    // Existing value is definitely one that's been set before.
    // If new value equals existing, then easy out.
    else if (value === existing) { return true }

    // Need to double check this as the execution of the assigner might trigger
    // the barrier and cause the object to already be copied as writable!!!
    if (isImmutable) {
      _$target            = _$Copy(_$source, false, null, null, selector)
      this._$target       = _$target
      this.get            = this.retargetedGet
      this.set            = this.retargetedSet
      this.deleteProperty = this.retargetedDelete
    }

    if (_$target !== _$source) {
      // If going to assigning property to self, instead assign it to the copy
      if (value === _source || value === _$source[$RIND]) {
        value = _$target[$RIND]
      }
    }
    InSetProperty(_$target, selector, value, _source)
    return true
  }


  InnerBarrier_prototype.deleteProperty = function deleteProperty(_$source, selector) {
    var assigner, _$target, value, value$root

    assigner = _$source[$ASSIGNERS][selector]

    if (assigner && assigner.name === "$assignmentError") {
      return DisallowedDeleteError(_$source, selector) || true
    }

    switch (selector) {
      case $DELETE_IMMUTABILITY   :  // Only called on immutable objects!!!
        _$target = _$Copy(_$source, false)
        break

      case $DELETE_ALL_PROPERTIES :  // Only called on immutable objects!!!
        _$target = InterMap.get(new _$source._newBlank())
        // _$target = new _$source[$BLANKER]()
        // if (_$target[$OUTER].this) {
        //   DefineProperty(_$target, "this", InvisibleConfig)
        //   $instance.this = _$target[$IS_TYPE] ?
        //     AddPermeableNewDefinitionTo(_$instance) : _$target[$PULP]
        // }
        break

      default :
        value$root = _$source[$ROOT][selector]
        value      = _$source[selector]

        if (value === value$root) {
          if (value === undefined || !_HasOwn.call(_$source, selector)) {
            return true // Doesn't have the property, but inherits it from root.
          }
        }
    }

    if (_$source[IS_IMMUTABLE]) {
      this._$target = _$target || _$Copy(_$source, false, null, null, selector)
      this.set = this.retargetedSet
      this.get = this.retargetedGet
      this.deleteProperty = this.retargetedDelete
    }
    else {
      delete _$source[selector]
      delete _$source[$OUTER][selector]
      delete _$source[_DURABLES]
    }

    return true
  }

  // eslint-disable-next-line
  InnerBarrier_prototype.retargetedGet = function retargetedGet(_$source, selector, _source) {
    // Note: Could have simply done the following line, but gets need to be
    // fast, so reimplemented it here.
    // const _$target = this._$target
    // return InnerBarrier_prototype.get(_$target, selector, _$target[$PULP])

    const _$target = this._$target
    const value    = _$target[selector]
    if (value !== undefined) { return value }

    const $method_inner = _$target[$IMMEDIATES][selector]
    if ($method_inner) { return $method_inner.call(_$target[$PULP]) }
    if (selector in _$target) { return null }

    return _$target._unknownProperty.call(_$target[$PULP], selector)
  }

  // eslint-disable-next-line
  InnerBarrier_prototype.retargetedSet = function retargetedSet(_$source, selector, value, _source) {
    const _$target = this._$target
    return InnerBarrier_prototype.set(
      _$target, selector, value, _$target[$PULP])
  }

  // eslint-disable-next-line
  InnerBarrier_prototype.retargetedDelete = function retargetedDelete(_$source, selector, _source) {
    const _$target = this._$target
    return InnerBarrier_prototype.deleteProperty(
      _$target, selector, _$target[$PULP])
  }


  InnerBarrier_prototype.basicGet    = InnerBarrier_prototype.get
  InnerBarrier_prototype.basicSet    = InnerBarrier_prototype.set
  InnerBarrier_prototype.basicDelete = InnerBarrier_prototype.deleteProperty



  function DisguisedOuterBarrier($target, _target, applyHandler) {
    this.$outer = $target
    this.$pulp  = _target
    this.apply  = applyHandler
  }

  const DisguisedOuterBarrier_prototype = SpawnFrom(OuterBarrier_prototype)
  DisguisedOuterBarrier.prototype = DisguisedOuterBarrier_prototype

  DisguisedOuterBarrier_prototype.get = function get(func, selector, target) {
    return this.basicGet(this.$outer, selector, target)
  }

  DisguisedOuterBarrier_prototype.has = function has(func, selector) {
    return this.basicHas(this.$outer, selector)
  }



  // CHECK THAT BARRIER WORK ON TYPE PROXIES, IMMUTABLE AS WELL AS MUTABLE!!!
  function DisguisedInnerBarrier(_$target, applyHandler) {
    this.$inner = _$target
    this.apply  = applyHandler
    // this.$pulp  = _target // This is impossible to set within this
    // constructor!!! Thsi barrier must be made before the proxy is
    // instantiated with this barrier. Therefore, _target must be set from
    // outside.  This occurs during the blanker created by NewDisguisedInner.
  }

  const DisguisedInnerBarrier_prototype = SpawnFrom(InnerBarrier_prototype)
  DisguisedInnerBarrier.prototype = DisguisedInnerBarrier_prototype


  DisguisedInnerBarrier_prototype.get = function get(func, selector, _target) {
    // Note: Could reimplement it here is following call is too slow.
    return this.basicGet(this.$inner, selector, _target)
  }

  DisguisedInnerBarrier_prototype.set = function set(func, selector, value, _target) {
    return this.basicSet(this.$inner, selector, value, _target)
  }

  DisguisedInnerBarrier_prototype.has = function has(func, selector) {
    return (selector in this.$inner)
  }

  DisguisedInnerBarrier_prototype.deleteProperty = function deleteProperty(func, selector) {
    return this.basicDelete(this.$inner, selector)
  }



  function SetSuperPropertyFor(_$target, selector, supers) {
    var next, _$nextType, _$nextRoot, value, isDeclared
    const ancestors = _$target.type.ancestry

    next = ancestors.length
    if (!_$target._hasOwn(selector)) { next -= 1 }

    while (next--) {
      _$nextType = InterMap.get(ancestors[next])
      _$nextRoot = _$nextType._blanker.$root$inner
      value      = _$nextRoot[selector]

      if (value != null) {
        return (supers[selector] =
          (value[$OUTER_WRAPPER] && InterMap.get(value)) ?
            value.method.super : value)
      }
      if (value === null) { return (supers[selector] = null) }

      if ((value = _$nextRoot[$IMMEDIATES][selector])) {
        supers[$IMMEDIATES][selector] = value.method.super
        return (supers[selector] = IMMEDIATE)
      }
      if (selector in _$nextRoot) { isDeclared = true }
    }

    return isDeclared ? null : NO_SUPER
  }


  function SuperBarrier() {}

  const SuperBarrier_prototype = SpawnFrom(DefaultBarrier)

  SuperBarrier.prototype = SuperBarrier_prototype

  // eslint-disable-next-line
  SuperBarrier_prototype.get = function get(_$target, selector, _super) {
    const supers = _$target[$SUPERS]
    var   value  = supers[selector]

    do {
      switch (value) {
        case undefined :
          value = SetSuperPropertyFor(_$target, selector, supers)
          break

        case IMPLEMENTATION :
          return _$target[selector]

        case IMMEDIATE :
          return supers[$IMMEDIATES][selector].call(_$target[$PULP])

        case NO_SUPER :
          return _$target._unknownProperty.call(_$target[$PULP], selector)

        default :
          return value
      }
    } while (true)
  }

  // eslint-disable-next-line
  SuperBarrier_prototype.set = function set(_$target, selector, value, _super) {
    return AttemptSetOnSuperError(_$target[$RIND]) || false
  }




  // const OwnSuperBarrier = {
  //   __proto__ : SuperBarrier,
  //
  //   get ($inner, selector, target) {
  //     // const supers = $inner[SUPERS]
  //     // const value =
  //     //
  //     // if (selector in supers) {
  //     //   let sharedSupers = supers[SUPERS]
  //     //   if (sharedSupers !== supers) { // instance has its own SUPERS
  //     //     if (!(selector in sharedSupers)) {
  //     //
  //     //     }
  //     //
  //     //   }
  //     //   value = supers[selector]
  //     // }
  //     // else {
  //     //   value = SetSuperPropertyFor($inner, selector)
  //     // }
  //     // return (value === NO_SUPER) ?
  //     //   ($inner._unknownProperty ?
  //     //     $inner[$PULP]._unknownProperty(selector) : undefined) :
  //     //   (value && value[$IS_INNER] === PROOF ?
  //     //     value.handler.call($inner[$PULP]) : value)
  //   }
  // }

  _OSauce._Super                = new SuperBarrier()
  _OSauce.Impermeable           = Impermeable
  _OSauce.InnerBarrier          = InnerBarrier
  _OSauce.DisguisedOuterBarrier = DisguisedOuterBarrier
  _OSauce.DisguisedInnerBarrier = DisguisedInnerBarrier
  _OSauce.SuperBarrier          = SuperBarrier

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
