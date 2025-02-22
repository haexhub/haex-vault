export interface IContextMenuItem {
  children?: IContextMenuItem[];
  handler?: (context?: any) => void;
  icon?: string;
  text: string;
  serperator?: boolean;
  shortcut?: string;
}
