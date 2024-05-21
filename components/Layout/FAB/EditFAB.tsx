//COPY FROM EZFIND2
import { orangeBtn, redBtn, tealBtn } from "services/constants";
import { FAB } from "./FAB";
import { FiCheck, FiEdit2, FiX } from "react-icons/fi";

type EditFABProps = {
  isEdit: boolean;
  onEdit: Function;
  onSave: Function;
  onCancel: Function;
};

export const EditFAB = ({ isEdit, onEdit, onSave, onCancel }: EditFABProps) => {
  return (
    <>
      <FAB
        icon={FiCheck}
        onClick={onSave}
        bottomOffset={isEdit ? 75 : 0}
        sx={tealBtn}
      />
      <FAB
        icon={isEdit ? FiX : FiEdit2}
        onClick={isEdit ? onCancel : onEdit}
        sx={isEdit ? redBtn : orangeBtn}
      />
    </>
  );
};
