Tranya(function (
  $ASSIGNERS, $BARRIER, $IMMEDIATES, $IS_CONTEXT, $IS_DEFINITION,
  $IS_IMPENETRABLE, $IS_INNER, $IS_TYPE, $OUTER, $PULP, $RIND, $SUPERS,
  IMPLEMENTATION, INVISIBLE, IS_IMMUTABLE, PROOF,
  VISIBLE, _DURABLES,
  SELF_METHOD, STANDARD_METHOD, VALUE_METHOD,
  AlwaysSelf, DefineProperty, InterMap, InvisibleConfig, MarkFunc, NewBlanker,
  NewInner, NewVacuousConstructor, RootOf, SetInvisibly, TheEmptyArray,
  SpawnFrom,
  Context_apply, Type_apply,

  Context_atPut, Context_init, Definition_init,
  _AddMethod, _BasicNew, _BasicSetImmutable, SetDefinition, _SetDefinitionAt,
  Shared, _Shared
) {
  "use strict"


  const $BaseBlanker = {
    innerMaker        : NewInner,
    $root$outer : {
      __proto__       : null,
      constructor     : NewVacuousConstructor("$Something$outer"), // ???
      [$IMMEDIATES]   : null, // emptyObject,
    },
    $root$inner : {
      __proto__       : null,
      constructor     : NewVacuousConstructor("$Something$inner"), // ???
      [$IMMEDIATES]   : null, // emptyObject,
      [$ASSIGNERS]    : null, // emptyObject,
      [$SUPERS]       : {
        __proto__        : null,
        [$IMMEDIATES]    : null, // emptyObject,
        [$PULP]          : IMPLEMENTATION,
      },
    },
  }

  $BaseBlanker.$root$inner[$OUTER] = $BaseBlanker.$root$outer
  DefineProperty($BaseBlanker.$root$outer, "constructor", InvisibleConfig)
  DefineProperty($BaseBlanker.$root$inner, "constructor", InvisibleConfig)

  const $SomethingBlanker   = NewBlanker($BaseBlanker)
  const $NothingBlanker     = NewBlanker($SomethingBlanker)
  const   $IntrinsicBlanker = NewBlanker($SomethingBlanker)
  const     TypeBlanker     = NewBlanker($IntrinsicBlanker, Type_apply   )
  const     ContextBlanker  = NewBlanker($IntrinsicBlanker, Context_apply)

  const ThingAncestry       = []


  function BootstrapType(iid, count, name, blanker_) {
    const _$type = new TypeBlanker([name])

    _$type._iidCount         = count
    _$type._definitions      = SpawnFrom(null)
    _$type._subordinateTypes = new Set()
    _$type._blanker          = blanker_ || NewBlanker($IntrinsicBlanker)
    _$type._supertypes       = TheEmptyArray

    SetInvisibly(_$type, "iid", iid, "SET BOTH INNER & OUTER")
    return _$type[$PULP]
  }

  const _$Something = BootstrapType(-100, 0, "$Something", $SomethingBlanker)
  const _$Intrinsic = BootstrapType( -11, 0, "$Intrinsic", $IntrinsicBlanker)
  const _Nothing    = BootstrapType(   0, 0, "Nothing"   , $NothingBlanker  )
  const _Thing      = BootstrapType(   1, 0, "Thing"     , null             )
  const _Type       = BootstrapType(   2, 4, "Type"      , TypeBlanker      )
  const _Context    = BootstrapType(   3, 0, "Context"   , ContextBlanker   )
  const _Definition = BootstrapType(   4, 0, "Definition", null             )

  const Thing      = _Thing[$RIND]
  const Definition = _Definition[$RIND]

  ThingAncestry[0] = Thing


  const $Something$root$inner = $SomethingBlanker.$root$inner
  const $Something$root$outer = $SomethingBlanker.$root$outer
  const Context$root$inner    = _Context._blanker.$root$inner
  const Definition$root$inner = _Definition._blanker.$root$inner
  const Type$root$inner       = TypeBlanker.$root$inner


  // Stubs for known properties

  // This secret is only known by inner objects
  $Something$root$inner[$IS_INNER]       = PROOF
  $Something$root$outer[$IS_INNER]       = null

  $Something$root$outer.type             = null

  $Something$root$inner._retarget        = null

  Type$root$inner.new                    = _BasicNew
  Type$root$inner._setDefinitionAt       = _SetDefinitionAt
  Type$root$inner._propagateDefinition   = AlwaysSelf

  Definition$root$inner._setImmutable    = _BasicSetImmutable
  Definition$root$inner._init            = Definition_init

  Context$root$inner._init               = Context_init
  Context$root$inner._atPut              = Context_atPut



  const _$RootContext    = new ContextBlanker("Tranya")
  const  _RootContext    = _$RootContext[$PULP]
  const   RootContext    = _$RootContext[$RIND]

  const _$DefaultContext = new ContextBlanker("Default")
  const  _DefaultContext = _$DefaultContext[$PULP]
  const   DefaultContext = _$DefaultContext[$RIND]

  _RootContext._init("Tranya")
  _DefaultContext._init("Default", RootContext)


  Context_atPut.call(_RootContext, "Thing"     , Thing     )
  Context_atPut.call(_RootContext, "Definition", Definition)

  // Necessary to prevent breaking Jasmine testing framework
  _SetDefinitionAt.call(_$Something, "asymmetricMatch", null       , INVISIBLE)


  _SetDefinitionAt.call(_$Something, IS_IMMUTABLE     , false      , VISIBLE  )
  _SetDefinitionAt.call(_$Something, "isSomething"    , true       , VISIBLE  )

  // Could have defined the follow properties later, after addDeclaration has
  // been defined, however it is fast execution within each objects' barrier#get
  // if implemented this way.  These properties are read very frequently.
  _SetDefinitionAt.call(_$Something, "id"             , null       , INVISIBLE)
  _SetDefinitionAt.call(_$Something, _DURABLES        , null       , INVISIBLE)
  _SetDefinitionAt.call(_$Something, "context"        , RootContext, VISIBLE  )

  _SetDefinitionAt.call(_Type      , $IS_TYPE         , true       , VISIBLE  )
  _SetDefinitionAt.call(_Context   , $IS_CONTEXT      , true       , VISIBLE  )
  _SetDefinitionAt.call(_Definition, $IS_DEFINITION   , true       , VISIBLE  )


  _AddMethod.call(_Type, _AddMethod, SELF_METHOD)

  // eslint-disable-next-line
  _Type._addMethod(function addMethod(func_selector, func_) {
    this._addMethod(...arguments, STANDARD_METHOD)
  }, SELF_METHOD)

  // eslint-disable-next-line
  _Type.addMethod(function addSelfMethod(func_selector, func_) {
    this._addMethod(...arguments, SELF_METHOD)
  })

  // eslint-disable-next-line
  _Type.addMethod(function addValueMethod(func_selector, func_) {
    this._addMethod(...arguments, VALUE_METHOD)
  })


  _$Intrinsic._addMethod(_BasicSetImmutable, VALUE_METHOD)

  _Type._addMethod("new", _BasicNew, VALUE_METHOD)
  _Type.addSelfMethod(_SetDefinitionAt)

  _Definition.addSelfMethod(Definition_init)
  _Definition._addMethod("_setImmutable", _BasicSetImmutable, VALUE_METHOD)

  _Context.addSelfMethod(Context_init)
  _Context.addSelfMethod(Context_atPut)


  _Context.addValueMethod(function entryAt(selector, checkRootContext_) {
    var entry = this._knownEntries[selector]
    if (entry !== undefined) { return entry }
    if (!checkRootContext_)  { return null }
    entry = _RootContext._knownEntries[selector]
    return (entry !== undefined) ? entry : null
  })



  const BasicPermeableNewDef = MakePermeableNewDef(_BasicNew, RootContext)

  function MakePermeableNewDef(NewHandler, context) {
    const Definition = context.entryAt("Definition", true)
    const handler = function permeableNew(...args) {
      const   instance = NewHandler.apply(this, args)
      const _$instance = InterMap.get(instance)

      SetInvisibly(_$instance[$OUTER], "this", _$instance[$PULP])
      return instance
    }
    return Definition("new", handler, VALUE_METHOD)
  }

  function AddPermeableNewDefinitionTo(_$type) {
    const _type         = _$type[$PULP]
    const newHandler    = _$type.new.method.handler
    const context       = _$type.context
    const newDefinition = (newHandler !== _BasicNew) ?
      MakePermeableNewDef(newHandler, context) : BasicPermeableNewDef
    if (_$type._definitions[$IS_TYPE]) { _type.addDefinition(newDefinition) }
    return _type.addOwnDefinition(newDefinition)
  }


  function BePermeable(target, beImmutable) {
    const _$target = InterMap.get(target)
    if (!_$target) { return target }
    if (_$target[$IS_IMPENETRABLE]) {
      return target._signalError("Can't make permeable copies of locked objects!!")
    }

    const _target = _$target[$PULP]
    const $target = _$target[$OUTER]
    SetInvisibly($target, "this", _target)
    if (_$target[$IS_TYPE]) { AddPermeableNewDefinitionTo(_$target) }
    if (beImmutable) { _target._setImmutable() }
    return target
  }


  function AddIntrinsicDeclaration(selector) {
    _SetDefinitionAt.call(_$Intrinsic, selector, null, INVISIBLE)
  }


  Shared.rootContext            =  RootContext
  Shared.defaultContext         =  DefaultContext

  _Shared.$BaseBlanker          =  $BaseBlanker
  _Shared.$SomethingBlanker     =  $SomethingBlanker
  _Shared.$IntrinsicBlanker     =  $IntrinsicBlanker
  _Shared.$Something$root$inner =  $Something$root$inner

  _Shared._$Something           = _$Something
  _Shared._$Intrinsic           = _$Intrinsic
  _Shared._Nothing              =  _Nothing
  _Shared._Thing                =  _Thing
  _Shared._Type                 =  _Type
  _Shared._Context              =  _Context
  _Shared._Definition           =  _Definition

  _Shared._$DefaultContext      = _$DefaultContext
  _Shared._RootContext          =  _RootContext
  _Shared.Thing                 =   Thing

  _Shared.AddPermeableNewDefinitionTo = AddPermeableNewDefinitionTo
  _Shared.BePermeable                 = BePermeable
  _Shared.AddIntrinsicDeclaration     = AddIntrinsicDeclaration

})