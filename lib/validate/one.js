var _               = require('lodash');
var is              = require('is_js');
var ValidationError = require('./error');

const ERR = require('./../../errors.json');

//
// Validate
//
// Parameters:
//
//   subject
//     [Mixed] - subject of the validation
//
//   parameter
//     [Object] - parameter description object
//
module.exports = function (subject, parameter) {
  parameter = parameter || {};

  function err (errorName, expected) {
    return new ValidationError(errorName, parameter, expected);
  }

  // required
  if (!subject) {
    if (parameter.required) {
      return err('REQUIRED');
    } else {
      return;
    }
  }

  // types
  if (parameter.type === 'string' && is.not.string(subject))   { return err('TYPE.STRING'); }
  if (parameter.type === 'boolean' && is.not.boolean(subject)) { return err('TYPE.BOOLEAN'); }
  if (parameter.type === 'integer' && !parseInt(subject, 10))  { return err('TYPE.INTEGER'); }
  if (parameter.type === 'long' && is.not.number(subject))     { return err('TYPE.LONG'); }
  if (parameter.type === 'float' && is.not.number(subject))    { return err('TYPE.FLOAT'); }
  if (parameter.type === 'double' && is.not.number(subject))   { return err('TYPE.DOUBLE'); }
  if (parameter.type === 'byte' && is.not.number(subject))     { return err('TYPE.BYTE'); }
  if (parameter.type === 'date' && is.not.dateString(subject)) { return err('TYPE.DATE'); }
  if (parameter.type === 'dateTime' && is.not.date(subject))   { return err('TYPE.DATETIME'); }

  // multiple
  if (parameter.multipleOf && (subject % parameter.multipleOf === 0)) { return err('VALUE.MULTIPLE_OF', parameter.multipleOf); }

  // maximums
  if (parameter.maximum && subject > parameter.maximum) { return err('VALUE.MAX', parameter.maximum); }
  if (parameter.exclusiveMaximum && subject >= parameter.exclusiveMaximum) { return err('VALUE.EXCLUSIVE_MAX', parameter.exclusiveMaximum); }

  // minimums
  if (parameter.minimum && subject < parameter.minimum) { return err('VALUE.MIN', parameter.minimum); }
  if (parameter.exclusiveMinimum && subject <= parameter.exclusiveMinimum) { return err('VALUE.EXCLUSIVE_MIN', parameter.exclusiveMinimum); }


  // lengths
  if (parameter.maxlength && subject.length > parameter.maxLength) { return err('VALUE.MAX_LENGTH', parameter.maxLength); }
  if (parameter.maxItems && subject.length > parameter.maxItems)   { return err('VALUE.MAX_ITEMS', parameter.maxItems); }
  if (parameter.minLength && subject.length < parameter.minLength) { return err('VALUE.MIN_LENGTH', parameter.minLength); }
  if (parameter.minItems && subject.length < parameter.minItems)   { return err('VALUE.MIN_ITEMS', parameter.minItems); }

  // pattern/regex
  if (parameter.pattern) {
    var regex = new RegExp(parameter.pattern);
    if (!regex.test(subject)) { return err('VALUE.PATTERN', parameter.pattern); }
  }

  // unique items
  if (parameter.uniqueItems && _.isArray(subject)) { throw Error('uh oh! uniqueItems is not currently supported. Please try back later'); }

  // property counts
  if (parameter.maxProperties && Object.keys(subject).length > parameter.maxProperties) { return err('VALUE.MAX_PROPERTIES', parameter.maxProperties); }
  if (parameter.minProperties && Object.keys(subject).length < parameter.minProperties) { return err('VALUE.MIN_PROPERTIES', parameter.minProperties); }

  // enum
  if (parameter.enum) {
    var enumFail = false;
    _.each(subject, function (value) {
      if (is.not.in(value, parameter.enum)) { enumFail = true; }
    });

    if (enumFail) { return err('VALUE.ENUM', parameter.enum.toString()); }
  }

  // email
  if (parameter.email && is.not.email(subject)) { return err('VALUE.EMAIL'); }

  // alphanumeric
  if (parameter.alphanumeric && is.not.alphaNumeric(subject)) { return err('VALUE.ALPHANUMERIC'); }

  // lowercase
  if (parameter.lowercase && is.not.lowercase(subject)) { return err('VALUE.LOWERCASE'); }

  // uppercase
  if (parameter.uppercase && is.not.uppercase(subject)) { return err('VALUE.UPPERCASE'); }
}