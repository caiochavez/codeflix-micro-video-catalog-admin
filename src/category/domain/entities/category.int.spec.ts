import Category from "./category"

describe('Category Integration Tests', () => {

  describe('create method', () => {

    it ('should a invalid category using name property', () => {
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })

      expect(() => new Category({ name: '' })).containsErrorMessages({
        name: ['name should not be empty']
      })

      expect(() => new Category({ name: 5 as any })).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })

      expect(() => new Category({ name: 't'.repeat(256) })).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters']
      })

    })

    it ('should a invalid category using description property', () => {
      expect(() => new Category({ name: 'Filme', description: 5 as any })).containsErrorMessages({
        description: ['description must be a string']
      })
    })

    it ('should a invalid category using is_active property', () => {
      expect(() => new Category({ name: 'Filme', is_active: '' as any })).containsErrorMessages({
        is_active: ['is_active must be a boolean value']
      })
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
      const category = new Category({ name: 'Filme' })

      expect(() => category.update(null, null)).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })

      expect(() => category.update('', null)).containsErrorMessages({
        name: [
          'name should not be empty'
        ]
      })

      expect(() => category.update(5 as any, null)).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })

      expect(() => category.update('t'.repeat(256), null)).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters']
      })
    })

    it ('should a invalid category using description property', () => {
      expect(() => category.update('Filme', 5 as any)).containsErrorMessages({
        description: ['description must be a string']
      })
    })

    it('should a valid category', () => {
      expect.assertions(0)
      const category = new Category({ name: 'Filme' })
      category.update('Filme 2', null)
      category.update('Filme 2', 'algo')
    })

  })

})