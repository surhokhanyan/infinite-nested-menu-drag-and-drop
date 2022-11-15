import React from 'react';
import css from "./ModalAdd.module.scss";
import CloseIcon from '@mui/icons-material/Close';

const ModalAdd = ({openModalAdd, setOpenModalAdd, addNodeChild, inputEl, rowInfo}) => {

    if (openModalAdd === "") return null
    return (
        <div className={css.add}>
            <button onClick={()=> setOpenModalAdd("")} className={css.close}>
                <CloseIcon/>
            </button>
            <label htmlFor="addChild">
                <input
                    type="text"
                    placeholder="Գրեք անունը ․․․"
                    ref={inputEl}
                />
            </label>
            <button className={css.save} onClick={()=> addNodeChild(rowInfo)}>
                պահպանել
            </button>
        </div>
    );
};

export default ModalAdd;