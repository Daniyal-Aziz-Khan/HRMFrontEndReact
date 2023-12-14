import React from "react";

const CustomButtonAddEdit = ({ buttons, row }) => {
  return (
    <div>
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={button.onClick ? () => button.onClick(row) : ""}
          className={button.className}
          title={button.title ? button.title : ""}
        >
          {button.icon ? <i className={button.icon}></i> : ""}
          {button.label ? button.label : ""}
        </button>
      ))}
    </div>
  );
};

export default CustomButtonAddEdit;
