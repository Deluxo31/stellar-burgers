import { FC, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../../src/services/store';
import {
  addIngredient,
  setBun
} from '../../../src/services/slices/constructorSlice';
import { getConstructorItems } from '../../../src/services/selectors';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const transformToConstructorIngredient = (
  ingredient: TIngredient
): TConstructorIngredient => ({
  ...ingredient,
  id: ingredient._id // Используем _id из API как id для конструктора
});

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAdd = () => {
      //console.log('✅✅✅✅ Добавляем ингредиент:✅✅✅✅', ingredient);
      if (!ingredient || !ingredient._id) {
        console.error(
          '✅✅✅✅Ингредиент не содержит _id:✅✅✅✅',
          ingredient
        );
      }
      const constructorIngredient =
        transformToConstructorIngredient(ingredient);

      if (ingredient.type === 'bun') {
        dispatch(setBun(constructorIngredient));
        //console.log('✅✅✅✅ Установлена булка:✅✅✅✅', constructorIngredient);
      } else {
        dispatch(addIngredient(constructorIngredient));
        //console.log('✅✅✅✅ Добавлена начинка:✅✅✅✅', constructorIngredient);
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
