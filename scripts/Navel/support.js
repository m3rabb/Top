
function FuncParamsListing(func) {
  return func.toString().match(/\(([^)]*)\)/)[1]
}


function AsMembershipSelector(name) {
  return `is${name[0].toUpperCase()}${name.slice(1)}`
}


function AsCapitalized(word) {
  return `${word[0].toUpperCase()}${word.slice(1)}`
}


function AsName(string_symbol) {
  if (string_symbol.charAt) { return string_symbol }
  const name = string_symbol.toString()
  return name.slice(7, name.length - 1)
}


function AsPropertyFromSetter(setterName) {
  const match = setterName.match(/^([_$]*)set([A-Z])(.*$)/)
  return match && `${match[1]}${match[2].toLowerCase()}${match[3]}`
}


function AsSetterFromProperty(propertyName) {
  const match = propertyName.match(/^([_$]*)([a-z])(.*$)/)
  return match && `${match[1]}set${match[2].toUpperCase()}${match[3]}`
}



function AsPropertySymbol(selector) {
  return PropertyToSymbolMap[selector] ||
    (PropertyToSymbolMap[selector] = Symbol(`<$${AsName(selector)}$>`))
}


// AsDefinition(definition)
// AsDefinition(tag, definition)
// AsDefinition(namedFunc, mode_)
// AsDefinition(selector, func, mode_)

function AsDefinition(...args) {
  var def, tag
  switch (args.length) {
    case 1 :
      [def] = args
      if (def.isDefinition) { return def }
      break

    case 2 :
      [tag, def] = args
      if (def.isDefinition) {
        return (tag === def.tag) ? def : Definition(tag, def.handler, def.mode)
      }
      // break omitted

    case 3 :
      return Definition(...args) // selector, value, mode
  }
  return SignalError("Improper arguments to make a Definition!!")
}

// function AsDefinition(arg, arg_, arg__) {
//   if (arg.isDefinition) { return arg }
//   if (arg_.isDefinition) {
//     return (arg === arg_.tag) ? arg_ : Definition(arg, arg_.handler, arg_.mode)
//   }
//   return Definition(arg, arg_, arg__)
// }
//


function AddIntrinsicDeclaration(selector) {
  _SetDefinitionAt.call(_$Intrinsic, selector, null, INVISIBLE)
}

function AddBaseMembershipProperty(type, selector) {
  AddIntrinsicMembershipProperty(selector)
  type.addSharedProperty(selector, value)
  if (value) { type.membershipSelector = selector }
}


function SetDefinition(_$target, definition) {
  const  $target     = _$target[$OUTER]
  const _$definition = InterMap.get(definition)
  const selector     = _$definition.selector
  const property     = _$definition.property
  const isPublic     = _$definition.isPublic

  switch (_$definition.mode) {
    case IMMEDIATE_METHOD :
      // Formerly used delete, but deleting uncovered inherited value from
      // _$Intrinsic & _Something, so setting it undefined covers inherited
      // value. Doing this specifically to deal with inherited null id value
      // which breaks defining immediate/lazy id values by the type instances.
      CompletelyDeleteProperty(_$target, selector)
       _$target[selector] = undefined
      _$target[$IMMEDIATES][selector] = _$definition.inner
      if (isPublic) {
        $target[selector] = undefined
        $target[$IMMEDIATES][selector] = _$definition.outer
      }
      return

    case ASSIGNER :
      _$target[$ASSIGNERS][selector] = _$definition.handler
      // break omitted

    case DECLARATION :
      if (_$target[selector] === undefined) {
        _$target[selector] = undefined
        if (isPublic) { $target[selector] = undefined }
      }
      return

    case MANDATORY_SETTER_METHOD :
      _$target[$ASSIGNERS][_$definition.mappedSymbol] = property
      _$target[$ASSIGNERS][property] = _$definition.assignmentError
      // break omitted

    case SETTER_METHOD :
      if (_$target[property] === undefined) {
        _$target[property] = undefined
        if (isPublic) { $target[property] = undefined }
      }
      // break omitted

    default :
      // Store the inner (and outer) wrapper in the property chain.
      CompletelyDeleteProperty(_$target, selector)
      _$target[selector] = _$definition.inner
      if (isPublic) { $target[selector] = _$definition.outer }
  }
}


