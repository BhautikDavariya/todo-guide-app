import React from "react";
import TextAreaProps from "./textarea.type";

const TextArea = ({
  name,
  value,
  placeholder,
  onChange,
  readOnly,
}: TextAreaProps) => {
  return (
    <textarea
      name={name}
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      rows={4}
      cols={30}
      onChange={onChange}
      className="border p-2 w-full rounded-lg shadow-lg hover:shadow-xl"
    ></textarea>
  );
};

export default TextArea;
