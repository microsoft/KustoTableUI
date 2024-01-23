// Add any custom types here.
// Please make sure all items are in alphabetical order.
interface IAction {
  payload: any;
  type: string;
}

interface IColumns {
  key: string;
  title?: string;
  label: string;
  type: string;
  formatValue?: (value: any) => any;
  options?: any[];
  min?: number;
  required?: boolean;
  isEmptyAllowed?: boolean;
}

interface IDictionary<T> {
  [key: string]: T;
}

interface IState {
  error: string;
  user: IUserState;
}

interface IStateContext<T> {
  effects: any;
  state: T;
}

interface IStateStore<T> {
  dispatch: any;
  state: T;
}

interface IUserState {
  isAuthenticated: boolean | null;
  userName: string | null;
}