function InSetProperty(_$target, selector, value, _target) {
  const firstChar = (selector.charAt) ? selector[0] : selector.toString()[7]

  if (firstChar !== "_") {    // Public selector
    const $target = _$target[$OUTER]
    var   _$value

    switch (typeof value) {
      case "undefined" :
        // Storing undefined is prohibited!
        return AssignmentOfUndefinedError(_target, selector)

      case "object" :
             if (value === null)                 {        /* NOP */        }
        else if (value[$PROOF] === INNER_SECRET) {
          if (value === _target)                 { value = _$target[$RIND] }
         // Safety check: detect failure to use 'this.$' elsewhere.
          else                 { return DetectedInnerError(_target, value) }
        }
        else if (value[IS_IMMUTABLE])            {        /* NOP */        }
        else if (value.id != null)               {        /* NOP */        }
        else if (value === _$target[$RIND])      {        /* NOP */        }
        else {   value = (_$value = InterMap.get(value)) ?
                   _$Copy(_$value, true)[$RIND] : CopyObject(value, true)  }

        $target[selector] = value
        break

      case "function" : // LOOK: will catch Type things!!!
        // Note: Checking for value.constructor is inadequate to prevent func spoofing
        switch (InterMap.get(value)) {
          case DISGUISE_PULP :
            // Safety check: detect failure to a type's 'this.$' elsewhere.
            return DetectedInnerError(_target, value)

          case INNER_FUNC    :
            $target[selector] = value[$OUTER_WRAPPER]
            break

          case undefined     : // New unknown untrusted function to be wrapped.
          case HANDLER_FUNC  :
          case ASSIGNER_FUNC :
            value = AsTameFunc(value)
            // break omitted

          case OUTER_FUNC    :
          case TAMED_FUNC    :
          case SAFE_FUNC     :
          case BLANKER_FUNC  :
          default            : // value is a type's $rind, etc
            $target[selector] = value
            break
        }
        break

      default :
        $target[selector] = value
        break
    }
  }
  else if (value && value[$PROOF] === INNER_SECRET && value[$PULP] !== _target) {
    // Safety check: detect failure to use 'this.$' elsewhere.
    return DetectedInnerError(_target, value)
  }

  return (_$target[selector] = value)
}



 // Consider caching these!!!
 function NewAssignmentErrorHandler(Property, Setter) {
   function $assignmentError(value) {
     DisallowedAssignmentError(this, Property, Setter)
   }
   return MarkFunc($assignmentError, ASSIGNER_FUNC)
 }



function NewNamelessVacuousFunc() {
  return function () {}
}


function NewVacuousConstructor(name) {
  const funcBody = `
    return function ${name}() {
      const message = "This constructor is only used for naming!!"
      return SignalError(${name}, message)
    }
  `
  const func = Function(funcBody)()
  Frost(func.prototype)
  return DefineProperty(func, "name", InvisibleConfig)
}

const DefaultDisguiseFunc = NewVacuousConstructor("$disguise$")


function MakeDefinitionsInfrastructure(_$target, _$root) {
  const $root        = _$root[$OUTER]
  const $target      = _$target[$OUTER]
  const supers       = SpawnFrom(_$root[$SUPERS])

  supers[$IMMEDIATES] = SpawnFrom(supers[$IMMEDIATES])

  _$target[$SUPERS]       = supers
  _$target[$ASSIGNERS]    = SpawnFrom(_$root[$ASSIGNERS])
  _$target[$IMMEDIATES]   = SpawnFrom(_$root[$IMMEDIATES])
   $target[$IMMEDIATES]   = SpawnFrom( $root[$IMMEDIATES])
}



