export default interface TextAreaProps {
  type: string;
  name: string;
  placeholder?: string;
  value?: string;
  readOnly?: boolean
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
