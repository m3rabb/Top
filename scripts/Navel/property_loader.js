
PropertyLoader = Type("PropertyLoader")

const modeNames = `DECLARE SHARED ALIAS STANDARD METHOD IMMEDIATE LAZY
                   FOR_ASSIGN FOR_SETTER FOR_MANDATORY SETTER MANDATORY`

PropertyLoader.addSharedProperty("modes", modeNames.split(/\s+/))

PropertyLoader.addMethod(function _init(type) {
  this._type    = type
  this._aliases = SpawnFrom(null)
})


PropertyLoader.addMethod(function _saveAlias(aliasName, existingName) {
  this._aliases[aliasName] = existingName
})

PropertyLoader.addMethod(function _resolveAliases() {
  const type    = this._type
  const aliases = this._aliases
  for (aliasName in aliases) {
    var existingName = aliases[aliasName]
    type.addAlias(aliasName, existingName)
  }
  this._aliases = SpawnFrom(null)
})


PropertyLoader.addMethod(function isMode(string) {
  return (this.modes.indexOf(string) >= 0)
})


PropertyLoader.addMethod(function load(item, mode = "STANDARD") {
  this._load(item, mode)
  this._resolveAliases()
  return this._type
})


PropertyLoader.addMethod(function _load(item, mode) {
  switch (item.constructor) {
    case Array    : this._loadFromArray(item, mode) ; break
    case Object   : this._loadFromSpec (item, mode) ; break
    case Function : this._loadFunc     (item, mode) ; break
    case String   : this._loadFromName (item, mode) ; break

    default : this._signalError("Methods must be in a list|spec|func!!")
  }
})

PropertyLoader.addMethod(function _loadFromArray(items, mode) {
  var index, count, item

  index = 0
  count = items.length

  while (index < count) {
    item = items[index++]

    switch (item.constructor) {
      default       : return this._signalError("Unexpected item!!")
      case Object   : this._loadFromSpec (item, mode)             ; break
      case Array    : this._loadFromArray(item, mode)             ; break
      case Function : this._loadFunc     (item, mode)             ; break
      case String   :
        if (this.isMode(item)) { this._load(items[index++], item) }
        else                   { this._loadFromName(item, mode)   } break
    }
  }
})

PropertyLoader.addMethod(function _loadFromSpec(item, mode) {
  var keys = VisibleProperties(item)

  keys.forEach(key => {
    var value = item[key]

    if (this.isMode(key)) { this._load(value, key)           }
    else                  { this._loadPair(key, value, mode) }
  })
})


PropertyLoader.addMethod(function _loadPair(name, value, mode) {
  switch (mode) {
    case "ALIAS"         : return this._saveAlias(name, value)
    case "SHARED"        : return this._type.addSharedProperty    (name, value)

    case "METHOD"        : return this._type.addMethod            (name, value)

    case "IMMEDIATE"     : return this._type.addImmediate         (name, value)
    case "LAZY"          : return this._type.addLazyProperty      (name, value)
    case "SETTER"        : return this._type.addSetter            (name, value)
    case "MANDATORY"     : return this._type.addMandatorySetter   (name, value)

    case "FOR_ASSIGN"    : return this._type.forAddAssigner       (name, value)
    case "FOR_SETTER"    : return this._type.forAddSetter         (name, value)
    case "FOR_MANDATORY" : return this._type.forAddMandatorySetter(name, value)

    case "STANDARD"      :
      return this._signalError(
        `Must define mode for spec containing '${name}'!!`)

    default : return this._signalError(`Invalid pair mode: ${mode}!!`)
  }
})

PropertyLoader.addMethod(function _loadFunc(func, mode) {
  switch (mode) {
    case "STANDARD"      : return this._type.addMethod         (func)
    case "METHOD"        : return this._type.addMethod         (func)

    case "IMMEDIATE"     : return this._type.addImmediate      (func)
    case "LAZY"          : return this._type.addLazyProperty   (func)
    case "SETTER"        : return this._type.addSetter         (func)
    case "MANDATORY"     : return this._type.addMandatorySetter(func)

    case "FOR_ASSIGN"    : return this._type.forAddAssigner    (func)

    default : return this._signalError(`Invalid method func mode: ${mode}!!`)
  }
})

PropertyLoader.addMethod(function _loadFromName(name, mode) {
  switch (mode) {
    case "STANDARD"      : return this._type.addDeclarations      (name)
    case "DECLARE"       : return this._type.addDeclarations      (name)

    case "SETTER"        : return this._type.addSetter            (name)
    case "MANDATORY"     : return this._type.addMandatorySetter   (name)

    case "FOR_SETTER"    : return this._type.forAddSetter         (name)
    case "FOR_MANDATORY" : return this._type.forAddMandatorySetter(name)

    default : return this._signalError(`$Invalid name mode: ${mode}!!`)
  }
})