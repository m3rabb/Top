Tranya(function (
  $INNER, $OUTER, $OUTER_WRAPPER, $PULP, $RIND, INHERIT, VISIBLE,
  $BaseBlanker, $IntrinsicBlanker, CrudeBeImmutable, Frost, InterMap,
  SetAsymmetricProperty,
  DefaultContext, OwnKeys, RootContext, SetInvisibly, SpawnFrom, TheEmptyArray,
  _$DefaultContext, _$Intrinsic, _$Something, _BasicSetImmutable, _RootContext,
  _Context, _Definition, _Nothing, Thing, _Thing, _Type,
  Shared, _Shared
) {
  "use strict"


  _Type.addDeclaration("_blanker")
  _Type.addDeclaration($OUTER_WRAPPER)    // Ensures method wrappers work!!!
  _Context.addDeclaration($OUTER_WRAPPER) // Ensures method wrappers work!!!


  const ThingAncestry = CrudeBeImmutable([Thing])
  const BasicSet      = $IntrinsicBlanker.$root$inner._basicSet

  function BootstrapType(_type, name, isRootType, spawnIntoRoot, isHidden) {
    const supertypes = isRootType ? TheEmptyArray : ThingAncestry
    const ancestry   = _type._buildAncestry(supertypes)

    // The order of the following is intentional.
    _type._setSupertypesAndAncestry(supertypes, ancestry, INHERIT)
    _type.setName(name)
    _type.addSharedProperty("type", _type[$RIND])
    BasicSet.call(_type, "context", RootContext)
    if (!isHidden) { _RootContext._atPut(name, _type[$RIND]) }
    if (spawnIntoRoot) { _type.addSharedProperty("context", RootContext) }
  }

  _$Something.addSharedProperty("context", DefaultContext)
  //               type         name     isRootType, spawnIntoRoot, isHidden
  BootstrapType(_$Something, "$Something", true ,       false,       true )
  BootstrapType(_$Intrinsic, "$Intrinsic", true ,       false,       true )
  BootstrapType(_Nothing   , "Nothing"   , true ,       true ,       false)
  BootstrapType(_Thing     , "Thing"     , true ,       false,       false)
  BootstrapType(_Type      , "Type"      , false,       false,       false)
  BootstrapType(_Definition, "Definition", false,       true ,       false)
  BootstrapType(_Context   , "Context"   , false,       true ,       false)


  // Helps with debugging!!!
  _$Something._setDisplayNames("$Intrinsic$Outer", "$Intrinsic$Inner")
  _$Intrinsic._setDisplayNames("$Outer"          , "$Inner"          )

  SetAsymmetricProperty(_$Intrinsic, "isOuter", false, true , VISIBLE)
  SetAsymmetricProperty(_$Intrinsic, "isInner", true , false, VISIBLE)


  // Note: If this was called before the previous declarations,
  // $IMMEDIATES, $ASSIGNERS, constructor, etc, would not be overridable
  // in the descendent $roots.
  Frost($BaseBlanker.$root$outer)
  Frost($BaseBlanker.$root$inner)
  CrudeBeImmutable($BaseBlanker)
  // _BasicSetImmutable.call(_$Intrinsic)
  // _BasicSetImmutable.call(_$Something)

  SetInvisibly(_$DefaultContext, "iid", 0, "SET BOTH INNER & OUTER")
  RootContext.iid

  for (var name in Shared) { _RootContext._atPut(name, Shared[name]) }

  const  TestContext = _Context.new("ImplementationTesting", RootContext)
  const _TestContext = InterMap.get(TestContext)[$PULP]

  const selectors = OwnKeys(_Shared)
  selectors.forEach(selector => {
    const value = _Shared[selector]
    if (!_RootContext.valueIsInner(value)) {
      _TestContext._atPut(selector, value)
    }
  })

  _RootContext.add(TestContext)

  Tranya = RootContext
})



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/