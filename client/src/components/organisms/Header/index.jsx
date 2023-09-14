import { Link } from 'react-router-dom'
import logo from '../../../img/logo.png';
import user from '../../../img/user_white.png';
import logout from '../../../img/logout_white.png';
import './index.scss';

const Header = () => {
  return(
    <div className='header'>
      <div className='header__title'>
        <img className='logo-icon' src={ logo } alt='logo'/>
        <span>W-Log</span>
      </div>
      <div className='header__button'>
        <Link to='/UserInfo' className='header__link'>
          <img className='header__icon' src={ user } alt='user'/>
          <span>ユーザー</span>
        </Link>
      </div>
      <div className='header__button'>
        <Link to='/' className='header__link'>
          <img className='header__icon' src={ logout } alt='logout'/>
          <span>ログアウト</span>
        </Link>
      </div>
    </div>
  );
}

export default Header;