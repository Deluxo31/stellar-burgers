import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchFeed,
  getFeedIsLoading,
  getFeedOrders
} from '../../../src/services/slices/feedSlice';
import { useDispatch, useSelector } from '../../../src/services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const isLoading = useSelector(getFeedIsLoading);

  useEffect(() => {
    console.log('Загружаем ленту заказов');
    dispatch(fetchFeed());
  }, [dispatch]);
  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (isLoading || !orders.length) {
    return <Preloader />;
  }
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
