import {
  constructorSlice,
  addIngredient,
  deleteIngredient,
  moveIngredient,
  setBun,
  clearConstructor
} from '../constructorSlice';
import { TConstructorIngredient } from '@utils-types';

const mockIngredient: TConstructorIngredient = {
  _id: 'ingredient-1',
  id: 'unique-1',
  name: 'Тестовый ингредиент',
  type: 'main' as const,
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 1,
  image: 'test.jpg',
  image_large: 'test-large.jpg',
  image_mobile: 'test-mobile.jpg'
};

const mockBun: TConstructorIngredient = {
  ...mockIngredient,
  type: 'bun' as const,
  _id: 'bun-1',
  id: 'bun-unique-1'
};

describe('constructorSlice', () => {
  //const initialState = {
  // bun: null,
  // ingredients: []
  //};
  const initialState = constructorSlice.getInitialState();

  describe('редьюсеры', () => {
    it('должен обрабатывать добавление ингредиента', () => {
      const action = addIngredient(mockIngredient);
      const state = constructorSlice.reducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(
        expect.objectContaining(mockIngredient)
      );
    });

    it('должен обрабатывать установку булки', () => {
      const action = setBun(mockBun);
      const state = constructorSlice.reducer(initialState, action);

      expect(state.bun).toEqual(expect.objectContaining(mockBun));
    });

    it('должен обрабатывать удаление ингредиента', () => {
      const stateWithIngredient = {
        ...initialState,
        ingredients: [mockIngredient]
      };

      const action = deleteIngredient(mockIngredient.id);
      const state = constructorSlice.reducer(stateWithIngredient, action);

      expect(state.ingredients).toHaveLength(0);
    });

    it('должен обрабатывать изменение порядка ингредиентов', () => {
      const ingredient1 = { ...mockIngredient, id: '1' };
      const ingredient2 = { ...mockIngredient, id: '2' };
      const ingredient3 = { ...mockIngredient, id: '3' };

      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2, ingredient3]
      };

      const action = moveIngredient({ from: 0, to: 2 });
      const state = constructorSlice.reducer(stateWithIngredients, action);

      expect(state.ingredients[0].id).toBe('2');
      expect(state.ingredients[1].id).toBe('3');
      expect(state.ingredients[2].id).toBe('1');
    });

    it('должен очищать конструктор', () => {
      const filledState = {
        bun: mockBun,
        ingredients: [mockIngredient]
      };

      const action = clearConstructor();
      const state = constructorSlice.reducer(filledState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
