import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  getIsAuthCheckedSelector,
  getUserSelector
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

const ProtectedRoute = ({
  onlyUnAuth = false,
  component
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);
  const user = useSelector(getUserSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <div className='loader'>Загрузка...</div>;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return component;
};

export default ProtectedRoute;
