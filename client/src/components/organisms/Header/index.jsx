import { Link } from 'react-router-dom'
import weight from '../../../img/weight_white.png';
import food from '../../../img/food_white.png';
// import graph from '../../../img/graph_white.png';
import flag from '../../../img/flag_white.png';
import logo from '../../../img/logo.png';
import logout from '../../../img/logout_white.png';
import './index.scss';

const Header = () => {
  return(
    <div className='header'>
      <div className='header__title' style={{display:'flex'}}>
        <img className='logo-icon' src={ logo } alt='logo'/>
        <span>W-Log</span>
      </div>
      {/* <div className='header__button'>
        <Link to='/UserSetting' className='header__link'>
          <img className='header__icon' src={ flag } alt='flag'/>
          <span>目標</span>
        </Link>
      </div>
      <div className='header__button'>
        <Link to='/PFCInput' className='header__link'>
          <img className='header__icon' src={ food } alt='food'/>
          <span>PFC</span>
        </Link>
      </div>
      <div className='header__button'>
        <Link to='/WeightInput' className='header__link'>
          <img className='header__icon' src={ weight } alt='weight'/>
          <span>体重</span>
        </Link>
      </div>
      <div className='header__button'>
        <Link to='/WeightInquiry' className='header__link'>
          <img className='header__icon' src={ graph } alt='graph'/>
          <span>グラフ</span>
        </Link>
      </div> */}
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