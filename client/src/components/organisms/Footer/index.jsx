import { Link } from 'react-router-dom';
import weight from '../../../img/weight_white.png';
import food from '../../../img/food_white.png';
import graph from '../../../img/graph_white.png';
import flag from '../../../img/flag_white.png';
import barChart from '../../../img/bar_chart_white.png';
import './index.scss';

const Footer = ({active}) => {
  return (
    <div className='footer'>
      <div className={`footer__button ${active === 0 ? 'active' : ''}`}>
        <Link to='/UserSetting' className='footer__link'>
          <img className='footer__icon' src={ flag } alt='flag'/>
          <span>目標</span>
        </Link>
      </div>
      <div className={`footer__button ${active === 1 ? 'active' : ''}`}>
        <Link to='/PFCInput' className='footer__link'>
          <img className='footer__icon' src={ food } alt='food'/>
          <span>PFC</span>
        </Link>
      </div>
      <div className={`footer__button ${active === 2 ? 'active' : ''}`}>
        <Link to='/WeightInput' className='footer__link'>
          <img className='footer__icon' src={ weight } alt='weight'/>
          <span>体重</span>
        </Link>
      </div>
      <div className={`footer__button ${active === 3 ? 'active' : ''}`}>
        <Link to='/WeightInquiry' className='footer__link'>
          <img className='footer__icon' src={ graph } alt='graph'/>
          <span>グラフ</span>
        </Link>
      </div>
      <div className={`footer__button ${active === 4 ? 'active' : ''}`}>
        <Link to='/TodaysInfo' className='footer__link'>
          <img className='footer__icon' src={ barChart } alt='barChart'/>
          <span>今日</span>
        </Link>
      </div>
    </div>
  )
}

export default Footer;