function NewBlanker(rootBlanker, applyHandler_) {
  const root$root$inner = rootBlanker.$root$inner
  const root$root$outer = rootBlanker.$root$outer
  const blankerMaker    = applyHandler_ ?
    NewDisguisedInner : rootBlanker.innerMaker
  const _$root          = SpawnFrom(root$root$inner)
  const  $root          = SpawnFrom(root$root$outer)
  // Note: The blanker function must be unnamed in order for the debugger to
  // display the type of instances using type name determined by the name of
  // its constructor function property.
  const OuterMaker      = NewNamelessVacuousFunc()
  const Blanker         = blankerMaker(OuterMaker, applyHandler_)
                         // Should this simply inherit from null!!!???

  OuterMaker.prototype = $root
  Blanker.$root$outer  = $root
  Blanker.prototype    = _$root
  Blanker.$root$inner  = _$root
  Blanker.innerMaker   = blankerMaker

  _$root[$ROOT]     = _$root
  _$root[$OUTER]    = $root
  _$root[$BLANKER]  = Blanker

  MakeDefinitionsInfrastructure(_$root, root$root$inner)

  InterMap.set(Blanker, BLANKER_FUNC)
  return Frost(Blanker)
}




function NewInner(CompanionOuterMaker) {
  // Note: The blanker function must be unnamed in order for the debugger to
  // display the type of instances using type name determined by the name of
  // its constructor function property.
  return function () {
    const $inner  = this
    const $outer  = new CompanionOuterMaker()
    const $rind   = new Proxy($outer, Impermeable)
    const barrier = new InnerBarrier()

    $inner[$BARRIER] = barrier
    $inner[$INNER]   = $inner
    $inner[$OUTER]   = $outer
    $inner[$PULP]    = new Proxy($inner, barrier)
    $inner[$RIND]    = $rind
    $outer[$RIND]    = $rind
    InterMap.set($rind, $inner)
  }
}



function NewDisguisedInner(CompanionOuterMaker, applyHandler) {
  // Note: The blanker function must be unnamed in order for the debugger to
  // display the type of instances using type name determined by the name of
  // its constructor function property.
  return function (arg_) {
    const name = arg_ && arg_.name || arg_[0].name || arg_[0]
    const func = name ? NewVacuousConstructor(name) : DefaultDisguiseFunc

    var $inner = this
    var $outer = new CompanionOuterMaker()

    const mutability = new DisguisedInnerBarrier($inner)
    // const barrier    = new InnerBarrier()
    const $pulp      = new Proxy(func, mutability)
    // mutability._target = $pulp
    const porosity   = new DisguisedOuterBarrier($pulp, $outer, applyHandler)
    const $rind      = new Proxy(func, porosity)
    // const $rind           = new Proxy(NewAsFact, privacyPorosity)

    $inner[$DISGUISE] = func
    $inner[$BARRIER]  = mutability // barrier
    $inner[$INNER]    = $inner
    $inner[$OUTER]    = $outer
    $inner[$PULP]     = $pulp
    $inner[$RIND]     = $rind
    $outer[$RIND]     = $rind

    InterMap.set($pulp, DISGUISE_PULP)
    InterMap.set($rind, $inner)
    // this[$PULP]  = new Proxy(NewAsFact, mutability)
  }
}



function BuildRoughAncestryOf(supertypes, originalTypes_) {
  const roughAncestry = []
  const originalTypes = originalTypes_ || new Set(supertypes)

  supertypes.forEach(nextType => {
    if (originalTypes_ && originalTypes_.has(nextType)) { /* continue */ }
    else {
      var nextAncestry =
        BuildRoughAncestryOf(nextType.supertypes, originalTypes)
      roughAncestry.push(...nextAncestry, nextType)
    }
  })
  return roughAncestry
}


function BuildAncestryOf(type, supertypes = type.supertypes) {
  const roughAncestry   = BuildRoughAncestryOf(supertypes)
  const visited         = new Set()
  const dupFreeAncestry = []
  var next, nextType

  next = roughAncestry.length
  while (next--) {
    nextType = roughAncestry[next]
    if (!visited.has(nextType)) {
      dupFreeAncestry.push(nextType)
      visited.add(nextType)
    }
  }
  dupFreeAncestry.reverse().push(type)
  return BasicSetObjectImmutable(dupFreeAncestry)
}



