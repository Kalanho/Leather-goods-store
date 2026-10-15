import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: 64 }}>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </div>
  );
};