import { useState } from "react";
import MessageBox from "../../organisms/MessageBox";
import EditMaelModal from "../../organisms/EditMealModal";
import './index.scss';

const MealHistoryTable = ({mealList}) => {

  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const callBackMethod = () => {
    setModalContent(<MessageBox message={'更新しました'} closeMethod={()=>window.location.reload()}/>);
  }

  const openEditModal = (food) => {
    setIsOpen(true);
    setModalContent(<EditMaelModal values={food} closeMethod={()=>setIsOpen(false)} callBackMethod={callBackMethod}/>);
  }

  return (
    <>
      <div className='food-history'>
        <table className='food-history__table'>
          <thead>
            <tr>
              <th className='col-note'></th>
              <th className='col-calorie'>Calorie</th>
              <th className='col-pfc'>P</th>
              <th className='col-pfc'>F</th>
              <th className='col-pfc'>C</th>
            </tr>
          </thead>
          <tbody>
            {
              mealList.map((food, index) => (
                <tr key={index} onClick={ () => openEditModal(food) }>
                  <td className='col-note'>{food.note}</td>
                  <td className='col-calorie'>{food.calorie}</td>
                  <td className='col-pfc'>{food.protein}</td>
                  <td className='col-pfc'>{food.fat}</td>
                  <td className='col-pfc'>{food.carbohydrate}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      { isOpen && modalContent }
    </>
  )
}

export default MealHistoryTable;