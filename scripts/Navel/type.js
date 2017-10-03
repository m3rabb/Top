HandAxe(function (
  $ASSIGNERS, $BARRIER, $BLANKER, $DISGUISE, $IMMEDIATES, $INNER, $IS_CONTEXT,
  $IS_DEFINITION, $IS_IMPENETRABLE, $IS_TYPE, $OUTER, $OWN_DEFINITIONS,
  $PULP, $RIND, $SUPERS,
  ASSIGNER, DECLARATION, IMMUTABLE, INHERIT, INVISIBLE, REINHERIT, VISIBLE,
   _DURABLES,
  ASSIGNER_FUNC, HANDLER_FUNC, INNER_FUNC, OUTER_FUNC, FACT_METHOD,
  IMMEDIATE_METHOD, MANDATORY_SETTER_METHOD, SETTER_METHOD, VALUE_METHOD,
  $Something$root$inner, AddIntrinsicDeclaration, AddPermeableNewDefinitionTo,
  AsCapitalized, AsDefinitionFrom, AsMembershipSelector, AsTypeDisguise, AsPropertySymbol,
  BasicSetInvisibly, BePermeable, CompareSelectors,
  DefaultContext, DeleteSelectorsIn, ExtractParamListing,
  GlazeAsImmutable, GlazeImmutable,
  InterMap, IsArray, IsPublicSelector,
  IsSubtypeOfThing, NewVacuousConstructor, PropertyAt, RootContext,
  RootOf, SetDefinition, SpawnFrom, ValueAsName,
  TheEmptyArray, TheEmptyStash, _HasOwn, _Type, _ValueAsNext,
  $IntrinsicBlanker, $SomethingBlanker, NewBlanker,
  AncestryOfPermeableTypeError, DuplicateSupertypeError,
  ImproperChangeToAncestryError, UnnamedFuncError,
  OwnKeysOf, OwnVisiblesOf, _KnownSelectorsOf, _OwnKeysOf, _OwnSelectorsOf,
  AsLazyProperty, AsRetroactiveProperty, AsSetterFromProperty,
  SetAsymmetricProperty,
  AsAssignmentSetter, AsBasicSetter, AsPropertyFromSetter
) {
  "use strict"


  _Type.addValueMethod(function newImmutable(...args) {
    const   instance = this.new(...args) // <<----------
    const _$instance = InterMap.get(instance)
    return _$instance._setImmutable.call(_$instance[$PULP], true)[$RIND]
  })

  _Type.addValueMethod(function newFact(...args) {
    // Note: this is effectively the same as generated by AsTypeDisguise
    const   instance = this.new(...args) // <<----------
    const _$instance = InterMap.get(instance)
    const  _instance = _$instance[$PULP]
    if (_instance.id == null) { _$instance._setImmutable.call(_instance, true) }
    return instance
  })


  _Type.addValueMethod(function newPermeable(...args) {
    return BePermeable(this.new(...args), false)// <<----------
  })

  _Type.addValueMethod(function newPermeableImmutable(...args) {
    return BePermeable(this.new(...args), true)// <<----------
  })

  _Type.addValueMethod(function newPermeableFact(...args) {
    const instance    = this.new(...args)// <<----------
    const asImmutable = (instance.id == null)
    return BePermeable(instance, asImmutable)
  })


  _Type.addValueMethod(function _newBlank() {
    const  $inner    = this[$INNER]
    const _$instance = new $inner[$BLANKER]("")
    const  $instance = new _$instance[$OUTER]

    if ($inner[$OUTER].this) {
      const _instance = AddPermeableNewDefinitionTo(_$instance)
      BasicSetInvisibly($instance, "this", _instance)
    }
    return _$instance[$RIND]
  })


  _Type.addValueMethod(function newFrom(source) {
    const blanker   = this._blanker
    const _initFrom_ = blanker.$root$inner._initFrom_

    if (!_initFrom_) { return this.new(source) }

    const _$source   = InterMap.get(source)
    const  _source   = _$source ? _$source[$PULP] : source
    const _$instance = new blanker(_source)
    const  _instance = _$instance[$PULP]
    const _postInit  = _$instance[$IMMEDIATES]._postInit

    _initFrom_.call(_instance, _source, false, new WeakMap())
    if (_postInit) {
      const result = _postInit.call(_instance)
      if (result !== _instance && result !== undefined) { return result }
    }
    return _$instance[$RIND]
  })



  // addAssigner(function property() {})
  // addAssigner("property", function () {})
  // forAddAssigner(function property() {})
  // forAddAssigner("property", function () {})

  _Type.addSelfMethod(function addAssigner(property_assigner, assigner_) {
    const [selector, assigner] = (assigner_) ?
      [property_assigner     , assigner_        ] :
      [property_assigner.name, property_assigner]

    if (!selector) { return UnnamedFuncError(this, assigner) }

    const definition = this.context.Definition(selector, assigner, ASSIGNER)
    this._setDefinitionAt(definition.tag, definition)
  })


  _Type.addSelfMethod(function addDeclaration(selector) {
    const definition = this.context.Definition(selector, undefined, DECLARATION)
    this._setDefinitionAt(definition.tag, definition)
  })


  _Type.addSelfMethod(function addSharedProperty(selector, value) {
    this._setDefinitionAt(selector, value)
  })

  // _Type.addSelfMethod(function addSharedProperty(selector, value, isVisible_) {
  //   const visibility = (isVisible_ !== false) ? VISIBLE : INVISIBLE
  //   this._setDefinitionAt(selector, value, visibility)
  // })



  _Type.addSelfMethod(function removeAssigner(selector) {
    const tag = `_$assigner@${ValueAsName(selector)}`
    if (this._definitions[tag] !== undefined) {
      this._deleteDefinitionAt(tag)
    }
  })

  _Type.addSelfMethod(function removeDeclaration(selector) {
    const tag = `_$declaration@${ValueAsName(selector)}`
  if (this._definitions[tag] !== undefined) {
      this._deleteDefinitionAt(tag)
    }
  })

  _Type.addSelfMethod(function removeSharedProperty(selector) {
    if (this._definitions[selector] !== undefined) {
      this._deleteDefinitionAt(selector)
    }
  })



  _Type.addValueMethod(function _deleteDefinitionAt(tag) {
    var   selectors, nextSelector, next
    const blanker          = this._blanker
    const $root$inner      = blanker.$root$inner
    const $root$outer      = blanker.$root$outer
    const defs             = this._definitions
    const value            = defs[tag]
    const _$value          = InterMap.get(value)
    const [selector, mode] = (_$value && _$value[$IS_DEFINITION]) ?
      [_$value.selector, _$value.mode] : [tag, null]

    switch (mode) {
      case IMMEDIATE_METHOD :
        delete $root$inner[$IMMEDIATES][selector]
        delete $root$outer[$IMMEDIATES][selector]
        delete $root$inner[$SUPERS][$IMMEDIATES][selector]
        selectors = [selector]
        break

      case ASSIGNER :
        delete $root$inner[$ASSIGNERS][selector]
        // break omitted

      case DECLARATION :
        selectors = []
        if ($root$inner[selector] !== undefined)         { break } // Has value
        if (defs[selector])                              { break } // Has immediate
        if (defs[`_$assigner@${ValueAsName(selector)}`]) { break } // Has assigner
        if (defs[AsSetterFromProperty(selector)])        { break } // Has setter
        selectors = [selector]
        break

      case MANDATORY_SETTER_METHOD :
        delete $root$inner[$ASSIGNERS][value.mappedSymbol]
        delete $root$inner[$ASSIGNERS][value.property]
        // break omitted

      case SETTER_METHOD :
        selectors = [selector]
        var property = value.property
        if ($root$inner[property] !== undefined)            { break } // Has value
        if (defs[property])                                 { break } // Has immediate
        if (defs[`_$declaration@${ValueAsName(property)}`]) { break } // Has def
        selectors[1] = property
        // break omitted

      default :
        selectors = [selector]
        break
    }

    next = selectors.length
    while (next--) {
      nextSelector = selectors[next]
      delete $root$inner[nextSelector]
      delete $root$outer[nextSelector]
      delete $root$inner[$SUPERS][nextSelector]
      delete defs[tag]
    }
    return this._inheritDefinitionAt(tag)
  })


  _Type.addValueMethod(function _inheritDefinitionAt(tag) {
    const definitions = this._definitions
    if (definitions[tag] !== undefined) { return }

    var ancestry, next, _$nextType, value

    ancestry = this._ancestry
    next     = ancestry.length - 1
    while (next--) {
      _$nextType = InterMap.get(ancestry[next])
      value      = _$nextType._definitions[tag]

      if (value !== undefined) {
        return this._setDefinitionAt(tag, value, INHERIT)
      }
    }
    return this
  })


  _Type.addValueMethod(function _propagateDefinition(tag) {
    this._subordinateTypes.forEach(subtype => {
      var _$subtype = InterMap.get(subtype)
      _$subtype._inheritDefinitionAt.call(_$subtype[$PULP], tag)
    })
    return this
  })


  _Type.addValueMethod(function _addSetter(name_setter, property_setter_, mode) {
    var propertyName, assigner, setterName, setter

    ;[setterName, setter] = (typeof name_setter === "function") ?
      [name_setter.name, name_setter] : [name_setter, null]

    switch (typeof property_setter_) {
      case "string"   :
        propertyName = property_setter_
        break

      case "function" :
        if ((propertyName = property_setter_.name)) {
          assigner = property_setter_
          if (mode === MANDATORY_SETTER_METHOD) {
            setter = AsAssignmentSetter(propertyName, setterName, assigner)
          }
          else {
            setter = AsBasicSetter(propertyName, setterName, mode)
            this._addMethod(propertyName, assigner, ASSIGNER, VISIBLE)
          }
        }
        else { setter = property_setter_ }
        break
    }

    if (!setterName)   { return UnnamedFuncError(this, assigner) }
    if (!propertyName) {
      propertyName = AsPropertyFromSetter(setterName) ||
        this._signalError(`Improper setter '${setterName}'!!`)
    }
    if (!setter) { setter = AsBasicSetter(propertyName, setterName, mode) }

    return this._addMethod(setterName, setter, mode, VISIBLE, propertyName)
  })


  // addSetter("setterName")
  // addSetter(function setterName() {})
  // addSetter("setterName", "property")
  // addSetter("setterName", function () {})
  // addSetter("setterName", function propertyAssigner() {})

  _Type.addSelfMethod(function addSetter(name_setter, property_setter_) {
    this._addSetter(name_setter, property_setter_, SETTER_METHOD)
  })


  // forAddSetter("propertyName")
  // forAddSetter("propertyName", "setterName")

  _Type.addSelfMethod(function forAddSetter(propertyName, setterName_) {
    const setterName = setterName_ || AsSetterFromProperty(propertyName) ||
      this._signalError(`Improper property name: ${propertyName}!!`)
    this._addSetter(setterName, propertyName, SETTER_METHOD)
  })


  // addMandatorySetter("setterName")
  // addMandatorySetter(function setterName() {}) // within must call _basicSet
  // addMandatorySetter("setterName", "property")
  // addMandatorySetter("setterName", function () {}) // within must call _basicSet
  // addMandatorySetter("setterName", function propertyAssigner() {})
  //
  _Type.addSelfMethod(function addMandatorySetter(name_setter, property_setter_) {
    this._addSetter(name_setter, property_setter_, MANDATORY_SETTER_METHOD)
  })

  // forAddMandatorySetter("property")
  // forAddMandatorySetter("property", "setterName")
  // forAddMandatorySetter("property", function setterName() {}) // within must call _basicSet

  _Type.addSelfMethod(function forAddMandatorySetter(propertyName, setter_) {
    const setter = setter_ || AsSetterFromProperty(propertyName) ||
      this._signalError(`Improper property name: ${propertyName}!!`)
    this._addSetter(setter, propertyName, MANDATORY_SETTER_METHOD)
  })



  _Type.addSelfMethod(function addRetroactiveValue(assigner_selector, assigner_) {
    // Will set the $inner selector even on an immutable object!!!
    const [selector, assigner] = (typeof assigner_selector === "function") ?
        [assigner_selector.name, assigner_selector] :
        [assigner_selector     , assigner_        ]
    const retroHandler = AsRetroactiveProperty(selector, assigner)
    this._addMethod(selector, retroHandler, VALUE_METHOD, VISIBLE)
  })

  _Type.addSelfMethod(function addRetroactiveProperty(assigner_selector, assigner_) {
    // Will set the $inner selector even on an immutable object!!!
    const [selector, assigner] = (typeof assigner_selector === "function") ?
        [assigner_selector.name, assigner_selector] :
        [assigner_selector     , assigner_        ]
    const retroHandler = AsRetroactiveProperty(selector, assigner)
    this._addMethod(selector, retroHandler, FACT_METHOD, VISIBLE)
  })


  _Type.addSelfMethod(function addLazyValue(assigner_selector, assigner_) {
    // Will set the $inner (even on) an immutable object!!!
    const [selector, assigner] = (typeof assigner_selector === "function") ?
      [assigner_selector.name, assigner_selector] :
      [assigner_selector     , assigner_        ]
    const lazyHandler = AsLazyProperty(selector, assigner)
    this._addMethod(selector, lazyHandler, VALUE_METHOD, VISIBLE)
  })

  _Type.addSelfMethod(function addLazyProperty(assigner_selector, assigner_) {
    // Will set the $inner (even on) an immutable object!!!
    const [selector, assigner] = (typeof assigner_selector === "function") ?
      [assigner_selector.name, assigner_selector] :
      [assigner_selector     , assigner_        ]
    const lazyHandler = AsLazyProperty(selector, assigner)
    this._addMethod(selector, lazyHandler, FACT_METHOD, VISIBLE)
  })


  // MAKE THIS use a Definition!!!
  _Type.addSelfMethod(function addDurable(selector) {
    const $root$inner = this._blanker.$root$inner
    const durables    = $root$inner[_DURABLES] || []
    if (!durables.includes(selector)) {
      $root$inner[_DURABLES] = GlazeImmutable([...durables, selector])
      this.addDeclaration(selector)
    }
  })



  // addDefinition(definition)
  // addDefinition(tag, definition)
  // addDefinition(namedFunc, mode_)
  // addDefinition(selector, func, mode_)

  _Type.addSelfMethod(function addDefinition(...params) {
    const definition = AsDefinitionFrom(params, this.context)
    this._setDefinitionAt(definition.tag, definition)
  })


  _Type.addSelfMethod(function addAlias(aliasName, selector_definition) {
    const definition = (typeof selector_definition !== "string") ?
      selector_definition :
      (this.methodAt(selector_definition) ||
        this._unknownMethodToAliasError(selector_definition))

    this.addDefinition(aliasName, definition)
  })



  _Type.addValueMethod(function _inheritAllDefinitions(inheritSpec) {
    var next, _$nextType, nextDefinitions, tags, value, nextValue
    var asImmutable, visited, context, noCopy

    if (inheritSpec === REINHERIT) {
      // Not a virgin type
      const blanker     = this._blanker
      const $root$inner = blanker.$root$inner
      const $root$outer = blanker.$root$outer
      const supers      = $root$inner[$SUPERS]

      DeleteSelectorsIn([$root$inner, $root$outer, supers])
      DeleteSelectorsIn(
        [$root$inner[$IMMEDIATES],$root$outer[$IMMEDIATES],supers[$IMMEDIATES]])
      DeleteSelectorsIn([$root$inner[$ASSIGNERS]])
      noCopy = true
    }
    else if (inheritSpec === INHERIT) { noCopy = true }
    else { ({asImmutable, visited, context} = inheritSpec) }

    const ancestry = this._ancestry
    const knowns   = SpawnFrom(null)

    next = ancestry.length
    while (next--) {
      _$nextType      = InterMap.get(ancestry[next])
      nextDefinitions = _$nextType._definitions
      tags            = _OwnKeysOf(nextDefinitions)

      tags.forEach(tag => {
        if (!knowns[tag]) {
          knowns[tag] = true
          value       = nextDefinitions[tag]
          nextValue   = noCopy ? value :
            _ValueAsNext(value, asImmutable, visited, context)
          this._setDefinitionAt(tag, nextValue, REINHERIT)
        }
      })
    }

    return this._propagateReinheritance(inheritSpec)
  })



  _Type.addValueMethod(function _propagateReinheritance(inheritSpec) {
    this._subordinateTypes.forEach(subtype => {
      var _$subtype = InterMap.get(subtype)
      _$subtype._inheritAllDefinitions.call(_$subtype[$PULP], inheritSpec)
    })
    return this
  })


  _Type.addValueMethod(function _setAsSubordinateOfSupertypes(supertypes) {
    // LOOK: add logic to invalidate connected types if supertypes changes!!!
    var next, _$supertype
    const subtype = this[$RIND]

    next = supertypes.length
    while (next--) {
      _$supertype = InterMap.get(supertypes[next])
      if (!_$supertype[IMMUTABLE]) {
        _$supertype._subordinateTypes.add(subtype)
      }
    }
    return this
  })



  _Type.addSelfMethod(function setName(newName) {
    const properName = AsCapitalized(newName)
    const priorName = this.name
    if (properName === priorName) { return priorName }

    if (properName[0] !== "$") {
      if (priorName != null) {
        this.removeSharedProperty(AsMembershipSelector(priorName))
      }
      const selector = AsMembershipSelector(properName)
      this.addSharedProperty(selector, true)
      AddIntrinsicDeclaration(selector)
    }

    this._setName(properName)
  })


  _Type.addMandatorySetter("_setName", function name(properName) {
    this._setDisplayNames(properName)
    return properName
  })


  _Type.addValueMethod(function _setDisplayNames(outerName, innerName_) {
    const innerName = innerName_ || ("_" + outerName)
    const _name     = NewVacuousConstructor(innerName)
    const $name     = NewVacuousConstructor(outerName)

    SetAsymmetricProperty(this, "constructor", _name, $name)
    this[$DISGUISE].name = outerName
    return this
  })



  _Type.addSelfMethod(function setContext(context) {
    this._setContext(context)
    context.atPut(this.name, this[$RIND])
  })


  _Type.addMandatorySetter("_setContext", function context(context) {
    if (_HasOwn.call(this, "context")) {
      return this._attemptToReassignContextError
    }
    this.addSharedProperty("context", context)
    return context
  })



  _Type.addMethod(function ancestry() { return this._ancestry })

  _Type.addMethod(function supertypes() { return this._supertypes })


  _Type.addValueMethod(function ancestryNames() {
    return GlazeImmutable(this._ancestry.map(type => type.name))
  })

  _Type.addValueMethod(function supertypeNames() {
    return GlazeImmutable(this._supertypes.map(type => type.name))
  })


  _Type.addSelfMethod(function addSupertype(type) {
    this.setSupertypes([...this.supertypes, type])
  })



  _Type.addSelfMethod(function setSupertypes(supertypes) {
    if (this._supertypes === supertypes) { return }
    const ancestry = this._buildAncestry(supertypes)
    this._validateNewSupertypes(supertypes, ancestry)
    this._setSupertypesAndAncestry(supertypes, ancestry, REINHERIT)
  })


  _Type.addValueMethod(function _setSupertypesAndAncestry(
                                      supertypes, ancestry, inheritSpec_) {
    this._supertypes = GlazeAsImmutable(supertypes)
    this._ancestry   = GlazeImmutable(ancestry)
    if (inheritSpec_) { this._inheritAllDefinitions(inheritSpec_) }
    return this._setAsSubordinateOfSupertypes(supertypes)
  })



  _Type.addValueMethod(function _extractArgs(
                              spec_name, supertypes_context_, context__) {
    var spec, name, supertypes, context, _$arg2
    ;[name, spec] = (typeof spec_name === "string") ?
      [spec_name, null] : [spec_name.name, spec_name]

    context    = context__ || spec_name.context || null
    supertypes = supertypes_context_

    if (supertypes === undefined)  { supertypes = spec_name.supertypes }
    if (supertypes === undefined)  { supertypes = spec_name.supertype  }
    if (supertypes === undefined)  { supertypes = [this.context.Thing] }
    else if (supertypes === null)  { supertypes = TheEmptyArray        }
    else if (!IsArray(supertypes)) {
      _$arg2 = InterMap.get(supertypes)
      if      (_$arg2  ==  null)   { supertypes = [this.context.Thing] }
      else if (_$arg2[$IS_TYPE])   { supertypes = [supertypes]         }
      else if (_$arg2.isNothing)   { supertypes = TheEmptyArray        }
      else                         { supertypes = [this.context.Thing] }
    }

    if (!context) {
      _$arg2  = _$arg2 || InterMap.get(supertypes_context_) || TheEmptyStash
      context = _$arg2[$IS_CONTEXT] ? supertypes_context_ : null
    }

    return [name, supertypes, context, spec]
  })


  //  spec
  //    name
  //    supertype|supertypes
  //    shared|sharedProperties
  //    methods|instanceMethods

  _Type.addValueMethod(function _init(spec_name, supertypes_context_, context__) {
    const [name, supertypes, context, spec] =
      this._extractArgs(spec_name, supertypes_context_, context__)
    const ancestry   = this._buildAncestry(supertypes)
    const isRootType = this._validateNewSupertypes(supertypes, ancestry)

    // The order of the following is intentional.
    this._initCoreProperties(isRootType)
    this._setSupertypesAndAncestry(supertypes, ancestry, INHERIT)
    this.setName(name)
    this.addSharedProperty("type", this[$RIND])

    context && this.setContext(context)
    spec    && this._initDefinitions(spec)
    return this
  })


  _Type.addValueMethod(function _initCoreProperties(isRootType_, disguiser_) {
    const parentBlanker = isRootType_ ? $SomethingBlanker : $IntrinsicBlanker

    this._blanker          = NewBlanker(parentBlanker, disguiser_)
    this._iidCount         = 0
    this._definitions      = SpawnFrom(null)
    this._subordinateTypes = new Set()
    return this
  })



  _Type.addValueMethod(function _initDefinitions(spec) {
    const declared    = spec.declare || spec.declared
    const durables    = spec.durable || spec.durables
    const shared      = spec.shared  || spec.sharedProperties
    const methods     = spec.methods || spec.instanceMethods
    const definitions = spec.define  || spec.defines

    declared    && this.addDeclarations(declared)
    durables    && this.addDurables(durables) // This needs to be for the root!!!
    shared      && this.addSharedProperties(shared)
    methods     && this.addMethods(methods)
    definitions && this.define(definitions)
    return this
  })


  _Type.addValueMethod(function _validateNewSupertypes(supertypes, ancestry) {
    if (supertypes.length !== new Set(supertypes).size) {
      return DuplicateSupertypeError(this) || null
    }
    const beRootType = !AncestryIncludesThing(ancestry)
    if (this._blanker) {
      if (this.isPermeable) {
        // This is a security measure. Keep someone from merge a protect type
        // into a programmer controller type in order to access aspects of the
        // merged type.
        return AncestryOfPermeableTypeError(this) || null
      }

      const isRootType = this.isRootType
      if (beRootType !== isRootType) {
        return ImproperChangeToAncestryError(this) || null
      }
      // Perhaps not. Might be able to redirect the _blanker of an existing type???
    }
    return beRootType
  })



  _Type.addValueMethod(function isRootType() {
    return (RootOf(this._blanker.$root$inner) === $Something$root$inner)
  })


  function AncestryIncludesThing(ancestry) {
    for (var index = 0, count = ancestry.length - 1; index < count; index++) {
      var _$type = InterMap.get(ancestry[index])
      if (!_$type.isRootType) { return true }
    }
    return false
  }


  _Type.addValueMethod(function _buildAncestry(supertypes = this.supertypes) {
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
    dupFreeAncestry.reverse().push(this[$RIND])
    return dupFreeAncestry
  })


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


  _Type.addValueMethod(function _initFrom_(_type, asImmutable, visited, context) {
    const inheritSpec = {asImmutable, visited, context}
    const isRootType  = _type.isRootType
    const disguiser   = (_type._blanker.length) ? AsTypeDisguise : null
    const supertypes  = _type._supertypes.map(type => visited.get(type) || type)
    const ancestry    = _type._ancestry.map(  type => visited.get(type) || type)

    // The order of the following is intentional.
    this._initCoreProperties(isRootType, disguiser)
    this._setSupertypesAndAncestry(supertypes, ancestry, inheritSpec)
    this.setName(_type.name)
    // this.addSharedProperty("type", this[$RIND])
    this._copyDefinitions(_type._definitions             , inheritSpec, false)
    this._copyDefinitions(_type[$INNER][$OWN_DEFINITIONS], inheritSpec, true )

    // Note: the context is used for building the new type, but in general
    // when instantiating a new object, it doesn't typically assign the new
    // object to a context. Such is the case here.
    //   this.setContext(context)

    if (_type[$OUTER].this) { AddPermeableNewDefinitionTo(this) }
    return this
  })


  _Type.addValueMethod(function _copyDefinitions(definitions, inheritSpec, isOwn) {
    if (!definitions) { return }
    const {asImmutable, visited, context} = inheritSpec
    const selector = isOwn ? "addOwnDefinition" : "addSharedProperty"
    const adder    = this[selector]
    const tags     = _OwnKeysOf(definitions)

    tags.forEach(tag => {
      const value       = definitions[tag]
      const nextValue   = _ValueAsNext(value, asImmutable, visited, context)
      adder.call(this, tag, nextValue)
    })
    return this
  })


  // This method should only be called on a mutable object!!!
  _Type.addValueMethod(function _setImmutable(inPlace, visited) { // eslint-disable-line
    this.id // Lazyily sets the id (& uid) befoe it's too late.
    this._subordinateTypes = TheEmptyArray
    GlazeImmutable(this[$DISGUISE])
    // return this._super._setImmutable(inPlace, visited)
    return this._basicSetImmutable()
  })




  _Type.addSelfMethod(function define(items, mode = "STANDARD") {
    const PropertyLoader = this.context.atOrInRootAt("PropertyLoader")
    PropertyLoader.new(this.self).load(items, mode)
  })

  _Type.addSelfMethod(function addSharedProperties(items) {
    this.define(items, "SHARED")
  })

  _Type.addSelfMethod(function addMethods(items) {
    this.define(items, "METHOD")
  })

  _Type.addSelfMethod(function addDeclarations(items) {
    this.define(items, "DECLARATION")
  })

  _Type.addSelfMethod(function addDurables(items) {
    this.define(items, "DURABLES")
  })



  _Type.addValueMethod(function _nextIID() {
    // This works on an immutable type without creating a new copy.
    return ++this[$INNER]._iidCount
  })

  _Type.addValueMethod(function id() { // Conditionally lazy property
    const newId = `${this.formalName},${this.oid}`
    if (this.context === DefaultContext) { return newId }
    return BasicSetInvisibly(this[$INNER], "id", newId, "SET OUTER TOO")
  })


  _Type.addValueMethod(function formalName() {
    const context = this.context
    const prefix = (context === DefaultContext) ? "" : context.formalName + "@"
    return `${prefix}${this.name}`
  })

  _Type.addValueMethod(function toString(_) { // eslint-disable-line
    return this.formalName
  })



  _Type.addValueMethod(function inheritsFrom(type) {
    var self, ancestry, next
    self     = this[$RIND]
    ancestry = type.ancestry
    next     = ancestry.length - 1
    while (next--) { if (ancestry[next] === self) { return true } }
    return false
  })



  _Type.addValueMethod(function hasDefinedMethod(selector) {
    const value = this._definitions[selector]
    return (value) ? value.isMethod : false
  })


  _Type.addValueMethod(function methodAt(selector) {
    const property = PropertyAt(this._blanker.$root$inner, selector)
    return property.isMethod ? property : null
  })

  _Type.addValueMethod(function definitionAt(selector) {
    return this._definitions[selector] || null
  })


  _Type.addValueMethod(function methodAncestry(selector) {
    return GlazeImmutable(
      this._ancestry.filter(type => type.hasDefinedMethod(selector)))
  })

  _Type.addValueMethod(function methodAncestryListing(selector) {
    const ancestry = this.methodAncestry(selector)
    return ancestry.map(type => type.name).join(" ")
  })



  _Type.addValueMethod(function definedSelectors() {
    return OwnKeysOf(this._definitions)
  })

  _Type.addValueMethod(function definedPublicSelectors() {
    return GlazeImmutable(this.definedSelectors.filter(IsPublicSelector))
  })

  _Type.addValueMethod(function allKnownSelectors() {
    return _KnownSelectorsOf(this._blanker.$root$inner)
  })

  _Type.addValueMethod(function allDefinedSelectors() {
    var index, next, _$nextType, nextDefinitions, tags
    const ancestry  = this._ancestry
    const knowns    = SpawnFrom(null)
    const selectors = []

    index = 0
    next  = ancestry.length
    while (next--) {
      _$nextType      = InterMap.get(ancestry[next])
      nextDefinitions = _$nextType._definitions
      tags            = _OwnSelectorsOf(nextDefinitions)

      tags.forEach(tag => {
        if (!knowns[tag]) { selectors[index++] = knowns[tag] = tag }
      })
    }
    return GlazeImmutable(selectors.sort(CompareSelectors))
  })

  _Type.addValueMethod(function allDefinedPublicSelectors() {
    // All public selectors
    // const definedSelectors = this.allDefinedSelectors
    // return GlazeImmutable(definedSelectors.filter(IsPublicSelector))

    return OwnVisiblesOf(this._blanker.$root$outer)
  })



  _Type.addValueMethod(function beImpenetrable() {
    this[$INNER][$IS_IMPENETRABLE]              = true
    this._blanker.$root$inner[$IS_IMPENETRABLE] = true
    return this
  })


  _Type.addSelfMethod(function _reconcileFrom(sourceType, asMutable, visited, context) {
    const _sourceType = InterMap.get(sourceType)[$PULP]
    const supertypes  = _sourceType._reconciledSupertypes(visited)

    this._setSupertypes(supertypes)
    this._initDefinitionsFrom_(_sourceType, visited, context)

    if (!asMutable && sourceType.isImmutable) { this.beImmutable }
  })

  _Type.addSelfMethod(function _reconciledSupertypes(visited) {
    return this._supertypes.map(supertype =>
      visited.get(supertype) || supertype)
  })



  _Type.addValueMethod(function _unknownMethodToAliasError(selector) {
    return this._signalError(
      `Can't find method '${ValueAsName(selector)}' to alias!!`)
  })

  _Type.addValueMethod(function _attemptToReassignContextError(context) {
    return this._signalError(`Can't reassign context of ${this} from ${this.context} to ${context}!!`)
  })



  _Type.addAlias("_basicNew"        , "new"                  )
  _Type.addAlias("new_"             , "newPermeable"         )
  _Type.addAlias("newImmutable_"    , "newPermeableImmutable")
  _Type.addAlias("newFact_"         , "newPermeableFact"     )

  _Type.addAlias("declare"          , "addDeclaration"       )
  _Type.addAlias("removeMethod"     , "removeSharedProperty" )
  _Type.addAlias("defines"          , "define"               )
  _Type.addAlias("forAddAssigner"   , "addAssigner"          )
  _Type.addAlias("forRemoveAssigner", "removeAssigner"       )

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/



// Type.addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)

////=====



// _Type.addMethod(function _getDefinedMethods(onlyPublic) {
//   const definitions = this._definitions
//   const methods     = []
//   var   tag, value
//
//   for (tag in definitions) {
//     value = definitions[tag]
//     if (value && value.isMethod) {
//       if (!onlyPublic || value.isPublic) { methods.push(value) }
//     }
//   }
//   methods.sort((methodA, methodB) => methodA.tag.localeCompare(methodB.tag))
//   return methods
// })
//
//
// _Type.addMethod(function _getImmediateMethods(onlyPublic) {
//   var methods, selector
//   const immediates = onlyPublic ?
//     this._blanker.$root$outer[$IMMEDIATES] :
//     this._blanker.$root$inner[$IMMEDIATES]
//
//   methods = []
//   for (selector in immediates) { methods.push(immediates[selector].method) }
//   methods.sort((methodA, methodB) => methodA.tag.localeCompare(methodB.tag))
//   return methods
// })
//
// _Type.addMethod(function _getMethods(onlyPublic) {
//   var methods, selector, selectors, next, value, method
//   const selectorPicker   = onlyPublic ? KnownSelectors : OwnVisibleNames
//   const root             = onlyPublic ?
//     this._blanker.$root$outer : this._blanker.$root$inner
//   const immediateMethods = this._getImmediateMethods(onlyPublic)
//   const somethingMethods = _$Something._getDefinedMethods(onlyPublic)
//   const intrinsicMethods = IsSubtypeOfThing(this) ?
//     _$Intrinsic._getDefinedMethods(onlyPublic) : TheEmptyArray
//
//   methods   = [].concat(immediateMethods, somethingMethods, intrinsicMethods)
//   selectors = selectorPicker(root)
//   next      = selectors.length
//   while (next--) {
//     selector = selectors[next]
//     value    = root[selector]
//     if (typeof value === "function" && InterMap.get(value) === marker) {
//       if ((method = value.method)) { methods.push(method) }
//     }
//   }
//   methods.sort((methodA, methodB) => methodA.tag.localeCompare(methodB.tag))
//   return methods
// })
//
//
