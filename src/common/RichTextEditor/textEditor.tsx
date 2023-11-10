import dynamic from "next/dynamic";
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
}) as any;

import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [
	{'header': [1,2,3,4,5,6,false]},
      { font: [] },
      { size: [] },
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      { color: [] },
      { background: [] },
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
      { direction: "rtl" },
      "link",
      "image",
      // "video",
      { align: [] },
      "clean",
    ],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "background",
  // "video",
  "align",
  "clean",
];  

interface RichEditor {
  value: string;
  onChange: (value: string) => void;
  className?: any
}

const RichEditor: React.FC<RichEditor> = ({ value, onChange,className }) => {
  return (
    <div>
      <QuillNoSSRWrapper
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
        className={className}
      />
    </div>
  );
};

export default RichEditor;
