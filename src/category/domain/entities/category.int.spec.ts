import Category from "./category"
import ValidationError from "../../../@seedwork/domain/errors/validation.error";

describe('Category Integration Tests', () => {

  describe('create method', () => {

    it ('should a invalid category using name property', () => {
      expect(() => new Category({ name: '' }))
        .toThrow(new ValidationError('The name is required'))

      expect(() => new Category({ name: null }))
        .toThrow(new ValidationError('The name is required'))

      expect(() => new Category({ name: undefined }))
        .toThrow(new ValidationError('The name is required'))

      expect(() => new Category({ name: 't'.repeat(256) }))
        .toThrow(new ValidationError('The name must be a less or equal than 255 characters'))

      expect(() => new Category({ name: 5 as any }))
        .toThrow(new ValidationError('The name must be a string'))
    })

    it ('should a invalid category using description property', () => {
      expect(() => new Category({ name: 'Filme', description: 5 as any }))
        .toThrow(new ValidationError('The description must be a string'))
    })

    it ('should a invalid category using is_active property', () => {
      expect(() => new Category({ name: 'Filme', is_active: '' as any }))
        .toThrow(new ValidationError('The is_active must be a boolean'))
    })

    it('should a valid category', () => {
      expect.assertions(0)
      new Category({ name: 'Filme' })
      new Category({ name: 'Filme', description: 'algo' })
      new Category({ name: 'Filme', description: null })
      new Category({ name: 'Filme', description: 'algo', is_active: true })
      new Category({ name: 'Filme', description: 'algo', is_active: false })
    })

  })

  describe('update method', () => {

    const category = new Category({ name: 'Filme' })

    it ('should a invalid category using name property', () => {
      expect(() => category.update(null, null))
        .toThrow(new ValidationError('The name is required'))

      expect(() => category.update('', null))
        .toThrow(new ValidationError('The name is required'))

      expect(() => category.update('t'.repeat(256), null))
        .toThrow(new ValidationError('The name must be a less or equal than 255 characters'))

      expect(() => category.update(5 as any, null))
        .toThrow(new ValidationError('The name must be a string'))
    })

    it ('should a invalid category using description property', () => {
      expect(() => category.update('Filme', 5 as any))
        .toThrow(new ValidationError('The description must be a string'))
    })

    it('should a valid category', () => {
      expect.assertions(0)
      const category = new Category({ name: 'Filme' })
      category.update('Filme 2', null)
      category.update('Filme 2', 'algo')
    })

  })

})