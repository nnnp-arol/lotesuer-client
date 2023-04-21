import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

type OnlyReadInputPropsType = {
  label: string;
  type: string;
  value: string;
  textColor: string;
  labelColor: string;
  borderColor: string;
};

export const OnlyReadInput: (props: any) => JSX.Element = (props) => {
  const {
    label,
    textColor = "white",
    labelColor,
    borderColor,
    onlyR = true,
  } = props;
  return (
    <div className="flex flex-1 justify-center items-center relative">
      <div className="absolute bg-slate-900 bottom-7 left-auto px-2 h-4 flex justify-start items-center flex-col">
        <p className={`${labelColor} text-xs bg-transparent`}>{label}</p>
      </div>
      <input
        readOnly={onlyR}
        className={`border ${borderColor} bg-slate-900 h-9 w-11/12 rounded-2xl px-2 text-center ${textColor}`}
        style={{ colorScheme: "dark" }}
        {...props}
      />
    </div>
  );
};
