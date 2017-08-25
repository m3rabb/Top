
_$Something._addMethod("$", AsRetroactiveProperty("$", function $() {
  return this[$RIND]
}), BASIC_VALUE_METHOD)


_$Something._addMethod("_super", AsRetroactiveProperty("_super", function _super() {
  return new Proxy(this[$INNER], SuperBarrier)
}), BASIC_VALUE_METHOD)



_$Something._addMethod(function _unknownProperty(property) {
  return SignalError(this, `Receiver ${this.id} doesn't have a property: ${AsName(property)}!!`)
})



_$Something._addMethod(Symbol.toPrimitive, function (hint) {
  return this.id
}, VALUE_METHOD)


_$Something._addMethod(function is(value) {
  return (this[$RIND] === value)
}, BASIC_VALUE_METHOD)

// _$Something.addMethod(function is(value) {
//   return (this === value) || (this[$RIND] === value)
// }, BASIC_VALUE_METHOD)





_$Something._addMethod(function isImmutable() {
  return this[IS_IMMUTABLE] ? true : false
}, BASIC_VALUE_METHOD)


// _$Something._setImmutable()

// $Base
//
//   $Something
//      $SECRET = $inner
//      id = null
//      IS_IMMUTABLE = null
//
//      $
//      _super
//      _unknownProperty
//      $INNER
//
//      is
//      isPermeable
//      isImmutable
//      isSomething
//      type
//
//     $Intrinsic
//        oid
//        iid
//        uid
//        isA
//        isVoid
//        isNothing
//        isThing
//       Thing
//         Type
//
//     Nothing
//        isNothing
//       Void
//        id
//        isVoid


// *
//   primitive
//     undefined
//     boolean
//     number
//     symbol
//     string
//     null
//   object
//     $Something --> thingy
//       Nothing
//       $Intrinsic
//        Thing
//     jsobject
//      Object


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/