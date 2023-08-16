import { Link } from 'react-router-dom'
import input from '../../../img/input_white.png';
import graph from '../../../img/graph_white.png';
import flag from '../../../img/flag_white.png';
import logout from '../../../img/logout_white.png';
import './index.scss';

const Header = () => {
  return(
    <div className='header'>
      <span className='header__title'>アプリタイトル</span>
      <div className='header__button'>
        <Link to='/UserSetting' className='header__link'>
          <img className='header__icon' src={ flag } alt='flag'/>
          <span>目標</span>
        </Link>
      </div>
      <div className='header__button'>
        <Link to='/WeightInput' className='header__link'>
          <img className='header__icon' src={ input } alt='input'/>
          <span>入力</span>
        </Link>
      </div>
      <div className='header__button'>
        <Link to='/WeightInquiry' className='header__link'>
          <img className='header__icon' src={ graph } alt='graph'/>
          <span>グラフ</span>
        </Link>
      </div>
    </div>
  );
}

export default Header;