function OwnSelectors(target, ignoreDeclarations_) {
  const selectors = ignoreDeclarations_ ?
    OwnVisibleNames(target) : OwnNames(target)
  const symbols   = OwnSymbols(target)

  index = selectors.length
  next  = symbols.length
  while (next--) {
    symbol = symbols[next]
    if (symbol.toString()[7] !== "$") { selectors[index++] = symbol }
  }
  return selectors
}


function OwnSelectorsSorted(target) {
  const selectors = OwnSelectors(target, true) // Do ignore declarations
  selectors.sort((a, b) => AsName(a).localeCompare(AsName(b)))
  return BasicSetObjectImmutable(selectors)
}


function AllSelectorsSorted(target, selectorPicker) {
  var targetSelectors, selector, index, next
  const knowns         = SpawnFrom(null)
  const selectors      = []

  index = 0
  while (target) {
    targetSelectors = selectorPicker(target)
    next            = targetSelectors.length
    while (next--) {
      selector = targetSelectors[next]
      if (!knowns[selector]) {
        knowns[selector] = true
        selectors[index++] = selector
      }
    }
    target = RootOf(target)
  }
  selectors.sort((a, b) => AsName(a).localeCompare(AsName(b)))
  return BasicSetObjectImmutable(selectors)
}



function DeleteSelectorsIn(targets) {
  var selectors, selectorIndex, selector, targetIndex

  selectors     = OwnSelectors(targets[0])
  selectorIndex = selectors.length

  while (selectorIndex--) {
    selector = selectors[selectorIndex]
    targetIndex = targets.length

    while (targetIndex--) {
      delete targets[targetIndex][selector]
    }
  }
}


 function SetDurables(target) {
   const durables = OwnNames(target)
   durables[IS_IMMUTABLE] = true
   return (target[_DURABLES] = Frost(durables))
 }







function SetImmutableFunc(func, marker = SAFE_FUNC) {
  if (InterMap.get(func)) { return func }

  func[IS_IMMUTABLE] = true
  InterMap.set(func, marker)
  Frost(func.prototype)
  return Frost(func)
}


function MarkFunc(func, marker) {
  if (InterMap.get(func)) { return func }
  InterMap.set(func, marker)
  return func
}


// Document these!!!
const SAFE_FUNC     = Frost({ id : "SAFE_FUNC"   , [IS_IMMUTABLE] : true })
const BLANKER_FUNC  = Frost({ id : "BLANKER_FUNC", [IS_IMMUTABLE] : true })
const TAMED_FUNC    = Frost({ id : "TAMED_FUNC"  , [IS_IMMUTABLE] : true })
const OUTER_FUNC    = Frost({ id : "OUTER_FUNC"  , [IS_IMMUTABLE] : true })
const INNER_FUNC    = Frost({ id : "INNER_FUNC"  , [IS_IMMUTABLE] : true })



const DISGUISE_PULP = Frost({ id : "DISGUISE_PULP" })
const ASSIGNER_FUNC = Frost({ id : "ASSIGNER_FUNC" })
const HANDLER_FUNC  = Frost({ id : "HANDLER_FUNC"  })


// Simpleton function
const ALWAYS_FALSE     = MarkFunc(          () => false       , SAFE_FUNC)
const ALWAYS_NULL      = MarkFunc(          () => null        , SAFE_FUNC)
const ALWAYS_UNDEFINED = MarkFunc(          () => undefined   , SAFE_FUNC)
const ALWAYS_SELF      = MarkFunc( function () { return this }, SAFE_FUNC)



function PropertyAt(_$target, selector) {
  const _$method_inner = _$target[$IMMEDIATES][selector]
  if (_$method_inner) { return _$method_inner.method /* || null */ }

  const value = _$target[selector]
  return (value == null) ? null :
    (value[$OUTER_WRAPPER] ? value.method : value)
}


