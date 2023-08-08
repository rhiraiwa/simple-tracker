import FlexDiv from "../../atoms/FlexDiv";
import './index.scss';

const YearMonthDate = ({ className, id }) => {
  return (
    <FlexDiv className={ `year-month-date ${className}` } id={ id }>
      <input className='year-month-date__year' type='number'/>
      <span className='year-month-date__span'>年</span>
      <input className='year-month-date__month' type='number'/>
      <span className='year-month-date__span'>月</span>
      <input className='year-month-date__date' type='number'/>
      <span className='year-month-date__span'>日</span>
    </FlexDiv>
  )
}

export default YearMonthDate;