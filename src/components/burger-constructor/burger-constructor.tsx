import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../../src/services/store';
import { clearConstructor } from '../../../src/services/slices/constructorSlice';
import { getConstructorItems } from '../../../src/services/selectors';
import { useNavigate } from 'react-router-dom';
import {
  clearOrder,
  createOrder,
  getOrder,
  getOrderLoading
} from '../../../src/services/slices/orderSlice';
import { getUserSelector } from '../../../src/services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderLoading);
  const orderModalData = useSelector(getOrder);
  //const isAuth = useSelector(getIsAuthCheckedSelector);
  const user = useSelector(getUserSelector);
  const isAuth = !!user;
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun) return;

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ing: TConstructorIngredient) => ing._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients || []).reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
