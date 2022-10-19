import { ValidationError } from '../../../src/domain/errors/validation-error'
import { isMinOrFail, isIntegerOrFail, isPositiveOrFail, isArrayOrFail, isNotEmptyOrFail } from '../../../src/shared/validations-util'

describe('Validations Util', () => {
  const msgError = 'any_message_error'

  it('isMinOrFail', () => {
    expect(isMinOrFail(0, 1, msgError)).toBeUndefined()
    expect(isMinOrFail(0, 0, msgError)).toBeUndefined()
    expect(() => isMinOrFail(0, -1, msgError)).toThrowError(new ValidationError(msgError))
  })

  it('isPositiveOrFail', () => {
    expect(isPositiveOrFail(1, msgError)).toBeUndefined()
    expect(() => isPositiveOrFail(0, msgError)).toThrowError(new ValidationError(msgError))
    expect(() => isPositiveOrFail(-1, msgError)).toThrowError(new ValidationError(msgError))
  })

  it('isIntegerOrFail', () => {
    expect(isIntegerOrFail(1, msgError)).toBeUndefined()
    expect(() => isIntegerOrFail(1.5, msgError)).toThrowError(new ValidationError(msgError))
  })

  it('isArrayOrFail', () => {
    expect(isArrayOrFail([], msgError)).toBeUndefined()
    expect(isArrayOrFail([1, 2, 3], msgError)).toBeUndefined()
    expect(() => isArrayOrFail(undefined, msgError)).toThrowError(new ValidationError(msgError))
    expect(() => isArrayOrFail(null, msgError)).toThrowError(new ValidationError(msgError))
    expect(() => isArrayOrFail({}, msgError)).toThrowError(new ValidationError(msgError))
    expect(() => isArrayOrFail(1, msgError)).toThrowError(new ValidationError(msgError))
    expect(() => isArrayOrFail('', msgError)).toThrowError(new ValidationError(msgError))
    expect(() => isArrayOrFail('123', msgError)).toThrowError(new ValidationError(msgError))
  })

  it('isNotEmptyOrFail', () => {
    expect(isNotEmptyOrFail(1, msgError)).toBeUndefined()
    expect(isNotEmptyOrFail('123', msgError)).toBeUndefined()
    expect(isNotEmptyOrFail({}, msgError)).toBeUndefined()
    expect(isNotEmptyOrFail([], msgError)).toBeUndefined()
    expect(() => isNotEmptyOrFail(undefined, msgError)).toThrowError(new ValidationError(msgError))
    expect(() => isNotEmptyOrFail(null, msgError)).toThrowError(new ValidationError(msgError))
  })
})
