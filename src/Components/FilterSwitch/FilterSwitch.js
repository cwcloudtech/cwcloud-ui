import React, { useContext } from "react";
import Translate from "react-translate-component";
import colors from "../../Context/Colors";
import GlobalContext from "../../Context/GlobalContext";

export default function FilterSwitch({
  filters,
  selectedValue,
  setSelectedValue,
}) {
  const context = useContext(GlobalContext);
  const _mode = context.mode;

  return (
    <div style={{ width: "fit-content" }}>
      <div
        className="toggleContainer"
        style={{
          backgroundColor: colors.secondBackground[_mode],
          border: "1px solid " + colors.border[_mode],
          color: colors.mainText[_mode],
        }}
      >
        {filters.map((filter) => {
          return (
            <div
              className={
                selectedValue === filter.value
                  ? "activeToggleItemContainer"
                  : "toggleItemContainer"
              }
              onClick={() => setSelectedValue(filter.value)}
            >
              <h5 className="toggleItemText">
                <Translate content={filter.translationPath} />
              </h5>
            </div>
          );
        })}
      </div>
    </div>
  );
}