function SetAsymmetricProperty(_type, property, _value, $value, visibility) {
  const blanker = _type._blanker
  const  $root  = blanker.$root$outer
  const _$root  = blanker.$root$inner

  if (visibility === INVISIBLE) {
    DefineProperty( $root, property, InvisibleConfig)
    DefineProperty(_$root, property, InvisibleConfig)
  }

   $root[property] = $value
  _$root[property] = _value
  // _type._properties[property] = ASYMMETRIC_PROPERTY
}



function IsSubtypeOfThing(_type) {
  // return (_type._basicSet !== undefined)
  // The following fails when testing _$Something
  return (RootOf(_type._blanker.$root$inner) === $Intrinsic$root$inner)
}

function AncestryIncludesThing(ancestry) {
  for (var index = 0, count = ancestry.length - 1; index < count; index++) {
    var _$type = InterMap.get(ancestry[index])
    if (IsSubtypeOfThing(_$type)) { return true }
  }
  return false
}


const _BasicNew = function _basicNew(...args) {
  const _$instance = new this._blanker(args)
  const  _instance = _$instance[$PULP]
  const  _postInit = _$instance._postInit

  _$instance._init.apply(_instance, args) // <<----------
  if (_postInit) {
    const result = _postInit.call(_instance)
    if (result !== undefined && result !== _instance) { return result }
  }
  return _$instance[$RIND]
}

const _BasicNew_ = function new_(...args) {
  const $inner     = this[$INNER]
  const newHandler = $inner.new
  const instance   = (newHandler === _BasicNew || newHandler === _BasicNew_) ?
    this._basicNew(...args) : this.new(...args)
  const _$instance = InterMap.get(instance)
  const $instance  = _$instance[$OUTER]

  DefineProperty($instance, "this", InvisibleConfig)
  $instance.this = _$instance[$PULP]

  return instance
}


// This method should only be called on a mutable object!!!
const _BasicSetImmutable = function _basicSetImmutable(inPlace_, visited__) {
  const _$target = this[$INNER]
  const  $target = _$target[$OUTER]

  delete _$target._retarget
  $target[IS_IMMUTABLE] = _$target[IS_IMMUTABLE] = true
  Frost($target)
  return this
} // BASIC_SELF_METHOD


// This method should only be called on a mutable object!!!
function BasicSetImmutable(_target) {
  var _$target, $target
  if ((_$target = _target[$INNER])) {
    $target = _$target[$OUTER]
    delete _$target._retarget
    $target[IS_IMMUTABLE] = _$target[IS_IMMUTABLE] = true
    Frost($target)
    return _target
  }

  _target[IS_IMMUTABLE] = true
  return Frost(_target)
}


// This method should only be called on a mutable object!!!
function BasicSetObjectImmutable(target) {
  target[IS_IMMUTABLE] = true
  return Frost(target)
}



function CompletelyDeleteProperty(_$target, selector) {
  delete _$target[selector]
  const $target = _$target[$OUTER]
  const supers  = _$target[$SUPERS]
  delete _$target[$IMMEDIATES][selector]
  delete  $target[$IMMEDIATES][selector]
  delete supers[selector]
  delete supers[$IMMEDIATES][selector]
}




function BePermeable(target) {
  const _$target = InterMap.get(target)
  if (!_$target) {
    return SignalError(source, "Can only make permeable copies of sauced objects!!")
  }
  if (_$target[$LOCKED]) {
    return _$source._signalError("Can't make permeable copies of locked objects!!")
  }

  const _target = _$target[$PULP]
  const $target = _$target[$OUTER]
  DefineProperty($target, "this", InvisibleConfig)
  $target.this = _target

  if (_$target.isType) {
    newHandler = _$target.new.handler
    newDefinition = (newHandler === _BasicNew) ?
      BasicPermeableNewDef : MakePermeableNewHandler(newHandler)
    _target.addOwnDefinition(newDefinition)
  }
  return target
}








/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
