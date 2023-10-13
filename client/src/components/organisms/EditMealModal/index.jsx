import { useState } from "react";
import { baseUri } from "../../../const";
import Modal from "../../molecules/Modal";
import './index.scss';

const EditMaelModal = ({values, closeMethod, callBackMethod}) => {
  const id = values.id;
  const [calorie, setCalorie] = useState(values.calorie? values.calorie : '');
  const [protein, setProtein] = useState(values.protein? values.protein : '');
  const [fat, setFat] = useState(values.fat? values.fat : '');
  const [carbohydrate, setCarbohydrate] = useState(values.carbohydrate? values.carbohydrate : '');
  const [note, setNote] = useState(values.note? values.note : '');

  const handleCalorie = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setCalorie(value);
  }

  const handleProtein = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setProtein(value);
  }

  const handleFat = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setFat(value);
  }

  const handleCarbohydrate = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setCarbohydrate(value);
  }

  const handleNote = (e) => {
    const value = e.target.value;

    if (value.length > 200) {
      alert('上限200文字です');
      return;
    }

    setNote(value);
  }

  const deletePFC = async () => {
    try {
      await fetch(`${baseUri}/pfcDelete`, {
        credentials:'include',
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ id: id })
      });

    } catch (error) {
      console.error('Fetch error:', error);
    }

    callBackMethod('削除しました');
  }

  const submitPFC = async () => {
    try {
      await fetch(`${baseUri}/pfcUpdate`, {
        credentials:'include',
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          id: id,
          calorie: calorie,
          protein: protein !== null ? protein : '',
          fat: fat !== null ? fat : '',
          carbohydrate: carbohydrate !== null ? carbohydrate : '',
          note: note !== null ? note : ''
        })
      });

    } catch (error) {
      console.error('Fetch error:', error);
    }

    callBackMethod('更新しました');
  }

  return (
    <Modal>
      <div className='edit-pfc-modal'>
        <div className='modal-row'>
          <input className='modal-row__input' type='text' value={note} onChange={handleNote}/>
        </div>
        <div className='modal-row'>
          <label className='modal-row__label'>カロリー：</label>
          <input className='modal-row__input--number' type='number' value={calorie} onChange={handleCalorie}/>
        </div>
        <div className='modal-row'>
          <label className='modal-row__label'>P：</label>
          <input className='modal-row__input--number' type='number' value={protein} onChange={handleProtein}/>
        </div>
        <div className='modal-row'>
          <label className='modal-row__label'>F：</label>
          <input className='modal-row__input--number' type='number' value={fat} onChange={handleFat}/>
        </div>
        <div className='modal-row'>
          <label className='modal-row__label'>C：</label>
          <input className='modal-row__input--number' type='number' value={carbohydrate} onChange={handleCarbohydrate}/>
        </div>
        <div className='modal-row'>
          <button className='modal-row__button--danger' onClick={ deletePFC }>削除</button>
          <button className='modal-row__button' onClick={ submitPFC }>変更</button>
          <button className='modal-row__button--cancel' onClick={ closeMethod }>キャンセル</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditMaelModal;