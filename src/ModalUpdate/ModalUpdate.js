import React from 'react';
import css from "./ModalUpdate.module.scss";
import CloseIcon from '@mui/icons-material/Close';

const ModalUpdate = ({openModalUpdate, setOpenModalUpdate, updateNode, inputEl, rowInfo}) => {

    if (openModalUpdate !== rowInfo.node.id) return null;
    return (
        <div className={css.update}>
            <button className={css.close} onClick={()=>setOpenModalUpdate("")}><CloseIcon/></button>
            <label htmlFor="updateChild">
                <input
                    type="text"
                    placeholder="Փոխեք անունը ․․․"
                    ref={inputEl}
                />
            </label>
            <button className={css.save} onClick={()=> updateNode(rowInfo)}>պահպանել</button>
        </div>
    );
};

export default ModalUpdate;