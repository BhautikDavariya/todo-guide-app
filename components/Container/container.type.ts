import { DNDType } from '@/pages';
import { UniqueIdentifier } from '@dnd-kit/core';

export default interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  containers?:DNDType[] | undefined
  title?: string;
  description?: string;
  onAddItem?: () => void;
  deleteContainer?: (() => void) | undefined;
}
