export interface State {
  emailSendProcessing: boolean;
  error?: any;
}

export const initialState: State = {
  emailSendProcessing: false,
  error: null
};

