export default interface InputProps {
  type: string;
  name: string;
  placeholder?: string;
  value?: string;
  readOnly?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
